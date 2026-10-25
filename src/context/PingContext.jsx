import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { isServiceActiveApi } from '../api/authApi';

const PingContext = createContext();

export const usePing = () => useContext(PingContext);

export const PingProvider = ({ children }) => {
  const [isBackendActive, setIsBackendActive] = useState(false);
  const [lastPingTime, setLastPingTime] = useState(null);
  const intervalRef = useRef(null);

  const checkPing = async () => {
    try {
      const res = await isServiceActiveApi();
      setIsBackendActive(res.data === true);
      setLastPingTime(new Date());
    } catch (err) {
      setIsBackendActive(false);
    }
  };

  useEffect(() => {
    checkPing();
    intervalRef.current = setInterval(checkPing, 30000); // ping every 30 seconds
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <PingContext.Provider value={{ isBackendActive, lastPingTime, checkPing }}>
      {children}
    </PingContext.Provider>
  );
};
