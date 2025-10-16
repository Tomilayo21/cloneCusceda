'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Package, Truck, CreditCard, DollarSign, MapPin, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

dayjs.extend(relativeTime);

const MyOrders = () => {
  const { currency } = useAppContext();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState(null);

  const paymentMethods = [
    { id: "stripe", label: "Stripe", fee: 0.029 },
    { id: "paystack", label: "Paystack", fee: 0.015 },
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

  // Fetch orders for the current user
  useEffect(() => {
    if (!userId) return; // don't fetch until we have a user

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/order/list", {
          headers: { Authorization: `Bearer ${userId}` },
        });

        if (data.success) {
          setOrders(data.orders.reverse());
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);


  const handleCancelOrder = async (orderId) => {
    if (!userId) {
      toast.error("You must be logged in to cancel an order.");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/order/cancel",
        { orderId },
        { headers: { Authorization: `Bearer ${userId}` } }
      );

      if (data.success) {
        toast.custom(
          (t) => (
            <div
              className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg flex items-center gap-3 p-4 transform transition-all duration-300 ${
                t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <Package className="text-orange-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Order cancelled
              </p>
            </div>
          ),
          { duration: 2000, position: "top-right" }
        );

        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: "Cancelled" } : o
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel order.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!userId) {
      toast.error("You must be logged in to delete an order.");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/order/delete",
        { orderId },
        { headers: { Authorization: `Bearer ${userId}` } }
      );

      if (data.success) {
        toast.custom(
          (t) => (
            <div
              className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg flex items-center gap-3 p-4 transform transition-all duration-300 ${
                t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <Trash2 className="text-red-500" size={20} />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Order deleted
              </p>
            </div>
          ),
          { duration: 2000, position: "top-right" }
        );

        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete order.");
    }
  };

  if (status === "loading" || loading) return <Loading />;
  if (status === "unauthenticated") return <p>Please log in to view your orders.</p>;

  const totalPages = Math.ceil(orders.length / perPage);

  return (
    <div className="items-center pt-8 bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Navbar />
      <main className="flex flex-col justify-between mt-2 px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mt-6 text-black dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            My Orders
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <Package className="w-14 h-14 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                No Orders Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Looks like you haven’t placed any orders. Start shopping and your orders will appear here!
              </p>
              <button
                onClick={() => router.push("/all-products")}
                className="mt-6 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-md transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <section className="grid gap-6 max-w-5xl text-sm text-black dark:text-white">
              {orders.slice((page - 1) * perPage, page * perPage).map((order, index) => {
                const method = paymentMethods.find(m => m.id === order.paymentMethod);

                return (
                  <div
                    key={order._id || index}
                    className="bg-white dark:bg-gray-900 shadow-sm border rounded-xl p-5 space-y-5"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        className="w-20 h-20 object-contain rounded-md border"
                        src={order.items[0]?.product.image[0] || assets.box_icon}
                        alt={order.items[0]?.product.name || "Product"}
                        width={80}
                        height={80}
                      />
                      <div>
                        <p className="font-semibold text-base">
                          {order.items.map(item => `${item.product.name} x ${item.quantity}`).join(", ")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <p className="font-semibold flex items-center gap-2 mb-1">
                          <MapPin size={16} /> Shipping Address
                        </p>
                        <address className="not-italic text-gray-700 dark:text-gray-300">
                          <p><span className="font-medium">Name:</span> {order.address?.fullName}</p>
                          <p><span className="font-medium">Country:</span> {order.address?.country}</p>
                          <p><span className="font-medium">State:</span> {order.address?.state}, <span className="font-medium">City:</span> {order.address?.city}</p>
                          <p><span className="font-medium">Phone:</span> {order.address?.phoneNumber}</p>
                        </address>
                      </div>

                      <div>
                        <p className="font-semibold flex items-center gap-2 mb-1">
                          <CreditCard size={16} /> Order Info
                        </p>
                        {method && <p className="text-sm">Payment: <span className="font-medium">{method.label}</span></p>}
                        <p className="text-sm">Order ID: <span className="font-medium">{order.orderId || order._id}</span></p>
                        <p className="text-sm">Date: <span className="font-medium">{dayjs(order.date || order.createdAt).format("DD/MM/YYYY")} • {dayjs(order.date || order.createdAt).fromNow()}</span></p>
                        <p className="text-sm">Payment Status: <span className="font-medium">{order.paymentStatus || "Pending"}</span></p>
                        <p className="text-sm">Order Status: <span className="font-medium">{order.orderStatus}</span></p>
                      </div>

                      <div>
                        <p className="font-semibold flex items-center gap-2 mb-1">
                          <DollarSign size={16} /> Total
                        </p>
                        <p className="text-lg font-bold text-orange-600">
                          {currency}
                          {order.amount?.toLocaleString
                            (undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t pt-3 space-y-2 text-sm">
                      {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="w-fit px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.orderStatus === "Cancelled" && (
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="w-fit px-4 py-2 flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm"
                        >
                          <Trash2 size={14} /> Delete Order
                        </button>
                      )}

                      {order.trackingNumber && (
                        <div className="flex items-center gap-3">
                          <Truck size={16} className="text-gray-500" />
                          <div>
                            <p><span className="font-medium">Tracking:</span> {order.trackingNumber}</p>
                            <p><span className="font-medium">Carrier:</span> {order.shippingCarrier}</p>
                            {order.shippingLabelUrl && (
                              <a href={order.shippingLabelUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                Download Label
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-orange-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-orange-100"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
