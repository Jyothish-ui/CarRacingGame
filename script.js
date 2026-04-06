
const STORAGE_KEYS = {
  gender: "racing-game-gender",
  mapIndex: "racing-game-map-index",
  carIndex: "racing-game-car-index",
  skinIndex: "racing-game-skin-index",
  carUnlocks: "racing-game-car-unlocks",
  coins: "racing-game-coins",
  playerProfile: "racing-game-player-profile",
  invites: "racing-game-invites",
  dailyReward: "racing-game-daily-reward",
  raceSession: "racing-game-race-session"
};

const COUNTRY_CODES = "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CR HR CU CY CZ CD DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(" ");

function countryCodeToFlag(code) {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

const regionNames = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["en"], { type: "region" })
  : null;

const PROFILE_COUNTRIES = COUNTRY_CODES.map((code) => ({
  code,
  name: regionNames ? regionNames.of(code) || code : code,
  flag: countryCodeToFlag(code),
  flagUrl: `https://flagcdn.com/w80/${code.toLowerCase()}.png`
}));
const AVATAR_LIBRARY = {
  male: [
    "assets/avatars/male-1.jpeg",
    "assets/avatars/male-2.jpeg",
    "assets/avatars/male-3.jpeg",
    "assets/avatars/male-4.jpeg",
    "assets/avatars/male-5.jpeg",
    "assets/avatars/male-6.jpeg"
  ],
  female: [
    "assets/avatars/female-1.jpeg",
    "assets/avatars/female-2.jpeg",
    "assets/avatars/female-3.jpeg",
    "assets/avatars/female-4.jpeg",
    "assets/avatars/female-5.jpeg",
    "assets/avatars/female-6.jpeg"
  ]
};

const DAILY_REWARD_AMOUNTS = [500, 1000, 2500, 3500, 5000, 7000, 10000];
const GAME_MODES = [
  { id: "career", name: "Career", image: "assets/ui/loading-first.jpeg", unlocked: true, description: "Race through the main driving path." },
  { id: "championship", name: "Championship", image: "assets/ui/loading-second.jpeg", unlocked: false, description: "Locked elite tournament mode." },
  { id: "multiplayer", name: "Multiplayer", image: "assets/ui/splash-user.jpeg", unlocked: false, description: "Locked online challenge mode." },
  { id: "2d", name: "2D Mode", image: "assets/ui/loading-first.jpeg", unlocked: true, description: "Classic 2D racing run." }
];
const DIFFICULTY_LEVELS = ["Amateur", "Pro", "Legend"];
const OPPONENT_NAMES = ["Emma", "Colton", "Ronny", "Mia", "Luca", "Sana", "Ryan", "Zoya"];
const CAMERA_MODES = [
  { id: "third", label: "Third" },
  { id: "top", label: "Top" },
  { id: "first", label: "First" }
];

const ASSETS = {
  characters: {
    male: "assets/characters/male-driver.svg",
    female: "assets/characters/female-driver.svg"
  },
  cars: [
    { id: 1, name: "RC One", src: "assets/cars/car-red.svg", model: "assets/cars/rc_car.glb", tier: "Free", description: "Main RC race car ready from the start.", rating: 391, price: 0, stats: { speed: 30, acceleration: 9.3, handling: 1.208, braking: 360 } },
    { id: 2, name: "RC Two", src: "assets/cars/car-blue.svg", model: "assets/cars/rc_car.glb", tier: "Locked", description: "Sharper bodywork with stronger top-end pace.", rating: 418, price: 500, stats: { speed: 32, acceleration: 8.9, handling: 1.264, braking: 372 } },
    { id: 3, name: "RC Three", src: "assets/cars/car-green.svg", model: "assets/cars/rc_car.glb", tier: "Locked", description: "Balanced race setup with improved corner stability.", rating: 447, price: 800, stats: { speed: 34, acceleration: 8.5, handling: 1.292, braking: 388 } },
    { id: 4, name: "RC Four", src: "assets/cars/car-orange.svg", model: "assets/cars/rc_car.glb", tier: "Locked", description: "Aggressive tuned chassis built for faster exits.", rating: 463, price: 1200, stats: { speed: 35, acceleration: 8.2, handling: 1.336, braking: 402 } },
    { id: 5, name: "RC Five", src: "assets/cars/car-yellow.svg", model: "assets/cars/rc_car.glb", tier: "Locked", description: "Premium RC racer with the strongest all-round feel.", rating: 512, price: 1500, stats: { speed: 39, acceleration: 7.6, handling: 1.418, braking: 446 } }
  ]
};

const SKINS = [
  { id: "classic", name: "Classic", description: "Clean factory finish for a sharp race-day look.", accent: "#f6c945" },
  { id: "ice", name: "Ice", description: "Cool trim package with frosted highlights.", accent: "#8dd7ff" },
  { id: "ember", name: "Ember", description: "Warm glow package with fiery dashboard style.", accent: "#ff9b5e" },
  { id: "forest", name: "Forest", description: "Muted green trim inspired by woodland tracks.", accent: "#7fd48b" }
];

const FRIENDS_DATA = {
  playing: ["Aarav", "Mia", "Noah"],
  online: ["Priya", "Luca", "Sana", "Ryan"],
  offline: ["Zoya", "Owen", "Eva", "Kabir"]
};

const MAPS = [
  {
    id: "coastal-run",
    name: "Coastal Run",
    description: "Smooth seaside road with long open corners and forgiving turns.",
    difficulty: "Easy",
    previewBars: 3,
    theme: { skyTop: "#6cc7ff", skyBottom: "#0c3561", groundA: "#3d8f65", groundB: "#2f7c57", accent: "#ffe08a", deco: "#8fd3ff" },
    segments: [{ length: 540, curve: 0 }, { length: 260, curve: 0.1 }, { length: 280, curve: 0.18 }, { length: 360, curve: 0 }, { length: 320, curve: -0.16 }, { length: 280, curve: -0.1 }, { length: 420, curve: 0 }]
  },
  {
    id: "desert-snake",
    name: "Desert Snake",
    description: "Warm desert route with quick left-right bends and tighter rhythm.",
    difficulty: "Medium",
    previewBars: 5,
    theme: { skyTop: "#f7b267", skyBottom: "#7a3f12", groundA: "#d8a15a", groundB: "#c68b46", accent: "#fff0a8", deco: "#f0c27f" },
    segments: [{ length: 420, curve: 0 }, { length: 240, curve: -0.14 }, { length: 240, curve: 0.12 }, { length: 240, curve: -0.18 }, { length: 260, curve: 0.16 }, { length: 300, curve: 0 }, { length: 300, curve: 0.12 }, { length: 360, curve: 0 }]
  },
  {
    id: "forest-bend",
    name: "Forest Bend",
    description: "Shaded forest highway with sweeping arcs and trickier exits.",
    difficulty: "Medium",
    previewBars: 6,
    theme: { skyTop: "#79d3a7", skyBottom: "#14392c", groundA: "#315b2f", groundB: "#284c28", accent: "#f6d76d", deco: "#a9f0b8" },
    segments: [{ length: 560, curve: 0 }, { length: 320, curve: 0.08 }, { length: 340, curve: 0.14 }, { length: 280, curve: 0 }, { length: 320, curve: -0.16 }, { length: 260, curve: -0.1 }, { length: 420, curve: 0 }]
  },
  {
    id: "night-loop",
    name: "Night Loop",
    description: "Locked neon night circuit with faster sweepers.",
    difficulty: "Hard",
    previewBars: 7,
    theme: { skyTop: "#4f6cff", skyBottom: "#141c52", groundA: "#2b2f5a", groundB: "#23264a", accent: "#9bd1ff", deco: "#89a6ff" },
    segments: [{ length: 420, curve: 0 }, { length: 280, curve: 0.2 }, { length: 260, curve: -0.18 }, { length: 320, curve: 0.22 }, { length: 360, curve: 0 }]
  },
  {
    id: "volcano-pass",
    name: "Volcano Pass",
    description: "Locked lava-side road with sharp directional changes.",
    difficulty: "Hard",
    previewBars: 8,
    theme: { skyTop: "#ff7a59", skyBottom: "#4a1610", groundA: "#6a3021", groundB: "#532419", accent: "#ffd166", deco: "#ff9f7a" },
    segments: [{ length: 360, curve: 0 }, { length: 220, curve: -0.2 }, { length: 220, curve: 0.22 }, { length: 260, curve: -0.18 }, { length: 320, curve: 0.18 }, { length: 300, curve: 0 }]
  }
];

const UNLOCKED_MAP_COUNT = 3;
const UNLOCKED_CAR_COUNT = 1;

const elements = {
  splashScreen: document.getElementById("splashScreen"),
  tapToContinueButton: document.getElementById("tapToContinueButton"),
  loadingScreen: document.getElementById("loadingScreen"),
  loadingImageFirst: document.getElementById("loadingImageFirst"),
  loadingImageSecond: document.getElementById("loadingImageSecond"),
  loadingText: document.getElementById("loadingText"),
  loadingPercent: document.getElementById("loadingPercent"),
  loadingBarFill: document.getElementById("loadingBarFill"),
  profileButton: document.getElementById("profileButton"),
  profileInitial: document.getElementById("profileInitial"),
  walletBox: document.getElementById("walletBox"),
  walletAmount: document.getElementById("walletAmount"),
  profilePopup: document.getElementById("profilePopup"),
  profileCloseButton: document.getElementById("profileCloseButton"),
  playerNameInput: document.getElementById("playerNameInput"),
  playerIdValue: document.getElementById("playerIdValue"),
  profileCoinsValue: document.getElementById("profileCoinsValue"),
  profileMatchesValue: document.getElementById("profileMatchesValue"),
  friendIdInput: document.getElementById("friendIdInput"),
  sendInviteButton: document.getElementById("sendInviteButton"),
  inviteMessage: document.getElementById("inviteMessage"),
  inviteList: document.getElementById("inviteList"),
  profileSetupScreen: document.getElementById("profileSetupScreen"),
  errorScreen: document.getElementById("errorScreen"),
  errorMessageText: document.getElementById("errorMessageText"),
  errorBackButton: document.getElementById("errorBackButton"),
  avatarPrevButton: document.getElementById("avatarPrevButton"),
  avatarNextButton: document.getElementById("avatarNextButton"),
  avatarChooseButton: document.getElementById("avatarChooseButton"),
  setupAvatarPreview: document.getElementById("setupAvatarPreview"),
  setupAvatarCount: document.getElementById("setupAvatarCount"),
  setupNameInput: document.getElementById("setupNameInput"),
  setupCountrySearch: document.getElementById("setupCountrySearch"),
  setupMaleButton: document.getElementById("setupMaleButton"),
  setupFemaleButton: document.getElementById("setupFemaleButton"),
  countryCarousel: document.getElementById("countryCarousel"),
  setupCountryFlag: document.getElementById("setupCountryFlag"),
  setupCountryLabel: document.getElementById("setupCountryLabel"),
  profileSetupNextButton: document.getElementById("profileSetupNextButton"),
  dailyRewardScreen: document.getElementById("dailyRewardScreen"),
  dailyRewardCards: document.getElementById("dailyRewardCards"),
  claimRewardButton: document.getElementById("claimRewardButton"),
  closeRewardButton: document.getElementById("closeRewardButton"),
  rewardParticles: document.getElementById("rewardParticles"),
  gameModesScreen: document.getElementById("gameModesScreen"),
  gameModesGrid: document.getElementById("gameModesGrid"),
  closeModesButton: document.getElementById("closeModesButton"),
  roomScreen: document.getElementById("roomScreen"),
  roomButton: document.getElementById("roomButton"),
  roomBackButton: document.getElementById("roomBackButton"),
  roomFriendsPanel: document.getElementById("roomFriendsPanel"),
  roomFriendsToggle: document.getElementById("roomFriendsToggle"),
  roomFriendsArrow: document.getElementById("roomFriendsArrow"),
  roomPlayingList: document.getElementById("roomPlayingList"),
  roomOnlineList: document.getElementById("roomOnlineList"),
  roomOfflineList: document.getElementById("roomOfflineList"),
  roomLapsMinus: document.getElementById("roomLapsMinus"),
  roomLapsPlus: document.getElementById("roomLapsPlus"),
  roomLapsValue: document.getElementById("roomLapsValue"),
  roomOpponentsMinus: document.getElementById("roomOpponentsMinus"),
  roomOpponentsPlus: document.getElementById("roomOpponentsPlus"),
  roomOpponentsValue: document.getElementById("roomOpponentsValue"),
  roomSpeedMinus: document.getElementById("roomSpeedMinus"),
  roomSpeedPlus: document.getElementById("roomSpeedPlus"),
  roomSpeedValue: document.getElementById("roomSpeedValue"),
  roomBetMinus: document.getElementById("roomBetMinus"),
  roomBetPlus: document.getElementById("roomBetPlus"),
  roomBetValue: document.getElementById("roomBetValue"),
  roomInviteSlots: document.getElementById("roomInviteSlots"),
  roomCreateButton: document.getElementById("roomCreateButton"),
  roomStatusText: document.getElementById("roomStatusText"),
  raceSettingsScreen: document.getElementById("raceSettingsScreen"),
  closeRaceSettingsButton: document.getElementById("closeRaceSettingsButton"),
  raceSettingsCoinsValue: document.getElementById("raceSettingsCoinsValue"),
  lapsMinusButton: document.getElementById("lapsMinusButton"),
  lapsPlusButton: document.getElementById("lapsPlusButton"),
  lapsValue: document.getElementById("lapsValue"),
  lapsFill: document.getElementById("lapsFill"),
  opponentsMinusButton: document.getElementById("opponentsMinusButton"),
  opponentsPlusButton: document.getElementById("opponentsPlusButton"),
  opponentsValue: document.getElementById("opponentsValue"),
  opponentsFill: document.getElementById("opponentsFill"),
  weatherToggleButton: document.getElementById("weatherToggleButton"),
  weatherValue: document.getElementById("weatherValue"),
  difficultyPrevButton: document.getElementById("difficultyPrevButton"),
  difficultyNextButton: document.getElementById("difficultyNextButton"),
  difficultyValue: document.getElementById("difficultyValue"),
  difficultyFill: document.getElementById("difficultyFill"),
  raceRewardValue: document.getElementById("raceRewardValue"),
  raceSettingsStartButton: document.getElementById("raceSettingsStartButton"),
  startingGridScreen: document.getElementById("startingGridScreen"),
  startingGridRows: document.getElementById("startingGridRows"),
  startGridRaceButton: document.getElementById("startGridRaceButton"),
  exitGridButton: document.getElementById("exitGridButton"),
  startingGridCountdown: document.getElementById("startingGridCountdown"),
  raceResultScreen: document.getElementById("raceResultScreen"),
  raceResultRows: document.getElementById("raceResultRows"),
  podiumFirstName: document.getElementById("podiumFirstName"),
  podiumSecondName: document.getElementById("podiumSecondName"),
  podiumThirdName: document.getElementById("podiumThirdName"),
  raceResultCoinsValue: document.getElementById("raceResultCoinsValue"),
  raceResultCoinBurst: document.getElementById("raceResultCoinBurst"),
  raceResultLobbyButton: document.getElementById("raceResultLobbyButton"),
  raceResultReplayButton: document.getElementById("raceResultReplayButton"),
  savePhotoButton: document.getElementById("savePhotoButton"),
  saveReplayButton: document.getElementById("saveReplayButton"),
  countdownOverlay: document.getElementById("countdownOverlay"),
  countdownValue: document.getElementById("countdownValue"),
  friendsPanel: document.getElementById("friendsPanel"),
  friendsToggle: document.getElementById("friendsToggle"),
  friendsArrow: document.getElementById("friendsArrow"),
  playingList: document.getElementById("playingList"),
  onlineList: document.getElementById("onlineList"),
  offlineList: document.getElementById("offlineList"),
  lobbyScreen: document.getElementById("lobbyScreen"),
  garageBackButton: document.getElementById("garageBackButton"),
  lobbyVideo: document.getElementById("lobbyVideo"),
  lobbyProfileTrigger: document.getElementById("lobbyProfileTrigger"),
  lobbyProfileImage: document.getElementById("lobbyProfileImage"),
  lobbyPlayerName: document.getElementById("lobbyPlayerName"),
  lobbyLevelBadge: document.getElementById("lobbyLevelBadge"),
  lobbyXpFill: document.getElementById("lobbyXpFill"),
  lobbyCountryMini: document.getElementById("lobbyCountryMini"),
  lobbyCoinsValue: document.getElementById("lobbyCoinsValue"),
  lobbySettingsButton: document.getElementById("lobbySettingsButton"),
  lobbyCarPreview: document.getElementById("lobbyCarPreview"),
  garageDriverName: document.getElementById("garageDriverName"),
  garageRatingValue: document.getElementById("garageRatingValue"),
  garageSpeedText: document.getElementById("garageSpeedText"),
  garageAccelerationText: document.getElementById("garageAccelerationText"),
  garageHandlingText: document.getElementById("garageHandlingText"),
  garageBrakingText: document.getElementById("garageBrakingText"),
  garageSpeedBar: document.getElementById("garageSpeedBar"),
  garageAccelerationBar: document.getElementById("garageAccelerationBar"),
  garageHandlingBar: document.getElementById("garageHandlingBar"),
  garageBrakingBar: document.getElementById("garageBrakingBar"),
  garageCustomizeButton: document.getElementById("garageCustomizeButton"),
  garageSelectButton: document.getElementById("garageSelectButton"),
  garageBuyButton: document.getElementById("garageBuyButton"),
  garageSelectedLabel: document.getElementById("garageSelectedLabel"),
  garageLockLabel: document.getElementById("garageLockLabel"),
  garageCarStrip: document.getElementById("garageCarStrip"),
  dailyRewardOpenButton: document.getElementById("dailyRewardOpenButton"),
  mapPreviewName: document.getElementById("mapPreviewName"),
  mapPreviewText: document.getElementById("mapPreviewText"),
  mapPreviewBars: document.getElementById("mapPreviewBars"),
  mapDifficulty: document.getElementById("mapDifficulty"),
  eventPlayButton: document.getElementById("eventPlayButton"),
  storeButton: document.getElementById("storeButton"),
  inventoryButton: document.getElementById("inventoryButton"),
  garageButton: document.getElementById("garageButton"),
  genderButtons: Array.from(document.querySelectorAll("[data-gender]")),
  startGameButton: document.getElementById("startGameButton"),
  gameShell: document.getElementById("gameScreen") || document.getElementById("gameShell"),
  threeViewport: document.getElementById("threeRaceViewport"),
  canvas: document.getElementById("gameCanvas"),
  gameCoinChip: document.getElementById("gameCoinChip"),
  gameCoinValue: document.getElementById("gameCoinValue"),
  speedValue: document.getElementById("speedValue"),
  lapValue: document.getElementById("lapValue"),
  positionValue: document.getElementById("positionValue"),
  currentTimeValue: document.getElementById("currentTimeValue"),
  bestTimeValue: document.getElementById("bestTimeValue"),
  lastTimeValue: document.getElementById("lastTimeValue"),
  totalTimeValue: document.getElementById("totalTimeValue"),
  graphicsToggleButton: document.getElementById("graphicsToggleButton"),
  graphicsArrow: document.getElementById("graphicsArrowGame"),
  graphicsOptions: document.getElementById("graphicsOptions"),
  graphicsOptionButtons: Array.from(document.querySelectorAll(".graphics-option")),
  minimapPlayerDot: document.getElementById("minimapPlayerDot"),
  minimapOpponentDots: document.getElementById("minimapOpponentDots"),
  minimapCanvas: document.getElementById("minimapCanvas"),
  exitGameButton: document.getElementById("exitGameButton"),
  cameraToggleButton: document.getElementById("cameraToggleButton"),
  honorGameButton: document.getElementById("honorGameButton"),
  pauseGameButton: document.getElementById("pauseGameButton"),
  pauseOverlay: document.getElementById("pauseOverlay"),
  pauseMenuButton: document.getElementById("pauseMenuButton"),
  pauseRestartButton: document.getElementById("pauseRestartButton"),
  pauseResumeButton: document.getElementById("pauseResumeButton"),
  pauseControlCards: Array.from(document.querySelectorAll(".pause-control-card")),
  mapButton: document.getElementById("mapButton"),
  hornButton: document.getElementById("hornBtn"),
  controlButtons: Array.from(document.querySelectorAll(".control-button"))
};

