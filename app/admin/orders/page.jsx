"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import { assets } from "@/assets/assets";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAdminOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/admin-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAdminOrders();
  }, [user]);

  const groupedOrders = orders.reduce((acc, order) => {
    if (statusFilter !== "All" && order.status !== statusFilter) return acc;
    const dateKey = new Date(order.date).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(order);
    return acc;
  }, {});

  const toggleCollapse = (date) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="flex-1 overflow-scroll h-screen text-sm flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-5">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Users Orders</h2>

        {/* Filter by status */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by status:</label>
          <select
            className="border px-3 py-1 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        {Object.entries(groupedOrders)
          .sort((a, b) => new Date(b[0]) - new Date(a[0])) // oldest to newest
          .map(([date, dayOrders]) => {
            const dateObj = new Date(date);
            const dateLabel = `${dateObj.toLocaleDateString("en-GB")} (${dateObj.toLocaleDateString("en-US", { weekday: "long" })})`;
            const isCollapsed = collapsedGroups[date] || false;
            const totalAmount = dayOrders.reduce((sum, o) => sum + o.amount, 0);

            return (
              <div key={date} className="space-y-4 mb-8">
                <div
                  className="flex justify-between items-center cursor-pointer bg-gray-100 p-3 rounded"
                  onClick={() => toggleCollapse(date)}
                >
                  <h3 className="text-lg font-semibold">
                    {dateLabel}
                  </h3>
                  <div className="text-right">
                    <p>{dayOrders.length} order(s)</p>
                    <p>Total: {currency}{totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {!isCollapsed &&
                  dayOrders.map((order, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-5 justify-between p-5 border border-gray-300 rounded"
                    >
                      <div className="flex-1 flex gap-5 max-w-80">
                        <Image className="w-16 h-16 object-cover" src={assets.box_icon} alt="box" />
                        <div className="flex flex-col gap-2">
                          <span className="font-medium text-base">
                            {order.items
                              .map(
                                (item) =>
                                  `${item?.product?.name || "Unknown"} x ${item.quantity}`
                              )
                              .join(", ")}
                          </span>
                          <span>Items: {order.items.length}</span>
                        </div>
                      </div>

                      <div>
                        <p>
                          <span className="font-medium">
                            {order.address?.fullName}
                          </span>
                          <br />
                          {order.address?.area}
                          <br />
                          {`${order.address?.city}, ${order.address?.state}`}
                          <br />
                          {order.address?.phoneNumber}
                        </p>
                      </div>

                      <p className="font-medium my-auto">
                        {currency}
                        {order.amount}
                      </p>

                      <div>
                        <p className="flex flex-col">
                          <span>Method: {order.paymentMethod}</span>
                          <span>Date: {new Date(order.date).toLocaleDateString("en-GB")}</span>
                          <span>Status: {order.orderStatus}</span>
                          <span>Status: {order.paymentStatus}</span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default Orders;
