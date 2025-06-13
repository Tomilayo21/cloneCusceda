"use client";

import React, { useEffect, useState } from "react";
import SubscriberExportButton from "@/components/SubscriberExportButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("/api/admin/subscribers");
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="p-2 max-w-4xl flex-1 overflow-scroll flex flex-col mx-6 mt-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Subscribers</h1>
      <SubscriberExportButton />

      {loading ? (
        <p className="text-gray-500 mt-4">Loading subscribers...</p>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-500 mt-6">No subscribers found.</p>
      ) : (
        <div className="mt-6">
          {/* Table for md+ screens */}
          <div className="hidden md:block">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{sub.email}</td>
                    <td className="border p-2">
                      {new Date(sub.subscribedAt).toLocaleString()} •{" "}
                      {dayjs(sub.subscribedAt).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for small screens */}
          <div className="md:hidden flex flex-col gap-4">
            {subscribers.map((sub, index) => (
              <div
                key={index}
                className="border border-gray-300 p-4 rounded shadow-sm bg-white dark:bg-neutral-900"
              >
                <p className="font-medium break-words text-sm text-black dark:text-white">
                  📧 {sub.email}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  {new Date(sub.subscribedAt).toLocaleString()} •{" "}
                  {dayjs(sub.subscribedAt).fromNow()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribersPage;
