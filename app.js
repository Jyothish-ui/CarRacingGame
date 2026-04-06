(function attachAppUI(global) {
  const AppUI = {
    toastTimeout: 0,

    ensureAudioReady() {
      window.AudioManager?.init?.();
    },

    showToast(message, variant = "default") {
      const toast = document.getElementById("appToast");
      if (!toast) return;
      toast.textContent = message;
      toast.dataset.variant = variant;
      toast.classList.add("is-visible");
      clearTimeout(this.toastTimeout);
      this.toastTimeout = window.setTimeout(() => {
        toast.classList.remove("is-visible");
      }, 1800);
    }
  };

  global.AppUI = AppUI;
})(window);
