import React from "react";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { USE_MOCKS } from "./mocks";

export const AppLayout = () => {
  const { user } = useAuth();
  console.log("user", user);
  // Login is not enforced while running on mock data.
  if (!user && !USE_MOCKS) return <Navigate to="/login" replace />;

  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen={false}
        style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};
