(function initRace3D(global) {
  if (!global || !global.THREE) {
    console.error("Three.js global not found");
    return;
  }
  const THREE = global.THREE;
  let gltfLoaderScriptPromise = null;
  let gltfLoaderFailureLogged = false;
  const GLTF_LOADER_URLS = [
    "vendor-gltfloader.js",
    "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/loaders/GLTFLoader.js",
    "https://unpkg.com/three@0.152.2/examples/js/loaders/GLTFLoader.js"
  ];
  function getExistingGLTFLoaderClass() {
    const loaderClass = global.GLTFLoader || THREE.GLTFLoader || null;
    if (!THREE.GLTFLoader && global.GLTFLoader) {
      THREE.GLTFLoader = global.GLTFLoader;
    }
    return loaderClass;
  }
  function ensureGLTFLoaderClass() {
    const existing = getExistingGLTFLoaderClass();
    if (existing) return Promise.resolve(existing);
    if (gltfLoaderScriptPromise) return gltfLoaderScriptPromise;
    gltfLoaderScriptPromise = new Promise((resolve) => {
      let index = 0;
      const tryNext = () => {
        if (index >= GLTF_LOADER_URLS.length) {
          if (!gltfLoaderFailureLogged) {
            console.error("Failed to load GLTFLoader runtime script");
            gltfLoaderFailureLogged = true;
          }
          resolve(null);
          return;
        }
        const script = document.createElement("script");
        script.src = GLTF_LOADER_URLS[index];
        script.async = true;
        script.dataset.gltfLoaderRuntime = "true";
        script.onload = () => {
          const loaderClass = getExistingGLTFLoaderClass();
          if (!loaderClass) {
            index += 1;
            tryNext();
            return;
          }
          resolve(loaderClass);
        };
        script.onerror = () => {
          index += 1;
          tryNext();
        };
        document.head.appendChild(script);
      };
      tryNext();
    });
    return gltfLoaderScriptPromise;
  }
  const input = { up: false, down: false, left: false, right: false };
  let velocity = 0;
  let acceleration = 0;
  let nitroHeld = false;
  let nitroTimeLeft = 0;
  const ACCEL = 0.001;
  const BRAKE = 0.9;
  const REVERSE = 0.001;
  const FRICTION = 0.96;
  const MAX_FWD = 0.05;
  const MAX_REV = -0.025;
  const ROAD_WIDTH = 8;
  const TRACK_SEGMENTS = 320;
  const NITRO_DURATION = 2;
  const CAMERA_MODES = [{ id: "third" }, { id: "top" }, { id: "first" }];
  const OPPONENT_COLORS = [0x2c7dff, 0xffa726, 0x7c4dff, 0x00c853, 0xff5252];
  const TRACK_POINTS = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(80, 0, 0),
    new THREE.Vector3(140, 0, -60),
    new THREE.Vector3(100, 0, -160),
    new THREE.Vector3(0, 0, -220),
    new THREE.Vector3(-120, 0, -160),
    new THREE.Vector3(-140, 0, -60),
    new THREE.Vector3(-80, 0, 20),
    new THREE.Vector3(0, 0, 0)
  ];
  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vC = new THREE.Vector3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  const box = new THREE.Box3();
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  class Race3DEngine {
    constructor(options = {}) {
      this.container = document.getElementById("gameScreen");
      this.mountNode = options.container || document.getElementById("threeRaceViewport") || this.container;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.composer = null;
      this.renderPass = null;
      this.bloomPass = null;
      this.trackCurve = null;
      this.trackLength = 0;
      this.roadGroup = null;
      this.edgeDetailGroup = null;
      this.asphaltGroup = null;
      this.barrierGroup = null;
      this.treeGroup = null;
      this.environment = null;
      this.ground = null;
      this.startLine = null;
      this.centerLine = null;
      this.leftEdgeLine = null;
      this.rightEdgeLine = null;
      this.contactShadow = null;
      this.hemiLight = null;
      this.sunLight = null;
      this.car = null;
      this.playerRoot = null;
      this.selectedCarModel = "assets/cars/rc_car.glb";
      this.loadedCarPath = "";
      this.assetCache = Race3DEngine.assetCache || (Race3DEngine.assetCache = new Map());
      this.opponents = [];
      this.ready = false;
      this.raceActive = false;
      this.paused = false;
      this.keyHandlerBound = false;
      this.cameraModeIndex = 0;
      this.graphicsMode = "cinematic";
      this.progress = 0;
      this.previousProgress = 0;
      this.offset = 0;
      this.distanceTravelled = 0;
      this.targetDistanceMeters = 2000;
      this.speedDisplay = 0;
      this.cameraTarget = new THREE.Vector3();
      this.lookTarget = new THREE.Vector3();
      this.frameTime = 0;
      this.minimapBounds = { minX: -1, maxX: 1, minZ: -1, maxZ: 1 };
      this.minimapPath = [];
      this.minimapPlayer = { x: 0.5, y: 0.5 };
      this.minimapOpponents = [];
      this.snapshot = {
        speedKph: 0, lap: 1, totalLaps: 1, position: 1, totalRacers: 1,
        currentLapTime: 0, lastLapTime: null, bestLapTime: null, totalTime: 0,
        distanceDelta: 0, progress: 0, opponentProgresses: [], finished: false,
        cameraMode: "third", distanceKm: 0, targetDistanceKm: 2
      };
    }

    async initialize() {
      if (this.ready) return;
      if (!this.container) throw new Error("gameScreen not found");
      this.dispose();
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog = new THREE.Fog(0xa0c8ff, 50, 300);
      this.camera = new THREE.PerspectiveCamera(65, global.innerWidth / global.innerHeight, 0.1, 1600);
      this.camera.position.set(0, 5, 10);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
      this.renderer.setSize(this.container.clientWidth || global.innerWidth, this.container.clientHeight || global.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1;
      this.renderer.domElement.tabIndex = 1;
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.inset = "0";
      this.renderer.domElement.style.width = "100%";
      this.renderer.domElement.style.height = "100%";
      this.renderer.domElement.style.zIndex = "0";
      if (this.mountNode) {
        this.mountNode.innerHTML = "";
        this.mountNode.appendChild(this.renderer.domElement);
        this.mountNode.style.display = "block";
      } else {
        this.container.appendChild(this.renderer.domElement);
      }
      this.renderer.domElement.focus();
      this.setupPostProcessing();
      this.createLights();
      this.createTrack();
      await this.createEnvironment();
      this.createShadow();
      await this.loadCarModel();
      this.setupControls();
      this.setGraphicsMode(this.graphicsMode);
      this.ready = true;
      this.render();
    }

    setupPostProcessing() {
      if (!THREE.EffectComposer || !THREE.RenderPass || !THREE.UnrealBloomPass) {
        this.composer = null;
        return;
      }
      this.composer = new THREE.EffectComposer(this.renderer);
      this.renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);
      this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(this.container.clientWidth || global.innerWidth, this.container.clientHeight || global.innerHeight), 0, 0.4, 0.85);
      this.composer.addPass(this.bloomPass);
    }

    createLights() {
      this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
      this.scene.add(this.hemiLight);
      this.sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
      this.sunLight.position.set(50, 100, 50);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.set(2048, 2048);
      this.sunLight.shadow.camera.near = 1;
      this.sunLight.shadow.camera.far = 600;
      this.sunLight.shadow.camera.left = -220;
      this.sunLight.shadow.camera.right = 220;
      this.sunLight.shadow.camera.top = 220;
      this.sunLight.shadow.camera.bottom = -220;
      this.scene.add(this.sunLight);
    }

    createRoadTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 1600; i += 1) {
        const alpha = 0.02 + Math.random() * 0.04;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 6);
      return tex;
    }

    createTrack() {
      this.trackCurve = new THREE.CatmullRomCurve3(TRACK_POINTS, true, "catmullrom", 0.12);
      this.trackLength = this.trackCurve.getLength();
      this.roadGroup = new THREE.Group();
      this.edgeDetailGroup = new THREE.Group();
      const points = this.trackCurve.getPoints(TRACK_SEGMENTS);
      const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, map: this.createRoadTexture(), roughness: 0.85, metalness: 0.15, side: THREE.DoubleSide });
      const grassStripMaterial = new THREE.MeshStandardMaterial({ color: 0x2f5e2f, roughness: 0.95, metalness: 0.04, side: THREE.DoubleSide });
      const curbMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xd63b3b, roughness: 0.75, metalness: 0.06 }),
        new THREE.MeshStandardMaterial({ color: 0xf3f3f3, roughness: 0.82, metalness: 0.04 })
      ];
      for (let i = 0; i < points.length - 1; i += 1) {
        const p1 = points[i], p2 = points[i + 1], length = p1.distanceTo(p2);
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_WIDTH, length), roadMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.lerpVectors(p1, p2, 0.5);
        const dir = vA.subVectors(p2, p1).normalize();
        mesh.rotation.z = Math.atan2(dir.x, dir.z);
        mesh.position.y = 0.04 + Math.sin(i * 0.35) * 0.004;
        mesh.receiveShadow = true;
        this.roadGroup.add(mesh);

        const tangent = vB.copy(dir);
        const normal = vC.set(-tangent.z, 0, tangent.x).normalize();
        [-1, 1].forEach((side) => {
          const grassStrip = new THREE.Mesh(new THREE.PlaneGeometry(1.8, length), grassStripMaterial);
          grassStrip.rotation.x = -Math.PI / 2;
          grassStrip.rotation.z = Math.atan2(dir.x, dir.z);
          grassStrip.position.lerpVectors(p1, p2, 0.5).add(normal.clone().multiplyScalar(side * 4.9));
          grassStrip.position.y = 0.005;
          grassStrip.receiveShadow = true;
          this.edgeDetailGroup.add(grassStrip);

          const curb = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, Math.max(1.2, length)), curbMaterials[i % 2]);
          curb.position.lerpVectors(p1, p2, 0.5).add(normal.clone().multiplyScalar(side * 4.18));
          curb.position.y = 0.08;
          curb.rotation.y = Math.atan2(dir.x, dir.z);
          curb.castShadow = true;
          curb.receiveShadow = true;
          this.edgeDetailGroup.add(curb);
        });
      }
      this.scene.add(this.roadGroup);
      this.scene.add(this.edgeDetailGroup);
      console.log("Track loaded");
      this.ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshStandardMaterial({ color: 0x4c6b39, roughness: 0.96, metalness: 0.02 }));
      this.ground.rotation.x = -Math.PI / 2;
      this.ground.position.y = -0.12;
      this.ground.receiveShadow = true;
      this.scene.add(this.ground);
      this.createTrackLines(points);
      this.buildMinimapPath(points);
    }

    createTrackLines(points) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => point.clone().setY(0.08)));
      this.centerLine = new THREE.Line(lineGeometry, new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 3, gapSize: 2 }));
      this.centerLine.computeLineDistances();
      this.scene.add(this.centerLine);
      const left = [];
      const right = [];
      for (let i = 0; i < points.length; i += 1) {
        const point = points[i];
        const next = points[(i + 1) % points.length];
        const tangent = vA.subVectors(next, point).normalize();
        const normal = vB.set(-tangent.z, 0, tangent.x);
        left.push(point.clone().add(normal.clone().multiplyScalar(3.8)).setY(0.09));
        right.push(point.clone().add(normal.clone().multiplyScalar(-3.8)).setY(0.09));
      }
      this.leftEdgeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(left), new THREE.LineBasicMaterial({ color: 0xffffff }));
      this.rightEdgeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(right), new THREE.LineBasicMaterial({ color: 0xffffff }));
      this.scene.add(this.leftEdgeLine, this.rightEdgeLine);
      const startPos = this.trackCurve.getPointAt(0);
      const startTan = this.trackCurve.getTangentAt(0);
      const startAngle = Math.atan2(startTan.x, startTan.z);
      this.startLine = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_WIDTH, 2.4), new THREE.MeshStandardMaterial({ color: 0xf3f3f3, roughness: 0.55, metalness: 0.08, side: THREE.DoubleSide }));
      this.startLine.rotation.x = -Math.PI / 2;
      this.startLine.rotation.z = startAngle;
      this.startLine.position.copy(startPos).setY(0.1);
      this.scene.add(this.startLine);
    }

    buildMinimapPath(points) {
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const point of points) {
        if (point.x < minX) minX = point.x;
        if (point.x > maxX) maxX = point.x;
        if (point.z < minZ) minZ = point.z;
        if (point.z > maxZ) maxZ = point.z;
      }
      this.minimapBounds = { minX, maxX, minZ, maxZ };
      this.minimapPath = points.map((point) => this.projectMinimapPoint(point));
    }

    async createEnvironment() {
      this.environment = new THREE.Group();
      this.scene.add(this.environment);
      this.asphaltGroup = new THREE.Group();
      this.barrierGroup = new THREE.Group();
      this.treeGroup = new THREE.Group();
      this.environment.add(this.asphaltGroup, this.barrierGroup, this.treeGroup);
      await Promise.allSettled([this.applyAsphaltMaterial(), this.placeBarrierTest(), this.placeTreeTest()]);
    }

    async loadAsset(path) {
      const LoaderClass = await ensureGLTFLoaderClass();
      if (!LoaderClass) {
        if (!gltfLoaderFailureLogged) {
          console.error("GLTFLoader not found");
          gltfLoaderFailureLogged = true;
        }
        throw new Error("GLTFLoader unavailable");
      }
      if (!this.assetCache.has(path)) {
        const loader = new LoaderClass();
        const promise = new Promise((resolve, reject) => {
          console.log("Loading:", path);
          loader.load(path, (gltf) => { console.log("Loaded:", path); resolve(gltf.scene); }, undefined, (error) => {
            console.error("Failed to load:", path, error);
            reject(error);
          });
        });
        this.assetCache.set(path, promise);
      }
      return this.assetCache.get(path);
    }

    prepareAssetClone(prototype) {
      const model = prototype.clone(true);
      model.visible = true;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) child.material = child.material.clone();
        }
      });
      return model;
    }

    createWrappedModel(model, fallbackColor, targetSpan, yOffset) {
      const visual = this.prepareAssetClone(model);
      this.applySafeModelMaterial(visual, fallbackColor);
      box.setFromObject(visual);
      box.getCenter(center);
      box.getSize(size);
      const span = Math.max(size.x || 1, size.z || 1, 1);
      const scale = clamp(targetSpan / span, 0.4, 6);
      visual.scale.setScalar(scale);
      visual.position.sub(center.clone().multiplyScalar(scale));
      box.setFromObject(visual);
      visual.position.y -= box.min.y;
      if (typeof yOffset === "number") visual.position.y += yOffset;
      const root = new THREE.Group();
      root.visible = true;
      root.add(visual);
      root.userData.visual = visual;
      return root;
    }

    debugAssetVisible(label, model) {
      console.log("Asset visible:", label, model.position, model.scale);
    }

    applySafeModelMaterial(model, fallbackColor) {
      model.traverse((child) => {
        if (!child.isMesh) return;
        const safeColor = new THREE.Color(fallbackColor);
        child.material = new THREE.MeshStandardMaterial({
          color: safeColor,
          roughness: 0.8,
          metalness: 0.2
        });
        child.castShadow = true;
        child.receiveShadow = true;
        child.visible = true;
      });
    }

    async applyAsphaltMaterial() {
      try {
        const prototype = await this.loadAsset("assets/track/asphalt.glb");
        let asphaltColor = new THREE.Color(0x2b2b2b);
        prototype.traverse((child) => {
          if (child.isMesh && child.material && child.material.color) {
            asphaltColor = child.material.color.clone();
          }
        });
        this.roadGroup.traverse((child) => {
          if (!child.isMesh) return;
          child.material = new THREE.MeshStandardMaterial({
            color: asphaltColor.lerp(new THREE.Color(0x303030), 0.35),
            roughness: 0.72,
            metalness: 0.2
          });
          child.receiveShadow = true;
        });
        if (this.asphaltGroup) {
          this.asphaltGroup.clear();
          const points = this.trackCurve.getSpacedPoints(54);
          for (let i = 0; i < points.length - 1; i += 1) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const segment = this.createWrappedModel(prototype, 0x1a1a1a, 7.8, 0.02);
            const tangent = vA.subVectors(p2, p1).normalize();
            segment.position.lerpVectors(p1, p2, 0.5);
            segment.position.y = 0.055;
            segment.rotation.y = Math.atan2(tangent.x, tangent.z);
            if (segment.userData.visual) {
              segment.userData.visual.rotation.x = -Math.PI / 2;
            }
            this.asphaltGroup.add(segment);
          }
          if (this.asphaltGroup.children[0]) this.debugAssetVisible("asphalt", this.asphaltGroup.children[0]);
        }
        if (this.centerLine && this.centerLine.material) {
          this.centerLine.material.color.set(0xf7f7f7);
        }
        if (this.leftEdgeLine && this.leftEdgeLine.material) {
          this.leftEdgeLine.material.color.set(0xffffff);
        }
        if (this.rightEdgeLine && this.rightEdgeLine.material) {
          this.rightEdgeLine.material.color.set(0xffe36a);
        }
        console.log("Track loaded");
      } catch (error) {
        console.error("Failed to load:", "assets/track/asphalt.glb", error);
      }
    }

    async placeBarrierTest() {
      try {
        const prototype = await this.loadAsset("assets/track/barrier.glb");
        if (this.barrierGroup) this.barrierGroup.clear();
        const segments = 44;
        for (let i = 0; i < segments; i += 1) {
          const t = i / segments;
          const point = this.trackCurve.getPointAt(t);
          const tangent = this.trackCurve.getTangentAt(t).normalize();
          const normal = vB.set(-tangent.z, 0, tangent.x).normalize();
          [-1, 1].forEach((side) => {
            const barrier = this.createWrappedModel(prototype, 0x888888, 2.8, 0);
            barrier.position.copy(point).add(vC.copy(normal).multiplyScalar(side * ((ROAD_WIDTH * 0.5) + 1)));
            barrier.position.y = 0.04;
            barrier.rotation.y = Math.atan2(tangent.x, tangent.z);
            barrier.scale.set(0.6, 0.6, 0.6);
            barrier.visible = true;
            this.barrierGroup.add(barrier);
            console.log("Barrier placed:", barrier.scale, barrier.position);
          });
        }
        if (this.barrierGroup.children[0]) this.debugAssetVisible("barrier", this.barrierGroup.children[0]);
        console.log("Barriers placed");
      } catch (error) {
        console.error("Failed to load:", "assets/track/barrier.glb", error);
      }
    }

    async placeTreeTest() {
      try {
        const prototype = await this.loadAsset("assets/env/tree.glb");
        if (this.treeGroup) this.treeGroup.clear();
        const points = this.trackCurve.getSpacedPoints(18);
        for (let i = 0; i < points.length; i += 1) {
          const point = points[i];
          const next = points[(i + 1) % points.length];
          const tangent = vA.subVectors(next, point).normalize();
          const normal = vB.set(-tangent.z, 0, tangent.x).normalize();
          [-1, 1].forEach((side) => {
            const clusterCount = 3 + (i % 3);
            for (let c = 0; c < clusterCount; c += 1) {
              const tree = this.prepareAssetClone(prototype);
              const distance = 14 + ((i % 4) * 2) + c * 1.6;
              tree.position.copy(point).add(vC.copy(normal).multiplyScalar(side * distance));
              tree.position.x += Math.sin(i * 0.8 + c + side) * (2.2 + c * 0.5);
              tree.position.z += Math.cos(i * 0.6 + c * 0.7 + side) * (2 + c * 0.45);
              tree.position.y = 0;
              const treeScale = 0.8 + ((i + c) % 5) * 0.1;
              tree.scale.setScalar(treeScale);
              tree.rotation.y = (i * 0.45) + (c * 0.6) + (side > 0 ? 0.2 : -0.2);
              this.treeGroup.add(tree);
            }
          });
        }
        if (this.treeGroup.children[0]) this.debugAssetVisible("tree", this.treeGroup.children[0]);
        console.log("Trees placed");
      } catch (error) {
        console.error("Failed to load:", "assets/env/tree.glb", error);
      }
    }

    createShadow() {
      this.contactShadow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }));
      this.contactShadow.rotation.x = -Math.PI / 2;
      this.contactShadow.position.y = 0.02;
      this.scene.add(this.contactShadow);
    }

    createProceduralFallbackCar() {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd62828, roughness: 0.5, metalness: 0.35 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x6eaad6, roughness: 0.2, metalness: 0.1 });
      const chassis = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.3, 4, 12), bodyMat);
      chassis.rotation.z = Math.PI / 2;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      group.add(chassis);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.8), glassMat);
      cabin.position.set(0, 0.28, -0.05);
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      group.add(cabin);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.92, metalness: 0.08 });
      [[-0.48, -0.12, 0.55], [0.48, -0.12, 0.55], [-0.48, -0.12, -0.55], [0.48, -0.12, -0.55]].forEach(([x, y, z]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 16), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, y, z);
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        group.add(wheel);
      });
      return group;
    }

    async loadCarModel() {
      const path = this.selectedCarModel || "assets/cars/rc_car.glb";
      const applyCar = (model) => {
        const currentProgress = this.car?.userData?.progress ?? this.progress;
        const currentOffset = this.car?.userData?.offset ?? this.offset;
        const currentDistance = this.car?.userData?.distanceTravelled ?? this.distanceTravelled;
        if (this.car?.parent) this.car.parent.remove(this.car);
        this.car = model;
        this.playerRoot = model;
        this.scene.add(model);
        this.loadedCarPath = path;
        this.applyTrackTransform(this.car, currentProgress, currentOffset);
        this.car.userData.progress = currentProgress;
        this.car.userData.offset = currentOffset;
        this.car.userData.distanceTravelled = currentDistance;
      };
      if (!await ensureGLTFLoaderClass()) {
        if (!gltfLoaderFailureLogged) {
          console.error("GLTFLoader not found");
          gltfLoaderFailureLogged = true;
        }
        applyCar(this.createProceduralFallbackCar());
        return;
      }
      console.log("Loading car...");
      try {
        const prototype = await this.loadAsset(path);
        const model = this.createWrappedModel(prototype, 0x3333ff, 3.4, 0.3);
        model.position.set(0, 0.3, 0);
        model.rotation.y = 0;
        model.visible = true;
        if (model.userData.visual) {
          model.userData.visual.rotation.y = Math.PI;
          model.userData.visual.position.y += 0.5;
          model.userData.visual.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });
        }
        model.scale.set(1.5, 1.5, 1.5);
        this.debugAssetVisible("car", model);
        console.log("Car loaded successfully");
        console.log("Car visible at:", model.position);
        console.log("Car ready");
        applyCar(model);
      } catch (error) {
        console.error("Failed to load:", path, error);
        applyCar(this.createProceduralFallbackCar());
      }
    }

    createOpponent(index) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 1.8), new THREE.MeshStandardMaterial({
        color: OPPONENT_COLORS[index % OPPONENT_COLORS.length], roughness: 0.5, metalness: 0.24
      }));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const progress = (0.06 + index * 0.04) % 1;
      mesh.userData = { progress, offset: ((index % 3) - 1) * 0.9, enemySpeed: 0.00165 + index * 0.00011, distanceTravelled: progress * this.trackLength };
      this.applyTrackTransform(mesh, progress, mesh.userData.offset);
      this.scene.add(mesh);
      this.opponents.push(mesh);
    }

    setupOpponents(count) {
      this.clearOpponents();
      const total = clamp(count || 4, 3, 5);
      for (let i = 0; i < total; i += 1) this.createOpponent(i);
      this.minimapOpponents = Array.from({ length: total }, () => ({ x: 0.5, y: 0.5 }));
    }

    clearOpponents() {
      for (const enemy of this.opponents) enemy.parent?.remove(enemy);
      this.opponents = [];
    }

    setupControls() {
      if (this.keyHandlerBound) return;
      this.keyHandlerBound = true;
      const onDown = (e) => {
        if (e.key === "ArrowUp") { e.preventDefault(); input.up = true; }
        if (e.key === "ArrowDown") { e.preventDefault(); input.down = true; }
        if (e.key === "ArrowLeft") { e.preventDefault(); input.left = true; }
        if (e.key === "ArrowRight") { e.preventDefault(); input.right = true; }
        if (e.key === "Shift") { nitroHeld = true; nitroTimeLeft = NITRO_DURATION; }
        if (e.key === "c" || e.key === "C") this.setCameraMode(this.cameraModeIndex + 1);
      };
      const onUp = (e) => {
        if (e.key === "ArrowUp") { e.preventDefault(); input.up = false; }
        if (e.key === "ArrowDown") { e.preventDefault(); input.down = false; }
        if (e.key === "ArrowLeft") { e.preventDefault(); input.left = false; }
        if (e.key === "ArrowRight") { e.preventDefault(); input.right = false; }
        if (e.key === "Shift") nitroHeld = false;
      };
      global.addEventListener("keydown", onDown, { passive: false });
      global.addEventListener("keyup", onUp, { passive: false });
      document.addEventListener("keydown", onDown, { passive: false });
      document.addEventListener("keyup", onUp, { passive: false });
    }

    async startRace(config = {}) {
      await this.initialize();
      this.selectedCarModel = config.selectedCarModel || this.selectedCarModel || "assets/cars/rc_car.glb";
      if (!this.car || this.loadedCarPath !== this.selectedCarModel) await this.loadCarModel();
      velocity = 0;
      acceleration = 0;
      input.up = false; input.down = false; input.left = false; input.right = false;
      nitroHeld = false; nitroTimeLeft = 0;
      this.progress = 0; this.previousProgress = 0; this.offset = 0; this.distanceTravelled = 0;
      this.targetDistanceMeters = Math.max(1000, (config.laps || 2) * 1000);
      this.speedDisplay = 0;
      this.raceActive = true;
      this.paused = false;
      this.cameraModeIndex = 0;
      this.snapshot = {
        ...this.snapshot,
        speedKph: 0, lap: 1, totalLaps: 1, position: 1, totalRacers: 1,
        currentLapTime: 0, lastLapTime: null, bestLapTime: null, totalTime: 0,
        distanceDelta: 0, progress: 0, opponentProgresses: [], finished: false,
        cameraMode: CAMERA_MODES[0].id, distanceKm: 0, targetDistanceKm: this.targetDistanceMeters / 1000
      };
      this.setupOpponents(config.opponents || 4);
      this.snapshot.totalRacers = this.opponents.length + 1;
      this.updatePlayerTransform(true);
      this.updateMinimapState();
      return this.getSnapshot();
    }

    update(deltaSeconds, controls) {
      if (!this.ready) return this.getSnapshot();
      if (!this.raceActive || this.paused || this.snapshot.finished) {
        this.updateCamera();
        this.render();
        return this.getSnapshot();
      }
      const delta = deltaSeconds || 0.016;
      const frameScale = delta * 60;
      const throttle = Boolean(controls?.throttle) || input.up;
      const brake = Boolean(controls?.brake) || input.down;
      const steerValue = controls?.steer || 0;
      const steerLeft = steerValue < 0 || input.left;
      const steerRight = steerValue > 0 || input.right;
      if (throttle) {
        acceleration = ACCEL;
        velocity += acceleration * frameScale;
      } else {
        acceleration = 0;
      }
      if (brake) {
        if (velocity > 0) velocity *= Math.pow(BRAKE, frameScale);
        else velocity -= REVERSE * frameScale * 0.5;
      }
      if (!throttle && !brake) velocity *= Math.pow(FRICTION, frameScale);
      if (nitroTimeLeft > 0) {
        velocity = Math.min(velocity + 0.00035 * frameScale, MAX_FWD * 1.2);
        nitroTimeLeft = Math.max(0, nitroTimeLeft - delta);
      }
      velocity = clamp(velocity, MAX_REV, MAX_FWD);
      const turnSpeed = 0.03 * (1 - Math.min(Math.abs(velocity) / MAX_FWD, 0.75));
      if (steerLeft) this.offset += turnSpeed * frameScale;
      if (steerRight) this.offset -= turnSpeed * frameScale;
      this.offset *= Math.pow(0.95, frameScale);
      this.offset = clamp(this.offset, -3.5, 3.5);
      this.previousProgress = this.progress;
      this.progress = ((this.progress + velocity * delta) % 1 + 1) % 1;
      this.frameTime += delta;
      if (this.progress < this.previousProgress && velocity > 0) this.snapshot.lap += 1;
      this.distanceTravelled += Math.abs(velocity) * this.trackLength * delta;
      if (this.distanceTravelled >= this.targetDistanceMeters) {
        this.snapshot.finished = true;
        this.raceActive = false;
        velocity = 0;
      }
      this.updatePlayerTransform(false);
      this.updateOpponents(delta);
      this.checkOpponentCollisions();
      this.updateRacePosition();
      this.updateMinimapState();
      this.speedDisplay += (Math.floor(Math.abs(velocity) * 2800) - this.speedDisplay) * 0.12;
      this.snapshot.speedKph = Math.round(this.speedDisplay);
      this.snapshot.distanceDelta = Math.abs(velocity) * this.trackLength * delta;
      this.snapshot.totalTime += delta;
      this.snapshot.currentLapTime += delta;
      this.snapshot.progress = this.progress;
      this.snapshot.distanceKm = this.distanceTravelled / 1000;
      this.snapshot.opponentProgresses = this.opponents.map((enemy) => enemy.userData.progress);
      this.updateCamera();
      this.render();
      return this.getSnapshot();
    }

    updatePlayerTransform(isStart) {
      if (!this.car) return;
      let playerProgress = this.progress;
      if (isStart) {
        playerProgress = (1 - (12 / Math.max(this.trackLength, 1)) + 1) % 1;
        this.progress = playerProgress;
      }
      this.applyTrackTransform(this.car, playerProgress, this.offset);
      this.car.position.y = 0.5 + Math.max(0, acceleration * 400) * 0.012 + Math.sin(this.frameTime * 8) * Math.abs(velocity) * 0.08;
      const steerTilt = clamp(-this.offset * 0.024, -0.1, 0.1);
      this.car.rotation.z = steerTilt;
      this.car.rotation.x += (((acceleration > 0 ? -0.04 : 0) + (input.down ? 0.03 : 0)) - this.car.rotation.x) * 0.15;
      if (this.car.userData.visual) {
        const wheelSpin = this.frameTime * Math.abs(velocity) * 80;
        this.car.userData.visual.traverse((child) => {
          if (!child.isMesh || !child.name) return;
          if (child.name.toLowerCase().includes("wheel")) child.rotation.x = wheelSpin;
        });
      }
      this.playerRoot = this.car;
      if (this.contactShadow) this.contactShadow.position.set(this.car.position.x, 0.02, this.car.position.z);
      this.car.userData.progress = playerProgress;
      this.car.userData.offset = this.offset;
      this.car.userData.distanceTravelled = this.distanceTravelled;
    }

    updateOpponents(delta) {
      const frameScale = delta * 60;
      for (const enemy of this.opponents) {
        enemy.userData.progress = (enemy.userData.progress + enemy.userData.enemySpeed * frameScale) % 1;
        enemy.userData.distanceTravelled += enemy.userData.enemySpeed * this.trackLength * frameScale;
        this.applyTrackTransform(enemy, enemy.userData.progress, enemy.userData.offset);
        enemy.position.y = 0.3;
      }
    }

    applyTrackTransform(mesh, progress, offset) {
      const point = this.trackCurve.getPointAt(progress);
      const tangent = this.trackCurve.getTangentAt(progress).normalize();
      const normal = vA.set(-tangent.z, 0, tangent.x).normalize();
      mesh.position.copy(point).add(vB.copy(normal).multiplyScalar(offset));
      mesh.position.y = 0.5;
      mesh.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0);
      if (mesh !== this.car) return;
      mesh.lookAt(vC.copy(point).add(tangent));
    }

    checkOpponentCollisions() {
      if (!this.car) return;
      for (const enemy of this.opponents) {
        if (this.car.position.distanceTo(enemy.position) < 1.5) velocity *= 0.85;
      }
    }

    updateRacePosition() {
      const allCars = [{ progress: this.distanceTravelled, player: true }];
      for (const enemy of this.opponents) allCars.push({ progress: enemy.userData.distanceTravelled, player: false });
      allCars.sort((a, b) => b.progress - a.progress);
      this.snapshot.position = allCars.findIndex((entry) => entry.player) + 1;
      this.snapshot.totalRacers = allCars.length;
    }

    updateCamera() {
      if (!this.camera || !this.car) return;
      if (this.cameraModeIndex === 0) {
        const tangent = this.trackCurve.getTangentAt(this.progress);
        this.cameraTarget.copy(this.car.position).add(vA.set(-tangent.x * 4.8, 1.7, -tangent.z * 4.8));
        this.lookTarget.copy(this.car.position).add(vB.copy(tangent).multiplyScalar(5));
      } else if (this.cameraModeIndex === 1) {
        this.cameraTarget.set(this.car.position.x, this.car.position.y + 15, this.car.position.z + 0.01);
        this.lookTarget.copy(this.car.position);
      } else {
        this.cameraTarget.copy(this.car.position).add(vA.set(0, 1.0, 1.5).applyQuaternion(this.car.quaternion));
        this.lookTarget.copy(this.car.position).add(vB.copy(this.trackCurve.getTangentAt(this.progress)).multiplyScalar(10));
      }
      this.camera.position.lerp(this.cameraTarget, 0.08);
      if (Math.abs(velocity) > 0.02) {
        this.camera.position.x += (Math.random() - 0.5) * 0.015;
        this.camera.position.y += (Math.random() - 0.5) * 0.01;
      }
      this.camera.lookAt(this.lookTarget);
      this.camera.fov += (clamp(65 + Math.abs(velocity) * 8000, 65, 85) - this.camera.fov) * 0.1;
      this.camera.updateProjectionMatrix();
    }

    updateMinimapState() {
      this.minimapPlayer = this.projectMinimapPoint(this.trackCurve.getPointAt(this.progress));
      this.minimapOpponents = this.opponents.map((enemy) => this.projectMinimapPoint(this.trackCurve.getPointAt(enemy.userData.progress)));
    }

    projectMinimapPoint(point) {
      const width = Math.max(1, this.minimapBounds.maxX - this.minimapBounds.minX);
      const height = Math.max(1, this.minimapBounds.maxZ - this.minimapBounds.minZ);
      return { x: 0.12 + ((point.x - this.minimapBounds.minX) / width) * 0.76, y: 0.12 + ((point.z - this.minimapBounds.minZ) / height) * 0.76 };
    }

    getMinimapData() {
      return { path: this.minimapPath, player: this.minimapPlayer, opponents: this.minimapOpponents };
    }

    setCameraMode(index) {
      this.cameraModeIndex = ((index % 3) + 3) % 3;
      this.snapshot.cameraMode = CAMERA_MODES[this.cameraModeIndex].id;
    }

    setPaused(value) {
      this.paused = Boolean(value);
    }

    setGraphicsMode(mode) {
      this.graphicsMode = mode || "cinematic";
      if (!this.renderer || !this.scene) return;
      const styles = {
        classic: { exposure: 1, bloom: 0, fog: 0x87ceeb, ambient: 0.9, sun: 1.2, clear: 0x87ceeb, road: 0x2a2a2a },
        cinematic: { exposure: 0.98, bloom: 0.16, fog: 0x9fd6f0, ambient: 0.86, sun: 1.16, clear: 0x8fcaea, road: 0x262626 },
        vibrant: { exposure: 1.08, bloom: 0.12, fog: 0x8cd0ef, ambient: 0.94, sun: 1.24, clear: 0x7fc8ee, road: 0x303030 },
        "color-blue": { exposure: 0.98, bloom: 0.08, fog: 0x7fbfe3, ambient: 0.88, sun: 1.12, clear: 0x78bae0, road: 0x24282c },
        dramatic: { exposure: 0.9, bloom: 0.14, fog: 0x7db2cf, ambient: 0.8, sun: 1.28, clear: 0x74accd, road: 0x222222 },
        faded: { exposure: 1, bloom: 0.02, fog: 0xa8d2e1, ambient: 0.84, sun: 1.04, clear: 0x9ecbdb, road: 0x343434 }
      };
      const style = styles[this.graphicsMode] || styles.cinematic;
      this.renderer.toneMappingExposure = style.exposure;
      this.scene.fog = new THREE.Fog(0xa0c8ff, 50, 300);
      this.scene.background = new THREE.Color(style.clear);
      if (this.bloomPass) {
        this.bloomPass.strength = style.bloom;
        this.bloomPass.radius = 0.4;
        this.bloomPass.threshold = 0.85;
      }
      if (this.hemiLight) this.hemiLight.intensity = style.ambient;
      if (this.sunLight) this.sunLight.intensity = style.sun;
      if (this.roadGroup) {
        this.roadGroup.traverse((child) => {
          if (child.isMesh && child.material?.color) child.material.color.set(style.road);
        });
      }
    }

    resize(width, height) {
      if (!this.renderer || !this.camera) return;
      const w = Math.max(1, width), h = Math.max(1, height);
      this.renderer.setSize(w, h);
      if (this.composer) this.composer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    stopRace() {
      this.raceActive = false;
      this.paused = false;
    }

    dispose() {
      this.stopRace();
      this.clearOpponents();
      if (this.renderer) {
        this.renderer.dispose();
        if (this.renderer.domElement?.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      if (this.mountNode) this.mountNode.innerHTML = "";
      this.scene = null; this.camera = null; this.renderer = null;
      this.composer = null; this.renderPass = null; this.bloomPass = null;
      this.trackCurve = null; this.trackLength = 0; this.roadGroup = null; this.edgeDetailGroup = null;
      this.asphaltGroup = null; this.barrierGroup = null; this.treeGroup = null;
      this.environment = null; this.ground = null; this.startLine = null;
      this.centerLine = null; this.leftEdgeLine = null; this.rightEdgeLine = null;
      this.contactShadow = null; this.hemiLight = null; this.sunLight = null;
      this.car = null; this.playerRoot = null; this.minimapPath = []; this.minimapOpponents = [];
      this.ready = false;
    }

    render() {
      if (!this.renderer || !this.scene || !this.camera) return;
      if (this.composer) this.composer.render();
      else this.renderer.render(this.scene, this.camera);
    }

    getSnapshot() {
      return { ...this.snapshot };
    }
  }

  window.Race3DEngine = Race3DEngine;
})(window);
