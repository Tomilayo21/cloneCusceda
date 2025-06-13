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
      ) : (
        <div className="mt-6">
          {subscribers.length === 0 ? (
            <p className="text-gray-500">No subscribers found.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
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
                      {new Date(sub.subscribedAt).toLocaleString()} • {dayjs(sub.subscribedAt).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscribersPage;
