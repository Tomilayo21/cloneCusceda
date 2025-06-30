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

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlusSquare,
  ListOrdered,
  Users,
  Star,
  Bell,
  CreditCard,
  Mail,
  Contact,
  Headphones, 
  Tag
} from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(240); // initial width in px
  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  };

  const handleMouseMove = (e) => {
    if (isResizing.current) {
      const newWidth = Math.max(64, Math.min(400, e.clientX)); // min 64px, max 400px
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
      className="border-r min-h-screen text-base border-gray-300 py-2 flex flex-col relative bg-white transition-all"
      style={{ width: `${sidebarWidth}px` }}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                  : "hover:bg-gray-100/90 border-white"
              }`}
            >
              {item.icon}
              <p className={`text-center ${sidebarWidth < 160 ? "hidden" : "block"}`}>
                {item.name}
              </p>
            </div>
          </Link>
        );
      })}

      {/* Resizer handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-orange-400/30 transition-colors"
      />
    </div>
  );
};

export default SideBar;
