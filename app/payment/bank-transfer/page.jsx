'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { useClerk, useUser } from '@clerk/nextjs';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


const BankTransferPage = () => {
  const router = useRouter();
  const { getToken, currency } = useAppContext();
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const fileInputRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);



  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/');
      setTimeout(() => openSignIn(), 100);
      return;
    }

    const fetchLatestOrder = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get('/api/order/list', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success && data.orders.length > 0) {
          const latestOrder = data.orders.reverse()[0];
          setOrder(latestOrder);
        } else {
          toast.error(data.message || 'No orders found.');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch order.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [isLoaded, isSignedIn, getToken, openSignIn, router]);

  const handleBackToMyOrders = () => {
    router.push('/my-orders');
  };

 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!proofFile) return toast.error("Please select a file to upload.");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('proof', proofFile);
      formData.append('orderId', order.orderId);  // <-- ADD THIS LINE to send orderId

      const { data } = await axios.post('/api/upload-proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success(data.message || 'Upload successful');
        setProofFile(null); // clear state
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // clear input
        }
        setUploadUrl('');
        setShowConfirmation(true);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading file');
    } finally {
      setUploading(false);
    }
  };


  if (!isLoaded || loading) return <Loading />;

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-center text-gray-700 dark:text-white">
          No recent order found.
        </div>
        <Footer />
      </>
    );
  }

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const delivery = order.deliveryFee || 2000;
  const transactionFee = order.transactionFee || 0;
  const total = subtotal + delivery + transactionFee;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="flex-grow flex flex-col mt-16 justify-center items-center px-4 bg-gray-50 dark:bg-black text-gray-800 dark:text-white py-12">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 shadow-xl rounded p-8 space-y-8">

          <h1 className="text-3xl font-bold text-orange-600 text-center">Bank Transfer Payment</h1>
          <p className="text-lg text-center">Your order has been placed successfully!</p>

          {/* Bank Info */}
          <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Bank Account Details</h2>
            <ul className="space-y-1 text-sm">
              <li><strong>Bank Name:</strong> First Bank</li>
              <li><strong>Account Name:</strong> Your Company Name</li>
              <li><strong>Account Number:</strong> 1234567890</li>
              <li><strong>SWIFT/BIC:</strong> FBNINGLA</li>
              <li><strong>IBAN:</strong> NG2912345678901234</li>
            </ul>
          </section>

          {/* Transfer Info */}
          <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Transfer Details</h2>
            <p><strong>Amount:</strong> {currency}{total.toFixed(2)}</p>
            <p><strong>currency:</strong> NGN</p>
            <p className="text-sm mt-2">
              Use your <strong>Order ID</strong> as the transfer reference:{" "}
              <span className="font-mono bg-white px-2 py-1 rounded border border-dashed border-gray-400 dark:bg-black dark:text-white">
                {order.orderId || "ORD-XXXXX"}
              </span>
            </p>
          </section>

          {/* Instructions */}
          <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open your mobile banking app or visit your bank branch.</li>
              <li>Transfer the exact amount to the account listed above.</li>
              <li>Include the Order ID <strong>{order.orderId}</strong> as the payment reference.</li>
              <li>After the transfer, proceed to upload your payment proof.</li>
            </ol>
          </section>

          {/* Upload Section */}
          <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Upload Payment Proof</h2>
            <form onSubmit={handleUpload}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="block w-full mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-600 dark:border-gray-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-orange-700 disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Proof'}
              </button>
            </form>

            {showConfirmation && (
              <div className="mt-4 p-3 text-sm bg-green-100 text-green-800 rounded">
                ✅ Payment proof received. We will confirm your payment within a few hours.
              </div>
            )}

          </section>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleBackToMyOrders}
              className="px-6 py-3 bg-gray-600 hover:bg-black text-white rounded shadow-md"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BankTransferPage;
