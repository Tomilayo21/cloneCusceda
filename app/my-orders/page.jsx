"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { assets } from "@/assets/assets";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


const MyOrders = () => {
  const { currency, getToken } = useAppContext();
  const { openSignIn } = useClerk();
  const { isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const paymentMethods = [
    { id: "stripe", label: "Stripe", fee: 0.029 },
    { id: "paypal", label: "PayPal", fee: 0.034 },
    { id: "apple", label: "Apple Pay", fee: 0.025 },
    { id: "google", label: "Google Pay", fee: 0.025 },
    { id: "amazon", label: "Amazon Pay", fee: 0.03 },
    { id: "bank-transfer", label: "Direct Bank Transfer", fee: 0.015 },
    { id: "crypto", label: "Cryptocurrency", fee: 0.02 },
    { id: "mpesa", label: "M-Pesa", fee: 0.025 },
    { id: "paytm", label: "Paytm", fee: 0.02 },
    { id: "cash-on-delivery", label: "Cash on Delivery", fee: 0 },
  ];

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/");
      setTimeout(() => {
        openSignIn();
      }, 100);
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/order/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setOrders(data.orders.reverse());
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoaded, isSignedIn, getToken, openSignIn, router]);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/cancel",
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Order cancelled");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
        router.push("/my-orders"); // Optional refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to cancel order.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/delete",
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Order deleted");
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to delete order."
      );
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <Loading />;
  }

  return (
    <div className="items-center pt-8 bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Navbar />
      <main className="flex flex-col justify-between mt-2 px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6 text-black dark:text-white">
            My Orders
          </h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              You have no orders yet.
            </p>
          ) : (
            <section className="max-w-5xl border-t border-gray-300 dark:border-gray-600 text-sm text-black dark:text-white">
              {orders.map((order, index) => {
                const method = paymentMethods.find(
                  (m) => m.id === order.paymentMethod
                );

                return (
                  <div
                    key={order._id || index}
                    className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300 dark:border-gray-600"
                  >
                    {/* Items info */}
                    <div className="flex-1 flex gap-5 max-w-80">
                      <Image
                        className="max-w-16 max-h-16 object-cover"
                        src={assets.box_icon}
                        alt="box_icon"
                        width={64}
                        height={64}
                        priority={index === 0} // prioritize first image load
                      />
                      <p className="flex flex-col gap-3">
                        <span className="font-medium text-base text-black dark:text-white">
                          {order.items
                            .map((item) => `${item.product.name} x ${item.quantity}`)
                            .join(", ")}
                        </span>
                        <span className="text-black dark:text-white">
                          Items: {order.items.length}
                        </span>
                      </p>
                    </div>

                    {/* Shipping address */}
                    <div>
                      <address className="not-italic text-black dark:text-white">
                        <p>
                          <span className="font-medium">{order.address.fullName}</span>
                          <br />
                          <span>{order.address.area}</span>
                          <br />
                          <span>
                            {order.address.city}, {order.address.state}
                          </span>
                          <br />
                          <span>{order.address.phoneNumber}</span>
                        </p>
                      </address>
                    </div>

                    {/* Amount */}
                    <p className="font-medium my-auto whitespace-nowrap text-black dark:text-white">
                      {currency}
                      {order.amount.toFixed(2)}
                    </p>

                    {/* Order details and actions */}
                    <div>
                      <p className="flex flex-col text-black dark:text-white">
                        {method && (
                          <>
                          <p className="text-sm text-gray-600">
                            Payment Method:{" "}
                            <span className="font-semibold">{method.label}</span>
                             {/* – Fee:{" "}
                            {(method.fee * 100).toFixed(1)}% */}
                          </p>
                          <span className="text-gray-600 dark:text-white">
                            Order ID: <span className="text-sm text-gray-600 font-semibold">{order.orderId || order._id}</span>
                          </span>

                          </>
                        )}
                        <span className="text-sm text-gray-600">
                          Date: <span className="font-semibold">{dayjs(order.date).format("DD/MM/YYYY")} • {dayjs(order.date).fromNow()}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Payment Status: <span className="font-semibold">{order.paymentStatus || "Pending"}</span>
                        </span>
                        <span className="text-sm text-gray-600"> Order Status: <span className="font-semibold">{order.orderStatus}</span></span>
                      </p>
                      {order.orderStatus !== "Delivered" &&
                        order.orderStatus !== "Cancelled" &&
                        order.orderStatus !== "Shipped" &&
                        order.paymentStatus !== "Successful" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="mt-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 transition text-white rounded"
                          >
                            Cancel Order
                          </button>
                      )}

                      {order.orderStatus === "Cancelled" && (
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="mt-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-800 transition text-white rounded"
                        >
                          Delete Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
