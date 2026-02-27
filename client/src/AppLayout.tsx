import Navbar from "./pages/Navbar";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

export const AppLayout = () => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Navbar open={navOpen} setOpen={setNavOpen} />

      {/* Page content */}
      <main className="flex-1 p-6">
        <Dashboard />
      </main>
    </div>
  );
};
