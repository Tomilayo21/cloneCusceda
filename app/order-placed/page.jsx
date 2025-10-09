'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle, PartyPopper,  XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const OrderPlaced = () => {
  const { setCartItems } = useAppContext();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [finalizing, setFinalizing] = useState(true);

  useEffect(() => {
    const finalizeOrder = async () => {
      const pending = sessionStorage.getItem('pendingOrder');
      if (!pending) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4`}
            >
              <XCircle className="text-red-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No pending order data found
              </p>
            </div>
          ),
          { duration: 2500, position: "top-right" }
        );
        setFinalizing(false);
        return;
      }

      if (status !== "authenticated") {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4`}
            >
              <XCircle className="text-red-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                You must be logged in to finalize order
              </p>
            </div>
          ),
          { duration: 2500, position: "top-right" }
        );
        setFinalizing(false);
        return;
      }

      try {
        const orderData = JSON.parse(pending);
        const endpoint =
          orderData.paymentMethod.toLowerCase() === 'stripe'
            ? '/api/order/stripe/create'
            : '/api/order/paystack/create';

        const res = await axios.post(
          endpoint,
          {
            address: orderData.addressId,
            items: orderData.items,
            userId: session.user.id, // use session user ID
          },
          { headers: { Authorization: `Bearer ${session.user.id}` } }
        );

        if (res.data.success) {
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4`}
              >
                <CheckCircle className="text-green-500" size={20} />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Order successfully created
                </p>
              </div>
            ),
            { duration: 2500, position: 'top-right' }
          );

          setCartItems({}); // clear cart
          sessionStorage.removeItem('pendingOrder');
          setTimeout(() => router.push('/my-orders'), 1500);
        } else {
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4`}
              >
                <PartyPopper className="text-red-500" size={20} />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {res.data.message || 'Order creation failed'}
                </p>
              </div>
            ),
            { duration: 2500, position: 'top-right' }
          );
        }
      } catch (error) {
        console.error('Finalize Order Error:', error);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4`}
            >
              <PartyPopper className="text-red-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Failed to finalize order: {error.message || 'Unknown error'}
              </p>
            </div>
          ),
          { duration: 2500, position: 'top-right' }
        );
      } finally {
        setFinalizing(false);
      }
    };

    if (status === 'authenticated') {
      finalizeOrder();
    }
  }, [session, status, setCartItems, router]);


  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="relative flex justify-center items-center mb-6">
        {finalizing ? (
          <div className="animate-spin rounded-full h-28 w-28 border-4 border-t-orange-400 border-gray-200 dark:border-neutral-700"></div>
        ) : (
          <CheckCircle className="h-28 w-28 text-green-500" />
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        {finalizing ? 'Finalizing your order...' : 'Order Placed Successfully'}
        {!finalizing && <PartyPopper className="w-6 h-6 text-orange-500" />}
      </h1>

      {!finalizing && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <a
            href="/my-orders"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md transition text-center"
          >
            View My Orders
          </a>
          <a
            href="/all-products"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 font-medium shadow-sm transition text-center"
          >
            Continue Shopping
          </a>
        </div>
      )}
    </div>    
  );
};

export default OrderPlaced;
