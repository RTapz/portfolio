const CHANNEL = "portfolio-projects";

let broadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL);
    } catch {
      return null;
    }
  }
  return broadcastChannel;
}

export function notifyProjectsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("portfolio-order-updated"));
  getBroadcastChannel()?.postMessage("updated");
}

export function subscribeProjectsChanged(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onEvent = () => onChange();
  const onVisible = () => {
    if (document.visibilityState === "visible") onEvent();
  };

  window.addEventListener("portfolio-order-updated", onEvent);
  window.addEventListener("focus", onEvent);
  document.addEventListener("visibilitychange", onVisible);

  const channel = getBroadcastChannel();
  if (channel) {
    channel.onmessage = onEvent;
  }

  return () => {
    window.removeEventListener("portfolio-order-updated", onEvent);
    window.removeEventListener("focus", onEvent);
    document.removeEventListener("visibilitychange", onVisible);
    if (channel) {
      channel.onmessage = null;
    }
  };
}
