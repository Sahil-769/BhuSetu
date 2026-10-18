"use client";
import React from "react";
import "./sidebar.css";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { useLayout } from "./layoutContext";
import SidebarConfig from "../../config/sidebar.config";
const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, showNavbar, setShowNavbar } =
    useLayout();
  const navRef = React.useRef(null);

  const currentRole = pathname?.startsWith("/roles/project-officer")
    ? "project-officer"
    : pathname?.startsWith("/roles/LandAcqOfficer")
      ? "LandAcqOfficer"
        : pathname?.startsWith("/roles/super-admin")
          ? "super-admin"
          : pathname?.startsWith("/roles/admin")
            ? "admin"
            : "nodal-officer";

  const currentRoleData =
    SidebarConfig.roles[currentRole];
  const tabs = currentRoleData.tabs;
  const logo = currentRoleData.profileImg || "/images/logo.png";

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setShowNavbar(false);
      }
    };

    if (showNavbar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNavbar, setShowNavbar]);

  const normalizePath = (path) => path?.replace(/\/+$/, "") || "/";

  const isActive = (url) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(url);

    const rootMatches = {
      "/roles/LandAcqOfficer": ["/roles/LandAcqOfficer", "/roles/LandAcqOfficer/dashboard"],
      "/roles/project-officer": ["/roles/project-officer", "/roles/project-officer/dashboard"],
      "/roles/nodal-officer": ["/roles/nodal-officer", "/roles/nodal-officer/dashboard"],
      "/roles/admin": ["/roles/admin", "/roles/admin/dashboard"],
      "/roles/super-admin": ["/roles/super-admin", "/roles/super-admin/dashboard"],
    };

    if (rootMatches[targetPath]) {
      return rootMatches[targetPath].includes(currentPath);
    }

    if (currentPath === targetPath) {
      return true;
    }

    return currentPath.startsWith(`${targetPath}/`);
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {showNavbar && (
        <div
          className="fixed inset-0 bg-black/50 z-80 md:hidden"
          onClick={() => setShowNavbar(false)}
        />
      )}

      <nav
        ref={navRef}
        className={`fixed left-0 top-0 z-90 transition-transform duration-300 ease-in-out
        ${showNavbar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <aside
  className={`bg-black text-[#e6eef6] h-screen p-5 overflow-y-auto transition-all duration-200 ${
    isCollapsed ? "w-20" : "w-64"
  }`}
>
          <div className="flex flex-col gap-4 h-full">
            {/* Profile Section */}
            <Link href="/">
            <div
              className={`profile_info flex items-center gap-3 ${isCollapsed ? "" : "px-3 py-3"} rounded-3xl bg-linear-to-br from-slate-800/80 to-slate-950/80 shadow-xl ring-1 ring-white/10 mb-3 ${isCollapsed ? "justify-center" : ""} transition-all duration-300`}
            >
              
              <div className={`relative shrink-0 rounded-2xl ${isCollapsed ? "p-1 border border-white/10 bg-slate-900 " :" " } `}>
                <Image
                  src={logo}
                  alt={`${currentRole}_profile`}
                  width={15}
                  height={25}
                  className="h-10 w-10 object-cover shadow-sm"
                />
              </div>
               {!isCollapsed && (
                <div className="min-w-0">
                <h1>BHOOMI-AI</h1>
                </div>
               )}
            </div>
               </Link>

            {/* Toggle Button */}
            <button
              onClick={toggleNavbar}
              className="sidebar-nav-link hover:bg-white/10 transition-all duration-200 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium border border-white/10 animation-bounce"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="text-lg">
                {isCollapsed ? <FaArrowRight /> : <FaArrowLeftLong />}
              </span>
            </button>

            {/* Navigation Links */}
            <nav className="mt-1">
              <ul className="flex flex-col">
                {tabs.map((tab, index) => (
                  <li
                    key={index}
                    className={`sidebar-nav-link ${isActive(tab.url) ? "active" : ""} ${
                      isCollapsed ? "justify-center text-center" : ""
                    }`}
                    title={isCollapsed ? tab.name : ""}
                  >
                    
                    <Link
                      className={`w-full h-full flex gap-2.5 text-[14px] capitalize ${
                        isCollapsed
                          ? "justify-center py-[0.7rem] pl-[0.37rem] pr-2 text-lg"
                          : "py-[0.6rem] pl-8 pr-3"
                      }`}
                      href={tab.url}
                    ><span>{tab.icon}</span>
                      {!isCollapsed && tab.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </nav>
    </>
  );
}

export default Sidebar;