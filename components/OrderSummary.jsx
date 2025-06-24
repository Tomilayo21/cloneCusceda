// 'use client';
// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const paymentMethods = [
//   { id: 'stripe', label: 'Stripe', fee: 0.029, url: 'https://buy.stripe.com/test_eVqcN4dKX4XufS8cTx1B600' },
//   { id: 'paypal', label: 'PayPal', fee: 0.034, url: 'https://www.paypal.com/checkoutnow' },
//   { id: 'apple', label: 'Apple Pay', fee: 0.025, url: 'https://www.apple.com/apple-pay/' },
//   { id: 'google', label: 'Google Pay', fee: 0.025, url: 'https://pay.google.com/' },
//   { id: 'amazon', label: 'Amazon Pay', fee: 0.03, url: 'https://pay.amazon.com/' },
//   { id: 'bank-transfer', label: 'Direct Bank Transfer', fee: 0.015, url: '/payment/bank-transfer' },
//   { id: 'crypto', label: 'Cryptocurrency', fee: 0.02, url: 'https://commerce.coinbase.com/' },
//   { id: 'mpesa', label: 'M-Pesa', fee: 0.025, url: 'https://www.safaricom.co.ke/personal/m-pesa' },
//   { id: 'paytm', label: 'Paytm', fee: 0.02, url: 'https://paytm.com/' },
//   { id: 'cash-on-delivery', label: 'Cash on Delivery', fee: 0, url: '/payment/cash-on-delivery' },
// ];

// const OrderSummary = () => {
//   const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState('stripe');
  
  

//   const selected = paymentMethods.find((m) => m.id === selectedMethod);
//   const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02); // subtotal + tax
//   const feeAmount = selected ? baseAmount * selected.fee : 0;
//   const total = baseAmount + feeAmount;

//   const fetchUserAddresses = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get('/api/user/get-address', { headers: { Authorization: `Bearer ${token}` } });
//       if (data.success) {
//         setUserAddresses(data.addresses);
//         if (data.addresses.length > 0) {
//           setSelectedAddress(data.addresses[0]);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//    const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   // const handlePayment = async () => {
//   //   if (processing) return;

//   //   if (!selectedAddress) return toast.error('Please select an address');
//   //   const cartItemsArray = Object.keys(cartItems).map((key) => ({ product: key, quantity: cartItems[key] })).filter(item => item.quantity > 0);
//   //   if (cartItemsArray.length === 0) return toast.error('Cart is empty');

//   //   setProcessing(true);

//   //   try {
//   //     const token = await getToken();
//   //     const { data } = await axios.post('/api/order/create', {
//   //       address: selectedAddress._id,
//   //       items: cartItemsArray,
//   //       paymentMethod: selected.id
//   //     }, {
//   //       headers: { Authorization: `Bearer ${token}` }
//   //     });

