"use client";

import React, { useEffect, useState } from "react";
import SubscriberExportButton from "@/components/SubscriberExportButton";

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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Subscribers</h1>

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
                      {new Date(sub.subscribedAt).toLocaleString()}
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
