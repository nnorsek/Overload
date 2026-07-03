import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Calendar, Dumbbell, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Sun, Moon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Clients", icon: Users, path: "/clients" },
  { label: "Sessions", icon: Calendar, path: "/sessions" },
  { label: "Exercises", icon: Dumbbell, path: "/exercises" },
  { label: "Workouts", icon: Dumbbell, path: "/workouts"}
]

export const AppSidebar = () => {
  const navigate = useNavigate()
  const { setOpen } = useSidebar()
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev);

  const logout = () => {
    localStorage.removeItem("auth")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return (
    <Sidebar collapsible="icon" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
              <h1 className="font-bold text-2xl ml-4 mt-4 group-data-[collapsible=icon]:hidden">Overload</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton onClick={() => navigate(item.path)} className="text-base cursor-pointer [&_svg]:size-5">
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/settings")} className="text-base cursor-pointer [&_svg]:size-5">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-base cursor-pointer [&_svg]:size-5">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme} className="text-base cursor-pointer [&_svg]:size-5">
              {isDark ? <Sun /> : <Moon />}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