const ctx = elements.canvas.getContext("2d");
let race3DEngine = null;
let race3DReady = false;

function loadStoredProfile() {
  const fallback = {
    name: "Player",
    id: `RG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    matchesPlayed: 0,
    avatarGender: "male",
    avatarIndex: 0,
    countryCode: "IN",
    setupComplete: false
  };

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.playerProfile) || "null");
    if (!stored || typeof stored !== "object") return fallback;
    return {
      name: typeof stored.name === "string" && stored.name.trim() ? stored.name.trim().slice(0, 18) : fallback.name,
      id: typeof stored.id === "string" && stored.id.trim() ? stored.id.trim() : fallback.id,
      matchesPlayed: Number.isFinite(Number(stored.matchesPlayed)) ? Math.max(0, Number(stored.matchesPlayed)) : 0,
      avatarGender: stored.avatarGender === "female" ? "female" : "male",
      avatarIndex: Number.isFinite(Number(stored.avatarIndex)) ? clamp(Number(stored.avatarIndex), 0, 9) : fallback.avatarIndex,
      countryCode: PROFILE_COUNTRIES.some((country) => country.code === stored.countryCode) ? stored.countryCode : fallback.countryCode,
      setupComplete: Boolean(stored.setupComplete)
    };
  } catch (error) {
    return fallback;
  }
}

function loadStoredInvites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.invites) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((value) => typeof value === "string" && value.trim());
  } catch (error) {
    return [];
  }
}

function loadUnlockedCars() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.carUnlocks) || "[]");
    if (!Array.isArray(stored)) return Array.from({ length: UNLOCKED_CAR_COUNT }, (_, index) => index);
    const defaults = Array.from({ length: UNLOCKED_CAR_COUNT }, (_, index) => index);
    return Array.from(new Set([...defaults, ...stored.filter((value) => Number.isInteger(value) && value >= 0 && value < ASSETS.cars.length)]));
  } catch (error) {
    return Array.from({ length: UNLOCKED_CAR_COUNT }, (_, index) => index);
  }
}

function loadDailyRewardState() {
  const fallback = { lastClaimAt: 0, streakIndex: 0 };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.dailyReward) || "null");
    if (!stored || typeof stored !== "object") return fallback;
    return {
      lastClaimAt: Number.isFinite(Number(stored.lastClaimAt)) ? Math.max(0, Number(stored.lastClaimAt)) : 0,
      streakIndex: Number.isFinite(Number(stored.streakIndex)) ? clamp(Number(stored.streakIndex), 0, DAILY_REWARD_AMOUNTS.length) : 0
    };
  } catch (error) {
    return fallback;
  }
}

const appState = {
  mode: "splash",
  selectedGender: localStorage.getItem(STORAGE_KEYS.gender) || "male",
  selectedMapIndex: Number(localStorage.getItem(STORAGE_KEYS.mapIndex) || 0) % MAPS.length,
  selectedCarIndex: Number(localStorage.getItem(STORAGE_KEYS.carIndex) || 0) % ASSETS.cars.length,
  selectedSkinIndex: Number(localStorage.getItem(STORAGE_KEYS.skinIndex) || 0) % SKINS.length,
  graphicsMode: "cinematic",
  controlMode: "arrow",
  garageOpen: false,
  friendsOpen: false,
  profileOpen: false,
  countrySearchQuery: "",
  totalCoins: Number(localStorage.getItem(STORAGE_KEYS.coins) || 0),
  unlockedCars: loadUnlockedCars(),
  playerProfile: loadStoredProfile(),
  invites: loadStoredInvites(),
  dailyReward: loadDailyRewardState()
};

const raceSettingsState = {
  modeId: "career",
  laps: 2,
  opponents: 4,
  weather: "day",
  difficultyIndex: 0
};

const ROOM_SPEEDS = ["Slow", "Normal", "Fast", "Extreme"];

const roomState = {
  open: false,
  laps: 2,
  opponents: 4,
  speedIndex: 1,
  coinBet: 200,
  invitedFriends: []
};

let startingGridEntries = [];
let raceResultEntries = [];
let rewardTransitionTimeout = 0;
const tiltState = {
  enabled: false,
  gamma: 0
};
const bootState = {
  assetsReady: false,
  preloadPromise: null,
  splashDismissed: false,
  loadingStarted: false,
  loadingProgress: 0,
  loadingFrame: null,
  loadingFailSafeTimer: null,
  loadingTransitioned: false,
  awaitingProfileAfterReward: false,
  awaitingLobbyAfterReward: false
};

const raceLaunchState = {
  active: false,
  frame: null,
  failSafeTimer: null,
  progress: 0
};

window.ASSETS = ASSETS;
window.appState = appState;

const inputState = { steer: 0, throttle: 0, brake: 0, held: new Set() };
let isGameRunning = false;

const gameState = {
  running: false,
  gameOver: false,
  finished: false,
  frameId: 0,
  lastTime: 0,
  images: {},
  track: null,
  player: {
    distance: 0,
    laneOffset: 0,
    laneVelocity: 0,
    speed: 420,
    minSpeed: 180,
    maxSpeed: 980,
    targetCruiseSpeed: 380,
    width: 72,
    height: 132,
    visualAngle: 0,
    bodyTilt: 0,
    bounce: 0,
    wheelSpin: 0
  },
  traffic: [],
  spawnTimer: 0,
  spawnInterval: 1.35,
  lastSpawnLane: 0,
  camera: { x: 0, horizonShift: 0 },
  cameraModeIndex: 0,
  paused: false,
  race: {
    currentLap: 1,
    totalLaps: 1,
    position: 1,
    previousPosition: 1,
    totalRacers: 1,
    speedKph: 0,
    currentTime: 0,
    bestTime: null,
    lastTime: null,
    totalTime: 0
  },
  graphicsPanelOpen: false,
  reward: {
    runCoins: 0,
    distanceSinceReward: 0,
    totalDistance: 0,
    averageSpeedAccumulator: 0,
    averageSpeedTime: 0
  },
  sceneryTick: 0,
  movementLogged: false,
  resultShown: false,
  resultRewardGiven: false
};

function wrapDistance(trackLength, distance) {
  return ((distance % trackLength) + trackLength) % trackLength;
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function lerpAngle(start, end, amount) {
  let diff = end - start;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return start + diff * amount;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hideManagedScreens() {
  [
    elements.splashScreen,
    elements.loadingScreen,
    elements.profileSetupScreen,
    elements.errorScreen,
    elements.dailyRewardScreen,
    elements.roomScreen,
    elements.gameModesScreen,
    elements.raceSettingsScreen,
    elements.startingGridScreen,
    elements.raceResultScreen,
    elements.lobbyScreen,
    elements.gameShell
  ].forEach((screen) => {
    if (!screen) return;
    screen.classList.add("hidden");
    screen.classList.remove("is-visible");
    screen.style.display = "none";
  });
}

function goToScreen(targetScreenId) {
  const screenMap = {
    splashScreen: elements.splashScreen,
    loadingScreen: elements.loadingScreen,
    profileScreen: elements.profileSetupScreen,
    profileSetupScreen: elements.profileSetupScreen,
    errorScreen: elements.errorScreen,
    dailyRewardScreen: elements.dailyRewardScreen,
    roomScreen: elements.roomScreen,
    gameModesScreen: elements.gameModesScreen,
    raceSettingsScreen: elements.raceSettingsScreen,
    startingGridScreen: elements.startingGridScreen,
    raceResultScreen: elements.raceResultScreen,
    lobbyScreen: elements.lobbyScreen,
    gameScreen: elements.gameShell
  };
  const target = screenMap[targetScreenId];
  if (!target) return;
  if (isGameRunning && targetScreenId !== "gameScreen" && targetScreenId !== "errorScreen") {
    console.log(`Navigation blocked while game is running: ${targetScreenId}`);
    return;
  }
  console.log(`Switching to: ${targetScreenId}`);
  hideManagedScreens();
  target.classList.remove("hidden");
  target.style.display = "";
  requestAnimationFrame(() => {
    target.classList.add("is-visible");
  });
}

function showErrorScreen(message) {
  console.error("Error:", message);
  isGameRunning = false;
  if (elements.errorMessageText) {
    elements.errorMessageText.textContent = message;
  }
  appState.mode = "error";
  goToScreen("errorScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
}

function showError(message) {
  showErrorScreen(message);
}

function saveGameSettings() {
  const payload = {
    laps: raceSettingsState.laps,
    opponents: raceSettingsState.opponents,
    mode: raceSettingsState.modeId,
    selectedCarIndex: appState.selectedCarIndex,
    weather: raceSettingsState.weather,
    difficultyIndex: raceSettingsState.difficultyIndex,
    mapIndex: appState.selectedMapIndex,
    savedAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.raceSession, JSON.stringify(payload));
  return payload;
}

function formatRaceTime(seconds) {
  if (!Number.isFinite(seconds) || seconds === null || seconds === undefined) {
    return "--:--:--";
  }
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const wholeSeconds = Math.floor(safeSeconds % 60);
  const centiseconds = Math.floor((safeSeconds - Math.floor(safeSeconds)) * 100);
  return `${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
}

function getRaceProgress(distance, lap = gameState.race.currentLap) {
  const trackLength = gameState.track?.totalLength || 2200;
  if (!trackLength || !gameState.race.totalLaps) return 0;
  const lapProgress = ((lap - 1) + (distance / trackLength)) / gameState.race.totalLaps;
  return clamp(lapProgress, 0, 1);
}

function getCameraMode() {
  return CAMERA_MODES[gameState.cameraModeIndex] || CAMERA_MODES[0];
}

async function ensureRace3DEngine() {
  const gameScreen = document.getElementById("gameScreen");
  if (!gameScreen) {
    console.error("Game screen missing");
    return null;
  }
  if (race3DEngine) return race3DEngine;
  if (!elements.threeViewport) {
    console.error("Error: Three viewport container missing");
    return null;
  }
  if (!window.THREE || !window.Race3DEngine) {
    console.warn("Three.js runtime unavailable, falling back");
    return null;
  }
  race3DEngine = new window.Race3DEngine({
    container: elements.threeViewport
  });
  try {
    await Promise.race([
      race3DEngine.initialize(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("3D engine init timeout")), 5000))
    ]);
    console.log("Assets loaded");
    race3DReady = true;
    return race3DEngine;
  } catch (error) {
    console.error("Error:", error);
    race3DEngine = null;
    race3DReady = false;
    return null;
  }
}

function resetRace3DEngine() {
  if (!race3DEngine) return;
  try {
    race3DEngine.dispose?.();
  } catch (error) {
    console.error("3D engine dispose failed:", error);
  }
  race3DEngine = null;
  race3DReady = false;
  if (elements.threeViewport) {
    elements.threeViewport.innerHTML = "";
  }
}

