(function initMain(global) {
  const FALLBACK_GRADIENT = "linear-gradient(180deg, #050505 0%, #1a1a1a 100%)";

  function normalizeAssetUrl(url) {
    const value = String(url || "").trim();
    if (!value) return value;
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) return value;
    if (value.startsWith("./")) return value;
    if (value.startsWith("/")) return `.${value}`;
    if (value.startsWith("assets/")) return `./${value}`;
    return value;
  }

  function setFallbackBackgroundFor(el) {
    const screen = el.closest?.(".app-screen") || el.closest?.("section") || el.parentElement;
    if (!screen) return;
    screen.classList.add("asset-fallback");
    if (!screen.style.background) screen.style.background = FALLBACK_GRADIENT;
  }

  function wireImgFallback(img) {
    if (!img || img.__fallbackWired) return;
    img.__fallbackWired = true;
    const src = img.getAttribute("src");
    if (src) img.setAttribute("src", normalizeAssetUrl(src));
    img.addEventListener("error", () => {
      img.style.display = "none";
      setFallbackBackgroundFor(img);
    }, { once: true });
  }

  function wireVideoFallback(video) {
    if (!video || video.__fallbackWired) return;
    video.__fallbackWired = true;

    const poster = video.getAttribute("poster");
    if (poster) video.setAttribute("poster", normalizeAssetUrl(poster));

    video.querySelectorAll?.("source").forEach((source) => {
      const src = source.getAttribute("src");
      if (src) source.setAttribute("src", normalizeAssetUrl(src));
    });

    video.addEventListener("error", () => {
      video.style.display = "none";
      setFallbackBackgroundFor(video);
    });
  }

  function preloadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ ok: true, url });
      img.onerror = () => resolve({ ok: false, url });
      img.src = normalizeAssetUrl(url);
    });
  }

  function preloadVideo(url) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.onloadedmetadata = () => resolve({ ok: true, url });
      video.onerror = () => resolve({ ok: false, url });
      video.src = normalizeAssetUrl(url);
    });
  }

  async function runPreload() {
    const loadingPercent = document.getElementById("loadingPercent");
    const loadingBarFill = document.getElementById("loadingBarFill");
    const loadingText = document.getElementById("loadingText");

    const domImages = Array.from(document.querySelectorAll("img[src]"))
      .map((img) => img.getAttribute("src"))
      .filter(Boolean);

    const domVideos = Array.from(document.querySelectorAll("video source[src]"))
      .map((source) => source.getAttribute("src"))
      .filter(Boolean);

    const avatarLibrary = global.AVATAR_LIBRARY ? Object.values(global.AVATAR_LIBRARY).flat() : [];
    const urls = [
      ...domImages,
      ...domVideos,
      ...avatarLibrary
    ].map(normalizeAssetUrl);

    const unique = Array.from(new Set(urls)).filter((u) => u && u.includes("./assets/"));
    if (!unique.length) return;

    const tasks = unique.map((u) => {
      if (u.endsWith(".mp4") || u.includes(".mp4")) return () => preloadVideo(u);
      return () => preloadImage(u);
    });

    let done = 0;
    let failures = 0;

    for (const task of tasks) {
      const result = await task();
      done += 1;
      if (!result.ok) failures += 1;

      const pct = Math.floor((done / tasks.length) * 100);
      if (loadingBarFill) loadingBarFill.style.width = `${pct}%`;
      if (loadingPercent) loadingPercent.textContent = `${pct}%`;
      if (loadingText) loadingText.textContent = failures ? `Recovering missing assets (${failures})...` : "Loading assets...";
    }
  }

  function normalizeDomAssetUrls() {
    document.querySelectorAll("img[src]").forEach((img) => {
      img.setAttribute("src", normalizeAssetUrl(img.getAttribute("src")));
      wireImgFallback(img);
    });
    document.querySelectorAll("video").forEach((video) => wireVideoFallback(video));
    document.querySelectorAll("[style]").forEach((node) => {
      const bg = node.style.backgroundImage || "";
      if (bg.includes("url(\"assets/") || bg.includes("url('assets/") || bg.includes("url(assets/")) {
        node.style.backgroundImage = bg.replaceAll("url(\"assets/", "url(\"./assets/").replaceAll("url('assets/", "url('./assets/").replaceAll("url(assets/", "url(./assets/");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    normalizeDomAssetUrls();
    // Keep this lightweight; script.js still drives the main flow.
    runPreload().catch(() => {});
  });
})(window);

