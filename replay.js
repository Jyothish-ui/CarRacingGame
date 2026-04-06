(function attachReplaySystem(global) {
  const STORAGE_KEYS = {
    photos: "gallery_photos",
    videos: "album_videos"
  };

  function loadCollection(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCollection(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  const ReplaySystem = {
    buffer: [],
    active: false,
    recordEnabled: true,
    maxFrames: 120,
    sampleStepMs: 120,
    lastSampleAt: 0,
    playbackFrame: 0,
    playbackId: 0,

    init() {
      this.recordEnabled = localStorage.getItem("replay_record_enabled") !== "false";
      const closeButton = document.getElementById("replayPlaybackClose");
      closeButton?.addEventListener("click", () => this.stopPlayback());
    },

    startSession(meta = {}) {
      this.buffer = [];
      this.active = true;
      this.meta = {
        startedAt: Date.now(),
        map: meta.map || "Track",
        laps: meta.laps || 1,
        car: meta.car || "Car"
      };
      this.lastSampleAt = 0;
    },

    stopSession() {
      this.active = false;
    },

    recordFrame(frame) {
      if (!this.active || !this.recordEnabled || !frame) return;
      const now = performance.now();
      if (now - this.lastSampleAt < this.sampleStepMs) return;
      this.lastSampleAt = now;
      this.buffer.push({
        t: Date.now(),
        x: Number(frame.x || 0),
        y: Number(frame.y || 0),
        z: Number(frame.z || 0),
        rotation: Number(frame.rotation || 0),
        speed: Number(frame.speed || 0)
      });
      if (this.buffer.length > this.maxFrames) {
        this.buffer.shift();
      }
    },

    getPhotos() {
      return loadCollection(STORAGE_KEYS.photos);
    },

    getReplays() {
      return loadCollection(STORAGE_KEYS.videos);
    },

    getRecordEnabled() {
      return this.recordEnabled;
    },

    setRecordEnabled(value) {
      this.recordEnabled = Boolean(value);
      localStorage.setItem("replay_record_enabled", this.recordEnabled ? "true" : "false");
      return this.recordEnabled;
    },

    getStorageStats() {
      const photos = this.getPhotos();
      const replays = this.getReplays();
      const photoBytes = photos.reduce((sum, item) => sum + (item.dataUrl ? item.dataUrl.length * 0.75 : 0), 0);
      const replayBytes = replays.reduce((sum, item) => sum + JSON.stringify(item).length, 0);
      const totalBytes = photoBytes + replayBytes;
      const maxBytes = 25 * 1024 * 1024;
      const usedPercent = clamp(Math.round((totalBytes / maxBytes) * 100), 0, 100);
      return {
        usedPercent,
        usedLabel: `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`,
        maxLabel: "25.00 MB"
      };
    },

    savePhoto() {
      const source = document.querySelector("#threeRaceViewport canvas") || document.getElementById("gameCanvas");
      if (!source || typeof source.toDataURL !== "function") {
        global.AppUI?.showToast("Capture failed", "error");
        return;
      }
      const photos = this.getPhotos();
      photos.unshift({
        id: `photo-${Date.now()}`,
        createdAt: Date.now(),
        title: `Capture ${photos.length + 1}`,
        dataUrl: source.toDataURL("image/png")
      });
      saveCollection(STORAGE_KEYS.photos, photos.slice(0, 36));
      global.AppUI?.showToast("Saved to Gallery", "success");
      global.dispatchEvent(new CustomEvent("gallery-updated"));
    },

    saveReplay() {
      if (!this.buffer.length) {
        global.AppUI?.showToast("No replay data yet", "error");
        return;
      }
      const averageSpeed = this.buffer.reduce((sum, frame) => sum + frame.speed, 0) / Math.max(1, this.buffer.length);
      const computedAccuracy = `${Math.round(Math.max(72, Math.min(98, 80 + averageSpeed / 18)))}%`;
      const replays = this.getReplays();
      replays.unshift({
        id: `replay-${Date.now()}`,
        createdAt: Date.now(),
        meta: {
          ...(this.meta || {}),
          result: this.meta?.result || "Victory",
          playerCount: this.meta?.playerCount || 8,
          eliminations: this.meta?.eliminations || Math.round(averageSpeed / 70) || 1,
          rating: this.meta?.rating || String(1350 + Math.round(averageSpeed)),
          damage: this.meta?.damage || String(1400 + Math.round(averageSpeed * 3)),
          revives: this.meta?.revives || String(Math.round(averageSpeed / 260)),
          accuracy: this.meta?.accuracy || computedAccuracy,
          mode: this.meta?.mode || "Career",
          saved: this.meta?.saved ?? true
        },
        frames: this.buffer.slice(-this.maxFrames)
      });
      saveCollection(STORAGE_KEYS.videos, replays.slice(0, 24));
      global.AppUI?.showToast("Replay saved", "success");
      global.dispatchEvent(new CustomEvent("album-updated"));
    },

    deletePhoto(id) {
      const photos = this.getPhotos().filter((item) => item.id !== id);
      saveCollection(STORAGE_KEYS.photos, photos);
      global.dispatchEvent(new CustomEvent("gallery-updated"));
    },

    clearPhotos() {
      saveCollection(STORAGE_KEYS.photos, []);
      global.dispatchEvent(new CustomEvent("gallery-updated"));
    },

    deleteReplay(id) {
      const replays = this.getReplays().filter((item) => item.id !== id);
      saveCollection(STORAGE_KEYS.videos, replays);
      global.dispatchEvent(new CustomEvent("album-updated"));
    },

    toggleReplaySaved(id) {
      const replays = this.getReplays().map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          meta: {
            ...(item.meta || {}),
            saved: item.meta?.saved === false ? true : false
          }
        };
      });
      saveCollection(STORAGE_KEYS.videos, replays);
      global.dispatchEvent(new CustomEvent("album-updated"));
    },

    openImage(dataUrl) {
      const modal = document.getElementById("galleryPreviewModal");
      const image = document.getElementById("galleryPreviewImage");
      if (!modal || !image) return;
      image.src = dataUrl;
      modal.classList.remove("hidden");
      modal.classList.add("is-visible");
    },

    closeImage() {
      const modal = document.getElementById("galleryPreviewModal");
      if (!modal) return;
      modal.classList.add("hidden");
      modal.classList.remove("is-visible");
    },

    playSavedReplay(id) {
      const replay = this.getReplays().find((entry) => entry.id === id);
      if (!replay || !replay.frames?.length) {
        global.AppUI?.showToast("Replay unavailable", "error");
        return;
      }
      const modal = document.getElementById("replayPlaybackModal");
      const canvas = document.getElementById("replayPlaybackCanvas");
      if (!modal || !canvas) return;
      modal.classList.remove("hidden");
      modal.classList.add("is-visible");
      this.stopPlayback();
      const ctx = canvas.getContext("2d");
      const frames = replay.frames;
      let index = 0;

      const drawFrame = () => {
        if (!modal.classList.contains("is-visible")) return;
        const frame = frames[index];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bg.addColorStop(0, "#0a1020");
        bg.addColorStop(1, "#161f34");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#2a2e35";
        ctx.fillRect(canvas.width * 0.25, 0, canvas.width * 0.5, canvas.height);
        ctx.strokeStyle = "#f5f0d0";
        ctx.setLineDash([26, 22]);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        const x = canvas.width / 2 + frame.x * 18;
        const y = canvas.height * 0.75 - (index / Math.max(1, frames.length - 1)) * canvas.height * 0.5;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(frame.rotation * 0.6);
        ctx.fillStyle = "#d92b2b";
        ctx.fillRect(-24, -42, 48, 84);
        ctx.fillStyle = "#10151c";
        ctx.fillRect(-14, -14, 28, 24);
        ctx.restore();

        ctx.fillStyle = "#f8fcff";
        ctx.font = "700 22px Arial";
        ctx.fillText(`Replay Speed ${Math.round(frame.speed)}`, 28, 40);

        index += 1;
        if (index < frames.length) {
          this.playbackFrame = requestAnimationFrame(drawFrame);
        }
      };

      this.playbackFrame = requestAnimationFrame(drawFrame);
    },

    stopPlayback() {
      if (this.playbackFrame) cancelAnimationFrame(this.playbackFrame);
      this.playbackFrame = 0;
      const modal = document.getElementById("replayPlaybackModal");
      if (!modal) return;
      modal.classList.add("hidden");
      modal.classList.remove("is-visible");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    ReplaySystem.init();
    document.getElementById("galleryPreviewClose")?.addEventListener("click", () => ReplaySystem.closeImage());
    document.querySelector("#galleryPreviewModal .gallery-preview-backdrop")?.addEventListener("click", () => ReplaySystem.closeImage());
    document.querySelector("#replayPlaybackModal .gallery-preview-backdrop")?.addEventListener("click", () => ReplaySystem.stopPlayback());
  });

  global.ReplaySystem = ReplaySystem;
})(window);