//   //     if (data.success) {
//   //       toast.success("Redirecting to payment...");
//   //       setCartItems({});
//   //       if (selected.url.startsWith('/')) {
//   //         router.push(selected.url);
//   //       } else {
//   //         window.location.href = selected.url;
//   //       }
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   } finally {
//   //     setProcessing(false);
//   //   }
//   // };
//   const handlePayment = async () => {
//   if (processing) return;

//   if (!selectedAddress) return toast.error('Please select an address');
//   const cartItemsArray = Object.keys(cartItems)
//     .map((key) => ({
//       product: key,
//       quantity: cartItems[key],
//     }))
//     .filter((item) => item.quantity > 0);

//   if (cartItemsArray.length === 0) return toast.error('Cart is empty');

//   setProcessing(true);

//   try {
//     const token = await getToken();

//     // Create order first
//     const { data } = await axios.post(
//       '/api/order/create',
//       {
//         address: selectedAddress._id,
//         items: cartItemsArray,
//         paymentMethod: selected.id,
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (!data.success) {
//       toast.error(data.message);
//       return;
//     }

//     toast.success('Redirecting to payment...');
//     setCartItems({});

  
//     if (selected.id === 'stripe') {
//   const items = Object.values(cartItems).map(({ name, image, price, quantity }) => ({
//     name,
//     image: image || 'https://via.placeholder.com/300',
//     price: Math.round(price * 100), 
//     quantity
//   }));

//   const res = await fetch('/api/checkout/stripe', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ items: cartItems }), // cartItems = { "productId": quantity }
//   });

//   const session = await res.json();

//   if (session.url) {
//     window.location.href = session.url;
//   } else {
//     toast.error(session.error || 'Stripe checkout failed.');
//   }
// }


//   } catch (error) {
//     toast.error(error.message);
//   } finally {
//     setProcessing(false);
//   }
// };


//   useEffect(() => {
//     if (user) fetchUserAddresses();
//   }, [user]);

//   return (
//     <div className="w-full md:w-96 bg-gray-500/5 p-5">
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
//       <hr className="border-gray-500/30 my-5" />

//       {/* Address Selection */}
//       <div className="space-y-6">
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Select Address</label>
//           <div className="relative inline-block w-full text-sm border">
//             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none">
//               {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}` : "Select Address"}
//               <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="#6B7280">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {isDropdownOpen && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.map((address, index) => (
//                   <li key={index} onClick={() => handleAddressSelect(address)} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
//                     {address.fullName}, {address.area}, {address.city}, {address.state}
//                   </li>
//                 ))}
//                 <li onClick={() => router.push("/add-address")} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center">
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Promo Code */}
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Promo Code</label>
//           <div className="flex flex-col items-start gap-3">
//             <input type="text" placeholder="Enter promo code" className="flex-grow w-full outline-none p-2.5 text-gray-600 border" />
//             <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">Apply</button>
//           </div>
//         </div>

//         {/* Cart Summary */}
//         <hr className="border-gray-500/30 my-5" />
//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">Free</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>{currency}{total.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* Payment Method */}
//         <div className="mt-4 space-y-2">
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Payment Method</label>
//           <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="w-full p-2 border text-gray-700">
//             {paymentMethods.map((method) => (
//               <option key={method.id} value={method.id}>
//                 {method.label} - Fee: {(method.fee * 100).toFixed(1)}%
//               </option>
//             ))}
//           </select>
//           <p className="text-sm text-gray-600">Transaction Fee: <span className="text-orange-600 font-medium">{currency}{feeAmount.toFixed(2)}</span></p>
//         </div>

//         {/* Submit */}
//         <button
//           onClick={handlePayment}
//           disabled={processing}
//           className={`w-full py-3 mt-5 text-white ${processing ? 'bg-black cursor-not-allowed' : 'bg-black hover:bg-orange-700'}`}
//         >
//           {processing ? "Processing..." : "Continue to Payment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;

































































// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const paymentMethods = [
//   { id: 'stripe', label: 'Stripe', fee: 0.029, url: 'https://buy.stripe.com/test_eVqcN4dKX4XufS8cTx1B600' },
//   { id: 'paypal', label: 'PayPal', fee: 0.034, url: 'https://www.paypal.com/checkoutnow' },
//   { id: 'apple', label: 'Apple Pay', fee: 0.025, url: 'https://www.apple.com/apple-pay/' },
//   { id: 'google', label: 'Google Pay', fee: 0.025, url: 'https://pay.google.com/' },
//   { id: 'amazon', label: 'Amazon Pay', fee: 0.03, url: 'https://pay.amazon.com/' },
//   { id: 'bank-transfer', label: 'Direct Bank Transfer', fee: 0.015, url: '/payment/bank-transfer' },
//   { id: 'crypto', label: 'Cryptocurrency', fee: 0.02, url: 'https://commerce.coinbase.com/' },
//   { id: 'mpesa', label: 'M-Pesa', fee: 0.025, url: 'https://www.safaricom.co.ke/personal/m-pesa' },
//   { id: 'paytm', label: 'Paytm', fee: 0.02, url: 'https://paytm.com/' },
//   { id: 'cash-on-delivery', label: 'Cash on Delivery', fee: 0, url: '/payment/cash-on-delivery' },
// ];

// const OrderSummary = () => {
//   const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState('stripe');
//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState(null);

//   const selected = paymentMethods.find((m) => m.id === selectedMethod);
//   const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02); // subtotal + tax
//   const feeAmount = selected ? baseAmount * selected.fee : 0;
//   const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
//   const total = baseAmount + feeAmount + shippingFee;

//   const fetchUserAddresses = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get('/api/user/get-address', { headers: { Authorization: `Bearer ${token}` } });
//       if (data.success) {
//         setUserAddresses(data.addresses);
//         if (data.addresses.length > 0) {
//           setSelectedAddress(data.addresses[0]);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const fetchShippingRates = async () => {
//     if (!selectedAddress) return;
//     try {
//       const token = await getToken();
//       const parcel = { length: '5', width: '5', height: '5', distance_unit: 'in', weight: '2', mass_unit: 'lb' };
//       const addressTo = selectedAddress;
//       const addressFrom = {
//         name: "Shop Admin",
//         street1: "123 Market Rd",
//         city: "Lagos",
//         state: "LA",
//         zip: "100001",
//         country: "NG",
//         phone: "+2348000000000",
//         email: "admin@example.com",
//       };

//       const { data } = await axios.post('/api/shipping/create', { addressTo, addressFrom, parcel });
//       if (data.success) {
//         setShippingOptions(data.shipment.rates);
//         setSelectedShipping(data.shipment.rates[0]);
//       } else {
//         toast.error("Failed to get shipping rates");
//       }
//     } catch (error) {
//       toast.error("Error fetching shipping rates");
//     }
//   };

//   const handlePayment = async () => {
//     if (processing) return;
//     if (!selectedAddress) return toast.error('Please select an address');
//     if (!selectedShipping) return toast.error('Select a shipping method');

//     const cartItemsArray = Object.keys(cartItems)
//       .map((key) => ({ product: key, quantity: cartItems[key] }))
//       .filter((item) => item.quantity > 0);

//     if (cartItemsArray.length === 0) return toast.error('Cart is empty');

//     setProcessing(true);

//     try {
//       const token = await getToken();
//       const orderRes = await axios.post('/api/order/create', {
//         address: selectedAddress._id,
//         items: cartItemsArray,
//         paymentMethod: selected.id,
//         shippingRate: selectedShipping.object_id
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!orderRes.data.success) {
//         toast.error(orderRes.data.message);
//         return;
//       }

//       // Book shipment to generate label
//       const bookingRes = await axios.post('/api/shipping/book', {
//         shipmentId: orderRes.data.shipmentId,
//         rateObjectId: selectedShipping.object_id
//       });

//       if (bookingRes.data.success) {
//         toast.success('Shipment booked and label generated. Redirecting to payment...');
//       }

//       setCartItems({});
//       if (selected.url.startsWith('/')) {
//         router.push(selected.url);
//       } else {
//         window.location.href = selected.url;
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchUserAddresses();
//   }, [user]);

//   useEffect(() => {
//     fetchShippingRates();
//   }, [selectedAddress]);

//   return (
//     <div className="w-full md:w-96 bg-gray-500/5 p-5">
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
//       <hr className="border-gray-500/30 my-5" />

//       <div className="space-y-6">
//         {/* Address Dropdown */}
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Select Address</label>
//           <div className="relative inline-block w-full text-sm border">
//             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700">
//               {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}` : "Select Address"}
//               <svg className={`w-5 h-5 float-right ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {isDropdownOpen && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.map((address, index) => (
//                   <li key={index} onClick={() => handleAddressSelect(address)} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
//                     {address.fullName}, {address.area}, {address.city}, {address.state}
//                   </li>
//                 ))}
//                 <li onClick={() => router.push("/add-address")} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center">
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Shipping Options */}
//         {shippingOptions.length > 0 && (
//           <div>
//             <label className="text-base font-medium uppercase text-gray-600 block mb-2">Shipping Options</label>
//             <select value={selectedShipping?.object_id} onChange={(e) => setSelectedShipping(shippingOptions.find(s => s.object_id === e.target.value))} className="w-full p-2 border text-gray-700">
//               {shippingOptions.map((option) => (
//                 <option key={option.object_id} value={option.object_id}>
//                   {option.provider} {option.servicelevel.name} - ₦{parseFloat(option.amount.amount).toFixed(2)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Payment Method */}
//         <div className="mt-4 space-y-2">
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Payment Method</label>
//           <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="w-full p-2 border text-gray-700">
//             {paymentMethods.map((method) => (
//               <option key={method.id} value={method.id}>
//                 {method.label} - Fee: {(method.fee * 100).toFixed(1)}%
//               </option>
//             ))}
//           </select>
//           <p className="text-sm text-gray-600">Transaction Fee: <span className="text-orange-600 font-medium">{currency}{feeAmount.toFixed(2)}</span></p>
//         </div>

