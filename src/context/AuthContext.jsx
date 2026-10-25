import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from '../api/authApi';
import { getMonthNamesApi } from '../api/monthApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(() => {
    const saved = localStorage.getItem('userDetails');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { userId: null, name: '', token: '' };
      }
    }
    return { userId: null, name: '', token: '' };
  });

  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const [availableMonths, setAvailableMonths] = useState([]);
  const [loadingMonths, setLoadingMonths] = useState(false);

  const isLogged = Boolean(userDetails?.token && userDetails?.userId);

  const fetchMonths = async (userId) => {
    if (!userId) return;
    try {
      setLoadingMonths(true);
      const res = await getMonthNamesApi(userId);
      if (Array.isArray(res.data)) {
        setAvailableMonths(res.data);
        if (res.data.length > 0 && !res.data.includes(currentYearMonth)) {
          // If current month is not in list but list has items, default to the latest available month
          setCurrentYearMonth(res.data[res.data.length - 1]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch available months:', err);
    } finally {
      setLoadingMonths(false);
    }
  };

  useEffect(() => {
    if (userDetails?.userId) {
      fetchMonths(userDetails.userId);
    }
  }, [userDetails?.userId]);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    const data = response.data;
    const user = {
      userId: data.userId,
      name: data.name,
      token: data.token,
    };
    setUserDetails(user);
    localStorage.setItem('jwtToken', data.token);
    localStorage.setItem('userDetails', JSON.stringify(user));

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const defaultYm = `${year}-${month}`;
    setCurrentYearMonth(defaultYm);

    await fetchMonths(data.userId);
    return data;
  };

  const logout = () => {
    setUserDetails({ userId: null, name: '', token: '' });
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userDetails');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        userDetails,
        currentYearMonth,
        setCurrentYearMonth,
        availableMonths,
        fetchMonths,
        login,
        logout,
        loadingMonths,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
