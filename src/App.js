import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./Auth/AuthContext";
import { PingProvider } from "./hooks/pingContext";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <PingProvider>
          <AppRoutes />
        </PingProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