function startCanvasFallbackRaceSafe() {
  try {
    startCanvasFallbackRace();
    console.log("Fallback race started successfully");
    return true;
  } catch (error) {
    console.error("Fallback race failed:", error);
    try {
      console.warn("Starting emergency fallback race scene");
      goToScreen("gameScreen");
      if (elements.threeViewport) elements.threeViewport.style.display = "none";
      if (elements.canvas) {
        elements.canvas.style.display = "block";
        elements.canvas.width = window.innerWidth;
        elements.canvas.height = window.innerHeight;
      }
      isGameRunning = true;
      appState.mode = "game";
      if (ctx && elements.canvas) {
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        const bg = ctx.createLinearGradient(0, 0, 0, elements.canvas.height);
        bg.addColorStop(0, "#7fb1e8");
        bg.addColorStop(0.6, "#dceaf9");
        bg.addColorStop(0.61, "#4f7b38");
        bg.addColorStop(1, "#23311f");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
        ctx.fillStyle = "#24262c";
        ctx.beginPath();
        ctx.moveTo(elements.canvas.width * 0.42, elements.canvas.height * 0.18);
        ctx.lineTo(elements.canvas.width * 0.58, elements.canvas.height * 0.18);
        ctx.lineTo(elements.canvas.width * 0.86, elements.canvas.height * 0.94);
        ctx.lineTo(elements.canvas.width * 0.14, elements.canvas.height * 0.94);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#d92b2b";
        ctx.fillRect(elements.canvas.width * 0.44, elements.canvas.height * 0.72, elements.canvas.width * 0.12, elements.canvas.height * 0.12);
      }
      console.log("Race running");
      return true;
    } catch (emergencyError) {
      console.error("Emergency fallback race failed:", emergencyError);
      return false;
    }
  }
}

async function safeInitGame(container) {
  console.log("Initializing game...");
  if (!container) {
    throw new Error("gameScreen not found in DOM");
  }
  if (!elements.threeViewport) {
    throw new Error("threeRaceViewport not found in DOM");
  }

  console.log("Cleaning previous renderer");
  resetRace3DEngine();

  if (elements.threeViewport) {
    elements.threeViewport.innerHTML = "";
  }

  const engine = await ensureRace3DEngine();
  if (!engine) {
    console.warn("3D engine unavailable, fallback race will be used");
    return null;
  }
  if (elements.threeViewport) {
    elements.threeViewport.style.display = "block";
  }
  if (elements.canvas) {
    elements.canvas.style.display = "none";
  }
  engine.setGraphicsMode?.(appState.graphicsMode);

  console.log("Renderer created");
  console.log("Scene & camera ready");
  console.log("Environment created");
  console.log("Car created");
  return engine;
}

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

function isMapUnlocked(index) {
  return index < UNLOCKED_MAP_COUNT;
}

function isCarUnlocked(index) {
  return appState.unlockedCars.includes(index);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
}

function createTrack(map) {
  const totalLength = map.segments.reduce((sum, segment) => sum + segment.length, 0);
  const samples = [];
  const sampleStep = 24;
  let distance = 0;
  let centerX = 0;
  let heading = 0;

  while (distance <= totalLength + sampleStep) {
    const state = getSegmentState(map, distance);
    heading += state.curve * 0.0017 * sampleStep;
    centerX += Math.sin(heading) * 18;
    samples.push({ distance, centerX, heading, curve: state.curve });
    distance += sampleStep;
  }

  return { ...map, totalLength, sampleStep, samples };
}

function getSegmentState(map, distance) {
  const totalLength = map.segments.reduce((sum, segment) => sum + segment.length, 0);
  const wrapped = wrapDistance(totalLength, distance);
  let cursor = 0;
  for (const segment of map.segments) {
    if (wrapped <= cursor + segment.length) return { curve: segment.curve };
    cursor += segment.length;
  }
  return { curve: 0 };
}

function getTrackPoint(distance) {
  const track = gameState.track;
  const wrapped = wrapDistance(track.totalLength, distance);
  const index = Math.floor(wrapped / track.sampleStep);
  const nextIndex = (index + 1) % track.samples.length;
  const current = track.samples[index];
  const next = track.samples[nextIndex];
  const progress = (wrapped - current.distance) / track.sampleStep;
  return {
    centerX: lerp(current.centerX, next.centerX, progress),
    heading: lerpAngle(current.heading, next.heading, progress),
    curve: lerp(current.curve, next.curve, progress)
  };
}

function relativeDistanceAhead(distance, reference) {
  const trackLength = gameState.track?.totalLength || 2200;
  return wrapDistance(trackLength, distance - reference);
}

function resizeCanvas() {
  const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth);
  const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
  elements.canvas.width = viewportWidth;
  elements.canvas.height = viewportHeight;
  if (elements.canvas) {
    elements.canvas.style.width = `${viewportWidth}px`;
    elements.canvas.style.height = `${viewportHeight}px`;
  }
  if (elements.threeViewport) {
    elements.threeViewport.style.width = `${viewportWidth}px`;
    elements.threeViewport.style.height = `${viewportHeight}px`;
  }
  gameState.player.width = elements.canvas.width * 0.1;
  gameState.player.height = gameState.player.width * 1.7;
  if (race3DEngine) {
    race3DEngine.resize(viewportWidth, viewportHeight);
  }
}

function updateOrientationUI() {
  const portraitUi = window.innerHeight > window.innerWidth;
  document.body.classList.toggle("is-portrait-ui", portraitUi);
  document.body.classList.toggle("is-landscape-ui", !portraitUi);
  gameState.running = appState.mode === "game" && !gameState.gameOver;
  if (race3DEngine && appState.mode === "game") {
    race3DEngine.setPaused(gameState.paused);
  }
}

async function enterGameMode() {
  const elem = document.documentElement;

  try {
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    }
  } catch (error) {
    console.log("Fullscreen request failed");
  }

  if (screen.orientation && screen.orientation.lock) {
    try {
      await screen.orientation.lock("landscape");
    } catch (error) {}
  }

  updateOrientationUI();
  window.AudioManager?.startBGM?.();
}

function primeMobileLandscapeMode() {
  let handled = false;
  async function startApp() {
    if (handled) return;
    handled = true;
    document.removeEventListener("touchstart", startApp, true);
    document.removeEventListener("click", startApp, true);
    await enterGameMode();
  }
  document.addEventListener("touchstart", startApp, true);
  document.addEventListener("click", startApp, true);
}

function renderFriendsPanel() {
  elements.friendsPanel.classList.toggle("is-open", appState.friendsOpen);
  elements.friendsArrow.textContent = appState.friendsOpen ? ">" : "<";
  Object.entries(FRIENDS_DATA).forEach(([status, names]) => {
    const list = elements[`${status}List`];
    list.innerHTML = "";
    names.forEach((name) => {
      const item = document.createElement("div");
      item.className = "friend-item";
      item.innerHTML = `
        <span class="friend-name-box">${name}</span>
        <span class="friend-status ${status}">${status}</span>
        <button class="friend-plus-button ${status}" type="button" ${status === "offline" ? "disabled" : ""} aria-label="Invite friend"></button>
      `;
      list.appendChild(item);
    });
  });
}

function createRoomFriendCard(name, status) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "room-friend-card";
  const isInvitable = status === "online";
  if (!isInvitable) card.disabled = true;
  card.innerHTML = `
    <span class="room-friend-avatar">${(name[0] || "F").toUpperCase()}</span>
    <span class="room-friend-name">${name}</span>
    <span class="room-friend-status ${status}">${status}</span>
    <span class="room-friend-invite">+</span>
  `;
  card.addEventListener("click", () => {
    if (!isInvitable) return;
    if (roomState.invitedFriends.includes(name)) return;
    if (roomState.invitedFriends.length >= roomState.opponents) return;
    roomState.invitedFriends.push(name);
    renderRoomUI();
  });
  return card;
}

function renderRoomFriendLists() {
  const sections = [
    ["playing", elements.roomPlayingList],
    ["online", elements.roomOnlineList],
    ["offline", elements.roomOfflineList]
  ];
  sections.forEach(([status, container]) => {
    if (!container) return;
    container.innerHTML = "";
    FRIENDS_DATA[status].forEach((name) => {
      container.appendChild(createRoomFriendCard(name, status));
    });
  });
  if (elements.roomFriendsPanel) {
    elements.roomFriendsPanel.classList.toggle("is-open", roomState.open);
  }
  if (elements.roomFriendsArrow) {
    elements.roomFriendsArrow.textContent = roomState.open ? "<" : ">";
  }
}

function renderRoomInviteSlots() {
  if (!elements.roomInviteSlots) return;
  elements.roomInviteSlots.innerHTML = "";
  const slots = roomState.opponents;
  for (let index = 0; index < slots; index += 1) {
    const name = roomState.invitedFriends[index];
    const slot = document.createElement("div");
    slot.className = "room-invite-slot";
    if (name) {
      slot.innerHTML = `
        <span class="room-slot-position">${index + 1}</span>
        <span class="room-slot-avatar">${name[0].toUpperCase()}</span>
        <span class="room-slot-name">${name}</span>
      `;
      slot.addEventListener("click", () => {
        roomState.invitedFriends.splice(index, 1);
        renderRoomUI();
      });
    } else {
      slot.classList.add("is-empty");
      slot.innerHTML = `
        <span class="room-slot-position">${index + 1}</span>
        <span class="room-slot-avatar">+</span>
        <span class="room-slot-name">Invite Friend</span>
      `;
    }
    elements.roomInviteSlots.appendChild(slot);
  }
}

function renderRoomUI() {
  if (elements.roomLapsValue) elements.roomLapsValue.textContent = String(roomState.laps);
  if (elements.roomOpponentsValue) elements.roomOpponentsValue.textContent = String(roomState.opponents);
  if (elements.roomSpeedValue) elements.roomSpeedValue.textContent = ROOM_SPEEDS[roomState.speedIndex];
  if (elements.roomBetValue) elements.roomBetValue.textContent = String(roomState.coinBet);
  if (elements.roomStatusText) {
    elements.roomStatusText.textContent = roomState.invitedFriends.length
      ? `${roomState.invitedFriends.length}/${roomState.opponents} friend${roomState.opponents > 1 ? "s" : ""} selected`
      : "Room not created yet";
  }
  renderRoomFriendLists();
  renderRoomInviteSlots();
}

function showRoomScreen() {
  appState.mode = "room";
  renderRoomUI();
  goToScreen("roomScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEYS.playerProfile, JSON.stringify(appState.playerProfile));
}

function saveInvites() {
  localStorage.setItem(STORAGE_KEYS.invites, JSON.stringify(appState.invites));
}

function saveUnlockedCars() {
  localStorage.setItem(STORAGE_KEYS.carUnlocks, JSON.stringify(appState.unlockedCars));
}

function saveDailyReward() {
  localStorage.setItem(STORAGE_KEYS.dailyReward, JSON.stringify(appState.dailyReward));
}

function getDailyRewardProgress() {
  const cooldownMs = 24 * 60 * 60 * 1000;
  const claimedCount = clamp(appState.dailyReward.streakIndex, 0, DAILY_REWARD_AMOUNTS.length);
  const hasCooldown = appState.dailyReward.lastClaimAt > 0 && (Date.now() - appState.dailyReward.lastClaimAt) < cooldownMs;
  const currentOpenIndex = claimedCount < DAILY_REWARD_AMOUNTS.length && !hasCooldown ? claimedCount : -1;
  return { claimedCount, hasCooldown, currentOpenIndex };
}

function setInviteMessage(message, type = "") {
  elements.inviteMessage.textContent = message;
  elements.inviteMessage.classList.toggle("is-error", type === "error");
  elements.inviteMessage.classList.toggle("is-success", type === "success");
}

function playCoinSound() {
  window.AudioManager?.playCoins?.();
}

function playUiClickSound() {
  return;
}

function playVictorySound() {
  return;
}

function notifyPositionChange(nextPosition) {
  const previousPosition = gameState.race.previousPosition || nextPosition;
  if (nextPosition > previousPosition) {
    window.AudioManager?.playOvertake?.();
  }
  gameState.race.previousPosition = nextPosition;
}

function spawnRewardCoins() {
  const claimRect = elements.claimRewardButton.getBoundingClientRect();
  const walletRect = elements.walletBox.getBoundingClientRect();
  const startX = claimRect.left + claimRect.width / 2;
  const startY = claimRect.top + claimRect.height / 2;
  const endX = walletRect.left + walletRect.width / 2;
  const endY = walletRect.top + walletRect.height / 2;

  for (let index = 0; index < 10; index += 1) {
    const coin = document.createElement("div");
    coin.className = "reward-coin";
    coin.textContent = "M";
    coin.style.left = `${startX + (Math.random() * 60 - 30)}px`;
    coin.style.top = `${startY + (Math.random() * 20 - 10)}px`;
    coin.style.setProperty("--travel-x", `${endX - startX + 80 + (Math.random() * 24 - 12)}px`);
    coin.style.setProperty("--travel-y", `${endY - startY + (Math.random() * 18 - 9)}px`);
    coin.style.animationDelay = `${index * 45}ms`;
    elements.rewardParticles.appendChild(coin);
    window.setTimeout(() => coin.remove(), 1200 + index * 45);
  }
}

function showDailyRewardScreen() {
  if (isGameRunning) return;
  appState.mode = "daily-reward";
  renderDailyRewardUI();
  goToScreen("dailyRewardScreen");
  window.AudioManager?.playTap?.();
  elements.profileButton.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  elements.walletBox.classList.remove("hidden");
  toggleProfilePopup(false);
  updateOrientationUI();
}

function hideDailyRewardScreen() {
  if (rewardTransitionTimeout) {
    clearTimeout(rewardTransitionTimeout);
    rewardTransitionTimeout = 0;
  }
  elements.dailyRewardScreen.classList.add("hidden");
  if (appState.mode === "lobby") elements.walletBox.classList.add("hidden");
}

function claimDailyReward() {
  const { hasCooldown, currentOpenIndex } = getDailyRewardProgress();
  if (hasCooldown || currentOpenIndex < 0) return;
  const amount = DAILY_REWARD_AMOUNTS[currentOpenIndex];
  appState.dailyReward.lastClaimAt = Date.now();
  appState.dailyReward.streakIndex = clamp(currentOpenIndex + 1, 0, DAILY_REWARD_AMOUNTS.length);
  saveDailyReward();
  awardCoins(amount);
  renderDailyRewardUI();
  playCoinSound();
  spawnRewardCoins();
  if (rewardTransitionTimeout) clearTimeout(rewardTransitionTimeout);
  rewardTransitionTimeout = window.setTimeout(() => {
    rewardTransitionTimeout = 0;
    try {
      console.log("Claim clicked -> moving to lobby");
      hideDailyRewardScreen();
      if (bootState.awaitingProfileAfterReward) {
        bootState.awaitingProfileAfterReward = false;
        showProfileScreen();
        return;
      }
      bootState.awaitingLobbyAfterReward = false;
      showLobby();
    } catch (error) {
      console.error(error);
      showLobby();
    }
  }, 1150);
}

function renderInviteList() {
  elements.inviteList.innerHTML = "";
  if (appState.invites.length === 0) {
    const empty = document.createElement("div");
    empty.className = "invite-item";
    empty.innerHTML = "<span>No invites sent yet</span><span>Waiting</span>";
    elements.inviteList.appendChild(empty);
    return;
  }

  appState.invites.forEach((id) => {
    const item = document.createElement("div");
    item.className = "invite-item";
    item.innerHTML = `<span>${id}</span><span>Sent</span>`;
    elements.inviteList.appendChild(item);
  });
}

function renderGameModes() {
  if (!elements.gameModesGrid) return;
  elements.gameModesGrid.innerHTML = "";
  GAME_MODES.forEach((mode) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "game-mode-card";
    if (!mode.unlocked) card.classList.add("is-locked");
    card.innerHTML = `
      <img class="game-mode-image" src="${mode.image}" alt="${mode.name}">
      <div class="game-mode-tint"></div>
      <div class="game-mode-copy">
        <strong>${mode.name}</strong>
        <span>${mode.description}</span>
      </div>
      ${mode.unlocked ? "" : '<div class="game-mode-lock"><span>🔒</span><span>Locked</span></div>'}
    `;
    card.addEventListener("click", () => {
      if (!mode.unlocked) return;
      raceSettingsState.modeId = mode.id;
      hideGameModes();
      showRaceSettings();
    });
    elements.gameModesGrid.appendChild(card);
  });
}

