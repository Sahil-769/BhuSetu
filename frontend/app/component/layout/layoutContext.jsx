"use client";
import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  return (
    <LayoutContext.Provider
      value={{ isCollapsed, setIsCollapsed, showNavbar, setShowNavbar }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);