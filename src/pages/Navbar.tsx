import { useEffect, useRef, useState } from "react";
import {
  faChartLine,
  faUsers,
  faCalendarDays,
  faGear,
  faBars,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  return (
    <>
      {/* Mobile overlay (Not Done) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" />
      )}

      <aside
        ref={navRef}
        className={`
          z-50 h-screen bg-white border-r border-gray-200
          transition-all duration-300
          ${open ? "w-64" : "w-16"}
        `}
        onClick={() => !open && setOpen(true)}
      >
        <div className="flex flex-col h-full px-3 py-6">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-bold pl-2">
              {open ? "Overload" : <FontAwesomeIcon icon={faDumbbell} />}
            </h1>

            {/* Not Done */}
            <button
              className="md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setMobileOpen((prev) => !prev);
                setOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>

          <nav className="flex flex-col gap-y-2">
            <NavItem
              icon={faChartLine}
              label="Dashboard"
              open={open}
              onClick={() => navigate("/")}
            />
            <NavItem
              icon={faUsers}
              label="Clients"
              open={open}
              onClick={() => navigate("/clients")}
            />
            <NavItem
              icon={faCalendarDays}
              label="Sessions"
              open={open}
              onClick={() => navigate("/sessions")}
            />
          </nav>

          <div className="grow" />

          <NavItem
            icon={faGear}
            label="Settings"
            open={open}
            onClick={() => navigate("/settings")}
          />
        </div>
      </aside>
    </>
  );
};

const NavItem = ({
  icon,
  label,
  open,
  onClick,
}: {
  icon: any;
  label: string;
  open: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="flex items-center gap-x-3 px-3 py-2 rounded-lg
               text-gray-600 hover:bg-gray-100 cursor-pointer transition"
  >
    <FontAwesomeIcon icon={icon} className="text-lg min-w-5" />

    <span
      className={`whitespace-nowrap font-medium transition-opacity duration-200
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {label}
    </span>
  </div>
);

export default Navbar;
