const STORAGE_KEY = "udaan:site-update";
const EVENT_NAME = "udaan:site-update";
const CHANNEL_NAME = "udaan-site-update";

function getBrowserChannel() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  return new BroadcastChannel(CHANNEL_NAME);
}

export function notifySiteUpdate(scope = "public-content") {
  if (typeof window === "undefined") return;

  const payload = {
    scope,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error(error);
  }

  try {
    const channel = getBrowserChannel();
    channel?.postMessage(payload);
    channel?.close();
  } catch (error) {
    console.error(error);
  }

  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
}

export function subscribeSiteUpdates(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const runCallback = () => {
    try {
      callback?.();
    } catch (error) {
      console.error(error);
    }
  };

  const customHandler = () => runCallback();
  const storageHandler = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      runCallback();
    }
  };

  window.addEventListener(EVENT_NAME, customHandler);
  window.addEventListener("storage", storageHandler);

  const channel = getBrowserChannel();
  if (channel) {
    channel.onmessage = () => runCallback();
  }

  return () => {
    window.removeEventListener(EVENT_NAME, customHandler);
    window.removeEventListener("storage", storageHandler);
    channel?.close();
  };
}

export function attachLiveRefresh(refetch, { intervalMs = 15000 } = {}) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const safeRefetch = () => {
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      refetch?.();
    }
  };

  const unsubscribe = subscribeSiteUpdates(safeRefetch);
  const focusHandler = () => safeRefetch();
  const visibilityHandler = () => {
    if (document.visibilityState === "visible") {
      safeRefetch();
    }
  };

  window.addEventListener("focus", focusHandler);
  document.addEventListener("visibilitychange", visibilityHandler);

  const intervalId = window.setInterval(() => {
    safeRefetch();
  }, intervalMs);

  return () => {
    unsubscribe();
    window.removeEventListener("focus", focusHandler);
    document.removeEventListener("visibilitychange", visibilityHandler);
    window.clearInterval(intervalId);
  };
}
