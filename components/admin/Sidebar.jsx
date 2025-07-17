// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   PlusSquare,
//   ListOrdered,
//   ShoppingCart,
//   Users,
//   Star,
//   Bell,
//   CreditCard,
//   Mail,
//   Contact,
//   Headphones, 
//   Tag
// } from 'lucide-react';

// const SideBar = () => {
//   const pathname = usePathname();

//   const menuItems = [
//     { name: 'Add Products', path: '/admin', icon: <PlusSquare className="w-6 h-6" /> },
//     { name: 'Customer Support', path: '/admin/customer-support', icon: <Headphones className="w-6 h-6" /> },
//     { name: 'Messages', path: '/admin/messages', icon: <Mail className="w-6 h-6" /> },
//     { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-6 h-6" /> },
//     { name: 'Orders', path: '/admin/orders', icon: <Tag className="w-6 h-6" /> },
//     { name: 'Products List', path: '/admin/product-list', icon: <ListOrdered className="w-6 h-6" /> },
//     { name: 'Reviews', path: '/admin/reviews', icon: <Star className="w-6 h-6" /> },
//     { name: 'Subscribers', path: '/admin/subscribers', icon: <Contact className="w-6 h-6" /> },
//     { name: 'Transactions', path: '/admin/payments', icon: <CreditCard className="w-6 h-6" /> },
//     { name: 'Users', path: '/admin/users', icon: <Users className="w-6 h-6" /> },
//   ];

//   return (
//     <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
//       {menuItems.map((item) => {
//         const isActive = pathname === item.path;

//         return (
//           <Link href={item.path} key={item.name} passHref>
//             <div
//               className={`flex items-center py-3 px-4 gap-3 ${
//                 isActive
//                   ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
//                   : "hover:bg-gray-100/90 border-white"
//               }`}
//             >
//               {item.icon}
//               <p className='md:block hidden text-center'>{item.name}</p>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// };

// export default SideBar;



























// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   PlusSquare,
//   ListOrdered,
//   ShoppingCart,
//   Users,
//   Star,
//   Bell,
//   CreditCard,
//   Mail,
//   Contact,
//   Headphones,
//   Tag,
//   ChevronsLeft,
//   ChevronsRight
// } from 'lucide-react';

// const SideBar = () => {
//   const pathname = usePathname();

//   const [collapsed, setCollapsed] = useState(false);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const savedState = localStorage.getItem('sidebar-collapsed');
//     if (savedState !== null) {
//       setCollapsed(JSON.parse(savedState));
//     }
//   }, []);

//   // Save to localStorage on change
//   useEffect(() => {
//     localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
//   }, [collapsed]);

//   const menuItems = [
//     { name: 'Add Products', path: '/admin', icon: <PlusSquare className="w-6 h-6" /> },
//     { name: 'Customer Support', path: '/admin/customer-support', icon: <Headphones className="w-6 h-6" /> },
//     { name: 'Messages', path: '/admin/messages', icon: <Mail className="w-6 h-6" /> },
//     { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-6 h-6" /> },
//     { name: 'Orders', path: '/admin/orders', icon: <Tag className="w-6 h-6" /> },
//     { name: 'Products List', path: '/admin/product-list', icon: <ListOrdered className="w-6 h-6" /> },
//     { name: 'Reviews', path: '/admin/reviews', icon: <Star className="w-6 h-6" /> },
//     { name: 'Subscribers', path: '/admin/subscribers', icon: <Contact className="w-6 h-6" /> },
//     { name: 'Transactions', path: '/admin/payments', icon: <CreditCard className="w-6 h-6" /> },
//     { name: 'Users', path: '/admin/users', icon: <Users className="w-6 h-6" /> },
//   ];

//   return (
//     <div
//       className={`border-r border-gray-300 min-h-screen py-2 flex flex-col transition-all duration-300 ease-in-out ${
//         collapsed ? 'w-16' : 'w-50'
//       }`}
//     >
//       {/* Toggle Button */}
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="self-end mr-2 mb-4 p-1 hover:bg-gray-200 rounded transition"
//       >
//         {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
//       </button>

