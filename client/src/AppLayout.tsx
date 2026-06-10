import React from "react"
import { AppSidebar } from "./components/AppSidebar"
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"
import { TooltipProvider } from "./components/ui/tooltip"
import { Outlet } from "react-router-dom"

export const AppLayout = () => {
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
