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



























'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlusSquare,
  ListOrdered,
  ShoppingCart,
  Users,
  Star,
  Bell,
  CreditCard,
  Mail,
  Contact,
  Headphones,
  Tag,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const menuItems = [
    { name: 'Add Products', path: '/admin', icon: <PlusSquare className="w-6 h-6" /> },
    { name: 'Customer Support', path: '/admin/customer-support', icon: <Headphones className="w-6 h-6" /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail className="w-6 h-6" /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-6 h-6" /> },
    { name: 'Orders', path: '/admin/orders', icon: <Tag className="w-6 h-6" /> },
    { name: 'Products List', path: '/admin/product-list', icon: <ListOrdered className="w-6 h-6" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star className="w-6 h-6" /> },
    { name: 'Subscribers', path: '/admin/subscribers', icon: <Contact className="w-6 h-6" /> },
    { name: 'Transactions', path: '/admin/payments', icon: <CreditCard className="w-6 h-6" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-6 h-6" /> },
  ];

  return (
    <div
      className={`border-r border-gray-300 min-h-screen py-2 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-50'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="self-end mr-2 mb-4 p-1 hover:bg-gray-200 rounded transition"
      >
        {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
      </button>

      {/* Menu Items */}
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90'
                  : 'hover:bg-gray-100/90 border-white'
              }`}
            >
              {item.icon}
              {!collapsed && <p className="whitespace-nowrap">{item.name}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
