'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const paymentMethods = [
  { id: 'stripe', label: 'Stripe', fee: 0.029, url: 'https://checkout.stripe.com/' },
  { id: 'paypal', label: 'PayPal', fee: 0.034, url: 'https://www.paypal.com/checkoutnow' },
  { id: 'apple', label: 'Apple Pay', fee: 0.025, url: 'https://www.apple.com/apple-pay/' },
  { id: 'google', label: 'Google Pay', fee: 0.025, url: 'https://pay.google.com/' },
  { id: 'amazon', label: 'Amazon Pay', fee: 0.03, url: 'https://pay.amazon.com/' },
  { id: 'bank-transfer', label: 'Direct Bank Transfer', fee: 0.015, url: '/payment/bank-transfer' },
  { id: 'crypto', label: 'Cryptocurrency', fee: 0.02, url: 'https://commerce.coinbase.com/' },
  { id: 'mpesa', label: 'M-Pesa', fee: 0.025, url: 'https://www.safaricom.co.ke/personal/m-pesa' },
  { id: 'paytm', label: 'Paytm', fee: 0.02, url: 'https://paytm.com/' },
  { id: 'cash-on-delivery', label: 'Cash on Delivery', fee: 0, url: '/payment/cash-on-delivery' }, // You can create this page
];

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const baseAmount = 100.0;
  const router = useRouter();

  const selected = paymentMethods.find((m) => m.id === selectedMethod);
  const feeAmount = baseAmount * selected.fee;
  const total = baseAmount + feeAmount;

  const handlePayment = () => {
    if (selected.url.startsWith('/')) {
      // Internal route
      router.push(selected.url);
    } else {
      // External payment URL
      window.location.href = selected.url;
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Payment Options</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">Select a payment method and review transaction fees.</p>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded cursor-pointer ${
                selectedMethod === method.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
                <span>{method.label}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Fee: {(method.fee * 100).toFixed(1)}%
              </span>
            </label>
          ))}
        </div>

        <div className="text-right space-y-2">
          <p>Base Amount: <span className="font-semibold">${baseAmount.toFixed(2)}</span></p>
          <p>Transaction Fee: <span className="font-semibold text-orange-500">${feeAmount.toFixed(2)}</span></p>
          <p className="text-xl font-bold">Total: <span className="text-green-600">${total.toFixed(2)}</span></p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-lg transition"
        >
          Continue to Payment
        </button>
      </div>
    </main>
  );
};

export default PaymentPage;