function showGameModes() {
  renderGameModes();
  appState.mode = "game-modes";
  goToScreen("gameModesScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
}

function hideGameModes() {
  elements.gameModesScreen.classList.add("hidden");
}

function calculateRaceReward() {
  const difficultyBonus = [0, 250, 550][raceSettingsState.difficultyIndex] || 0;
  const weatherBonus = raceSettingsState.weather === "night" ? 180 : 0;
  return 600 + raceSettingsState.laps * 160 + raceSettingsState.opponents * 55 + difficultyBonus + weatherBonus;
}

function updateRaceSettingsUI() {
  if (!elements.raceSettingsScreen) return;
  elements.raceSettingsCoinsValue.textContent = String(appState.totalCoins);
  elements.lapsValue.textContent = String(raceSettingsState.laps);
  elements.opponentsValue.textContent = String(raceSettingsState.opponents);
  elements.weatherValue.textContent = raceSettingsState.weather === "night" ? "Night" : "Day";
  elements.difficultyValue.textContent = DIFFICULTY_LEVELS[raceSettingsState.difficultyIndex];
  elements.lapsFill.style.width = `${((raceSettingsState.laps - 1) / 4) * 100}%`;
  elements.opponentsFill.style.width = `${((raceSettingsState.opponents - 1) / 7) * 100}%`;
  elements.difficultyFill.style.width = `${(raceSettingsState.difficultyIndex / (DIFFICULTY_LEVELS.length - 1)) * 100}%`;
  elements.raceRewardValue.textContent = String(calculateRaceReward());
  elements.weatherToggleButton.classList.toggle("is-night", raceSettingsState.weather === "night");
}

function showRaceSettings() {
  updateRaceSettingsUI();
  appState.mode = "race-settings";
  goToScreen("raceSettingsScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
}

function hideRaceSettings() {
  elements.raceSettingsScreen.classList.add("hidden");
}

function buildStartingGrid() {
  const playerCountry = PROFILE_COUNTRIES.find((country) => country.code === appState.playerProfile.countryCode) || PROFILE_COUNTRIES[0];
  const opponentPool = PROFILE_COUNTRIES.filter((country) => country.code !== playerCountry.code);
  const totalOpponents = raceSettingsState.opponents;
  const entries = [];

  for (let index = 0; index < totalOpponents; index += 1) {
    const country = opponentPool[index % opponentPool.length];
    entries.push({
      pos: index + 1,
      name: OPPONENT_NAMES[index % OPPONENT_NAMES.length],
      team: `Team ${index + 1}`,
      flagUrl: country.flagUrl,
      isYou: false
    });
  }

  entries.push({
    pos: totalOpponents + 1,
    name: "YOU",
    team: appState.playerProfile.name,
    flagUrl: playerCountry.flagUrl,
    isYou: true
  });

  startingGridEntries = entries;
}

function buildRaceResults() {
  const playerCountry = PROFILE_COUNTRIES.find((country) => country.code === appState.playerProfile.countryCode) || PROFILE_COUNTRIES[0];
  const opponentPool = PROFILE_COUNTRIES.filter((country) => country.code !== playerCountry.code);
  const totalOpponents = raceSettingsState.opponents;
  const playerPosition = clamp(gameState.race.position || totalOpponents + 1, 1, totalOpponents + 1);
  const entries = [];
  let opponentCursor = 0;

  for (let pos = 1; pos <= totalOpponents + 1; pos += 1) {
    if (pos === playerPosition) {
      entries.push({
        pos,
        name: "YOU",
        team: appState.playerProfile.name,
        flagUrl: playerCountry.flagUrl,
        isYou: true
      });
      continue;
    }

    const country = opponentPool[opponentCursor % opponentPool.length];
    entries.push({
      pos,
      name: OPPONENT_NAMES[opponentCursor % OPPONENT_NAMES.length],
      team: `Team ${opponentCursor + 1}`,
      flagUrl: country.flagUrl,
      isYou: false
    });
    opponentCursor += 1;
  }

  raceResultEntries = entries;
  return entries;
}

function animateRaceResultCoins(amount) {
  if (!elements.raceResultCoinsValue || !elements.raceResultCoinBurst) return;
  const target = Math.max(0, Math.floor(amount));
  let current = 0;
  const startedAt = performance.now();
  const duration = 1100;
  elements.raceResultCoinBurst.innerHTML = "";

  for (let index = 0; index < 10; index += 1) {
    const coin = document.createElement("span");
    coin.className = "race-result-burst-coin";
    coin.textContent = "M";
    coin.style.setProperty("--burst-x", `${-90 + Math.random() * 180}px`);
    coin.style.setProperty("--burst-y", `${-80 - Math.random() * 90}px`);
    coin.style.animationDelay = `${index * 45}ms`;
    elements.raceResultCoinBurst.appendChild(coin);
    window.setTimeout(() => coin.remove(), 1300 + index * 45);
  }

  const tick = (now) => {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    current = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    elements.raceResultCoinsValue.textContent = String(current);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      elements.raceResultCoinsValue.textContent = String(target);
    }
  };

  requestAnimationFrame(tick);
}

function showRaceResults() {
  if (gameState.resultShown) return;
  gameState.resultShown = true;
  gameState.running = false;
  gameState.finished = true;
  isGameRunning = false;
  if (gameState.frameId) {
    cancelAnimationFrame(gameState.frameId);
    gameState.frameId = 0;
  }
  if (race3DEngine) race3DEngine.stopRace();
  window.ReplaySystem?.stopSession();
  inputState.held.clear();
  syncInputState();
  elements.controlButtons.forEach((button) => button.classList.remove("is-active"));

  const entries = buildRaceResults();
  if (elements.raceResultRows) {
    elements.raceResultRows.innerHTML = "";
    entries.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "starting-grid-row";
      if (entry.isYou) row.classList.add("is-you");
      row.innerHTML = `
        <span class="starting-grid-pos">${entry.pos}</span>
        <span class="starting-grid-driver ${entry.isYou ? "is-you" : "is-opponent"}">
          <img src="${entry.flagUrl}" alt="${entry.name} flag">
          <strong>${entry.name}</strong>
        </span>
        <span class="starting-grid-team">${entry.team}</span>
      `;
      elements.raceResultRows.appendChild(row);
    });
  }

  if (elements.podiumFirstName) elements.podiumFirstName.textContent = entries[0]?.name || "---";
  if (elements.podiumSecondName) elements.podiumSecondName.textContent = entries[1]?.name || "---";
  if (elements.podiumThirdName) elements.podiumThirdName.textContent = entries[2]?.name || "---";

  const reward = calculateRaceReward() + Math.max(0, raceSettingsState.opponents - gameState.race.position + 1) * 80;
  if (!gameState.resultRewardGiven) {
    awardCoins(reward);
    gameState.resultRewardGiven = true;
  }
  animateRaceResultCoins(reward);
  window.AudioManager?.fadeUp?.();
  playVictorySound();

  appState.mode = "race-results";
  goToScreen("raceResultScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
}

function renderStartingGrid() {
  if (!elements.startingGridRows) return;
  buildStartingGrid();
  elements.startingGridRows.innerHTML = "";
  startingGridEntries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "starting-grid-row";
    if (entry.isYou) row.classList.add("is-you");
    row.innerHTML = `
      <span class="starting-grid-pos">${entry.pos}</span>
      <span class="starting-grid-driver ${entry.isYou ? "is-you" : "is-opponent"}">
        <img src="${entry.flagUrl}" alt="${entry.name} flag">
        <strong>${entry.name}</strong>
      </span>
      <span class="starting-grid-team">${entry.team}</span>
    `;
    elements.startingGridRows.appendChild(row);
  });
}

function showStartingGrid() {
  renderStartingGrid();
  appState.mode = "starting-grid";
  goToScreen("startingGridScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
}

function hideStartingGrid() {
  elements.startingGridScreen.classList.add("hidden");
}

function updateProfileUI() {
  const profile = appState.playerProfile;
  const avatarGender = profile.avatarGender === "female" ? "female" : "male";
  const selectedCountry = PROFILE_COUNTRIES.find((country) => country.code === profile.countryCode) || PROFILE_COUNTRIES[0];
  const lobbyAvatar = AVATAR_LIBRARY[avatarGender][profile.avatarIndex];
  const level = Math.max(1, Math.floor(profile.matchesPlayed / 3) + 1);
  const xpProgress = Math.min(100, ((profile.matchesPlayed % 3) / 3) * 100);
  elements.playerNameInput.value = profile.name;
  elements.playerIdValue.textContent = profile.id;
  elements.profileCoinsValue.textContent = String(appState.totalCoins);
  elements.profileMatchesValue.textContent = String(profile.matchesPlayed);
  elements.profileInitial.textContent = (profile.name.trim()[0] || "P").toUpperCase();
  elements.walletAmount.textContent = String(appState.totalCoins);
  if (elements.lobbyProfileImage) elements.lobbyProfileImage.src = lobbyAvatar;
  if (elements.lobbyPlayerName) elements.lobbyPlayerName.textContent = profile.name.toUpperCase();
  if (elements.lobbyLevelBadge) elements.lobbyLevelBadge.textContent = `LV ${level}`;
  if (elements.lobbyXpFill) elements.lobbyXpFill.style.width = `${xpProgress}%`;
  if (elements.lobbyCountryMini) elements.lobbyCountryMini.textContent = selectedCountry.name;
  if (elements.lobbyCoinsValue) elements.lobbyCoinsValue.textContent = String(appState.totalCoins);
  renderInviteList();
}

function updateRaceHud() {
  if (elements.speedValue) elements.speedValue.textContent = `${Math.round(gameState.race.speedKph || 0)} km/h`;
  if (elements.lapValue) {
    if (Number.isFinite(gameState.race.distanceKm) && Number.isFinite(gameState.race.targetDistanceKm)) {
      elements.lapValue.textContent = `${gameState.race.distanceKm.toFixed(2)} KM / ${gameState.race.targetDistanceKm.toFixed(0)} KM`;
    } else {
      elements.lapValue.textContent = `${gameState.race.currentLap}/${gameState.race.totalLaps}`;
    }
  }
  if (elements.positionValue) elements.positionValue.textContent = `${gameState.race.position}/${gameState.race.totalRacers}`;
  if (elements.currentTimeValue) elements.currentTimeValue.textContent = formatRaceTime(gameState.race.currentTime);
  if (elements.bestTimeValue) elements.bestTimeValue.textContent = formatRaceTime(gameState.race.bestTime);
  if (elements.lastTimeValue) elements.lastTimeValue.textContent = formatRaceTime(gameState.race.lastTime);
  if (elements.totalTimeValue) elements.totalTimeValue.textContent = formatRaceTime(gameState.race.totalTime);
  if (elements.cameraToggleButton) elements.cameraToggleButton.setAttribute("aria-label", `Camera: ${getCameraMode().label}`);
  if (elements.threeViewport) {
    elements.threeViewport.classList.toggle("is-fast", (gameState.race.speedKph || 0) > 240);
  }
  updateGameCoinHud();
  updateMinimap();
}

function updateGameCoinHud(animate = false) {
  if (!elements.gameCoinValue) return;
  elements.gameCoinValue.textContent = String(appState.totalCoins);
  if (animate && elements.gameCoinChip) {
    elements.gameCoinChip.classList.remove("is-updating");
    void elements.gameCoinChip.offsetWidth;
    elements.gameCoinChip.classList.add("is-updating");
  }
}

function updateMinimap() {
  const minimapData = race3DEngine?.getMinimapData?.();
  if (elements.minimapCanvas && minimapData?.path?.length) {
    const canvas = elements.minimapCanvas;
    const ctx2d = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx2d.clearRect(0, 0, width, height);

    ctx2d.lineWidth = 3;
    ctx2d.strokeStyle = "rgba(93, 239, 255, 0.92)";
    ctx2d.shadowColor = "rgba(93, 239, 255, 0.35)";
    ctx2d.shadowBlur = 8;
    ctx2d.beginPath();
    minimapData.path.forEach((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      if (index === 0) ctx2d.moveTo(x, y);
      else ctx2d.lineTo(x, y);
    });
    ctx2d.closePath();
    ctx2d.stroke();
    ctx2d.shadowBlur = 0;

    const player = minimapData.player || { x: 0.5, y: 0.5 };
    ctx2d.fillStyle = "#ff5151";
    ctx2d.beginPath();
    ctx2d.arc(player.x * width, player.y * height, 4, 0, Math.PI * 2);
    ctx2d.fill();

    (minimapData.opponents || []).forEach((point, index) => {
      ctx2d.fillStyle = index % 2 === 0 ? "#f6fbff" : "#55ff87";
      ctx2d.beginPath();
      ctx2d.arc(point.x * width, point.y * height, 3, 0, Math.PI * 2);
      ctx2d.fill();
    });

    if (elements.minimapPlayerDot) elements.minimapPlayerDot.style.opacity = "0";
    if (elements.minimapOpponentDots) elements.minimapOpponentDots.innerHTML = "";
    return;
  }

  if (!elements.minimapPlayerDot || !elements.minimapOpponentDots) return;
  if (elements.minimapPlayerDot) elements.minimapPlayerDot.style.opacity = "1";
  const engineSnapshot = race3DEngine?.getSnapshot?.();
  const playerProgress = engineSnapshot
    ? clamp(engineSnapshot.progress, 0, 1)
    : getRaceProgress(gameState.player.distance, gameState.race.currentLap);
  elements.minimapPlayerDot.style.top = `${(1 - playerProgress) * 100}%`;
  elements.minimapOpponentDots.innerHTML = "";
  const opponentProgresses = engineSnapshot
    ? engineSnapshot.opponentProgresses || []
    : gameState.traffic.map((trafficCar) => getRaceProgress(trafficCar.distance, trafficCar.lap || gameState.race.currentLap));
  opponentProgresses.forEach((progress, index) => {
    const dot = document.createElement("span");
    dot.className = `minimap-dot opponent${index % 2 === 0 ? " alt" : ""}`;
    dot.style.top = `${(1 - progress) * 100}%`;
    elements.minimapOpponentDots.appendChild(dot);
  });
}

function applyGraphicsMode(mode) {
  appState.graphicsMode = mode;
  if (elements.gameShell) {
    elements.gameShell.dataset.graphics = mode;
  }
  elements.graphicsOptionButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.graphics === mode);
  });
  race3DEngine?.setGraphicsMode?.(mode);
  console.log("Graphics applied", mode);
  if (!race3DEngine && elements.threeViewport) {
    const filterMap = {
      classic: "none",
      cinematic: "contrast(1.08) saturate(1.05)",
      vibrant: "saturate(1.3) contrast(1.05)",
      "color-blue": "saturate(1.08) hue-rotate(-12deg)",
      dramatic: "contrast(1.18) saturate(0.92) brightness(0.92)",
      faded: "brightness(0.88) saturate(0.68)"
    };
    elements.threeViewport.style.filter = filterMap[mode] || "none";
  }
}

