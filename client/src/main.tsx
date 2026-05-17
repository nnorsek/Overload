import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext"
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-neutral-100 w-screen h-screen">
        <AuthProvider>
      <App />
        </AuthProvider>
    </div>
  </StrictMode>,
);
