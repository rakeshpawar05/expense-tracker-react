export const isAuthenticated = () => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("jwtToken");
    return token ? true : false;
  };
  
  export const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("jwtToken");
  };