function updateCoinRewards() {
  if (!gameState?.reward) return;
  gameState.reward.distanceSinceReward = Math.max(0, gameState.reward.distanceSinceReward || 0);
}

function toggleGraphicsPanel(forceOpen) {
  if (!elements.graphicsOptions || !elements.graphicsToggleButton) return;
  gameState.graphicsPanelOpen = typeof forceOpen === "boolean" ? forceOpen : !gameState.graphicsPanelOpen;
  elements.graphicsOptions.classList.toggle("is-open", gameState.graphicsPanelOpen);
  elements.graphicsToggleButton.setAttribute("aria-expanded", String(gameState.graphicsPanelOpen));
  if (elements.graphicsArrow) {
    elements.graphicsArrow.classList.toggle("is-open", gameState.graphicsPanelOpen);
  }
}

function updatePauseControlUI() {
  elements.pauseControlCards.forEach((card) => {
    const mode = card.dataset.controlMode;
    card.classList.toggle("is-active", mode === appState.controlMode);
  });
}

function setControlMode(mode) {
  appState.controlMode = mode;
  tiltState.enabled = mode === "tilt";
  updatePauseControlUI();
  console.log("Control mode changed", mode);
}

function syncRaceSnapshot(snapshot) {
  if (!snapshot) return;
  gameState.race.speedKph = snapshot.speedKph || 0;
  gameState.race.currentLap = snapshot.lap || gameState.race.currentLap;
  gameState.race.totalLaps = snapshot.totalLaps || gameState.race.totalLaps;
  gameState.race.distanceKm = Number.isFinite(snapshot.distanceKm) ? snapshot.distanceKm : gameState.race.distanceKm;
  gameState.race.targetDistanceKm = Number.isFinite(snapshot.targetDistanceKm) ? snapshot.targetDistanceKm : gameState.race.targetDistanceKm;
  const nextPosition = snapshot.position || gameState.race.position;
  gameState.race.position = nextPosition;
  notifyPositionChange(nextPosition);
  gameState.race.totalRacers = snapshot.totalRacers || gameState.race.totalRacers;
  gameState.race.currentTime = snapshot.currentLapTime || 0;
  gameState.race.lastTime = snapshot.lastLapTime ?? gameState.race.lastTime;
  gameState.race.bestTime = snapshot.bestLapTime ?? gameState.race.bestTime;
  gameState.race.totalTime = snapshot.totalTime || 0;
  gameState.reward.totalDistance += snapshot.distanceDelta || 0;
  gameState.reward.distanceSinceReward += snapshot.distanceDelta || 0;
  if (!gameState.movementLogged && (snapshot.speedKph || 0) > 20) {
    gameState.movementLogged = true;
    console.log("Car moving");
  }
  updateCoinRewards();
  updateRaceHud();
}

function recordReplayFrame() {
  const frame = race3DEngine?.getSnapshot?.()
    ? {
        x: race3DEngine.playerRoot?.position?.x || 0,
        y: race3DEngine.playerRoot?.position?.y || 0,
        z: race3DEngine.playerRoot?.position?.z || 0,
        rotation: race3DEngine.playerRoot?.rotation?.y || 0,
        speed: gameState.race.speedKph || 0
      }
    : {
        x: gameState.player.laneOffset || 0,
        y: 0,
        z: gameState.player.distance || 0,
        rotation: gameState.player.visualAngle || 0,
        speed: gameState.race.speedKph || 0
      };
  window.ReplaySystem?.recordFrame(frame);
}

function setGarageView(open) {
  appState.garageOpen = Boolean(open);
  elements.lobbyScreen.classList.toggle("is-garage-open", appState.garageOpen);
  if (elements.garageBackButton) {
    elements.garageBackButton.classList.toggle("hidden", !appState.garageOpen);
  }
  if (elements.garageButton) {
    elements.garageButton.classList.toggle("is-active", appState.garageOpen);
  }
  if (elements.storeButton) {
    elements.storeButton.classList.toggle("is-active", !appState.garageOpen);
  }
  if (elements.inventoryButton) {
    elements.inventoryButton.classList.remove("is-active");
  }
}

function renderDailyRewardUI() {
  const { claimedCount, hasCooldown, currentOpenIndex } = getDailyRewardProgress();
  elements.dailyRewardCards.innerHTML = "";
  DAILY_REWARD_AMOUNTS.forEach((amount, index) => {
    const card = document.createElement("div");
    card.className = "reward-day-card";
    if (index === currentOpenIndex) card.classList.add("is-current");
    if (index < claimedCount) card.classList.add("is-claimed");
    if (index > currentOpenIndex && index >= claimedCount) card.classList.add("is-locked");
    const stateLabel = index < claimedCount
      ? "Claimed"
      : index === currentOpenIndex
        ? "Free"
        : "Locked";
    const rewardVisual = index < claimedCount ? "✓" : index === currentOpenIndex ? "🪙" : "🔒";
    card.innerHTML = `
      <div class="reward-day-label">Day ${index + 1}</div>
      <div class="reward-day-coins">${rewardVisual}</div>
      <div class="reward-day-value">${amount}</div>
      <div class="reward-day-state">${stateLabel}</div>
    `;
    elements.dailyRewardCards.appendChild(card);
  });
  elements.claimRewardButton.disabled = hasCooldown || currentOpenIndex < 0;
  elements.claimRewardButton.textContent = currentOpenIndex < 0
    ? "All Rewards Claimed"
    : hasCooldown
      ? "Come Back In 24h"
      : "Claim Now!";
}

function renderCountryCarousel() {
  elements.countryCarousel.innerHTML = "";
  const query = appState.countrySearchQuery.trim().toLowerCase();
  const filteredCountries = PROFILE_COUNTRIES.filter((country) => {
    return !query || country.name.toLowerCase().includes(query) || country.code.toLowerCase().includes(query);
  });
  const countriesToRender = filteredCountries.length > 0 ? filteredCountries : PROFILE_COUNTRIES;

  countriesToRender.forEach((country) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "country-card";
    if (country.code === appState.playerProfile.countryCode) card.classList.add("is-selected");
    card.innerHTML = `
      <span class="country-card-flag"><img src="${country.flagUrl}" alt="${country.name} flag"></span>
      <span class="country-card-name">${country.name}</span>
    `;
    card.addEventListener("click", () => setProfileCountry(country.code));
    elements.countryCarousel.appendChild(card);
  });
}

function updateProfileSetupUI() {
  const profile = appState.playerProfile;
  const avatarGender = profile.avatarGender === "female" ? "female" : "male";
  const selectedCountry = PROFILE_COUNTRIES.find((country) => country.code === profile.countryCode) || PROFILE_COUNTRIES[0];
  elements.setupAvatarPreview.src = AVATAR_LIBRARY[avatarGender][profile.avatarIndex];
  elements.setupAvatarPreview.alt = `${avatarGender} avatar`;
  elements.setupAvatarCount.textContent = `${profile.avatarIndex + 1} / ${AVATAR_LIBRARY[avatarGender].length}`;
  elements.setupNameInput.value = profile.name;
  elements.setupCountrySearch.value = appState.countrySearchQuery;
  elements.setupCountryFlag.textContent = "";
  elements.setupCountryFlag.style.backgroundImage = `url("${selectedCountry.flagUrl}")`;
  elements.setupCountryFlag.style.backgroundSize = "cover";
  elements.setupCountryFlag.style.backgroundPosition = "center";
  elements.setupCountryFlag.setAttribute("aria-label", `${selectedCountry.name} flag`);
  elements.setupCountryLabel.textContent = selectedCountry.name;
  elements.setupMaleButton.classList.toggle("is-active", avatarGender === "male");
  elements.setupFemaleButton.classList.toggle("is-active", avatarGender === "female");
  renderCountryCarousel();
}

function toggleProfilePopup(forceOpen) {
  appState.profileOpen = typeof forceOpen === "boolean" ? forceOpen : !appState.profileOpen;
  elements.profilePopup.classList.toggle("hidden", !appState.profileOpen);
  elements.profilePopup.setAttribute("aria-hidden", String(!appState.profileOpen));
  if (appState.profileOpen) updateProfileUI();
}

function setPlayerName(name) {
  const value = (name || "").trim().slice(0, 18) || "Player";
  appState.playerProfile.name = value;
  saveProfile();
  updateProfileUI();
  updateProfileSetupUI();
}

function setProfileAvatarGender(gender) {
  appState.playerProfile.avatarGender = gender === "female" ? "female" : "male";
  appState.selectedGender = appState.playerProfile.avatarGender;
  localStorage.setItem(STORAGE_KEYS.gender, appState.selectedGender);
  saveProfile();
  updateProfileSetupUI();
  updateLobbyUI();
}

function setProfileAvatar(step) {
  const currentGender = appState.playerProfile.avatarGender === "female" ? "female" : "male";
  const avatarCount = AVATAR_LIBRARY[currentGender].length;
  elements.setupAvatarPreview.classList.add("is-sliding");
  window.setTimeout(() => {
    appState.playerProfile.avatarIndex = (appState.playerProfile.avatarIndex + step + avatarCount) % avatarCount;
    appState.selectedGender = currentGender;
    localStorage.setItem(STORAGE_KEYS.gender, appState.selectedGender);
    saveProfile();
    updateProfileSetupUI();
    updateLobbyUI();
    elements.setupAvatarPreview.classList.remove("is-sliding");
  }, 120);
}

function setProfileCountry(code) {
  if (!PROFILE_COUNTRIES.some((country) => country.code === code)) return;
  appState.playerProfile.countryCode = code;
  saveProfile();
  updateProfileSetupUI();
}

function completeProfileSetup() {
  setPlayerName(elements.setupNameInput.value);
  appState.playerProfile.setupComplete = true;
  saveProfile();
  bootState.awaitingLobbyAfterReward = true;
  showDailyRewardScreen();
}

function skipDailyReward() {
  try {
    hideDailyRewardScreen();
    if (bootState.awaitingProfileAfterReward) {
      bootState.awaitingProfileAfterReward = false;
      showProfileScreen();
      return;
    }
    bootState.awaitingLobbyAfterReward = false;
    showLobby();
  } catch (error) {
    console.error(error);
    showLobby();
  }
}

function sendInvite() {
  const rawId = (elements.friendIdInput.value || "").trim().toUpperCase();
  if (!rawId || rawId.length < 5) {
    setInviteMessage("Enter a valid friend ID.", "error");
    return;
  }
  if (rawId === appState.playerProfile.id) {
    setInviteMessage("You cannot invite your own ID.", "error");
    return;
  }
  if (appState.invites.includes(rawId)) {
    setInviteMessage("Invite already sent to this player.", "error");
    return;
  }
  appState.invites.push(rawId);
  saveInvites();
  elements.friendIdInput.value = "";
  setInviteMessage(`Invite sent to ${rawId}.`, "success");
  renderInviteList();
}

function setSelectedGender(gender) {
  appState.selectedGender = gender;
  appState.playerProfile.avatarGender = gender === "female" ? "female" : "male";
  localStorage.setItem(STORAGE_KEYS.gender, gender);
  saveProfile();
  updateProfileSetupUI();
  updateLobbyUI();
}

function setSelectedMap(index) {
  if (!isMapUnlocked(index)) return;
  appState.selectedMapIndex = (index + MAPS.length) % MAPS.length;
  localStorage.setItem(STORAGE_KEYS.mapIndex, String(appState.selectedMapIndex));
  gameState.track = createTrack(MAPS[appState.selectedMapIndex]);
  resetRaceState();
  updateLobbyUI();
}

function setSelectedCar(index) {
  appState.selectedCarIndex = (index + ASSETS.cars.length) % ASSETS.cars.length;
  localStorage.setItem(STORAGE_KEYS.carIndex, String(appState.selectedCarIndex));
  updateLobbyUI();
}

function setSelectedSkin(index) {
  appState.selectedSkinIndex = (index + SKINS.length) % SKINS.length;
  localStorage.setItem(STORAGE_KEYS.skinIndex, String(appState.selectedSkinIndex));
  updateLobbyUI();
}

function buildCarouselCards(container, items, selectedIndex, getMeta) {
  container.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("div");
    const offset = index - selectedIndex;
    card.className = "carousel-card";
    if (offset === 0) card.classList.add("is-center");
    else if (offset === -1 || (selectedIndex === 0 && index === items.length - 1)) card.classList.add("is-left");
    else if (offset === 1 || (selectedIndex === items.length - 1 && index === 0)) card.classList.add("is-right");
    else card.classList.add("is-hidden");
    if (getMeta(index).locked) card.classList.add("is-locked");

    const meta = getMeta(index);
    const preview = meta.preview ? `<img class="carousel-card-preview" src="${meta.preview}" alt="${item.name}">` : "";
    card.innerHTML = `
      <div class="carousel-card-top">
        <span class="carousel-card-name">${item.name}</span>
        <span class="carousel-card-state">${meta.state}</span>
      </div>
      ${preview}
      <div class="carousel-card-meta">${meta.text}</div>
    `;
    container.appendChild(card);
  });
}

function updateLobbyUI() {
  const selectedMap = MAPS[appState.selectedMapIndex];
  const selectedCar = ASSETS.cars[appState.selectedCarIndex];
  const selectedSkin = SKINS[appState.selectedSkinIndex];
  const unlocked = isCarUnlocked(appState.selectedCarIndex);

  if (elements.lobbyCarPreview) {
    elements.lobbyCarPreview.src = selectedCar.src;
    elements.lobbyCarPreview.alt = `${selectedCar.name} car preview`;
  }
  if (elements.garageDriverName) elements.garageDriverName.textContent = appState.playerProfile.name;
  if (elements.garageRatingValue) elements.garageRatingValue.textContent = String(selectedCar.rating);
  if (elements.garageSpeedText) elements.garageSpeedText.textContent = `${selectedCar.stats.speed.toFixed(1)} MPH`;
  if (elements.garageAccelerationText) elements.garageAccelerationText.textContent = `${selectedCar.stats.acceleration.toFixed(1)} SEC`;
  if (elements.garageHandlingText) elements.garageHandlingText.textContent = `${selectedCar.stats.handling.toFixed(3)} G`;
  if (elements.garageBrakingText) elements.garageBrakingText.textContent = `${selectedCar.stats.braking.toFixed(1)} Nm`;
  if (elements.garageSpeedBar) elements.garageSpeedBar.style.width = `${clamp((selectedCar.stats.speed / 40) * 100, 14, 100)}%`;
  if (elements.garageAccelerationBar) elements.garageAccelerationBar.style.width = `${clamp(((10 - selectedCar.stats.acceleration) / 3) * 100, 14, 100)}%`;
  if (elements.garageHandlingBar) elements.garageHandlingBar.style.width = `${clamp((selectedCar.stats.handling / 1.5) * 100, 14, 100)}%`;
  if (elements.garageBrakingBar) elements.garageBrakingBar.style.width = `${clamp((selectedCar.stats.braking / 500) * 100, 14, 100)}%`;
  if (elements.garageSelectButton) elements.garageSelectButton.classList.toggle("hidden", !unlocked);
  if (elements.garageBuyButton) {
    elements.garageBuyButton.classList.toggle("hidden", unlocked);
    elements.garageBuyButton.textContent = unlocked ? "Buy" : `Buy ${selectedCar.price}`;
  }
  if (elements.garageSelectedLabel) {
    elements.garageSelectedLabel.textContent = unlocked
      ? `${selectedCar.name} Selected`
      : `${selectedCar.name} Preview`;
  }
  if (elements.garageLockLabel) {
    elements.garageLockLabel.classList.toggle("hidden", unlocked);
    elements.garageLockLabel.textContent = unlocked ? "Unlocked" : `LOCKED ${selectedCar.price}`;
  }

  if (elements.mapButton) elements.mapButton.textContent = `Map: ${appState.selectedMapIndex + 1} - ${selectedMap.name}`;
  if (elements.mapPreviewName) elements.mapPreviewName.textContent = selectedMap.name;
  if (elements.mapPreviewText) elements.mapPreviewText.textContent = selectedMap.description;
  if (elements.mapDifficulty) elements.mapDifficulty.textContent = selectedMap.difficulty;
  if (elements.mapPreviewBars) {
    elements.mapPreviewBars.innerHTML = "";
    for (let i = 0; i < 8; i += 1) {
      const bar = document.createElement("span");
      if (i < selectedMap.previewBars) bar.classList.add("is-active");
      elements.mapPreviewBars.appendChild(bar);
    }
  }

  document.documentElement.style.setProperty("--accent", selectedSkin.accent || selectedMap.theme.accent);
  updateProfileUI();
  renderGarageCarStrip();
}

