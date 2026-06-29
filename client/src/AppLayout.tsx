import React from "react"
import { AppSidebar } from "./components/AppSidebar"
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"
import { TooltipProvider } from "./components/ui/tooltip"
import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

export const AppLayout = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />


  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false} style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
