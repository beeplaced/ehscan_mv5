import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import './style/index.css'
import './style/app.css'
import './style/images.css'
import './style/dialog.css'
import './style/tools.css'
import 'swiper/css';
import './localStorageHandler';


import App from './App'
const container = document.getElementById('root')!;
const root = createRoot(container);

import { ImageRenderer } from './data/images'; const ImageData = new ImageRenderer();
const serviveUrl = '/service-worker.js'

const Main = () => {
    const [loading, setLoading] = useState(true);
      
    useEffect(() => {
      (async () => {
        if ('serviceWorker' in navigator) {
          try {
            // Register the service worker
            const registration = await navigator.serviceWorker.register(serviveUrl);
            //console.log('Service worker registered successfully:', registration);
            // Check if an update is needed
            registration.update();
            // Handle updates to the service worker
            registration.onupdatefound = () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.onstatechange = () => {
                  // Log the state change when a new worker is found
                  console.log('New worker state change:', newWorker.state);
                  if (newWorker.state === 'installed') {
                    console.log('New service worker installed. Ready for activation.');
                  }
                };
              }
            };
          } catch (error) {
            console.error('Service worker registration failed:', error);
          }
        }
      })();
    }, []);

      useEffect(() => {
      (async () => {
        // await ImageData.initBlobs()
        // classMap.set('ImageData', ImageData);
        setLoading(false)
      })();
    }, []);

    return (
        <>
            {loading ? <div>SplashScreen</div> : 
            <App />
          }
        </>
    );
};

root.render(<Main />);