import React, { useState } from "react";
import { usePWAInstall } from "../lib/usePWAInstall";
import { Download, Share2, PlusSquare, X } from "lucide-react";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
        title="Install CurateCV as a native desktop or mobile app"
      >
        <Download className="w-3.5 h-3.5 text-indigo-300 group-hover:scale-110 transition-transform" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-stone-900 text-base">
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 font-bold text-stone-800">
                    1
                  </div>
                  <div>
                    Tap the{" "}
                    <Share2 className="inline w-3.5 h-3.5 text-indigo-600 mx-0.5" />{" "}
                    <strong>Share</strong> button in Safari's bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 font-bold text-stone-800">
                    2
                  </div>
                  <div>
                    Scroll down and tap{" "}
                    <PlusSquare className="inline w-3.5 h-3.5 text-indigo-600 mx-0.5" />{" "}
                    <strong>Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 font-bold text-stone-800">
                    3
                  </div>
                  <div>
                    Tap <strong>Add</strong> in the top-right corner to launch
                    CurateCV anytime with offline speed.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
