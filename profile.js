(function attachProfilePanel(global) {
  const MENU = {
    overview: "Overview",
    gallery: "Gallery",
    history: "History",
    skins: "Skins"
  };

  const GALLERY_TABS = {
    photos: "Photos",
    videos: "Videos"
  };

  const HISTORY_DETAILS_DEFAULT = {
    map: "Azure Track",
    result: "Victory",
    rating: "1480",
    eliminations: "3",
    damage: "2450",
    revives: "1"
  };

  function readJson(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function formatDate(timestamp) {
    const value = new Date(timestamp);
    return value.toLocaleDateString();
  }

  function formatTime(timestamp) {
    const value = new Date(timestamp);
    return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function estimateDataSize(dataUrl) {
    if (!dataUrl) return "0 KB";
    const sizeKb = Math.max(1, Math.round((dataUrl.length * 0.75) / 1024));
    return `${sizeKb} KB`;
  }

  function normalizeModeLabel(mode) {
    const value = String(mode || "").toLowerCase();
    return value.includes("room") ? "ROOM" : "NORMAL";
  }

  const ProfilePanel = {
    initialized: false,
    activeTab: "overview",
    activeGalleryTab: "photos",
    activeHistoryId: "",
    activeSkinId: "",
    highlightFilter: "all",

    init() {
      if (this.initialized) return;
      this.initialized = true;
      this.cache();
      this.buildLayout();
      this.cacheBuilt();
      this.bind();
      this.render();
    },

    cache() {
      this.overlay = document.getElementById("profilePanelOverlay");
      this.panel = document.getElementById("profilePanel");
    },

    buildLayout() {
      if (!this.panel) return;
      this.panel.innerHTML = `
        <nav class="profile-layout-menu" aria-label="Profile menu">
          <button class="profile-menu-item is-active" data-profile-tab="overview" type="button">Overview</button>
          <button class="profile-menu-item profile-gallery-trigger" data-profile-tab="gallery" type="button">
            <span>Gallery</span>
            <span class="profile-menu-arrow" aria-hidden="true"></span>
          </button>
          <div id="profileGallerySubmenu" class="profile-gallery-submenu hidden">
            <button class="profile-submenu-item is-active" data-gallery-tab="photos" type="button">Photos</button>
            <button class="profile-submenu-item" data-gallery-tab="videos" type="button">Videos</button>
          </div>
          <button class="profile-menu-item" data-profile-tab="history" type="button">
            <span>History</span>
            <span class="profile-menu-arrow" aria-hidden="true"></span>
          </button>
          <button class="profile-menu-item" data-profile-tab="skins" type="button">
            <span>Skins</span>
            <span class="profile-menu-arrow" aria-hidden="true"></span>
          </button>
        </nav>

        <section class="profile-layout-center">
          <div class="profile-center-topbar">
            <div class="profile-top-currency">
              <div class="profile-currency-pill">
                <span class="currency-icon"></span>
                <strong id="profilePanelCoins">0</strong>
              </div>
              <div class="profile-currency-pill">
                <span class="currency-icon currency-icon-diamond"></span>
                <strong id="profilePanelDiamonds">120</strong>
              </div>
            </div>
            <button id="profilePanelClose" class="profile-panel-close" type="button" aria-label="Close profile">X</button>
          </div>

          <div id="profileCenterStage" class="profile-center-stage">
            <div class="profile-center-spotlight"></div>
            <div class="profile-character-shell">
              <img id="profilePanelCharacter" class="profile-character" src="" alt="Profile character">
            </div>
          </div>

          <div id="profileDynamicContent" class="profile-dynamic-content"></div>
        </section>

        <aside id="profileInfoPanel" class="profile-layout-info">
          <div id="profileSideContent" class="profile-info-shell"></div>
        </aside>
      `;
    },

    cacheBuilt() {
      this.closeButton = document.getElementById("profilePanelClose");
      this.menuButtons = Array.from(this.panel.querySelectorAll(".profile-menu-item"));
      this.gallerySubmenu = document.getElementById("profileGallerySubmenu");
      this.gallerySubmenuButtons = Array.from(this.panel.querySelectorAll(".profile-submenu-item"));
      this.centerStage = document.getElementById("profileCenterStage");
      this.dynamic = document.getElementById("profileDynamicContent");
      this.infoPanel = document.getElementById("profileInfoPanel");
      this.sideContent = document.getElementById("profileSideContent");
      this.character = document.getElementById("profilePanelCharacter");
      this.coins = document.getElementById("profilePanelCoins");
      this.diamonds = document.getElementById("profilePanelDiamonds");
      this.galleryTrigger = this.panel.querySelector(".profile-gallery-trigger");
    },

    bind() {
      this.closeButton?.addEventListener("click", () => this.closePanel());
      this.overlay?.addEventListener("click", (event) => {
        if (event.target === this.overlay) this.closePanel();
      });

      this.menuButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tab = button.dataset.profileTab;
          if (tab === "gallery") {
            this.activeTab = "gallery";
          } else {
            this.activeTab = tab;
          }
          if (tab === "gallery" && !this.activeGalleryTab) {
            this.activeGalleryTab = "photos";
          }
          this.render();
        });
      });

      this.gallerySubmenuButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.activeTab = "gallery";
          this.activeGalleryTab = button.dataset.galleryTab;
          this.render();
        });
      });

      const profileOpenTargets = [
        document.getElementById("profileButton"),
        document.getElementById("lobbyProfileTrigger"),
        document.getElementById("lobbySettingsButton")
      ];

      profileOpenTargets.forEach((element) => {
        element?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          this.open();
        }, true);
      });

      global.addEventListener("gallery-updated", () => this.renderIfOpen());
      global.addEventListener("album-updated", () => this.renderIfOpen());
    },

    renderIfOpen() {
      if (this.overlay?.classList.contains("is-visible")) this.render();
    },

    getProfileSnapshot() {
      const matches = Number(document.getElementById("profileMatchesValue")?.textContent || 0);
      return {
        playerName: document.getElementById("lobbyPlayerName")?.textContent?.trim() || "PLAYER",
        levelBadge: (document.getElementById("lobbyLevelBadge")?.textContent?.trim() || "LV 1").replace("LV", "Lv."),
        playerId: document.getElementById("playerIdValue")?.textContent?.trim() || "RG-000000",
        language: document.getElementById("lobbyCountryMini")?.textContent?.trim() || "English",
        coins: document.getElementById("lobbyCoinsValue")?.textContent?.trim() || "0",
        diamonds: "120",
        wins: String(Math.max(0, Math.floor(matches * 0.32))),
        matches: String(matches),
        score: String(1800 + matches * 145),
        likes: String(120 + matches * 2),
        avatar: document.getElementById("lobbyProfileImage")?.getAttribute("src") || ""
      };
    },

    getHistoryRows() {
      const replays = (global.ReplaySystem?.getReplays?.() || []).map((item) => ({
        id: item.id,
        result: item.meta?.result || "Victory",
        mode: item.meta?.mode || "Career",
        playerCount: item.meta?.playerCount || 8,
        eliminations: item.meta?.eliminations || 3,
        date: formatDate(item.createdAt),
        time: formatTime(item.createdAt),
        map: item.meta?.map || HISTORY_DETAILS_DEFAULT.map,
        rating: item.meta?.rating || HISTORY_DETAILS_DEFAULT.rating,
        damage: item.meta?.damage || HISTORY_DETAILS_DEFAULT.damage,
        revives: item.meta?.revives || HISTORY_DETAILS_DEFAULT.revives
      }));

      const roomRows = readJson("room_history").map((item, index) => ({
        id: `room-${index}`,
        result: item.result || "Defeat",
        mode: item.mode || "Room",
        playerCount: item.playerCount || 6,
        eliminations: item.eliminations || 1,
        date: formatDate(Date.now()),
        time: formatTime(Date.now()),
        map: item.map || HISTORY_DETAILS_DEFAULT.map,
        rating: item.rating || "1310",
        damage: item.damage || "1780",
        revives: item.revives || "0"
      }));

      const rows = [...replays, ...roomRows];
      if (!this.activeHistoryId && rows[0]) this.activeHistoryId = rows[0].id;
      return rows;
    },

    getSkinRows() {
      const cars = global.ASSETS?.cars || [];
      const unlocked = new Set(global.appState?.unlockedCars || [0, 1]);
      const rows = cars.map((car, index) => ({
        id: `skin-${index}`,
        name: car.name,
        image: car.src,
        status: unlocked.has(index) ? "Unlocked" : "Locked"
      }));
      if (!this.activeSkinId && rows[0]) this.activeSkinId = rows[0].id;
      return rows;
    },

    renderOverviewCenter() {
      return `
        <div class="profile-content-view">
          <div class="profile-overview-stage-ui" aria-hidden="true">
            <div class="profile-overview-ring"></div>
            <div class="profile-overview-ring ring-two"></div>
            <div class="profile-overview-particles">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      `;
    },

    renderOverviewSide(data) {
      return `
        <div class="profile-photo-frame">
          <img id="profilePanelPhoto" class="profile-photo-image" src="${data.avatar}" alt="Profile photo">
        </div>
        <div class="profile-identity">
          <h2 id="profilePanelName">${data.playerName}</h2>
          <div class="profile-id-row">
            <span id="profilePanelId" class="profile-id-text">${data.playerId}</span>
            <button id="profileIdCopyButton" class="profile-id-copy" type="button" aria-label="Copy player id"></button>
          </div>
          <div class="profile-mini-row">
            <span id="profilePanelLevel" class="profile-mini-chip">${data.levelBadge}</span>
            <span id="profilePanelLanguage" class="profile-mini-chip">${data.language}</span>
          </div>
        </div>
        <div class="profile-like-row">
          <span class="profile-like-label">Likes</span>
          <strong id="profilePanelLikes">${data.likes}</strong>
        </div>
        <div class="profile-stat-list">
          <div class="profile-stat-row">
            <span>Wins</span>
            <strong id="profileStatWins">${data.wins}</strong>
          </div>
          <div class="profile-stat-row">
            <span>Matches</span>
            <strong id="profileStatMatches">${data.matches}</strong>
          </div>
          <div class="profile-stat-row">
            <span>Score</span>
            <strong id="profileStatScore">${data.score}</strong>
          </div>
        </div>
      `;
    },

    renderGalleryCenter() {
      const photos = global.ReplaySystem?.getPhotos?.() || [];
      const replays = global.ReplaySystem?.getReplays?.() || [];
      const storage = global.ReplaySystem?.getStorageStats?.() || { usedPercent: 0, usedLabel: "0 MB", maxLabel: "25 MB" };
      const recordEnabled = global.ReplaySystem?.getRecordEnabled?.() ?? true;
      const filteredReplays = replays.filter((item) => {
        if (this.highlightFilter === "saved") return item.meta?.saved !== false;
        if (this.highlightFilter === "not-saved") return item.meta?.saved === false;
        return true;
      });

      if (this.activeGalleryTab === "photos") {
        return `
          <div class="profile-content-view">
            <div class="profile-tab-bar">
              ${Object.entries(GALLERY_TABS).map(([key, label]) => `
                <button class="profile-tab-button ${this.activeGalleryTab === key ? "is-active" : ""}" type="button" data-gallery-tab="${key}">${label}</button>
              `).join("")}
            </div>
            <div class="profile-gallery-grid rich-grid">
              ${photos.length ? photos.map((item, index) => `
                <button class="profile-media-card" type="button" data-photo-id="${item.id}">
                  <div class="profile-media-thumb">
                    <img src="${item.dataUrl}" alt="Saved photo ${index + 1}">
                  </div>
                  <div class="profile-media-copy">
                    <strong>Capture ${index + 1}</strong>
                    <span>${formatDate(item.createdAt)}</span>
                    <span>${estimateDataSize(item.dataUrl)}</span>
                  </div>
                </button>
              `).join("") : '<div class="profile-empty-state">No regular photos stored yet.</div>'}
            </div>
            <div class="profile-storage-footer">
              <div class="profile-storage-bar">
                <div class="profile-storage-fill" style="width:${storage.usedPercent}%"></div>
              </div>
              <div class="profile-storage-meta">
                <span>${storage.usedLabel} / ${storage.maxLabel}</span>
                <button id="profileDeletePhotosButton" class="profile-inline-icon profile-delete-icon" type="button" aria-label="Delete photos"></button>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div class="profile-content-view">
          <div class="profile-tab-bar">
            ${Object.entries(GALLERY_TABS).map(([key, label]) => `
              <button class="profile-tab-button ${this.activeGalleryTab === key ? "is-active" : ""}" type="button" data-gallery-tab="${key}">${label}</button>
            `).join("")}
          </div>
          <div class="profile-filter-bar">
            ${[
              ["all", "All"],
              ["saved", "Saved"],
              ["not-saved", "Not Saved"]
            ].map(([key, label]) => `
              <button class="profile-filter-chip ${this.highlightFilter === key ? "is-active" : ""}" type="button" data-highlight-filter="${key}">${label}</button>
            `).join("")}
          </div>
          <div class="profile-highlights-table">
            <div class="profile-highlights-head">
              <span>Action</span>
              <span>Laps</span>
              <span>Time</span>
              <span class="actions">Play</span>
            </div>
            ${filteredReplays.length ? filteredReplays.map((item) => `
              <div class="profile-highlights-row">
                <div class="profile-action-cell">
                  <div class="profile-action-main">
                    <span class="profile-result-badge ${String(item.meta?.result || "Victory").toLowerCase().includes("win") ? "is-win" : "is-lose"}"></span>
                    <strong>${String(item.meta?.result || "Victory").toLowerCase().includes("win") ? "WIN" : (item.meta?.positionLabel || "#2")}</strong>
                  </div>
                  <span class="profile-action-mode">${normalizeModeLabel(item.meta?.mode)}</span>
                </div>
                <span>${item.meta?.laps || 1}</span>
                <span>${formatDate(item.createdAt)} ${formatTime(item.createdAt)}</span>
                <button class="profile-video-play" type="button" data-replay-id="${item.id}">Play</button>
              </div>
            `).join("") : '<div class="profile-empty-state">No highlight replays stored yet.</div>'}
          </div>
          <div class="profile-storage-footer">
            <div class="profile-storage-bar">
              <div class="profile-storage-fill" style="width:${storage.usedPercent}%"></div>
            </div>
            <div class="profile-storage-meta">
              <span>${storage.usedLabel} / ${storage.maxLabel}</span>
              <label class="profile-record-toggle">
                <span>Record</span>
                <button id="profileRecordToggle" class="profile-toggle-switch ${recordEnabled ? "is-on" : ""}" type="button" aria-label="Toggle replay recording"></button>
              </label>
            </div>
          </div>
        </div>
      `;
    },

    renderGallerySide() {
      const photos = global.ReplaySystem?.getPhotos?.() || [];
      const replays = global.ReplaySystem?.getReplays?.() || [];
      const storage = global.ReplaySystem?.getStorageStats?.() || { usedPercent: 0, usedLabel: "0 MB", maxLabel: "25 MB" };
      return `
        <div class="profile-side-card">
          <h3>Gallery Storage</h3>
          <div class="profile-side-row">
            <span>Photos</span>
            <strong>${photos.length}</strong>
          </div>
          <div class="profile-side-row">
            <span>Highlights</span>
            <strong>${replays.length}</strong>
          </div>
          <div class="profile-side-row">
            <span>Usage</span>
            <strong>${storage.usedLabel}</strong>
          </div>
          <div class="profile-storage-bar compact">
            <div class="profile-storage-fill" style="width:${storage.usedPercent}%"></div>
          </div>
        </div>
      `;
    },

    renderHistoryCenter() {
      const rows = this.getHistoryRows();
      return `
        <div class="profile-content-view">
          <div class="profile-section-title">History</div>
          <div class="profile-history-table">
            ${rows.length ? rows.map((item) => `
              <button class="profile-history-line ${this.activeHistoryId === item.id ? "is-active" : ""}" type="button" data-history-id="${item.id}">
                <span>${item.result}</span>
                <span>${item.mode}</span>
                <span>${item.playerCount}</span>
                <span>${item.eliminations}</span>
                <span>${item.date} ${item.time}</span>
              </button>
            `).join("") : '<div class="profile-empty-state">No match history available.</div>'}
          </div>
        </div>
      `;
    },

    renderHistorySide() {
      const rows = this.getHistoryRows();
      const active = rows.find((item) => item.id === this.activeHistoryId) || HISTORY_DETAILS_DEFAULT;
      return `
        <div class="profile-side-card">
          <h3>Match Details</h3>
          <div class="profile-side-row">
            <span>Map</span>
            <strong>${active.map}</strong>
          </div>
          <div class="profile-side-row">
            <span>Result</span>
            <strong>${active.result}</strong>
          </div>
          <div class="profile-detail-stack">
            <div class="profile-side-row">
              <span>Rating</span>
              <strong>${active.rating}</strong>
            </div>
            <div class="profile-side-row">
              <span>Eliminations</span>
              <strong>${active.eliminations}</strong>
            </div>
            <div class="profile-side-row">
              <span>Damage</span>
              <strong>${active.damage}</strong>
            </div>
            <div class="profile-side-row">
              <span>Revives</span>
              <strong>${active.revives}</strong>
            </div>
          </div>
          <button class="profile-detail-button" type="button">Details</button>
        </div>
      `;
    },

    renderSkinsCenter() {
      const skins = this.getSkinRows();
      return `
        <div class="profile-content-view">
          <div class="profile-section-title">Skins</div>
          <div class="profile-skins-grid">
            ${skins.length ? skins.map((item) => `
              <button class="profile-skin-card ${this.activeSkinId === item.id ? "is-active" : ""}" type="button" data-skin-id="${item.id}">
                <div class="profile-skin-thumb">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="profile-skin-copy">
                  <strong>${item.name}</strong>
                  <span>${item.status}</span>
                </div>
              </button>
            `).join("") : '<div class="profile-empty-state">No skins available.</div>'}
          </div>
        </div>
      `;
    },

    renderSkinsSide() {
      const skins = this.getSkinRows();
      const active = skins.find((item) => item.id === this.activeSkinId) || skins[0];
      if (!active) return '<div class="profile-side-card"><h3>Skins</h3><div class="profile-empty-state">No skins available.</div></div>';
      return `
        <div class="profile-side-card">
          <h3>Skin Details</h3>
          <div class="profile-side-preview">
            <img src="${active.image}" alt="${active.name}">
          </div>
          <div class="profile-side-row">
            <span>Name</span>
            <strong>${active.name}</strong>
          </div>
          <div class="profile-side-row">
            <span>Status</span>
            <strong>${active.status}</strong>
          </div>
        </div>
      `;
    },

    bindSideActions() {
      this.sideContent?.querySelector("#profileIdCopyButton")?.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(this.getProfileSnapshot().playerId);
          global.AppUI?.showToast("Player ID copied", "success");
        } catch (error) {
          global.AppUI?.showToast("Copy unavailable", "error");
        }
      });
    },

    attachDynamicHandlers() {
      this.dynamic?.querySelectorAll("[data-gallery-tab]").forEach((button) => {
        button.addEventListener("click", () => {
          this.activeGalleryTab = button.dataset.galleryTab;
          this.render();
        });
      });

      this.dynamic?.querySelectorAll("[data-highlight-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          this.highlightFilter = button.dataset.highlightFilter;
          this.render();
        });
      });

      this.dynamic?.querySelectorAll("[data-photo-id]").forEach((button) => {
        button.addEventListener("click", () => {
          const photo = (global.ReplaySystem?.getPhotos?.() || []).find((entry) => entry.id === button.dataset.photoId);
          if (photo) global.ReplaySystem?.openImage?.(photo.dataUrl);
        });
      });

      this.dynamic?.querySelectorAll("[data-replay-id]").forEach((button) => {
        button.addEventListener("click", () => {
          global.ReplaySystem?.playSavedReplay?.(button.dataset.replayId);
        });
      });

      this.dynamic?.querySelectorAll("[data-history-id]").forEach((button) => {
        button.addEventListener("click", () => {
          this.activeHistoryId = button.dataset.historyId;
          this.render();
        });
      });

      this.dynamic?.querySelectorAll("[data-skin-id]").forEach((button) => {
        button.addEventListener("click", () => {
          this.activeSkinId = button.dataset.skinId;
          this.render();
        });
      });

      this.dynamic?.querySelector("#profileDeletePhotosButton")?.addEventListener("click", () => {
        global.ReplaySystem?.clearPhotos?.();
        this.render();
      });

      this.dynamic?.querySelector("#profileRecordToggle")?.addEventListener("click", () => {
        const next = !(global.ReplaySystem?.getRecordEnabled?.() ?? true);
        global.ReplaySystem?.setRecordEnabled?.(next);
        this.render();
      });
    },

    render() {
      const data = this.getProfileSnapshot();
      if (this.character) this.character.src = data.avatar;
      if (this.coins) this.coins.textContent = data.coins;
      if (this.diamonds) this.diamonds.textContent = data.diamonds;

      this.menuButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.profileTab === this.activeTab);
      });
      this.galleryTrigger?.classList.toggle("is-active", this.activeTab === "gallery");
      this.galleryTrigger?.classList.toggle("is-expanded", this.activeTab === "gallery");
      this.gallerySubmenu?.classList.toggle("hidden", this.activeTab !== "gallery");
      this.gallerySubmenuButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.galleryTab === this.activeGalleryTab);
      });

      let centerHtml = "";
      let sideHtml = "";

      if (this.activeTab === "gallery") {
        centerHtml = this.renderGalleryCenter();
        sideHtml = this.renderGallerySide();
        this.centerStage?.classList.add("hidden");
      } else if (this.activeTab === "history") {
        centerHtml = this.renderHistoryCenter();
        sideHtml = this.renderHistorySide();
        this.centerStage?.classList.add("hidden");
      } else if (this.activeTab === "skins") {
        centerHtml = this.renderSkinsCenter();
        sideHtml = this.renderSkinsSide();
        this.centerStage?.classList.add("hidden");
      } else {
        centerHtml = this.renderOverviewCenter();
        sideHtml = this.renderOverviewSide(data);
        this.centerStage?.classList.remove("hidden");
      }

      if (this.dynamic) this.dynamic.innerHTML = centerHtml;
      if (this.sideContent) this.sideContent.innerHTML = sideHtml;
      this.attachDynamicHandlers();
      this.bindSideActions();
    },

    open() {
      this.render();
      this.overlay?.classList.remove("hidden");
      this.overlay?.classList.add("is-visible");
      this.overlay?.setAttribute("aria-hidden", "false");
    },

    closePanel() {
      this.overlay?.classList.remove("is-visible");
      this.overlay?.classList.add("hidden");
      this.overlay?.setAttribute("aria-hidden", "true");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    ProfilePanel.init();
  });

  global.ProfilePanel = ProfilePanel;
})(window);
