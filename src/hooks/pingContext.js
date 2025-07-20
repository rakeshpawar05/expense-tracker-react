import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { isServiceActive } from "../api/AxiosService";

const PingContext = createContext();

export const PingProvider = ({ children }) => {
  const [isBackendActive, setIsBackendActive] = useState(false);
  const [pinging, setPinging] = useState(true);
  const intervalRef = useRef(null);

  const checkBackendStatus = async () => {
    try {
      const response = await isServiceActive();
      const active = response.data === true;
      setIsBackendActive(active);
    } catch (error) {
      console.error("Backend check failed:", error.message);
      setIsBackendActive(false);
    }
  };

  const startPinging = () => {
    if (intervalRef.current) return;
    setPinging(true);
    checkBackendStatus(); // immediate check
    intervalRef.current = setInterval(checkBackendStatus, 0.2 * 60 * 1000);
  };

  const stopPinging = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPinging(false);
  };

  useEffect(() => {
    startPinging();
    return () => stopPinging();
  }, []);

  return (
    <PingContext.Provider
      value={{ isBackendActive, startPinging, stopPinging, pinging }}
    >
      {children}
    </PingContext.Provider>
  );
};

export const usePing = () => useContext(PingContext);
