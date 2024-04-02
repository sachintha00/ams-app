'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdDashboard } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { RiInboxArchiveFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";

const menuItems = [
  {
    id: 1,
    name: "Dashboard",
    href: "/",
    icon: MdDashboard,
  },
  {
    id: 2,
    name: "Payment",
    href: "/dashboard/form",
    icon: MdOutlinePayment,
  },
  {
    id: 3,
    name: "User Groups",
    href: "/dashboard/usergroups",
    icon: FaUsers,
  },
  {
    id: 4,
    name: "Inbox",
    href: "/dashboard/users",
    icon: RiInboxArchiveFill,
  },
  {
    id: 5,
    name: "Products",
    href: "#",
    icon: MdOutlineProductionQuantityLimits,
    subMenu: [
      { id: 51,
        title: 'All Products',
        path: '#',
        subMenu: [
          { id: 512, title: 'Prmiume', path: '#' },
          { id: 513, title: 'Single', path: '#' },
        ] 
      },
      { id: 52,
        title: 'Add New Product',
        path: '#',
      },
    ],
  },
  {
    id: 6,
    name: "Sign In",
    href: "#",
    icon: FaSignInAlt,
  },
  {
    id: 7,
    name: "Sign Up",
    href: "#",
    icon: IoLogIn,
  },
]

const Sidebar = ({ collapsed, onToggleSidebar }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [openMenu, setOpenMenu] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if (theme === "dark") setDarkMode(true)
      }, [])
    
      useEffect(() =>{
        if (darkMode) {
          document.documentElement.classList.add('dark')
          localStorage.setItem("theme", "dark")
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem("theme", "light")
        }
      }, [darkMode])

      const handleMenuClick = (menuId) => {
        setOpenMenu(menuId);
      };
    
      const handleSubMenuClick = (subMenuId) => {
        setOpenSubMenu(subMenuId);
      };

    return (
        <aside 
        id="separator-sidebar"
        className={`sidebar ${collapsed ? 'collapsed' : ''} fixed top-0 left-0 z-40 w-[60px] h-screen transition-transform -translate-x-full sm:translate-x-0 sidebarmain mt-[77px] border-r border-[#D7DAD3] dark:border-[#3c4042]`}
        aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-[#121212]">
          <ul className="space-y-2 font-medium">
            {menuItems.map(({ id, name, href, icon: Icon, subMenu }) => (
              <div className={`${collapsed ? '' : 'mainnavlink'}`}>
                <li className="navlink" onClick={() => handleMenuClick(id)}>
                  <span className={`${collapsed ? '' : 'hoverspan'} hidden flex absolute ml-5 w-24 bg-[#fff] text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#121212]`}>{name}</span>
                  <Link
                    href={href}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c4042] group"
                  >
                    <span className='navitemicon'>
                      <Icon className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'/>
                    </span>
                    <span className={`${collapsed ? 'block' : 'hidden'} ms-3`}>{name}</span>
                  </Link>
                  {openMenu === id && subMenu && (
                    <ul>
                      {subMenu.map(({ id, title, path, subMenu }) => (
                        <div>
                          <span className={`${collapsed ? '' : 'hoverspansub'} hidden flex absolute ml-5 w-24 bg-[#fff] text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#121212]`}>{name}</span>
                          <li className={`${collapsed ? 'subnavlink' : 'hidden'}`} key={id} onClick={() => handleSubMenuClick(id)}>
                            <Link
                              href={path}
                              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                              <span className="ms-3">{title}</span>
                            </Link>

                            {openSubMenu === id && subMenu && (
                              <ul>
                                {subMenu && subMenu.map(({ id, title, path }) => (
                                  <li key={id} className='subnavlink'>
                                    <Link 
                                      href={path}
                                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                      <span className="ms-3">{title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        </div>
                      ))}
                    </ul>
                  )}
                </li>
              </div>
            ))}
          </ul>
        </div>
        </aside>
    );
};

export default Sidebar;