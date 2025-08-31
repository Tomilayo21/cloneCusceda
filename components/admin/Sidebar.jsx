
// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useTranslation } from 'react-i18next';
// import { useClerk } from "@clerk/nextjs";
// import {
//   PlusSquare, ListOrdered, Star, Mail, Bell, Tag,
//   CreditCard, Users, Contact, Headphones,
//   ChevronsLeft, ChevronsRight, ChevronDown, ChevronRight,
//   Menu, Home, LogOut, Settings
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { useUser, UserButton } from "@clerk/nextjs";
// import Image from "next/image";
// import { assets, CartIcon } from "@/assets/assets";




// const SideBar = () => {
//   const pathname = usePathname();
//   const { t } = useTranslation();
//   const { signOut } = useClerk();
//   const [collapsed, setCollapsed] = useState(false);
//   const [openGroups, setOpenGroups] = useState({});
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const router = useRouter();
//   const { user } = useUser();
//   const { openSignIn } = useClerk();
  


//   useEffect(() => {
//     const saved = localStorage.getItem('sidebar-collapsed');
//     if (saved !== null) setCollapsed(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
//   }, [collapsed]);

//   const toggleGroup = (groupTitle) => {
//     setOpenGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
//   };

//   const menuGroups = [
//     {
//       title: t('admin'),
//       items: [
//         { name: t('dashboard'), path: '/admin', icon: <Headphones className="w-5 h-5" /> },
//       ],
//     },
//     {
//       title: t('products'),
//       items: [
//         { name: t('addProducts'), path: '/admin/add-products', icon: <PlusSquare className="w-5 h-5" /> },
//         { name: t('productsList'), path: '/admin/product-list', icon: <ListOrdered className="w-5 h-5" /> },
//         { name: t('reviews'), path: '/admin/reviews', icon: <Star className="w-5 h-5" /> },
//       ],
//     },
//     {
//       title: t('orders'),
//       items: [
//         { name: t('orders'), path: '/admin/orders', icon: <Tag className="w-5 h-5" /> },
//         { name: t('transactions'), path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
//       ],
//     },
//     {
//       title: t('communication'),
//       items: [
//         { name: t('messages'), path: '/admin/messages', icon: <Mail className="w-5 h-5" /> },
//         { name: t('notifications'), path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
//       ],
//     },
//     {
//       title: t('users'),
//       items: [
//         { name: t('usersList'), path: '/admin/users', icon: <Users className="w-5 h-5" /> },
//         { name: t('subscribers'), path: '/admin/subscribers', icon: <Contact className="w-5 h-5" /> },
//       ],
//     },
//     {
//       title: t('settings'),
//       items: [
//         { name: t('general'), path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
//       ],
//     }

//   ];

//   const sidebarContent = (
//     <div className={`bg-white h-full border-r border-gray-200 py-4 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
//       {/* Header */}
//       <div className="hidden md:flex items-center justify-between px-4 mb-4">
//         {!collapsed && <h1 className="text-lg font-bold text-green-600">Admin Panel</h1>}
//         <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-200 rounded">
//           {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
//         </button>
//       </div>


//       {/* Menu */}
//       <nav className="flex flex-col gap-1">
//         {menuGroups.map((group) => (
//           <div key={group.title}>
//             {!collapsed && (
//               <button
//                 onClick={() => toggleGroup(group.title)}
//                 className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-600 uppercase hover:bg-gray-100 w-full"
//               >
//                 <span>{group.title}</span>
//                 {openGroups[group.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//               </button>
//             )}

//             <AnimatePresence>
//               {(collapsed || openGroups[group.title]) && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: 'auto', opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   className="overflow-hidden"
//                 >
//                   {group.items.map((item) => {
//                     const isActive = pathname === item.path;
//                     return (
//                       <Link key={item.name} href={item.path}>
//                         <div
//                           className={`flex items-center px-4 py-3 gap-3 text-sm font-medium cursor-pointer transition ${
//                             isActive
//                               ? 'bg-orange-100 text-orange-600 border-r-4 border-orange-500'
//                               : 'hover:bg-gray-100 text-gray-700'
//                           }`}
//                         >
//                           {item.icon}
//                           {!collapsed && <span>{item.name}</span>}
//                         </div>
//                       </Link>
//                     );
//                   })}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         ))}
//       </nav>

