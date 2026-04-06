(function attachAudioManager(global) {
  const AudioManager = {
    started: false,
    initialized: false,
    bgm: new Audio("sounds/bgm.mp3"),
    tap: new Audio("sounds/tap.aac"),
    coins: new Audio("sounds/coins.aac"),
    horn: new Audio("sounds/horn.aac"),
    overtake: new Audio("sounds/overtake.aac"),
    lastOvertakeAt: 0,

    init() {
      if (this.initialized) return;
      this.initialized = true;

      this.bgm.loop = true;
      this.bgm.volume = 0.25;
      this.bgm.preload = "auto";
      this.bgm.playsInline = true;

      this.tap.volume = 0.5;
      this.tap.preload = "auto";
      this.tap.playsInline = true;

      this.coins.volume = 0.7;
      this.coins.preload = "auto";
      this.coins.playsInline = true;

      this.horn.volume = 0.55;
      this.horn.preload = "auto";
      this.horn.playsInline = true;

      this.overtake.volume = 0.5;
      this.overtake.preload = "auto";
      this.overtake.playsInline = true;

      document.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        this.playTap();
      }, true);
    },

    startBGM() {
      if (this.started && !this.bgm.paused) return;
      this.bgm.play().then(() => {
        this.started = true;
        console.log("BGM started");
      }).catch(() => {
        this.started = false;
      });
    },

    playTap() {
      try {
        this.tap.currentTime = 0;
      } catch (error) {}
      this.tap.play().catch(() => {});
    },

    playCoins() {
      try {
        this.coins.currentTime = 0;
      } catch (error) {}
      this.coins.play().catch(() => {});
    },

    playHorn() {
      try {
        this.horn.currentTime = 0;
      } catch (error) {}
      this.horn.play().catch(() => {});
    },

    playOvertake() {
      const now = performance.now();
      if (now - this.lastOvertakeAt < 350) return;
      this.lastOvertakeAt = now;
      try {
        this.overtake.currentTime = 0;
      } catch (error) {}
      this.overtake.play().catch(() => {});
    },

    fadeDown() {},
    fadeUp() {}
  };

  AudioManager.init();
  global.AudioManager = AudioManager;
})(window);
