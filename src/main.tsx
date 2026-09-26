import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register PWA service worker with auto-update for offline capabilities and high performance
if ("serviceWorker" in navigator) {
  registerSW({ immediate: true });
}

// Suppress benign ResizeObserver notifications loop errors that occur during rapid DOM layout recalculations
window.addEventListener("error", (event) => {
  if (
    event.message &&
    (event.message.includes(
      "ResizeObserver loop completed with undelivered notifications",
    ) ||
      event.message.includes("ResizeObserver loop limit exceeded"))
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
