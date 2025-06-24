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
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(orders.length / perPage);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);


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
            <section className="max-w-5xl divide-y divide-gray-300 dark:divide-gray-600 text-sm text-black dark:text-white">
              {orders.map((order, index) => {
                const method = paymentMethods.find((m) => m.id === order.paymentMethod);

                return (
                  <div
                    key={order._id || index}
                    className="flex flex-col gap-4 py-5"
                  >
                    {/* Section: Product */}
                    <div className="flex items-center gap-4">
                      {/* Image that opens modal */}
                      <button onClick={() => setActiveOrder(order)} className="focus:outline-none">
                        <Image
                          className="w-16 h-16 object-cover rounded"
                          src={order.items[0]?.product.image[0] || assets.box_icon}
                          alt={order.items[0]?.product.name || "Product"}
                          width={64}
                          height={64}
                        />
                      </button>

                      <div className="space-y-1">
                        <p className="font-semibold text-base">
                          {order.items.map((item) => `${item.product.name} x ${item.quantity}`).join(", ")}
                        </p>
                        <p className="text-sm">Items: {order.items.length}</p>
                      </div>
                    </div>

                    {/* Section: Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold mb-1">Shipping Address</p>
                        <address className="not-italic">
                          <p>{order.address.fullName}</p>
                          <p>{order.address.area}</p>
                          <p>
                            {order.address.city}, {order.address.state}
                          </p>
                          <p>{order.address.phoneNumber}</p>
                        </address>
                      </div>

                      <div>
                        <p className="font-semibold mb-1">Order Details</p>
                        {method && (
                          <p className="text-sm">Payment Method: <span className="font-semibold">{method.label}</span></p>
                        )}
                        <p className="text-sm">Order ID: <span className="font-semibold">{order.orderId || order._id}</span></p>
                        <p className="text-sm">Date: <span className="font-semibold">{dayjs(order.date).format("DD/MM/YYYY")} • {dayjs(order.date).fromNow()}</span></p>
                        <p className="text-sm">Payment Status: <span className="font-semibold">{order.paymentStatus || "Pending"}</span></p>
                        <p className="text-sm">Order Status: <span className="font-semibold">{order.orderStatus}</span></p>
                      </div>

                      <div>
                        <p className="font-semibold mb-1">Total</p>
                        <p className="text-lg font-bold">
                          {currency}{order.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Section: Order Tracking & Actions */}
                    <div className="flex flex-col gap-2 mt-2">
                      {order.orderStatus !== "Delivered" &&
                        order.orderStatus !== "Cancelled" &&
                        order.orderStatus !== "Shipped" &&
                        order.paymentStatus !== "Successful" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="w-fit px-3 py-1 text-sm bg-red-600 hover:bg-red-700 transition text-white rounded"
                          >
                            Cancel Order
                          </button>
                      )}

                      {order.orderStatus === "Cancelled" && (
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="w-fit px-3 py-1 text-sm bg-gray-700 hover:bg-gray-800 transition text-white rounded"
                        >
                          Delete Order
                        </button>
                      )}

                      <p className="text-sm">
                        <span className="font-medium">Tracking:</span> {order.trackingNumber} <br />
                        <span className="font-medium">Carrier:</span> {order.shippingCarrier} <br />
                        <a
                          href={order.shippingLabelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download Shipping Label
                        </a>
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center">
            <div className="space-x-2 flex items-center">
              {/* Prev Button */}
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page Numbers with Ellipsis */}
              {(() => {
                const range = [];
                const start = Math.max(1, page - 2);
                const end = Math.min(totalPages, page + 2);

                if (start > 1) {
                  range.push(1);
                  if (start > 2) range.push("ellipsis-start");
                }

                for (let i = start; i <= end; i++) {
                  range.push(i);
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) range.push("ellipsis-end");
                  range.push(totalPages);
                }

                return range.map((item, index) =>
                  item === "ellipsis-start" || item === "ellipsis-end" ? (
                    <span key={index} className="px-1">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`px-3 py-1 rounded border ${
                        page === item ? "bg-black text-white" : "bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  )
                );
              })()}

              {/* Next Button */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow max-w-lg w-full overflow-y-auto max-h-[80vh] relative">
              <button
                onClick={() => setActiveOrder(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black dark:text-gray-300"
              >
                ✖
              </button>
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {activeOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start border-b pb-4">
                    <Image
                      src={item.product.image[0] || assets.box_icon}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      {item.product.price && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Price: {currency}{item.product.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