//       {/* Bottom Buttons */}
//       {/* Bottom Buttons */}
//       <div className="mt-auto px-4 pt-4 space-y-2">
//         {user ? (
//           <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
//             <UserButton
//               afterSignOutUrl="/"
//               appearance={{ elements: { avatarBox: "w-8 h-8" } }}
//             />
//             {!collapsed && (
//               <div>
//                 <p className="text-sm font-semibold text-gray-900 leading-none">
//                   {user.fullName || user.primaryEmailAddress?.emailAddress}
//                 </p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <button
//             onClick={() => {
//               openSignIn();
//               setMobileOpen(false);
//             }}
//             className="flex items-center gap-2 text-gray-700 hover:bg-[#EBEDED] rounded px-2 py-1"
//           >
//             <Image src={assets.user_icon} alt="user" className="w-4 h-4" />
//             {!collapsed && <span>Sign In</span>}
//           </button>
//         )}

//         <Link
//           href="/"
//           className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded"
//         >
//           <Home className="w-5 h-5" />
//           {!collapsed && <span>Home</span>}
//         </Link>

//         <button
//           onClick={() => {
//             const confirmLogout = window.confirm("Are you sure you want to sign out?");
//             if (confirmLogout) {
//               signOut().then(() => {
//                 toast.success("You've been signed out");
//                 router.push('/');
//               });
//             }
//           }}
//           className="w-full flex items-center gap-3 text-sm text-red-600 hover:bg-red-100 p-2 rounded"
//         >
//           <LogOut className="w-5 h-5" />
//           {!collapsed && <span>Logout</span>}
//         </button>
//       </div>

//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className="hidden md:block">{sidebarContent}</div>

//       {/* Mobile Drawer Toggle */}
//       <div className="md:hidden fixed top-4 left-4 z-50">
//         <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 bg-white shadow rounded-full">
//           <Menu className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Mobile Drawer */}
//       {mobileOpen && (
//         <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}>
//           <div className="w-64 h-full bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
//             {sidebarContent}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SideBar;


















































































'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useClerk, useUser, UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  FileText,
  LogOut,
  Home,
  Menu,
  Monitor,
  Inbox
  
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PasswordConfirmPopup from './PasswordConfirmPopup';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Transactions',
    path: '/admin/payments',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    name: 'Support Chats',
    path: '/admin/customer-support',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    name: 'Contacts & Feedbacks',
    path: '/admin/messages',
    icon: <Inbox className="w-5 h-5" />,
  },
  {
    name: 'Activity Logs',
    path: '/admin/activity-logs',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

const SideBar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { signOut, openSignIn } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleLogoutClick = () => {
    setShowPopup(true);
  };

  const confirmLogout = (enteredPassword) => {
    if (enteredPassword === process.env.NEXT_PUBLIC_LOGOUT_PASSWORD) {
      signOut().then(() => {
        toast.success("You've been signed out");
        router.push("/");
      });
    } else {
      toast.error("Incorrect password");
    }
    setShowPopup(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to sign out?');
    if (confirmLogout) {
      signOut().then(() => {
        toast.success("You've been signed out");
        router.push('/');
      });
    }
  };

  const SidebarContent = (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-md">
            <Monitor className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            Admin Panel
          </h2>
        </div>
        <p className="text-xs text-gray-500 ml-1 mt-1">System Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <li key={item.name}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                      active
                        ? "bg-orange-50 text-orange-700 border-l-4 border-orange-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 ${
                        active ? "text-orange-600" : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Section */}
      <div className="px-4 py-4 border-t space-y-3">
        {user ? (
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="text-sm">
              <p className="font-medium text-gray-800">
                {user.fullName || user.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-xs text-gray-500">Signed in</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 w-full px-4 py-2 rounded-md border border-gray-200 transition"
          >
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Sign In</span>
          </button>
        )}

        <Link
          href="/"
          className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md transition"
        >
          <Home className="w-5 h-5 text-gray-500" />
          <span>Home</span>
        </Link>

        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {showPopup && (
          <PasswordConfirmPopup
            onClose={() => setShowPopup(false)}
            onConfirm={confirmLogout}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white border rounded-full shadow"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="bg-white w-64 h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