function renderGarageCarStrip() {
  if (!elements.garageCarStrip) return;
  elements.garageCarStrip.innerHTML = "";
  ASSETS.cars.forEach((car, index) => {
    const card = document.createElement("button");
    const unlocked = isCarUnlocked(index);
    card.type = "button";
    card.className = "garage-car-card";
    if (index === appState.selectedCarIndex) card.classList.add("is-selected");
    if (!unlocked) card.classList.add("is-locked");
    card.innerHTML = `
      <img src="${car.src}" alt="${car.name}">
      <span class="garage-car-card-name">${car.name}</span>
      <span class="garage-car-card-state">${unlocked ? "Unlocked" : `${car.price} Coins`}</span>
      ${unlocked ? "" : '<span class="garage-car-card-lock">LOCKED</span>'}
    `;
    card.addEventListener("click", () => {
      setSelectedCar(index);
    });
    elements.garageCarStrip.appendChild(card);
  });
}

function selectCurrentGarageCar() {
  const index = appState.selectedCarIndex;
  if (!isCarUnlocked(index)) return;
  localStorage.setItem(STORAGE_KEYS.carIndex, String(index));
  updateLobbyUI();
}

function buyCurrentGarageCar() {
  const index = appState.selectedCarIndex;
  const car = ASSETS.cars[index];
  if (isCarUnlocked(index)) return;
  if (appState.totalCoins < car.price) {
    setInviteMessage("Not enough coins to buy this car.", "error");
    return;
  }
  appState.totalCoins -= car.price;
  appState.unlockedCars.push(index);
  appState.unlockedCars = Array.from(new Set(appState.unlockedCars)).sort((a, b) => a - b);
  saveUnlockedCars();
  saveCoins();
  localStorage.setItem(STORAGE_KEYS.carIndex, String(index));
  updateLobbyUI();
}

function saveCoins() {
  localStorage.setItem(STORAGE_KEYS.coins, String(appState.totalCoins));
  updateProfileUI();
  updateGameCoinHud();
}

function awardCoins(amount) {
  const value = Math.max(0, Math.floor(amount));
  if (value === 0) return;
  gameState.reward.runCoins += value;
  appState.totalCoins += value;
  saveCoins();
  updateGameCoinHud(true);
  updateRaceHud();
}