//       {/* Menu Items */}
//       {menuItems.map((item) => {
//         const isActive = pathname === item.path;

//         return (
//           <Link href={item.path} key={item.name} passHref>
//             <div
//               className={`flex items-center py-3 px-4 gap-3 cursor-pointer transition-all duration-200 ${
//                 isActive
//                   ? 'border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90'
//                   : 'hover:bg-gray-100/90 border-white'
//               }`}
//             >
//               {item.icon}
//               {!collapsed && <p className="whitespace-nowrap">{item.name}</p>}
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// };

// export default SideBar;



































'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useClerk } from '@clerk/nextjs';
import {
  PlusSquare, ListOrdered, Star, Mail, Bell, Tag,
  CreditCard, Users, Contact, Headphones,
  ChevronsLeft, ChevronsRight, ChevronDown, ChevronRight,
  Menu, Home, LogOut, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';


const SideBar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { signOut } = useClerk();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleGroup = (groupTitle) => {
    setOpenGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
  };

  const menuGroups = [
    {
      title: t('admin'),
      items: [
        { name: t('dashboard'), path: '/admin', icon: <Headphones className="w-5 h-5" /> },
      ],
    },
    {
      title: t('products'),
      items: [
        { name: t('addProducts'), path: '/admin/add-products', icon: <PlusSquare className="w-5 h-5" /> },
        { name: t('productsList'), path: '/admin/product-list', icon: <ListOrdered className="w-5 h-5" /> },
        { name: t('reviews'), path: '/admin/reviews', icon: <Star className="w-5 h-5" /> },
      ],
    },
    {
      title: t('orders'),
      items: [
        { name: t('orders'), path: '/admin/orders', icon: <Tag className="w-5 h-5" /> },
        { name: t('transactions'), path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
      ],
    },
    {
      title: t('communication'),
      items: [
        { name: t('messages'), path: '/admin/messages', icon: <Mail className="w-5 h-5" /> },
        { name: t('notifications'), path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
      ],
    },
    {
      title: t('users'),
      items: [
        { name: t('usersList'), path: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: t('subscribers'), path: '/admin/subscribers', icon: <Contact className="w-5 h-5" /> },
      ],
    },
    {
      title: t('settings'),
      items: [
        { name: t('general'), path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
      ],
    }

  ];

  const sidebarContent = (
    <div className={`bg-white h-full border-r border-gray-200 py-4 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        {!collapsed && <h1 className="text-lg font-bold text-green-600">Admin Panel</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-200 rounded">
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1">
        {menuGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-600 uppercase hover:bg-gray-100 w-full"
              >
                <span>{group.title}</span>
                {openGroups[group.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}

            <AnimatePresence>
              {(collapsed || openGroups[group.title]) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {group.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link key={item.name} href={item.path}>
                        <div
                          className={`flex items-center px-4 py-3 gap-3 text-sm font-medium cursor-pointer transition ${
                            isActive
                              ? 'bg-orange-100 text-orange-600 border-r-4 border-orange-500'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.icon}
                          {!collapsed && <span>{item.name}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div className="mt-auto px-4 pt-4">
        <Link href="/" className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded">
          <Home className="w-5 h-5" />
          {!collapsed && <span>Home</span>}
        </Link>
        <button
          onClick={() => {
            const confirmLogout = window.confirm("Are you sure you want to sign out?");
            if (confirmLogout) {
              signOut().then(() => {
                toast.success("You've been signed out");
                router.push('/');
              });
            }
          }}
          className="w-full flex items-center gap-3 text-sm text-red-600 hover:bg-red-100 p-2 rounded mt-2"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">{sidebarContent}</div>

      {/* Mobile Drawer Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 bg-white shadow rounded-full">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
