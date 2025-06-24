"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Footer from "@/components/admin/Footer";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Papa from "papaparse";

dayjs.extend(relativeTime);


export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [enlargedImg, setEnlargedImg] = useState(null);
  const { getToken, currency } = useAppContext()
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [totalPages, setTotalPages] = useState(1);

  

  const exportToCSV = () => {
    const csv = Papa.unparse(
      filteredTransactions.map((txn) => ({
        OrderID: txn.orderId,
        UserID: txn.userId,
        Amount: txn.amount,
        PaymentMethod: txn.paymentMethod,
        PaymentStatus: txn.paymentStatus,
        OrderStatus: txn.orderStatus,
        ProofOfPayment: txn.proofOfPaymentUrl || "",
        Date: new Date(txn.date).toLocaleString(),
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/transactions?page=${page}&limit=${pageSize}`);
      setTransactions(res.data.transactions || []);
      setTotalPages(Math.ceil(res.data.totalCount / pageSize));
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

  const updatePaymentStatus = async (orderId, status) => {
    try {
      const token = await getToken(); // from your AppContext
      const res = await axios.post(
        "/api/admin/order/payment-status",
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`, // this must be valid
          },
        }
      );

      if (res.data.success) {
        toast.success("Updated payment status");
        setTransactions((prev) =>
          prev.map((txn) =>
            txn._id === orderId ? { ...txn, paymentStatus: status } : txn
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update payment status");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/order/update-status", { orderId, status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Status updated");
        // fetchAdminOrders(); // Refresh
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key]?.toString().toLowerCase();
    const bVal = b[sortConfig.key]?.toString().toLowerCase();

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (date) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const today = new Date().toDateString();
  const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));

  const todayTotal = filteredTransactions.reduce(
    (acc, txn) => new Date(txn.date).toDateString() === today ? acc + txn.amount : acc,
    0
  );
  const weekTotal = filteredTransactions.reduce(
    (acc, txn) => new Date(txn.date) >= oneWeekAgo ? acc + txn.amount : acc,
    0
  );
  const monthTotal = filteredTransactions.reduce(
    (acc, txn) => new Date(txn.date) >= oneMonthAgo ? acc + txn.amount : acc,
    0
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
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={exportToCSV}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Export to CSV
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-green-800">Today’s Total</h3>
          <p className="text-lg font-bold">{currency}{todayTotal.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-blue-800">Last 7 Days</h3>
          <p className="text-lg font-bold">{currency}{weekTotal.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-yellow-800">Last 30 Days</h3>
          <p className="text-lg font-bold">{currency}{monthTotal.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          {/* Grouped Tables by Date with Totals and Collapsible Sections */}
          {Object.entries(
            sortedTransactions.reduce((groups, txn) => {
              const dateKey = new Date(txn.date).toLocaleDateString();
              if (!groups[dateKey]) groups[dateKey] = [];
              groups[dateKey].push(txn);
              return groups;
            }, {})
          )
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, transactionsOfDay], index) => {
              const totalAmount = transactionsOfDay.reduce((sum, txn) => sum + (txn.amount || 0), 0);
              const isCollapsed = collapsedSections[date] ?? (index !== 0); // First group open by default

              return (
                <div key={date} className="mb-8 border rounded shadow">
                  <div
                    className="flex justify-between items-center bg-gray-100 p-3 cursor-pointer"
                    onClick={() => toggleSection(date)}
                  >
                    <h2 className="text-lg font-semibold">
                      {new Date(date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </h2>
                    <div className="text-sm text-gray-700 font-medium">
                      Total: {currency}{totalAmount.toFixed(2)}
                      <span className="ml-4 text-blue-600">
                        {isCollapsed ? "Show ▼" : "Hide ▲"}
                      </span>
                    </div>
                  </div>
                  

                  {!isCollapsed && (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden sm:block">
                        <table className="min-w-full border-collapse border border-gray-300">
                          <thead>
                            <tr>
                              <th className="border p-2 cursor-pointer" onClick={() => requestSort('_id')}>Order ID</th>
                              <th className="border p-2">User ID</th>
                              <th className="border p-2">Amount</th>
                              <th className="border p-2 cursor-pointer" onClick={() => requestSort('paymentMethod')}>Payment Method</th>
                              <th className="border p-2 cursor-pointer" onClick={() => requestSort('paymentStatus')}>Payment Status</th>
                              <th className="border p-2 cursor-pointer" onClick={() => requestSort('orderStatus')}>Order Status</th>
                              <th className="border p-2">Proof of Payment</th>
                              <th className="border p-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionsOfDay.map((txn) => (
                              <tr key={txn._id} className="hover:bg-gray-100">
                                <td className="border p-2 text-sm">{txn.orderId}</td>
                                <td className="border p-2 text-sm">{txn.userId}</td>
                                <td className="border p-2 text-sm">{currency}{txn.amount?.toFixed(2)}</td>
                                <td className="border p-2 text-sm">{txn.paymentMethod}</td>
                                <td className="border p-2 text-sm">
                                  <select
                                    value={txn.paymentStatus}
                                    onChange={(e) => updatePaymentStatus(txn._id, e.target.value)}
                                    className="border px-2 py-1 rounded"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Successful">Successful</option>
                                    <option value="Refunded">Refunded</option>
                                    <option value="Failed">Failed</option>
                                  </select>
                                </td>
                                <td className="border p-2 text-sm">
                                  <select
                                    value={txn.orderStatus}
                                    onChange={(e) => updateOrderStatus(txn.orderId, e.target.value)}
                                    className="border px-2 py-1 rounded"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="border p-2 text-center">
                                  {txn.proofOfPaymentUrl ? (
                                    <img
                                      src={txn.proofOfPaymentUrl}
                                      alt="Proof"
                                      className="w-16 h-16 object-cover cursor-pointer rounded border"
                                      onClick={() => setEnlargedImg(txn.proofOfPaymentUrl)}
                                    />
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )}
                                </td>
                                <td className="border p-2 text-sm">
                                  {new Date(txn.date).toLocaleString()}{" "}
                                  <span className="text-gray-500 text-xs">({dayjs(txn.date).fromNow()})</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="sm:hidden space-y-4 mt-4">
                        {transactionsOfDay.map((txn) => (
                          <div key={txn._id} className="border rounded p-4 shadow">
                            <p><span className="font-semibold">Order ID:</span> {txn.orderId}</p>
                            <p><span className="font-semibold">User ID:</span> {txn.userId}</p>
                            <p><span className="font-semibold">Amount:</span> {currency}{txn.amount?.toFixed(2)}</p>
                            <p><span className="font-semibold">Payment Method:</span> {txn.paymentMethod}</p>
                            <p>
                              <span className="font-semibold">Payment Status:</span>
                              <select
                                className="ml-2 mt-1 p-1 text-sm border rounded"
                                value={txn.paymentStatus}
                                onChange={(e) => updatePaymentStatus(txn._id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Successful">Successful</option>
                                <option value="Refunded">Refunded</option>
                                <option value="Failed">Failed</option>
                              </select>
                            </p>
                            <p>
                              <span className="font-semibold">Order Status:</span>
                              <select
                                className="ml-2 mt-1 p-1 text-sm border rounded"
                                value={txn.orderStatus}
                                onChange={(e) => updateOrderStatus(txn.orderId, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </p>
                            <p className="mt-2">
                              <span className="font-semibold">Proof of Payment:</span><br />
                              {txn.proofOfPaymentUrl ? (
                                <img
                                  src={txn.proofOfPaymentUrl}
                                  alt="Proof"
                                  className="w-24 h-24 object-cover rounded border mt-1"
                                  onClick={() => setEnlargedImg(txn.proofOfPaymentUrl)}
                                />
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(txn.date).toLocaleString()}{" "}
                              <span className="text-xs text-gray-400">({dayjs(txn.date).fromNow()})</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          
          {/* Pagination */}
          {/* <div className="flex justify-center mt-4 space-x-4">
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
          </div> */}
          {totalPages > 1 && (
  <div className="flex justify-center mt-6 space-x-2 flex-wrap">
    {[...Array(totalPages)].map((_, index) => {
      const pageNum = index + 1;

      if (totalPages <= 10) {
        // Show all pages if total ≤ 10
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-3 py-1 rounded border ${
              pageNum === page ? "bg-black text-white" : "bg-gray-100 text-black"
            }`}
          >
            {pageNum}
          </button>
        );
      }

      const showPage =
        pageNum === 1 ||
        pageNum === totalPages ||
        (pageNum >= page - 1 && pageNum <= page + 1);

      if (showPage) {
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-3 py-1 rounded border ${
              pageNum === page ? "bg-black text-white" : "bg-gray-100 text-black"
            }`}
          >
            {pageNum}
          </button>
        );
      }

      if (
        (pageNum === 2 && page > 4) ||
        (pageNum === totalPages - 1 && page < totalPages - 3)
      ) {
        return <span key={pageNum} className="px-2">...</span>;
      }

      return null;
    })}
  </div>
)}

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
            alt="Enlarged proof"
            className="max-w-3xl max-h-full rounded shadow-lg"
          />
        </div>
      )}

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );

}






// Can you do the same thing here i.e totals perday, collaopsible sections, filtering by Amount,Payment Method,Payment Status,Order Status, date, Pagination for large datasets.