//         {/* Cart Summary */}
//         <hr className="border-gray-500/30 my-5" />
//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">{currency}{shippingFee.toFixed(2)}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>{currency}{total.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* Submit */}
//         <button onClick={handlePayment} disabled={processing} className={`w-full py-3 mt-5 text-white ${processing ? 'bg-black cursor-not-allowed' : 'bg-black hover:bg-orange-700'}`}>
//           {processing ? "Processing..." : "Continue to Payment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;
















































// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const paymentMethods = [
//   { id: 'stripe', label: 'Stripe', fee: 0.029, url: 'https://buy.stripe.com/test_eVqcN4dKX4XufS8cTx1B600' },
//   { id: 'paypal', label: 'PayPal', fee: 0.034, url: 'https://www.paypal.com/checkoutnow' },
//   { id: 'apple', label: 'Apple Pay', fee: 0.025, url: 'https://www.apple.com/apple-pay/' },
//   { id: 'google', label: 'Google Pay', fee: 0.025, url: 'https://pay.google.com/' },
//   { id: 'amazon', label: 'Amazon Pay', fee: 0.03, url: 'https://pay.amazon.com/' },
//   { id: 'bank-transfer', label: 'Direct Bank Transfer', fee: 0.015, url: '/payment/bank-transfer' },
//   { id: 'crypto', label: 'Cryptocurrency', fee: 0.02, url: 'https://commerce.coinbase.com/' },
//   { id: 'mpesa', label: 'M-Pesa', fee: 0.025, url: 'https://www.safaricom.co.ke/personal/m-pesa' },
//   { id: 'paytm', label: 'Paytm', fee: 0.02, url: 'https://paytm.com/' },
//   { id: 'cash-on-delivery', label: 'Cash on Delivery', fee: 0, url: '/payment/cash-on-delivery' },
// ];

