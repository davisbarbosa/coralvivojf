import ReactGA from 'react-ga4';
import { useCookies } from 'react-cookie';
import { useEffect, useCallback } from 'react';

const trackingId = 'G-LKG7J3LF0P'; // Substitua pelo seu Measurement ID

const useAnalytics = () => {
  const [cookies] = useCookies(['userConsent']);

  useEffect(() => {
    if (cookies.userConsent && !ReactGA.isInitialized) {
      ReactGA.initialize(trackingId);
      ReactGA.isInitialized = true; // Evita múltiplas inicializações
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    }
  }, [cookies]);

  const sendLocationData = useCallback((latitude, longitude) => {
    if (cookies.userConsent) {
      ReactGA.event({
        category: 'User Location',
        action: 'Shared Location',
        label: `Lat: ${latitude}, Lng: ${longitude}`,
      });
    } else {
      console.warn('User consent not provided. Location data not sent.');
    }
  }, [cookies]);

  return { sendLocationData };
};

export default useAnalytics;
