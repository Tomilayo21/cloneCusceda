import React from 'react';
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
  Contact
} from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Add Products', path: '/admin', icon: <PlusSquare className="w-6 h-6" /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail className="w-6 h-6" /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-6 h-6" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-6 h-6" /> },
    { name: 'Products List', path: '/admin/product-list', icon: <ListOrdered className="w-6 h-6" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star className="w-6 h-6" /> },
    { name: 'Subscribers', path: '/admin/subscribers', icon: <Contact className="w-6 h-6" /> },
    { name: 'Transactions', path: '/admin/payments', icon: <CreditCard className="w-6 h-6" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-6 h-6" /> },
  ];

  return (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
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
              <p className='md:block hidden text-center'>{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