// const OrderSummary = () => {
//   const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState('stripe');
//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState(null);

//   const selected = paymentMethods.find((m) => m.id === selectedMethod);
//   const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02); // subtotal + tax
//   const feeAmount = selected ? baseAmount * selected.fee : 0;
//   const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
//   const total = baseAmount + feeAmount + shippingFee;

//   // ✅ FIXED: Handle address selection
//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const fetchUserAddresses = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get('/api/user/get-address', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (data.success) {
//         setUserAddresses(data.addresses);
//         if (data.addresses.length > 0) {
//           setSelectedAddress(data.addresses[0]);
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const fetchShippingRates = async () => {
//     if (!selectedAddress) return;
//     try {
//       const token = await getToken();
//       const parcel = {
//         length: '5',
//         width: '5',
//         height: '5',
//         distance_unit: 'in',
//         weight: '2',
//         mass_unit: 'lb'
//       };

//       const addressTo = selectedAddress;
//       const addressFrom = {
//         name: "Shop Admin",
//         street1: "123 Market Rd",
//         city: "Lagos",
//         state: "LA",
//         zip: "100001",
//         country: "NG",
//         phone: "+2348000000000",
//         email: "admin@example.com",
//       };

//       const { data } = await axios.post('/api/shipping/create', {
//         addressTo,
//         addressFrom,
//         parcel
//       });

//       if (data.success && data.shipment.rates.length > 0) {
//         setShippingOptions(data.shipment.rates);
//         setSelectedShipping(data.shipment.rates[0]);
//       } else {
//         toast.error("No shipping rates available");
//       }
//     } catch (error) {
//       toast.error("Error fetching shipping rates");
//       console.error("Shipping error:", error);
//     }
//   };

//   const handlePayment = async () => {
//     if (processing) return;
//     if (!selectedAddress) return toast.error('Please select an address');
//     if (!selectedShipping) return toast.error('Select a shipping method');

//     const cartItemsArray = Object.keys(cartItems)
//       .map((key) => ({ product: key, quantity: cartItems[key] }))
//       .filter((item) => item.quantity > 0);

//     if (cartItemsArray.length === 0) return toast.error('Cart is empty');

//     setProcessing(true);

//     try {
//       const token = await getToken();
//       const orderRes = await axios.post('/api/order/create', {
//         address: selectedAddress._id,
//         items: cartItemsArray,
//         paymentMethod: selected.id,
//         shippingRate: selectedShipping.object_id
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!orderRes.data.success) {
//         toast.error(orderRes.data.message);
//         return;
//       }

//       const bookingRes = await axios.post('/api/shipping/book', {
//         shipmentId: orderRes.data.shipmentId,
//         rateObjectId: selectedShipping.object_id
//       });

//       if (bookingRes.data.success) {
//         toast.success('Shipment booked and label generated. Redirecting to payment...');
//       }

//       setCartItems({});
//       if (selected.url.startsWith('/')) {
//         router.push(selected.url);
//       } else {
//         window.location.href = selected.url;
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchUserAddresses();
//   }, [user]);

//   useEffect(() => {
//     fetchShippingRates();
//   }, [selectedAddress]);

//   return (
//     <div className="w-full md:w-96 bg-gray-500/5 p-5">
//       <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
//       <hr className="border-gray-500/30 my-5" />

//       <div className="space-y-6">
//         {/* Address Dropdown */}
//         <div>
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Select Address</label>
//           <div className="relative inline-block w-full text-sm border">
//             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700">
//               {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}` : "Select Address"}
//               <svg className={`w-5 h-5 float-right ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {isDropdownOpen && (
//               <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
//                 {userAddresses.map((address, index) => (
//                   <li key={index} onClick={() => handleAddressSelect(address)} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
//                     {address.fullName}, {address.area}, {address.city}, {address.state}
//                   </li>
//                 ))}
//                 <li onClick={() => router.push("/add-address")} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center">
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Shipping Options */}
//         {shippingOptions.length > 0 && (
//           <div>
//             <label className="text-base font-medium uppercase text-gray-600 block mb-2">Shipping Options</label>
//             <select
//               value={selectedShipping?.object_id}
//               onChange={(e) => {
//                 const found = shippingOptions.find((s) => s.object_id === e.target.value);
//                 setSelectedShipping(found);
//               }}
//               className="w-full p-2 border text-gray-700"
//             >
//               {shippingOptions.map((option) => (
//                 <option key={option.object_id} value={option.object_id}>
//                   {option.provider} {option.servicelevel.name} - ₦{parseFloat(option.amount.amount).toFixed(2)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Payment Method */}
//         <div className="mt-4 space-y-2">
//           <label className="text-base font-medium uppercase text-gray-600 block mb-2">Payment Method</label>
//           <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="w-full p-2 border text-gray-700">
//             {paymentMethods.map((method) => (
//               <option key={method.id} value={method.id}>
//                 {method.label} - Fee: {(method.fee * 100).toFixed(1)}%
//               </option>
//             ))}
//           </select>
//           <p className="text-sm text-gray-600">
//             Transaction Fee: <span className="text-orange-600 font-medium">{currency}{feeAmount.toFixed(2)}</span>
//           </p>
//         </div>