function showSplash() {
  if (isGameRunning) return;
  appState.mode = "splash";
  goToScreen("splashScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
  updateOrientationUI();
}

function showLoading(message = "Preparing cars, maps, and lobby modules...") {
  if (isGameRunning) return;
  appState.mode = "loading";
  elements.loadingText.textContent = message;
  elements.loadingPercent.textContent = "0%";
  elements.loadingBarFill.style.width = "0%";
  elements.loadingImageFirst.classList.add("is-visible");
  elements.loadingImageSecond.classList.remove("is-visible");
  goToScreen("loadingScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
  updateOrientationUI();
}

function showProfileSetupScreen() {
  if (isGameRunning) return;
  appState.mode = "profile-setup";
  updateProfileSetupUI();
  goToScreen("profileScreen");
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.remove("hidden");
  elements.friendsPanel.classList.add("hidden");
  toggleProfilePopup(false);
  updateOrientationUI();
}

function showLobby() {
  isGameRunning = false;
  appState.mode = "lobby";
  setGarageView(false);
  if (!elements.lobbyScreen) {
    console.error("Screen not found: lobbyScreen");
    return;
  }
  goToScreen("lobbyScreen");
  window.AudioManager?.fadeUp?.();
  elements.lobbyScreen.style.display = "";
  elements.lobbyScreen.style.opacity = "1";
  elements.lobbyScreen.style.visibility = "visible";
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.remove("hidden");
  if (elements.roomFriendsPanel) elements.roomFriendsPanel.classList.remove("is-open");
  elements.countdownOverlay.classList.add("hidden");
  elements.countdownOverlay.style.display = "none";
  if (elements.lobbyVideo) {
    elements.lobbyVideo.currentTime = 0;
    elements.lobbyVideo.play().catch(() => {});
  }
  hideDailyRewardScreen();
  updateOrientationUI();
}

function showProfileScreen() {
  showProfileSetupScreen();
}

function showGame() {
  if (rewardTransitionTimeout) {
    clearTimeout(rewardTransitionTimeout);
    rewardTransitionTimeout = 0;
  }
  isGameRunning = true;
  appState.mode = "game";
  goToScreen("gameScreen");
  window.AudioManager?.fadeDown?.();
  elements.profileButton.classList.add("hidden");
  elements.walletBox.classList.add("hidden");
  elements.friendsPanel.classList.add("hidden");
  if (elements.threeViewport) elements.threeViewport.style.display = race3DEngine ? "block" : "none";
  if (elements.canvas) elements.canvas.style.display = race3DEngine ? "none" : "block";
  if (elements.lobbyVideo) elements.lobbyVideo.pause();
  if (elements.pauseOverlay) elements.pauseOverlay.classList.add("hidden");
  if (elements.pauseGameButton) elements.pauseGameButton.textContent = "Ⅱ";
    applyGraphicsMode(appState.graphicsMode);
    updatePauseControlUI();
    toggleGraphicsPanel(false);
  if (race3DEngine) race3DEngine.resize(window.innerWidth, window.innerHeight);
  toggleProfilePopup(false);
  updateOrientationUI();
  updateRaceHud();
}

function resetRaceState() {
  gameState.player.distance = 0;
  gameState.player.laneOffset = 0;
  gameState.player.laneVelocity = 0;
  gameState.player.speed = 420;
  gameState.player.visualAngle = 0;
  gameState.player.bodyTilt = 0;
  gameState.player.bounce = 0;
  gameState.player.wheelSpin = 0;
  gameState.traffic = [];
  gameState.spawnTimer = 0;
  gameState.spawnInterval = 1.2;
  gameState.lastSpawnLane = 0;
  gameState.maxOpponents = raceSettingsState.opponents;
  gameState.cameraModeIndex = 0;
  gameState.paused = false;
  gameState.graphicsPanelOpen = false;
  gameState.finished = false;
  gameState.camera.x = 0;
  gameState.camera.horizonShift = 0;
  gameState.gameOver = false;
  gameState.sceneryTick = 0;
  gameState.movementLogged = false;
  gameState.race.currentLap = 1;
  gameState.race.totalLaps = raceSettingsState.laps;
  gameState.race.position = 1;
  gameState.race.previousPosition = 1;
  gameState.race.totalRacers = raceSettingsState.opponents + 1;
  gameState.race.speedKph = 0;
  gameState.race.currentTime = 0;
  gameState.race.bestTime = null;
  gameState.race.lastTime = null;
  gameState.race.totalTime = 0;
  gameState.race.distanceKm = 0;
  gameState.race.targetDistanceKm = null;
  gameState.reward.runCoins = 0;
  gameState.reward.distanceSinceReward = 0;
  gameState.reward.totalDistance = 0;
  gameState.reward.averageSpeedAccumulator = 0;
  gameState.reward.averageSpeedTime = 0;
  gameState.resultShown = false;
  gameState.resultRewardGiven = false;
  gameState.traffic = Array.from({ length: raceSettingsState.opponents }, (_, index) => ({
    id: index,
    laneOffset: ((index % 3) - 1) * 2.2,
    distance: 260 + index * 180,
    speed: 280 + (index % 4) * 28,
    lap: 1
  }));
  toggleGraphicsPanel(false);
  updateRaceHud();
  updateGameCoinHud();
  updateMinimap();
}

function exitRaceToLobby() {
  isGameRunning = false;
  gameState.running = false;
  gameState.gameOver = false;
  gameState.paused = false;
    if (gameState.frameId) {
      cancelAnimationFrame(gameState.frameId);
      gameState.frameId = 0;
    }
    if (race3DEngine) race3DEngine.stopRace();
    window.ReplaySystem?.stopSession();
    window.AudioManager?.fadeUp?.();
    inputState.held.clear();
  syncInputState();
  elements.controlButtons.forEach((button) => button.classList.remove("is-active"));
  if (elements.pauseOverlay) elements.pauseOverlay.classList.add("hidden");
  if (elements.pauseGameButton) elements.pauseGameButton.textContent = "Ⅱ";
  showLobby();
}

function togglePause() {
  if (appState.mode !== "game" || gameState.gameOver) return;
  gameState.paused = !gameState.paused;
  gameState.running = !gameState.paused;
  if (race3DEngine) race3DEngine.setPaused(gameState.paused);
  console.log(gameState.paused ? "Pause enabled" : "Pause disabled");
  if (gameState.paused) {
    inputState.held.clear();
    syncInputState();
    elements.controlButtons.forEach((button) => button.classList.remove("is-active"));
    if (elements.pauseOverlay) elements.pauseOverlay.classList.remove("hidden");
    if (elements.pauseGameButton) elements.pauseGameButton.textContent = "▶";
    render();
  } else {
    if (elements.pauseOverlay) elements.pauseOverlay.classList.add("hidden");
    if (elements.pauseGameButton) elements.pauseGameButton.textContent = "Ⅱ";
    gameState.lastTime = performance.now();
  }
}

function drawFallbackRaceScene() {
  if (!ctx || !elements.canvas) return;
  const width = elements.canvas.width;
  const height = elements.canvas.height;

  ctx.clearRect(0, 0, width, height);

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#76aee6");
  sky.addColorStop(0.55, "#d4e6fb");
  sky.addColorStop(0.56, "#608f4a");
  sky.addColorStop(1, "#2f4f2d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const roadTop = height * 0.2;
  const roadBottom = height * 0.94;
  const roadTopWidth = width * 0.13;
  const roadBottomWidth = width * 0.7;
  ctx.fillStyle = "#262930";
  ctx.beginPath();
  ctx.moveTo(width / 2 - roadTopWidth / 2, roadTop);
  ctx.lineTo(width / 2 + roadTopWidth / 2, roadTop);
  ctx.lineTo(width / 2 + roadBottomWidth / 2, roadBottom);
  ctx.lineTo(width / 2 - roadBottomWidth / 2, roadBottom);
  ctx.closePath();
  ctx.fill();

  for (let strip = 0; strip < 18; strip += 1) {
    const y = roadTop + ((strip * 90 + gameState.player.distance * 1.1) % (roadBottom - roadTop));
    const widthAtY = lerp(roadTopWidth, roadBottomWidth, (y - roadTop) / (roadBottom - roadTop));
    ctx.strokeStyle = strip % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - widthAtY / 2, y);
    ctx.lineTo(width / 2 + widthAtY / 2, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#f4edbe";
  ctx.lineWidth = Math.max(2, width * 0.003);
  ctx.setLineDash([height * 0.035, height * 0.04]);
  ctx.beginPath();
  ctx.moveTo(width / 2, roadTop);
  ctx.lineTo(width / 2, roadBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  const lapDistance = 2200;
  const finishProgress = 1 - clamp(gameState.player.distance / lapDistance, 0, 1);
  const finishY = roadTop + finishProgress * (roadBottom - roadTop);
  if (finishY > roadTop + 24 && finishY < roadBottom - 12) {
    const finishWidth = lerp(roadTopWidth, roadBottomWidth, (finishY - roadTop) / (roadBottom - roadTop));
    const startX = width / 2 - finishWidth / 2;
    const tile = Math.max(10, finishWidth / 14);
    const tileH = Math.max(10, tile * 0.55);
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < Math.ceil(finishWidth / tile); col += 1) {
        ctx.fillStyle = (row + col) % 2 === 0 ? "#ffffff" : "#16181c";
        ctx.fillRect(startX + col * tile, finishY + row * tileH, tile, tileH);
      }
    }
  }

  gameState.traffic
    .slice()
    .sort((a, b) => relativeDistanceAhead(a.distance, gameState.player.distance) - relativeDistanceAhead(b.distance, gameState.player.distance))
    .forEach((trafficCar, index) => {
      const ahead = relativeDistanceAhead(trafficCar.distance, gameState.player.distance);
      if (ahead <= 0 || ahead > lapDistance * 0.55) return;
      const perspective = 1 - ahead / (lapDistance * 0.55);
      const carWidth = lerp(width * 0.03, width * 0.1, perspective);
      const carHeight = lerp(height * 0.05, height * 0.14, perspective);
      const y = roadTop + (1 - perspective) * (roadBottom - roadTop) * 0.82;
      const roadWidthAtY = lerp(roadTopWidth, roadBottomWidth, (y - roadTop) / (roadBottom - roadTop));
      const x = width / 2 + trafficCar.laneOffset * roadWidthAtY * 0.07;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = ["#366cff", "#ff9b21", "#2ec673", "#ffd84f", "#f5f5f5"][index % 5];
      ctx.fillRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);
      ctx.fillStyle = "#10141b";
      ctx.fillRect(-carWidth * 0.26, -carHeight * 0.22, carWidth * 0.52, carHeight * 0.28);
      ctx.fillStyle = "#050608";
      ctx.fillRect(-carWidth / 2 - carWidth * 0.08, -carHeight * 0.3, carWidth * 0.16, carHeight * 0.22);
      ctx.fillRect(carWidth / 2 - carWidth * 0.08, -carHeight * 0.3, carWidth * 0.16, carHeight * 0.22);
      ctx.fillRect(-carWidth / 2 - carWidth * 0.08, carHeight * 0.08, carWidth * 0.16, carHeight * 0.22);
      ctx.fillRect(carWidth / 2 - carWidth * 0.08, carHeight * 0.08, carWidth * 0.16, carHeight * 0.22);
      ctx.restore();
    });

  const laneShift = gameState.player.laneOffset * (width * 0.018);
  const carX = width / 2 + laneShift;
  const carY = height * 0.76;
  const carW = width * 0.12;
  const carH = height * 0.17;
  const horizonStripeY = roadTop + ((gameState.player.distance * 0.5) % (roadBottom - roadTop));
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = Math.max(2, width * 0.002);
  ctx.beginPath();
  ctx.moveTo(width / 2 - roadBottomWidth * 0.28, horizonStripeY);
  ctx.lineTo(width / 2 + roadBottomWidth * 0.28, horizonStripeY);
  ctx.stroke();

  const bodyTilt = gameState.player.bodyTilt * width * 0.004;
  ctx.save();
  ctx.translate(carX, carY);
  ctx.rotate(gameState.player.bodyTilt);
  ctx.fillStyle = "#d82b2b";
  ctx.fillRect(-carW / 2, -carH / 2, carW, carH);
  ctx.fillStyle = "#0f1319";
  ctx.fillRect(-carW * 0.28, -carH * 0.24, carW * 0.56, carH * 0.3);
  ctx.fillStyle = "#050608";
  const wheelW = carW * 0.16;
  const wheelH = carH * 0.25;
  ctx.fillRect(-carW / 2 - wheelW * 0.45 + bodyTilt, -carH * 0.33, wheelW, wheelH);
  ctx.fillRect(carW / 2 - wheelW * 0.55 + bodyTilt, -carH * 0.33, wheelW, wheelH);
  ctx.fillRect(-carW / 2 - wheelW * 0.45 - bodyTilt, carH * 0.1, wheelW, wheelH);
  ctx.fillRect(carW / 2 - wheelW * 0.55 - bodyTilt, carH * 0.1, wheelW, wheelH);
  ctx.restore();
}

function startCanvasFallbackRace() {
  race3DEngine = null;
  race3DReady = false;
  resetRaceState();
  window.ReplaySystem?.startSession({
    map: MAPS[appState.selectedMapIndex]?.name || "Track",
    laps: raceSettingsState.laps,
    car: ASSETS.cars[appState.selectedCarIndex]?.name || "Car",
    mode: GAME_MODES.find((entry) => entry.id === raceSettingsState.modeId)?.name || "Career"
  });
  appState.mode = "game";
  isGameRunning = true;
  goToScreen("gameScreen");
  if (elements.profileButton) elements.profileButton.classList.add("hidden");
  if (elements.walletBox) elements.walletBox.classList.add("hidden");
  if (elements.friendsPanel) elements.friendsPanel.classList.add("hidden");
  if (elements.pauseOverlay) elements.pauseOverlay.classList.add("hidden");
  if (elements.pauseGameButton) elements.pauseGameButton.textContent = "Ⅱ";
  if (elements.threeViewport) elements.threeViewport.style.display = "none";
    if (elements.canvas) {
      elements.canvas.style.display = "block";
    }
  window.AudioManager?.fadeDown?.();
    gameState.running = true;
  gameState.paused = false;
  gameState.lastTime = performance.now();
  updateRaceHud();
  drawFallbackRaceScene();
  render();
}

function updateFallbackRace(deltaSeconds) {
  const acceleration = inputState.throttle ? 320 : 0;
  const braking = inputState.brake ? 420 : 0;
  const drag = 120;
  gameState.player.speed += (acceleration - braking - drag) * deltaSeconds;
  gameState.player.speed = clamp(gameState.player.speed, 120, 980);

  gameState.player.laneVelocity += inputState.steer * deltaSeconds * 7.5;
  gameState.player.laneVelocity *= Math.pow(0.84, deltaSeconds * 60);
  gameState.player.laneOffset += gameState.player.laneVelocity * deltaSeconds * 4.4;
  gameState.player.laneOffset = clamp(gameState.player.laneOffset, -4.6, 4.6);
  gameState.player.bodyTilt = lerp(gameState.player.bodyTilt, -inputState.steer * 0.12, Math.min(1, deltaSeconds * 8));
  gameState.player.visualAngle = gameState.player.bodyTilt;

  const distanceDelta = (gameState.player.speed * deltaSeconds) / 6;
  gameState.player.distance += distanceDelta;
  gameState.race.speedKph = Math.round(gameState.player.speed * 0.62);
  if (!gameState.movementLogged && gameState.race.speedKph > 20) {
    gameState.movementLogged = true;
    console.log("Car moving");
  }
  gameState.race.currentTime += deltaSeconds;
  gameState.race.totalTime += deltaSeconds;
  gameState.reward.totalDistance += distanceDelta;
  gameState.reward.distanceSinceReward += distanceDelta;
  gameState.reward.averageSpeedAccumulator += gameState.race.speedKph * deltaSeconds;
  gameState.reward.averageSpeedTime += deltaSeconds;

  const lapDistance = 2200;
  gameState.traffic.forEach((trafficCar) => {
    trafficCar.distance += ((trafficCar.speed + raceSettingsState.difficultyIndex * 18) * deltaSeconds) / 6;
    while (trafficCar.distance >= lapDistance) {
      trafficCar.distance -= lapDistance;
      trafficCar.lap += 1;
    }
  });

  if (gameState.player.distance >= lapDistance) {
    gameState.player.distance -= lapDistance;
    gameState.race.lastTime = gameState.race.currentTime;
    gameState.race.bestTime = gameState.race.bestTime === null
      ? gameState.race.lastTime
      : Math.min(gameState.race.bestTime, gameState.race.lastTime);
    gameState.race.currentTime = 0;
    if (gameState.race.currentLap < gameState.race.totalLaps) {
      gameState.race.currentLap += 1;
    } else {
      gameState.finished = true;
    }
  }

  updateRacePosition();
}

function renderFrame(now = performance.now()) {
  if (appState.mode !== "game") {
    gameState.frameId = 0;
    return;
  }

  const deltaSeconds = Math.min(0.05, Math.max(0, (now - gameState.lastTime) / 1000 || 0));
  gameState.lastTime = now;

  if (race3DEngine) {
    const snapshot = race3DEngine.update(deltaSeconds, inputState);
    if (snapshot) {
      syncRaceSnapshot(snapshot);
      if (snapshot.finished && !gameState.resultShown) {
        showRaceResults();
        return;
      }
    }
  } else {
    updateFallbackRace(deltaSeconds);
    drawFallbackRaceScene();
    if (gameState.finished && !gameState.resultShown) {
      showRaceResults();
      return;
    }
  }

  recordReplayFrame();
  updateRaceHud();
  gameState.frameId = requestAnimationFrame(renderFrame);
}

function render() {
  if (gameState.frameId) {
    cancelAnimationFrame(gameState.frameId);
  }
  gameState.frameId = requestAnimationFrame(renderFrame);
}

function updateRacePosition() {
  const lapDistance = 2200;
  const playerProgress = (gameState.race.currentLap - 1) * lapDistance + gameState.player.distance;
  let position = 1;
  for (const trafficCar of gameState.traffic) {
    const trafficLap = trafficCar.lap || 1;
    const trafficProgress = (trafficLap - 1) * lapDistance + trafficCar.distance;
    if (trafficProgress > playerProgress) position += 1;
  }
  const nextPosition = clamp(position, 1, gameState.race.totalRacers);
  gameState.race.position = nextPosition;
  notifyPositionChange(nextPosition);
}

function syncInputState() {
  inputState.steer = 0;
  inputState.throttle = 0;
  inputState.brake = 0;
  if (inputState.held.has("left")) inputState.steer -= 1;
  if (inputState.held.has("right")) inputState.steer += 1;
  if (inputState.held.has("accelerate")) inputState.throttle = 1;
  if (inputState.held.has("brake")) inputState.brake = 1;
  if (appState.controlMode === "steering") {
    inputState.steer *= 0.65;
  }
  if (tiltState.enabled && !inputState.held.has("left") && !inputState.held.has("right")) {
    inputState.steer = clamp(tiltState.gamma * 0.03, -1, 1);
  }
}

function setControlActive(control, active) {
  if (appState.mode !== "game" && active) return;
  if (active) inputState.held.add(control);
  else inputState.held.delete(control);
  syncInputState();
  const button = elements.controlButtons.find((element) => element.dataset.control === control);
  if (button) button.classList.toggle("is-active", active);
  console.log(`Control ${control}: ${active ? "on" : "off"}`, {
    steer: inputState.steer,
    throttle: inputState.throttle,
    brake: inputState.brake
  });
}

async function startCountdown() {
  elements.countdownOverlay.classList.remove("hidden");
  elements.countdownOverlay.style.display = "flex";
  for (let value = 4; value >= 1; value -= 1) {
    elements.countdownValue.textContent = String(value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  elements.countdownValue.textContent = "GO";
  await new Promise((resolve) => setTimeout(resolve, 380));
  elements.countdownOverlay.classList.add("hidden");
  elements.countdownOverlay.style.display = "none";
}

window.initRace = async function initRace(config = {}) {
  console.log("initRace called", config);
  const gameScreen = document.getElementById("gameScreen");
  if (!gameScreen) {
    throw new Error("gameScreen not found in DOM");
  }

  if (Number.isFinite(config.laps)) {
    raceSettingsState.laps = Math.max(1, Number(config.laps));
  }
  if (Number.isFinite(config.opponents)) {
    raceSettingsState.opponents = Math.max(1, Number(config.opponents));
  }
  if (typeof config.weather === "string") {
    raceSettingsState.weather = config.weather;
  }
  if (typeof config.modeId === "string") {
    raceSettingsState.modeId = config.modeId;
  }

  resetRaceState();
  window.ReplaySystem?.startSession({
    map: MAPS[appState.selectedMapIndex]?.name || "Track",
    laps: raceSettingsState.laps,
    car: ASSETS.cars[appState.selectedCarIndex]?.name || "Car",
    mode: GAME_MODES.find((entry) => entry.id === raceSettingsState.modeId)?.name || "Career"
  });
  appState.playerProfile.matchesPlayed += 1;
  saveProfile();

  showGame();
  await enterGameMode();
  gameState.running = false;
  const engine = await safeInitGame(gameScreen);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await startCountdown();

  if (!engine) {
    console.warn("3D init unavailable, launching fallback race");
    startCanvasFallbackRaceSafe();
    return true;
  }

    try {
      gameState.cameraModeIndex = 0;
      engine.setCameraMode(gameState.cameraModeIndex);
      const snapshot = await engine.startRace({
      laps: raceSettingsState.laps,
      opponents: raceSettingsState.opponents,
      weather: raceSettingsState.weather,
      difficulty: DIFFICULTY_LEVELS[raceSettingsState.difficultyIndex],
        mapTheme: MAPS[appState.selectedMapIndex]?.theme || null,
      selectedCarModel: ASSETS.cars[appState.selectedCarIndex]?.model || "assets/cars/rc_car.glb"
      });
      if (elements.threeViewport) {
        elements.threeViewport.style.display = "block";
      }
      if (elements.canvas) {
        elements.canvas.style.display = "none";
      }
      syncRaceSnapshot(snapshot);
      gameState.lastTime = performance.now();
    gameState.running = true;
    render();
    console.log("Race running");
    return true;
  } catch (error) {
    console.error("Race init failed:", error);
    resetRace3DEngine();
    startCanvasFallbackRaceSafe();
    return true;
  }
};

async function startGame() {
  console.log("StartGame clicked");

  if (window.__gameStarting) {
    console.warn("Start blocked: already starting");
    return;
  }

  window.__gameStarting = true;

  try {
    const gameScreen = document.getElementById("gameScreen");
    if (!gameScreen) {
      throw new Error("gameScreen not found in DOM");
    }

    console.log("gameScreen found:", gameScreen);

    goToScreen("gameScreen");
    await window.initRace({
      laps: raceSettingsState.laps || 2,
      opponents: raceSettingsState.opponents || 4,
      weather: raceSettingsState.weather || "day",
      modeId: raceSettingsState.modeId || "career"
    });
    console.log("Game started successfully");
  } catch (error) {
    console.error("START ERROR:", error);
    startCanvasFallbackRaceSafe();
  } finally {
    window.__gameStarting = false;
  }
}

async function initializeGameSafe() {
  try {
    await startGame();
    console.log("Game started successfully");
  } catch (error) {
    console.error("Game failed:", error);
    startCanvasFallbackRaceSafe();
  }
}

function moveMap(step) {
  let next = appState.selectedMapIndex;
  for (let i = 0; i < MAPS.length; i += 1) {
    next = (next + step + MAPS.length) % MAPS.length;
    if (isMapUnlocked(next)) break;
  }
  setSelectedMap(next);
}

function moveCar(step) {
  let next = appState.selectedCarIndex;
  for (let i = 0; i < ASSETS.cars.length; i += 1) {
    next = (next + step + ASSETS.cars.length) % ASSETS.cars.length;
    if (isCarUnlocked(next)) break;
  }
  setSelectedCar(next);
}

function moveSkin(step) {
  setSelectedSkin(appState.selectedSkinIndex + step);
}

async function runLoadingSequence() {
  if (bootState.loadingStarted) return;
  bootState.loadingStarted = true;
  bootState.loadingTransitioned = false;
  bootState.loadingProgress = 0;
  console.log("Loading started");
  showLoading("Preparing your profile screen...");

  const finalizeLoading = async () => {
    if (bootState.loadingTransitioned) return;
    bootState.loadingTransitioned = true;
    if (bootState.loadingFrame) cancelAnimationFrame(bootState.loadingFrame);
    if (bootState.loadingFailSafeTimer) clearTimeout(bootState.loadingFailSafeTimer);
    elements.loadingBarFill.style.width = "100%";
    elements.loadingPercent.textContent = "100%";
    console.log("Loading complete");
    try {
      if (bootState.preloadPromise) await Promise.race([
        bootState.preloadPromise,
        new Promise((resolve) => setTimeout(resolve, 600))
      ]);
    } catch (error) {
      console.error("Loading preload error:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSplash();
  };

  const startedAt = performance.now();
  const switchTime = 3000;
  const totalDuration = 7000;
  const failSafeDuration = 8000;

  const step = (now) => {
    if (bootState.loadingTransitioned) return;
    const elapsed = now - startedAt;
    bootState.loadingProgress = Math.min(100, (elapsed / totalDuration) * 100);
    const percent = Math.floor(bootState.loadingProgress);
    elements.loadingBarFill.style.width = `${percent}%`;
    elements.loadingPercent.textContent = `${percent}%`;
    console.log(`Progress: ${percent}%`);

    if (elapsed >= switchTime) {
      elements.loadingImageFirst.classList.remove("is-visible");
      elements.loadingImageSecond.classList.add("is-visible");
      elements.loadingText.textContent = "Finalizing profile and garage...";
    } else {
      elements.loadingImageFirst.classList.add("is-visible");
      elements.loadingImageSecond.classList.remove("is-visible");
      elements.loadingText.textContent = "Loading profile data...";
    }

    if (elapsed >= totalDuration || bootState.loadingProgress >= 100) {
      finalizeLoading().catch(console.error);
      return;
    }

    bootState.loadingFrame = requestAnimationFrame(step);
  };

  bootState.loadingFailSafeTimer = setTimeout(() => {
    console.warn("Loading fail-safe triggered");
    bootState.loadingProgress = 100;
    finalizeLoading().catch(console.error);
  }, failSafeDuration);

  bootState.loadingFrame = requestAnimationFrame(step);
}

async function continueFromSplash() {
  if (isGameRunning) return;
  bootState.splashDismissed = true;
  bootState.awaitingProfileAfterReward = false;
  bootState.awaitingLobbyAfterReward = false;
  console.log("Switching to: profileScreen");
  elements.splashScreen.classList.add("hidden");
  elements.splashScreen.style.display = "none";
  showProfileSetupScreen();
}

async function startLoadingThenGame() {
  if (raceLaunchState.active) return;
  raceLaunchState.active = true;
  raceLaunchState.progress = 0;
  console.log("Starting game...");
  showLoading("Preparing race scene...");
  elements.loadingImageFirst.classList.add("is-visible");
  elements.loadingImageSecond.classList.remove("is-visible");
  elements.loadingText.textContent = "Preparing race scene...";

  const finalize = async () => {
    if (!raceLaunchState.active) return;
    raceLaunchState.active = false;
    if (raceLaunchState.frame) cancelAnimationFrame(raceLaunchState.frame);
    if (raceLaunchState.failSafeTimer) clearTimeout(raceLaunchState.failSafeTimer);
    elements.loadingBarFill.style.width = "100%";
    elements.loadingPercent.textContent = "100%";
    console.log("Loading complete...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Entering game scene");
    await initializeGameSafe();
  };

  const startedAt = performance.now();
  const animate = (now) => {
    if (!raceLaunchState.active) return;
    const elapsed = now - startedAt;
    const increment = elapsed < 900 ? 2.2 : elapsed < 1700 ? 1.5 : 1;
    raceLaunchState.progress = Math.min(100, raceLaunchState.progress + increment);
    const percent = Math.floor(raceLaunchState.progress);
    elements.loadingBarFill.style.width = `${percent}%`;
    elements.loadingPercent.textContent = `${percent}%`;
    elements.loadingText.textContent = percent < 55 ? "Loading cars and track..." : "Syncing race systems...";

    if (percent >= 50) {
      elements.loadingImageFirst.classList.remove("is-visible");
      elements.loadingImageSecond.classList.add("is-visible");
    }

    if (raceLaunchState.progress >= 100) {
      finalize().catch(console.error);
      return;
    }

    raceLaunchState.frame = requestAnimationFrame(animate);
  };

  raceLaunchState.failSafeTimer = setTimeout(() => {
    if (!raceLaunchState.active) return;
    console.warn("Race loading fail-safe triggered");
    raceLaunchState.progress = 100;
    finalize().catch(console.error);
  }, 5000);

  raceLaunchState.frame = requestAnimationFrame(animate);
}

function startGameFromRaceSettings() {
  saveGameSettings();
  showStartingGrid();
}

function bindLobbyEvents() {
  const handleSplashContinue = (event) => {
    event.preventDefault();
    window.AudioManager?.startBGM?.();
    playUiClickSound();
    continueFromSplash().catch(console.error);
  };
  elements.tapToContinueButton.addEventListener("click", handleSplashContinue);
  elements.tapToContinueButton.addEventListener("pointerdown", handleSplashContinue);
  elements.splashScreen.addEventListener("click", handleSplashContinue);
  elements.splashScreen.addEventListener("pointerdown", handleSplashContinue);
  elements.claimRewardButton.addEventListener("click", claimDailyReward);
  elements.closeRewardButton?.addEventListener("click", skipDailyReward);
  elements.closeRaceSettingsButton?.addEventListener("click", () => {
    playUiClickSound();
    hideRaceSettings();
    showGameModes();
  });
  elements.exitGridButton?.addEventListener("click", () => {
    playUiClickSound();
    hideStartingGrid();
    showLobby();
  });
  elements.startGridRaceButton?.addEventListener("click", () => {
    playUiClickSound();
    hideStartingGrid();
    initializeGameSafe().catch(console.error);
  });
  elements.raceResultLobbyButton?.addEventListener("click", () => {
    playUiClickSound();
    showLobby();
  });
  elements.raceResultReplayButton?.addEventListener("click", () => {
    playUiClickSound();
    showRaceSettings();
  });
  elements.savePhotoButton?.addEventListener("click", () => {
    playUiClickSound();
    window.ReplaySystem?.savePhoto?.();
  });
  elements.saveReplayButton?.addEventListener("click", () => {
    playUiClickSound();
    window.ReplaySystem?.saveReplay?.();
  });
  elements.lapsMinusButton?.addEventListener("click", () => {
    raceSettingsState.laps = clamp(raceSettingsState.laps - 1, 1, 5);
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.lapsPlusButton?.addEventListener("click", () => {
    raceSettingsState.laps = clamp(raceSettingsState.laps + 1, 1, 5);
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.opponentsMinusButton?.addEventListener("click", () => {
    raceSettingsState.opponents = clamp(raceSettingsState.opponents - 1, 1, 8);
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.opponentsPlusButton?.addEventListener("click", () => {
    raceSettingsState.opponents = clamp(raceSettingsState.opponents + 1, 1, 8);
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.weatherToggleButton?.addEventListener("click", () => {
    raceSettingsState.weather = raceSettingsState.weather === "day" ? "night" : "day";
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.difficultyPrevButton?.addEventListener("click", () => {
    raceSettingsState.difficultyIndex = (raceSettingsState.difficultyIndex - 1 + DIFFICULTY_LEVELS.length) % DIFFICULTY_LEVELS.length;
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.difficultyNextButton?.addEventListener("click", () => {
    raceSettingsState.difficultyIndex = (raceSettingsState.difficultyIndex + 1) % DIFFICULTY_LEVELS.length;
    playUiClickSound();
    updateRaceSettingsUI();
  });
  elements.raceSettingsStartButton?.addEventListener("click", () => {
    playUiClickSound();
    startGameFromRaceSettings();
  });
  elements.avatarPrevButton.addEventListener("click", () => setProfileAvatar(-1));
  elements.avatarNextButton.addEventListener("click", () => setProfileAvatar(1));
  elements.avatarChooseButton.addEventListener("click", () => setProfileAvatar(1));
  elements.setupMaleButton.addEventListener("click", () => setProfileAvatarGender("male"));
  elements.setupFemaleButton.addEventListener("click", () => setProfileAvatarGender("female"));
  elements.setupNameInput.addEventListener("change", (event) => setPlayerName(event.target.value));
  elements.setupNameInput.addEventListener("blur", (event) => setPlayerName(event.target.value));
  elements.setupCountrySearch.addEventListener("input", (event) => {
    appState.countrySearchQuery = event.target.value;
    renderCountryCarousel();
  });
  elements.profileSetupNextButton.addEventListener("click", completeProfileSetup);
  elements.profileButton.addEventListener("click", () => toggleProfilePopup());
  if (elements.lobbyProfileTrigger) {
    elements.lobbyProfileTrigger.addEventListener("click", () => toggleProfilePopup(true));
  }
  if (elements.lobbySettingsButton) {
    elements.lobbySettingsButton.addEventListener("click", () => toggleProfilePopup(true));
  }
  elements.garageBackButton?.addEventListener("click", () => {
    setGarageView(false);
  });
  elements.profileCloseButton.addEventListener("click", () => toggleProfilePopup(false));
  elements.errorBackButton?.addEventListener("click", () => {
    showLobby();
  });
  elements.profilePopup.addEventListener("click", (event) => {
    if (event.target === elements.profilePopup) toggleProfilePopup(false);
  });
  elements.playerNameInput.addEventListener("change", (event) => {
    setPlayerName(event.target.value);
  });
  elements.playerNameInput.addEventListener("blur", (event) => {
    setPlayerName(event.target.value);
  });
  elements.sendInviteButton.addEventListener("click", sendInvite);
  elements.friendIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendInvite();
    }
  });
  elements.genderButtons.forEach((button) => {
    button.addEventListener("click", () => setSelectedGender(button.dataset.gender));
  });
  elements.startGameButton.addEventListener("click", () => {
    showGameModes();
  });
  if (elements.eventPlayButton) {
    elements.eventPlayButton.addEventListener("click", () => {
      showGameModes();
    });
  }
  elements.closeModesButton?.addEventListener("click", hideGameModes);
  elements.gameModesScreen?.addEventListener("click", (event) => {
    if (event.target === elements.gameModesScreen || event.target.classList.contains("game-modes-backdrop")) {
      hideGameModes();
    }
  });
  if (elements.dailyRewardOpenButton) {
    elements.dailyRewardOpenButton.addEventListener("click", () => showDailyRewardScreen());
  }
  if (elements.storeButton) {
    elements.storeButton.addEventListener("click", () => {
      setGarageView(false);
      setInviteMessage("Store button is ready for expansion.");
      elements.storeButton.classList.add("is-active");
      elements.inventoryButton?.classList.remove("is-active");
      elements.garageButton?.classList.remove("is-active");
    });
  }
  if (elements.inventoryButton) {
    elements.inventoryButton.addEventListener("click", () => {
      setGarageView(false);
      moveSkin(1);
      elements.inventoryButton.classList.add("is-active");
      elements.storeButton?.classList.remove("is-active");
      elements.garageButton?.classList.remove("is-active");
    });
  }
  if (elements.garageButton) {
    elements.garageButton.addEventListener("click", () => {
      setGarageView(true);
    });
  }
  elements.roomButton?.addEventListener("click", () => {
    playUiClickSound();
    showRoomScreen();
  });
  elements.roomBackButton?.addEventListener("click", () => {
    playUiClickSound();
    showLobby();
  });
  elements.roomFriendsToggle?.addEventListener("click", () => {
    roomState.open = !roomState.open;
    renderRoomUI();
  });
  elements.roomLapsMinus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.laps = clamp(roomState.laps - 1, 1, 8);
    renderRoomUI();
  });
  elements.roomLapsPlus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.laps = clamp(roomState.laps + 1, 1, 8);
    renderRoomUI();
  });
  elements.roomOpponentsMinus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.opponents = clamp(roomState.opponents - 1, 1, 12);
    roomState.invitedFriends = roomState.invitedFriends.slice(0, roomState.opponents);
    renderRoomUI();
  });
  elements.roomOpponentsPlus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.opponents = clamp(roomState.opponents + 1, 1, 12);
    renderRoomUI();
  });
  elements.roomSpeedMinus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.speedIndex = (roomState.speedIndex - 1 + ROOM_SPEEDS.length) % ROOM_SPEEDS.length;
    renderRoomUI();
  });
  elements.roomSpeedPlus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.speedIndex = (roomState.speedIndex + 1) % ROOM_SPEEDS.length;
    renderRoomUI();
  });
  elements.roomBetMinus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.coinBet = clamp(roomState.coinBet - 100, 0, 5000);
    renderRoomUI();
  });
  elements.roomBetPlus?.addEventListener("click", () => {
    playUiClickSound();
    roomState.coinBet = clamp(roomState.coinBet + 100, 0, 5000);
    renderRoomUI();
  });
  elements.roomCreateButton?.addEventListener("click", () => {
    playUiClickSound();
    if (elements.roomStatusText) {
      elements.roomStatusText.textContent = `Room ready: ${roomState.laps} laps • ${roomState.opponents} opponents • ${ROOM_SPEEDS[roomState.speedIndex]} • ${roomState.coinBet} bet`;
    }
  });
  elements.garageSelectButton?.addEventListener("click", selectCurrentGarageCar);
  elements.garageBuyButton?.addEventListener("click", buyCurrentGarageCar);
  elements.garageCustomizeButton?.addEventListener("click", () => moveSkin(1));
  elements.graphicsToggleButton?.addEventListener("click", () => {
    toggleGraphicsPanel();
  });
  elements.graphicsOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyGraphicsMode(button.dataset.graphics || "cinematic");
      toggleGraphicsPanel(false);
    });
  });
  elements.exitGameButton?.addEventListener("click", () => {
    exitRaceToLobby();
  });
  elements.cameraToggleButton?.addEventListener("click", () => {
    gameState.cameraModeIndex = (gameState.cameraModeIndex + 1) % CAMERA_MODES.length;
    if (race3DEngine) race3DEngine.setCameraMode(gameState.cameraModeIndex);
    console.log("Camera mode changed", getCameraMode().label);
    updateRaceHud();
    if (appState.mode === "game") render();
  });
  elements.hornButton?.addEventListener("click", () => {
    window.AudioManager?.playHorn?.();
  });
  elements.pauseGameButton?.addEventListener("click", () => {
    togglePause();
  });
  elements.pauseControlCards.forEach((card) => {
    card.addEventListener("click", () => {
      setControlMode(card.dataset.controlMode || "arrow");
    });
  });
  elements.pauseMenuButton?.addEventListener("click", () => {
    exitRaceToLobby();
  });
  elements.pauseRestartButton?.addEventListener("click", () => {
    gameState.paused = false;
    gameState.running = false;
    if (elements.pauseOverlay) elements.pauseOverlay.classList.add("hidden");
    if (elements.pauseGameButton) elements.pauseGameButton.textContent = "Ⅱ";
    startGame().catch(console.error);
  });
  elements.pauseResumeButton?.addEventListener("click", () => {
    if (gameState.paused) togglePause();
  });
  elements.friendsToggle.addEventListener("click", () => {
    appState.friendsOpen = !appState.friendsOpen;
    renderFriendsPanel();
  });
}

