// src/components/CookieConsent.js
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const CookieConsent = ({ onAccept }) => {
  const [cookies, setCookie] = useCookies(['userConsent']);
  const [showBanner, setShowBanner] = useState(false);

  // Verificar se o usuário já deu consentimento
  useEffect(() => {
    if (!cookies.userConsent) {
      setShowBanner(true);
    }
  }, [cookies]);

  const handleAccept = () => {
    setCookie('userConsent', true, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 ano
    setShowBanner(false);
    if (onAccept) onAccept(); // Executa callback se fornecido
  };

  const handleDecline = () => {
    setCookie('userConsent', false, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 ano
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={bannerStyle}>
      <p>Usamos cookies para melhorar sua experiência. Aceita nossos cookies?</p>
      <button onClick={handleAccept} style={buttonStyle}>Aceitar</button>
      <button onClick={handleDecline} style={buttonStyle}>Recusar</button>
    </div>
  );
};

const bannerStyle = {
  position: 'fixed',
  bottom: '10px',
  left: '10px',
  backgroundColor: '#333',
  color: '#fff',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 1000,
};

const buttonStyle = {
  margin: '5px',
  padding: '5px 10px',
  borderRadius: '3px',
  border: 'none',
  cursor: 'pointer',
};

export default CookieConsent;
