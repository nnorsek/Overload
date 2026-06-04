import Navbar from "./pages/Navbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      {/* Sidebar */}
      <Navbar open={navOpen} setOpen={setNavOpen} />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
