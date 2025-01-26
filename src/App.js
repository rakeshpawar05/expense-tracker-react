import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./Auth/AuthContext";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
};

export default App;
