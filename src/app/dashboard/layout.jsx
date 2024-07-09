"use client";
import React, { useEffect, useState, cloneElement } from "react";
import { Inter } from "next/font/google";
import "../globals.css";
import Responsivesidbar from "./components/responsivesidebar";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import Protected from "../_lib/hooks/useProtected";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Function to clone children elements with collapsed prop
  const renderChildrenWithProps = () => {
    return React.Children.map(children, (child) => {
      return cloneElement(child, { collapsed: sidebarCollapsed });
    });
  };

  const [lightMode, setLightMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") setLightMode(true);
  }, []);

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [lightMode]);
  return (
    <Protected>
      <div>
        <header className="antialiased border-b border-black-800 dark:border-[#3c4042] w-[-moz-available]">
          <Navbar onToggleSidebar={toggleSidebar} />

          {/* responsive navbar */}
          <Responsivesidbar collapsed={sidebarCollapsed} />
        </header>

        <button
          data-drawer-target="separator-sidebar"
          data-drawer-toggle="separator-sidebar"
          aria-controls="separator-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 text-sm text-gray-500 rounded-lg ms-3 sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>

        <div className="maincontent bg-gray-50 dark:bg-[#121212]">
          {/* sidebar */}
          <Sidebar onToggleSidebar={toggleSidebar}  collapsed= {sidebarCollapsed}/>

          <main className="bg-gray-50 dark:bg-[#121212]">
            <div
              className={`child-div ${
                sidebarCollapsed ? "sm:ml-44" : "sm:ml-8"
              } p-4 content`}
            >
              {renderChildrenWithProps()}
            </div>
          </main>
        </div>
      </div>
    </Protected>
  );
}
