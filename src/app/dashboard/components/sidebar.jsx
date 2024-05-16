'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdManageAccounts, MdSpaceDashboard, MdOutlineChevronRight, MdOutlineChevronLeft } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { VscServerProcess } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useSidebarListQuery } from '@/app/_lib/redux/features/sidebar/sidebar_api';

const Sidebar = ({ collapsed, onToggleSidebar }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [openMenu, setOpenMenu] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleMenuClick = (menuId) => {
    setOpenMenu(menuId);
  };

  const handleSubMenuClick = (subMenuId) => {
    setOpenSubMenu(subMenuId);
  };

      const iconMapping = {
        MdManageAccounts: <MdManageAccounts />,
        GrDocumentConfig: <GrDocumentConfig />,
        VscServerProcess: <VscServerProcess />,
        // Add more icons here as needed
      };

      // sidebar list
      const [menuItems, setMenuItems] = useState([]);

      const {
        data: SidebarList,
        isLoading,
        isError,
        error,
        refetch,
      } = useSidebarListQuery();
      
  // Update buildTree function to check for null or undefined
  function buildTree(data, parentId = null) {
    const children = data.filter((node) => node && node.parent_id === parentId);
    return children.map((child) => ({
      id: child.id,
      permission_id: child.permission_id,
      parentNode: parentId,
      menuname: child.menuname,
      menulink: child.menulink,
      icon: child.icon,
      children: buildTree(data, child.id),
    }));
  }

  // Update organizationTableDataToTreeStructure function to check for null or undefined
  const organizationTableDataToTreeStructure = (organizationData) => {
    const rootNodes = organizationData.filter((node) => node && node.parent_id === null);
    const transformedData = rootNodes.map((root) => ({
      id: root.id,
      permission_id: root.permission_id,
      parentNode: null,
      menuname: root.menuname,
      menulink: root.menulink,
      icon: iconMapping[root.icon] || null, // Use iconMapping to select the icon component
      children: buildTree(organizationData, root.id),
    }));
    return transformedData;
  };

  useEffect(() => {
    if (!isLoading && !isError && SidebarList && SidebarList.sidebaritem) {
      const menuItems = organizationTableDataToTreeStructure(SidebarList.sidebaritem);
      setMenuItems(menuItems);
    }
  }, [isLoading, isError, SidebarList, refetch]);

  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const handleMenuItemClick = (menuItem) => {
    if (activeMenuItem === menuItem) {
      setActiveMenuItem(null); // Hide children if clicked on active menu item again
    } else {
      setActiveMenuItem(menuItem);
    }
  };

    return (
        <aside
          id="sidebar-multi-level-sidebar"
          className={`sidebar ${collapsed ? 'collapsed' : ''} fixed top-0 left-0 z-40 w-[60px] h-screen transition-transform -translate-x-full sm:translate-x-0 sidebarmain mt-[57px] border-r border-[#D7DAD3] dark:border-[#3c4042]`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-[#121212]">
            <button
              className={`rounded-full bg-white opacity-100 text-white p-1 absolute top-4px right-[-12px] transition-colors duration-300 hover:bg-[#213389] hover:text-white flex items-center justify-center dark:bg-gray-400 dark:text-white dark:hover:bg-[#213389]`}
              onClick={onToggleSidebar}
              style={{ width: '24px', height: '24px', border: '1px solid #D7DAD3' }}
            >
              {collapsed ? <MdOutlineChevronLeft className='hover:text-white dark:text-white'/> : <MdOutlineChevronRight className='hover:text-white dark:text-white'/>}
            </button>
            <ul className="space-y-2 font-medium">
              <li>
                <Link
                  href='/dashboard'
                  onMouseEnter={() => setHoveredItem('Dashboard')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c4042] group opacity-90"
                >
                    <span className='navitemicon'>
                      <MdSpaceDashboard className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'/>
                    </span>
                    <span className={`${collapsed ? 'block' : 'hidden'} ms-3 text-sm font-light`}>Dashboard</span>
                    <span className={`${collapsed ? 'hidden' : ''} ${hoveredItem === 'Dashboard' ? 'block' : 'hidden'} shadow flex absolute ml-6 p-2.5 text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#3c4042] text-sm font-light w-56`}>Dashboard</span>
                </Link>
              </li>

              {menuItems.map(sidebaritem => (
                <li key={sidebaritem.id} onClick={() => handleMenuItemClick(sidebaritem.id)} onMouseEnter={() => setHoveredItem(sidebaritem.menuname)} onMouseLeave={() => setHoveredItem(null)} className={`${collapsed ? '' : 'flex'}`}>
                  <Link
                    href={sidebaritem.menulink}
                    className="flex justify-between items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-[#3c4042]"
                    aria-controls="dropdown-example"
                    data-collapse-toggle="dropdown-example"
                  >
                    <div className='flex justify-start w-10'> 
                      <span className='navitemicon'>
                        {React.cloneElement(sidebaritem.icon, {
                          className: `w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white`,
                        })}
                      </span>
                      <span className={`${collapsed ? 'block' : 'hidden'} ms-3 text-sm font-light`}>{sidebaritem.menuname}</span>
                    </div>
                    {activeMenuItem === sidebaritem.id ? <IoIosArrowUp className='text-sm'/> : <IoIosArrowDown className='text-sm'/>}
                  </Link>
                  <Link
                    href={sidebaritem.menulink}>
                        <span className={`${collapsed ? 'hidden' : ''} ${hoveredItem === sidebaritem.menuname ? 'block' : 'hidden'} flex shadow absolute p-2.5 text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#3c4042] justify-between items-center opacity-90 text-sm font-light w-56`}
                          >{sidebaritem.menuname}
                                <svg
                                  className="w-3 h-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 10 6"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 4 4 4-4"
                                  />
                                </svg>
                        </span>
                  </Link>
                  {sidebaritem.children && (
                    <ul id="dropdown-example" className={`${collapsed ? 'hidden' : 'block'} ${hoveredItem === sidebaritem.menuname ? 'block' : 'hidden'} shadow absolute p-2.5 text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#3c4042] justify-between items-center ml-12 mt-10 opacity-90 w-[210px]`}>
                        {sidebaritem.children.map(submenu1 => (
                            <li key={submenu1.id}>
                              <Link
                                href={submenu1.menulink}
                                className="flex items-center justify-between w-full text-gray-900 transition duration-75 rounded-lg group dark:text-white text-sm mt font-light p-1"
                              >
                                {submenu1.menuname}
                              </Link>
                            </li>       
                        ))}
                    </ul>
                  )}

                  {/* collapsed */}
                  {sidebaritem.children && activeMenuItem === sidebaritem.id && (
                  <ul id="dropdown-example" className={`${collapsed ? 'block' : 'hidden'} py-2 space-y-2`}>
                    {sidebaritem.children.map(submenu1 => (
                    <li key={submenu1.id}>
                      <Link
                        href={submenu1.menulink}
                        className="flex items-center justify-between w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm font-light"
                      >
                        {submenu1.menuname}
                      </Link>
                      {submenu1.children && (
                        <ul id="dropdown-example" className={`${collapsed ? 'block' : 'hidden'} py-2 space-y-2`}>
                          {submenu1.children.map(subsubmenu => (
                             <li key={subsubmenu.id}>
                                <Link
                                  href={subsubmenu.menulink}
                                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm font-light"
                                >
                                  {subsubmenu.menuname}
                                </Link>
                             </li>
                          ))}
                        </ul>
                      )}
                    </li>
                    ))}
                  </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
    );
};

export default Sidebar;