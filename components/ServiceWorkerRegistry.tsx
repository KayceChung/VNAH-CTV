"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistry() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Small delay to ensure page is stable
      const timeout = setTimeout(() => {
        navigator.serviceWorker
          .register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          })
          .then((registration) => {
            console.log("✓ Service Worker registered successfully:", registration);

            // Check for updates regularly
            setInterval(() => {
              registration.update().catch((err) => {
                console.warn("Failed to check for SW updates:", err);
              });
            }, 60000); // Check every 60 seconds
          })
          .catch((error) => {
            console.error("✗ Service Worker registration failed:", error);
          });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, []);

  return null;
}
