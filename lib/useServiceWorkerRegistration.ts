/**
 * Service Worker Registration Hook
 * Registers the PWA service worker for offline support
 */

import { useEffect } from 'react';

export function useServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only register in production
    if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_REGISTER_SW) {
      return;
    }

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('Service Worker registered:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New version available - page will update on refresh');
            }
          });
        });
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    };

    // Delay registration to ensure page is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', registerServiceWorker);
    } else {
      registerServiceWorker();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', registerServiceWorker);
    };
  }, []);
}
