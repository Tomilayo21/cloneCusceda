"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [enlargedImg, setEnlargedImg] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/transactions?page=${page}&limit=${pageSize}`);
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((txn) =>
    txn.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Transactions</h1>

      <input
        type="text"
        placeholder="Search by user, order, status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Payment Method</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Proof of Payment</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-100">
                    <td className="border p-2 text-sm">{txn.orderId}</td>
                    <td className="border p-2 text-sm">{txn.userId}</td>
                    <td className="border p-2 text-sm">${txn.amount?.toFixed(2)}</td>
                    <td className="border p-2 text-sm">{txn.paymentMethod}</td>
                    <td className="border p-2 text-sm">{txn.status}</td>
                      <td className="border p-2 text-center">
                        {txn.proofOfPaymentUrl ? (
                          <img
                            src={txn.proofOfPaymentUrl}
                            alt="Proof of Payment"
                            className="w-16 h-16 object-cover cursor-pointer rounded border"
                            onClick={() => setEnlargedImg(txn.proofOfPaymentUrl)}
                            title="Click to enlarge"
                          />
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    <td className="border p-2 text-sm">{new Date(txn.date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Enlarged image modal */}
      {enlargedImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setEnlargedImg(null)}
        >
          <img
            src={enlargedImg}
            alt="Enlarged payment screenshot"
            className="max-w-3xl max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