//         {/* Cart Summary */}
//         <hr className="border-gray-500/30 my-5" />
//         <div className="space-y-4">
//           <div className="flex justify-between text-base font-medium">
//             <p className="uppercase text-gray-600">Items {getCartCount()}</p>
//             <p className="text-gray-800">{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Shipping Fee</p>
//             <p className="font-medium text-gray-800">{currency}{shippingFee.toFixed(2)}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="text-gray-600">Tax (2%)</p>
//             <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
//             <p>Total</p>
//             <p>{currency}{total.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           onClick={handlePayment}
//           disabled={processing}
//           className={`w-full py-3 mt-5 text-white ${processing ? 'bg-black cursor-not-allowed' : 'bg-black hover:bg-orange-700'}`}
//         >
//           {processing ? "Processing..." : "Continue to Payment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;























'use client';

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ... paymentMethods here
const paymentMethods = [
  { id: 'stripe', label: 'Stripe', fee: 0.029, url: 'https://buy.stripe.com/test_eVqcN4dKX4XufS8cTx1B600' },
  { id: 'paypal', label: 'PayPal', fee: 0.034, url: 'https://www.paypal.com/checkoutnow' },
  { id: 'apple', label: 'Apple Pay', fee: 0.025, url: 'https://www.apple.com/apple-pay/' },
  { id: 'google', label: 'Google Pay', fee: 0.025, url: 'https://pay.google.com/' },
  { id: 'amazon', label: 'Amazon Pay', fee: 0.03, url: 'https://pay.amazon.com/' },
  { id: 'bank-transfer', label: 'Direct Bank Transfer', fee: 0.015, url: '/payment/bank-transfer' },
  { id: 'crypto', label: 'Cryptocurrency', fee: 0.02, url: 'https://commerce.coinbase.com/' },
  { id: 'mpesa', label: 'M-Pesa', fee: 0.025, url: 'https://www.safaricom.co.ke/personal/m-pesa' },
  { id: 'paytm', label: 'Paytm', fee: 0.02, url: 'https://paytm.com/' },
  { id: 'cash-on-delivery', label: 'Cash on Delivery', fee: 0, url: '/payment/cash-on-delivery' },
];

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const selected = paymentMethods.find((m) => m.id === selectedMethod);
  const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
  const feeAmount = selected ? baseAmount * selected.fee : 0;
  const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
  const total = baseAmount + feeAmount + shippingFee;

  // ✅ FIXED: Declare handleAddressSelect before using it
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-address', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchShippingRates = async () => {
    if (!selectedAddress) return;
    try {
      const token = await getToken();
      const parcel = {
        length: '5',
        width: '5',
        height: '5',
        distance_unit: 'in',
        weight: '2',
        mass_unit: 'lb'
      };

      const addressTo = selectedAddress;
      const addressFrom = {
        name: "Shop Admin",
        street1: "123 Market Rd",
        city: "Lagos",
        state: "LA",
        zip: "100001",
        country: "NG",
        phone: "+2348000000000",
        email: "admin@example.com",
      };

      const { data } = await axios.post('/api/shipping/create', {
        addressTo,
        addressFrom,
        parcel
      });

      if (data.success && data.shipment.rates.length > 0) {
        setShippingOptions(data.shipment.rates);
        setSelectedShipping(data.shipment.rates[0]);
      } else {
        toast.error("No shipping rates available");
      }
    } catch (error) {
      toast.error("Error fetching shipping rates");
    }
  };

  const handlePayment = async () => {
    if (processing) return;
    if (!selectedAddress) return toast.error('Please select an address');
    if (!selectedShipping) return toast.error('Select a shipping method');

    const cartItemsArray = Object.keys(cartItems)
      .map((key) => ({ product: key, quantity: cartItems[key] }))
      .filter((item) => item.quantity > 0);

    if (cartItemsArray.length === 0) return toast.error('Cart is empty');

    setProcessing(true);

    try {
      const token = await getToken();
      const orderRes = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray,
        paymentMethod: selected.id,
        shippingRate: selectedShipping.object_id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!orderRes.data.success) {
        toast.error(orderRes.data.message);
        return;
      }

      const bookingRes = await axios.post('/api/shipping/book', {
        shipmentId: orderRes.data.shipmentId,
        rateObjectId: selectedShipping.object_id
      });

      if (bookingRes.data.success) {
        toast.success('Shipment booked and label generated. Redirecting to payment...');
      }

      setCartItems({});
      if (selected.url.startsWith('/')) {
        router.push(selected.url);
      } else {
        window.location.href = selected.url;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  useEffect(() => {
    fetchShippingRates();
  }, [selectedAddress]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">Order Summary</h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        {/* Address Dropdown */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">Select Address</label>
          <div className="relative inline-block w-full text-sm border">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700">
              {selectedAddress
                ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "Select Address"}
              <svg className={`w-5 h-5 float-right ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li key={index} onClick={() => handleAddressSelect(address)} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li onClick={() => router.push("/add-address")} className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center">
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Shipping + Payment + Summary */}
        {/* Shipping Options */}
        {shippingOptions.length > 0 && (
          <div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">Shipping Options</label>
            <select
              value={selectedShipping?.object_id}
              onChange={(e) => {
                const found = shippingOptions.find((s) => s.object_id === e.target.value);
                setSelectedShipping(found);
              }}
              className="w-full p-2 border text-gray-700"
            >
              {shippingOptions.map((option) => (
                <option key={option.object_id} value={option.object_id}>
                  {option.provider} {option.servicelevel.name} - ₦{parseFloat(option.amount.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Method */}
        <div className="mt-4 space-y-2">
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">Payment Method</label>
          <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="w-full p-2 border text-gray-700">
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.label} - Fee: {(method.fee * 100).toFixed(1)}%
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600">
            Transaction Fee: <span className="text-orange-600 font-medium">{currency}{feeAmount.toFixed(2)}</span>
          </p>
        </div>

        {/* Cart Summary */}
        <hr className="border-gray-500/30 my-5" />
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">{currency}{shippingFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{total.toFixed(2)}</p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className={`w-full py-3 mt-5 text-white ${processing ? 'bg-black cursor-not-allowed' : 'bg-black hover:bg-orange-700'}`}
        >
          {processing ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