function bindGameControls() {
  elements.controlButtons.forEach((button) => {
    const control = button.dataset.control;
    const activate = (event) => {
      event.preventDefault();
      if (!gameState.gameOver) setControlActive(control, true);
    };
    const deactivate = (event) => {
      event.preventDefault();
      setControlActive(control, false);
    };
    button.addEventListener("pointerdown", activate);
    button.addEventListener("pointerup", deactivate);
    button.addEventListener("pointercancel", deactivate);
    button.addEventListener("pointerleave", (event) => {
      if (event.buttons === 0) deactivate(event);
    });
  });

  window.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.repeat) return;
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setControlActive("left", true);
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setControlActive("right", true);
    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") setControlActive("accelerate", true);
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") setControlActive("brake", true);
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setControlActive("left", false);
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setControlActive("right", false);
    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") setControlActive("accelerate", false);
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") setControlActive("brake", false);
  });

  window.addEventListener("deviceorientation", (event) => {
    if (!tiltState.enabled) return;
    tiltState.gamma = clamp((event.gamma || 0), -30, 30);
    syncInputState();
  }, { passive: true });
}

function preloadBootAssets() {
  const assetsToLoad = [
    "assets/ui/loading-first.jpeg",
    "assets/ui/loading-second.jpeg",
    "assets/ui/splash-user.jpeg",
    ...Object.values(ASSETS.characters),
    ...ASSETS.cars.map((car) => car.src),
    ...AVATAR_LIBRARY.male,
    ...AVATAR_LIBRARY.female
  ];

  bootState.preloadPromise = Promise.all(
    assetsToLoad.map((src) =>
      loadImage(src).catch((error) => {
        console.warn(error.message);
        return null;
      })
    )
  ).finally(() => {
    bootState.assetsReady = true;
  });

  return bootState.preloadPromise;
}

function initializeApp() {
  window.AudioManager?.init?.();
  primeMobileLandscapeMode();
  bindLobbyEvents();
  bindGameControls();
  renderFriendsPanel();
  renderRoomUI();
  renderInviteList();
  renderGameModes();
  updateRaceSettingsUI();
  renderCountryCarousel();
  updateProfileSetupUI();
    updateLobbyUI();
    renderDailyRewardUI();
    updateGameCoinHud();
    updateRaceHud();
    updatePauseControlUI();
    updateMinimap();
  resizeCanvas();
  updateOrientationUI();
  preloadBootAssets();
  runLoadingSequence().catch((error) => {
    console.error("Boot sequence failed:", error);
    showSplash();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  const handleViewportResize = () => {
    const width = Math.round(window.visualViewport?.width || window.innerWidth);
    const height = Math.round(window.visualViewport?.height || window.innerHeight);
    resizeCanvas();
    updateOrientationUI();
    if (race3DEngine) {
      if (race3DEngine.renderer) {
        race3DEngine.renderer.setSize(window.innerWidth, window.innerHeight);
      }
      if (race3DEngine.camera) {
        race3DEngine.camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
        race3DEngine.camera.updateProjectionMatrix();
      }
      race3DEngine.resize(width, height);
    }
  };
  window.addEventListener("resize", handleViewportResize);
  window.visualViewport?.addEventListener("resize", handleViewportResize);
  window.visualViewport?.addEventListener("scroll", handleViewportResize);
});
