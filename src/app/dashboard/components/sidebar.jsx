'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdManageAccounts } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
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
      
      function buildTree(data, parentId = null) {
        const children = data.filter((node) => node.parent_id === parentId);
        return children.map((child) => ({
          id: child.id,
          permission_id: child.permission_id,
          parentNode: parentId,
          RightsCode: child.RightsCode,
          MenuTxtCode: child.MenuTxtCode,
          MenuName: child.MenuName,
          Description: child.Description,
          path: child.path,
          MenuLink: child.MenuLink,
          MenuOrder: child.MenuOrder,
          Enabled: child.Enabled,
          MenuPath: child.MenuPath,
          icon: child.icon,
          children: buildTree(data, child.id),
        }));
      }
      
      const organizationTableDataToTreeStructure = (organizationData) => {
        const rootNodes = organizationData.filter((node) => node.parent_id === null);
        const transformedData = rootNodes.map((root) => ({
          id: root.id,
          permission_id: root.permission_id,
          parentNode: null,
          RightsCode: root.RightsCode,
          MenuTxtCode: root.MenuTxtCode,
          MenuName: root.MenuName,
          Description: root.Description,
          path: root.path,
          MenuLink: root.MenuLink,
          MenuOrder: root.MenuOrder,
          Enabled: root.Enabled,
          MenuPath: root.MenuPath,
          icon: iconMapping[root.icon] || null, // Use iconMapping to select the icon component
          children: buildTree(organizationData, root.id),
        }));
        return transformedData;
      };
      
      useEffect(() => {
        if (!isLoading && !isError && SidebarList) {
          const menuItems = organizationTableDataToTreeStructure(SidebarList.sidebaritem);
          setMenuItems(menuItems);
        }
      }, [isLoading, isError, SidebarList, refetch]);

    return (
      <aside 
        id="separator-sidebar"
        className={`sidebar ${collapsed ? 'collapsed' : ''} fixed top-0 left-0 z-40 w-[60px] h-screen transition-transform -translate-x-full sm:translate-x-0 sidebarmain mt-[77px] border-r border-[#D7DAD3] dark:border-[#3c4042]`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-[#121212]">
          <ul className="space-y-2 font-medium">
              <div>
                <li className="navlink">
                  <Link
                    href='/dashboard'
                    onMouseEnter={() => setHoveredItem('Dashboard')}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c4042] group"                >
                    <span className='navitemicon'>
                      <MdSpaceDashboard className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'/>
                    </span>
                    <span className={`${collapsed ? 'block' : 'hidden'} ms-3`}>Dashboard</span>
                    <span className={`${collapsed ? 'hidden' : ''} ${hoveredItem === 'Dashboard' ? 'block' : 'hidden'} flex absolute ml-7 p-2.5 bg-[#fff] text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#3c4042]`}>Dashboard</span>
                  </Link>
                </li>
              </div>
            {menuItems.map(sidebaritem => (
              <div key={sidebaritem.id}>
                <li className="navlink" onClick={() => handleMenuClick(sidebaritem.id)}>
                  {/* <span className={`${collapsed ? '' : 'hoverspan'} ${hoveredItem === sidebaritem.MenuName ? 'block' : 'hidden'} hidden flex absolute ml-5 w-24 bg-[#fff] text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#121212]`}>{sidebaritem.MenuName}</span> */}
                  <Link
                    href={sidebaritem.MenuLink}
                    onMouseEnter={() => setHoveredItem(sidebaritem.MenuName)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c4042] group"                >
                    <span className='navitemicon'>
                      {React.cloneElement(sidebaritem.icon, {
                        className: `w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white`,
                      })}
                    </span>
                    <span className={`${collapsed ? 'block' : 'hidden'} ms-3`}>{sidebaritem.MenuName}</span>
                    <span className={`${collapsed ? 'hidden' : ''} ${hoveredItem === sidebaritem.MenuName ? 'block' : 'hidden'} flex absolute ml-7 p-2.5 w-[max-content] bg-[#fff] text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#3c4042]`}
                    >{sidebaritem.MenuName}</span>
                      {sidebaritem.children && hoveredItem === sidebaritem.MenuName && (
                        <ul className={`${collapsed ? 'hidden' : 'block'} absolute ml-12 mt-20 bg-white dark:bg-[#3c4042] rounded-lg shadow-lg`}>
                          {sidebaritem.children.map(submenu1 => (
                            <li key={submenu1.id} onClick={() => handleSubMenuClick(submenu1.id)}>
                              <Link href={submenu1.MenuLink} className="block p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                {submenu1.MenuName}
                              </Link>
                              {/* Handling sub-submenu */}
                              {submenu1.children && (
                                <ul className="ml-8">
                                  {submenu1.children.map(subsubmenu => (
                                    <li key={subsubmenu.id} onClick={() => handleSubMenuClick(subsubmenu.id)}>
                                      <Link href={subsubmenu.MenuLink} className="block p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        {subsubmenu.MenuName}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                  </Link>
                  {sidebaritem.children && (
                    <ul className="ml-9">
                      {sidebaritem.children.map(submenu1 => (
                        <div key={submenu1.id}>
                          <li onClick={() => handleSubMenuClick(submenu1.id)}>
                            <Link
                              href={submenu1.MenuLink}
                              className={`${collapsed ? '' : 'hidden'} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                            >
                              <span className={`${collapsed ? '' : 'hidden'} ms-3`}>{submenu1.MenuName}</span>
                            </Link>
                            {submenu1.children && (
                              <ul className="ml-16">
                                {submenu1.children.map(subsubmenu => (
                                  <div key={subsubmenu.id}>
                                    <span className={`${collapsed ? '' : 'hoverspansubsub'} hidden flex absolute ml-5 w-24 bg-[#fff] text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-[#121212]`}>{subsubmenu.MenuName}</span>
                                    <li className={`${collapsed ? 'subnavlink' : 'hidden'}`} onClick={() => handleSubMenuClick(subsubmenu.id)}>
                                      <Link
                                        href={subsubmenu.MenuLink}
                                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                      >
                                        <span className="ms-3">{subsubmenu.MenuName}</span>
                                      </Link>
                                    </li>
                                  </div>
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