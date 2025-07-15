// 'use client'
// import { assets } from '@/assets/assets'
// import { useAppContext } from '@/context/AppContext'
// import Image from 'next/image'
// import { useEffect } from 'react'

// const OrderPlaced = () => {

//   const { router } = useAppContext()

//   useEffect(() => {
//     setTimeout(() => {
//       router.push('/my-orders')
//     }, 5000)
//   }, [])

//   return (
//     <div className='h-screen flex flex-col justify-center items-center gap-5'>
//       <div className="flex justify-center items-center relative">
//         <Image className="absolute p-5" src={assets.checkmark} alt='' />
//         <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
//       </div>
//       <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
//     </div>
//   )
// }

// export default OrderPlaced





//......................................................................................
'use client';

import { useAppContext } from '@/context/AppContext';
import { useAuth } from "@clerk/nextjs";
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderPlaced = () => {
  const { setCartItems, router } = useAppContext();
  const { getToken } = useAuth(); 

  useEffect(() => {
    const finalizeOrder = async () => {
      const pending = sessionStorage.getItem("pendingOrder");

      if (!pending) {
        toast.error("No pending order data found");
        return;
      }

      try {
        const token = await getToken();
        console.log("Clerk token:", token); // ✅ Debug log added here

        if (!token) {
          toast.error("No auth token found. Please sign in again.");
          return;
        }

        const orderData = JSON.parse(pending);

        const res = await axios.post("/api/order/create", {
          address: orderData.addressId,
          items: orderData.items,
          paymentMethod: orderData.paymentMethod,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.success) {
          toast.error("Order creation failed");
        } else {
          toast.success("Order successfully created");
          setCartItems({});
          sessionStorage.removeItem("pendingOrder");
        }
      } catch (error) {
        console.error("Finalize Order Error:", error);
        toast.error("Failed to finalize order: " + (error.message || "Unknown error"));
      }
    };

    finalizeOrder();

    const timer = setTimeout(() => {
      router.push('/my-orders');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
    </div>
  );
};

export default OrderPlaced;
//................................................................................................







































































// 'use client'
// import { assets } from '@/assets/assets'
// import { useAppContext } from '@/context/AppContext'
// import Image from 'next/image'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useAuth } from '@clerk/nextjs'

// const OrderPlaced = () => {
//   const { router, setCartItems } = useAppContext()
//   const { getToken } = useAuth()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const createOrderAfterStripe = async () => {
//       const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder") || "null")
//       if (!pendingOrder) {
//         toast.error("No order data found")
//         setLoading(false)
//         return
//       }

//       try {
//         const token = await getToken()
//         const res = await axios.post('/api/order/create', pendingOrder, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         if (!res.data.success) {
//           toast.error(res.data.message || "Order creation failed")
//         } else {
//           toast.success("Order successfully created")
//           localStorage.removeItem("pendingOrder")
//           setCartItems({})
//         }
//       } catch (error) {
//         toast.error(error.message || "Failed to create order after Stripe")
//       } finally {
//         setLoading(false)
//       }
//     }

//     createOrderAfterStripe()

//     const timeout = setTimeout(() => {
//       router.push('/my-orders')
//     }, 5000)

//     return () => clearTimeout(timeout)
//   }, [])

//   return (
//     <div className='h-screen flex flex-col justify-center items-center gap-5'>
//       <div className="flex justify-center items-center relative">
//         <Image className="absolute p-5" src={assets.checkmark} alt='' />
//         <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
//       </div>
//       <div className="text-center text-2xl font-semibold">
//         {loading ? 'Placing your order...' : 'Order Placed Successfully'}
//       </div>
//     </div>
//   )
// }

// export default OrderPlaced
