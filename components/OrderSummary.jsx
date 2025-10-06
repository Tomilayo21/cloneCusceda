// 'use client';

// import { useAppContext } from "@/context/AppContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Country, State, City } from "country-state-city";
// import { X, User, Phone, Mail, MapPin, Globe, Landmark } from "lucide-react"


// // ... paymentMethods here
// const paymentMethods = [
//   { id: 'stripe', label: 'Stripe', fee: 0.029, url: null },
//   { id: 'paystack', label: 'Paystack', fee: 0.015, url: null },
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
//   const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
//   const feeAmount = selected ? baseAmount * selected.fee : 0;
//   const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
//   const total = baseAmount + feeAmount + shippingFee;
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [showAddressDropdown, setShowAddressDropdown] = useState(false);

//   const [rates, setRates] = useState([]);
//   const [loadingRates, setLoadingRates] = useState(false);
//   const [rateError, setRateError] = useState("");
//   const [selectedRate, setSelectedRate] = useState(null);
//   const [bookingShipment, setBookingShipment] = useState(false);
//   const [bookingMessage, setBookingMessage] = useState("");
//   const parcel = {
//     length: 10,
//     width: 5,
//     height: 5,
//     distance_unit: "cm",
//     weight: 1,
//     mass_unit: "kg",
//   };

//   // 1. Fetch shipping rates
//   const fetchRates = async () => {
//     setLoadingRates(true);
//     setRateError("");
//     try {
//       const res = await fetch("/api/shipping/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId, parcel }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.message || "Failed to fetch rates");
//       setRates(data.rates);
//     } catch (err) {
//       setRateError(err.message);
//     } finally {
//       setLoadingRates(false);
//     }
//   };

//   // 2. Book shipment
//   const bookShipment = async () => {
//     if (!selectedRate) return;
//     setBookingShipment(true);
//     setBookingMessage("");
//     try {
//       const res = await fetch("/api/shipping/book", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderId,
//           parcel,
//           rateId: selectedRate.object_id,
//         }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.message);
//       setBookingMessage(`✅ Shipment booked! Tracking #: ${data.transaction.tracking_number}`);
//     } catch (err) {
//       setBookingMessage(`❌ ${err.message}`);
//     } finally {
//       setBookingShipment(false);
//     }
//   };

  


//   // ✅ FIXED: Declare handleAddressSelect before using it
//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//     setShowAddressDropdown(false);
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

//       if (data.success && data.rates.length > 0) {
//         setShippingOptions(data.rates);
//         setSelectedShipping(data.rates[0]);
//       } else {
//         toast.error("No shipping rates available");
//       }

//     } catch (error) {
//       toast.error("Error fetching shipping rates");
//     }
//   };

//   const handlePayment = async () => {
//     if (processing) return;
//     if (!selectedAddress) return toast.error("Please select an address");

//     // Convert cart to array: [{ product, quantity }]
//     const cartItemsArray = Object.keys(cartItems)
//       .map((key) => ({ product: key, quantity: cartItems[key] }))
//       .filter((item) => item.quantity > 0);

//     if (cartItemsArray.length === 0) return toast.error("Cart is empty");

//     setProcessing(true);

//     try {
//       const token = await getToken();

//       // ✅ Stripe payment flow
//       if (selected.id === "stripe") {
//         const cartItemsObject = Object.keys(cartItems).reduce((acc, id) => {
//           acc[id] = cartItems[id];
//           return acc;
//         }, {});

//         const { data } = await axios.post(
//           "/api/checkout/stripe",
//           {
//             items: cartItemsObject,
//             address: selectedAddress,       // optional, for metadata or future use
//             paymentMethod: selected.id
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` }
//           }
//         );

//         if (!data.url) throw new Error("No Stripe session URL returned");

//         // Save order info temporarily to finalize after redirect
//         sessionStorage.setItem("pendingOrder", JSON.stringify({
//           addressId: selectedAddress._id,
//           items: cartItemsArray,
//           paymentMethod: selected.id
//         }));

//         return (window.location.href = data.url);
//       }
      
//       if (selected.id === "paystack") {
//         const cartItemsObject = Object.keys(cartItems).reduce((acc, id) => {
//           acc[id] = cartItems[id];
//           return acc;
//         }, {});

//         const { data } = await axios.post(
//           "/api/checkout/paystack",
//           {
//             items: cartItemsObject,   // ✅ now object, matches backend
//             address: selectedAddress,
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (!data.success) throw new Error("Paystack init failed");

//         sessionStorage.setItem("pendingOrder", JSON.stringify({
//           addressId: selectedAddress._id,
//           items: cartItemsObject,
//           paymentMethod: selected.id,
//         }));

//         return (window.location.href = data.authorizationUrl);
//       }

//       // ✅ Other payment methods (bank transfer, PayPal, etc.)
//       if (selected.url.startsWith("/")) {
//         router.push(selected.url);
//       } else {
//         window.location.href = selected.url;
//       }
//     } catch (error) {
//       toast.error(error.message || "Payment initialization failed");
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

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this address?")) return;
//     try {
//       const res = await fetch(`/api/user/add-address/${id}`, { method: "DELETE" });
//       if (res.ok) {
//         toast.success("Address deleted");
//         // fetchAddresses(); // Re-fetch the list
//         fetchUserAddresses(); // ✅ not fetchAddresses()
//       } else {
//         toast.error("Failed to delete address");
//       }
//     } catch (err) {
//       toast.error("Error deleting address");
//     }
//   };

//   const handleEdit = (address) => {
//     setEditingAddress(address); // set this to open modal with pre-filled values
//     setShowEditModal(true);
//   };

//   // Load countries initially
//   useEffect(() => {
//     const countryList = Country.getAllCountries();
//     setCountries(countryList);
//   }, []);

//   // Load states when country changes
//   useEffect(() => {
//     if (selectedCountry) {
//       const country = countries.find(c => c.name === selectedCountry);
//       if (country) {
//         const stateList = State.getStatesOfCountry(country.isoCode);
//         setStates(stateList);
//       } else {
//         setStates([]);
//       }
//     } else {
//       setStates([]);
//     }

//     setCities([]);
//     setSelectedState("");
//     setSelectedCity("");
//   }, [selectedCountry, countries]);

//   // Load cities when state changes
//   useEffect(() => {
//     if (selectedCountry && selectedState) {
//       const country = countries.find(c => c.name === selectedCountry);
//       const state = states.find(s => s.name === selectedState);

//       if (country && state) {
//         const cityList = City.getCitiesOfState(country.isoCode, state.isoCode);
//         setCities(cityList);
//       } else {
//         setCities([]);
//       }
//     } else {
//       setCities([]);
//     }
//   }, [selectedState, selectedCountry, countries, states]);

//   return (  
//     <div className="w-full md:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
//       {/* Title */}
//       <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
//         Order <span className="text-orange-600">Summary</span>
//       </h2>
//       <hr className="border-gray-200 dark:border-gray-700 my-4 md:my-5" />

//       <div className="space-y-4 md:space-y-6">
//         {/* Address Dropdown */}
//         <div>
//           <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//             Shipping Address
//           </label>
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="w-full flex justify-between items-center px-3 py-2.5 md:px-4 md:py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:ring-1 hover:ring-orange-500 transition"
//             >
//               {selectedAddress
//                 ? `${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.state}`
//                 : "Select Address"}
//               <svg
//                 className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                 {userAddresses.map((address, idx) => (
//                   <div key={idx} className="mb-2">
//                     <li
//                       onClick={() => {
//                         handleAddressSelect(address);
//                         setShowAddressDropdown(false);
//                       }}
//                       className="px-3 py-2 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
//                     >
//                       {address.fullName}, {address.city}, {address.state}, {address.country}
//                     </li>
//                     <div className="flex justify-end gap-2 px-3 text-sm text-blue-600">
//                       <button onClick={() => handleEdit(address)}>Edit</button>
//                       <button onClick={() => handleDelete(address._id)}>Delete</button>
//                     </div>
//                   </div>
//                 ))}
//                 <li
//                   onClick={() => {
//                     router.push("/add-address");
//                     setShowAddressDropdown(false);
//                   }}
//                   className="px-3 py-2 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer"
//                 >
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
            
//             {showEditModal && selectedAddress && (
//               <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
//                 <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-4 md:p-6 relative">
                  
//                   {/* Close button */}
//                   <button
//                     className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
//                     onClick={() => setShowEditModal(false)}
//                   >
//                     <X className="w-6 h-6" />
//                   </button>

//                   {/* Title */}
//                   <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 md:mb-6 flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-orange-500" />
//                     Edit Address
//                   </h2>

//                   <form
//                     onSubmit={async (e) => {
//                       e.preventDefault();
//                       const formData = new FormData(e.target);
//                       const updated = Object.fromEntries(formData.entries());

//                       try {
//                         const res = await fetch(`/api/user/add-address/${editingAddress._id}`, {
//                           method: "PUT",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify(updated),
//                         });

//                         if (!res.ok) throw new Error("Failed to update");

//                         setUserAddresses(prev =>
//                           prev.map(addr =>
//                             addr._id === editingAddress._id ? { ...addr, ...updated } : addr
//                           )
//                         );

//                         toast.success("Address updated");
//                         setShowEditModal(false);
//                         setEditingAddress(null);
//                       } catch (err) {
//                         toast.error("Update failed");
//                       }
//                     }}
//                     className="space-y-3 md:space-y-4"
//                   >
//                     {/* Full Name */}
//                     <div>
//                       <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
//                         <User className="w-4 h-4 text-orange-500" /> Full Name
//                       </label>
//                       <input
//                         name="fullName"
//                         defaultValue={selectedAddress.fullName}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                         placeholder="Enter full name"
//                       />
//                     </div>

//                     {/* Phone Number */}
//                     <div>
//                       <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
//                         <Phone className="w-4 h-4 text-orange-500" /> Phone Number
//                       </label>
//                       <input
//                         name="phoneNumber"
//                         defaultValue={selectedAddress.phoneNumber}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                         placeholder="Enter phone number"
//                       />
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
//                         <Mail className="w-4 h-4 text-orange-500" /> Email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         defaultValue={selectedAddress.email}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                         placeholder="Enter email"
//                       />
//                     </div>

//                     {/* Zip Code */}
//                     <div>
//                       <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
//                         <MapPin className="w-4 h-4 text-orange-500" /> Zip Code
//                       </label>
//                       <input
//                         name="zipcode"
//                         defaultValue={selectedAddress.zipcode}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                         placeholder="Enter zip code"
//                       />
//                     </div>

//                     {/* Country / State / City */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                       <select
//                         name="country"
//                         value={selectedCountry}
//                         onChange={(e) => {
//                           setSelectedCountry(e.target.value);
//                           setSelectedState("");
//                           setSelectedCity("");
//                         }}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                       >
//                         <option value="">Select Country</option>
//                         {countries.map((country) => (
//                           <option key={country.isoCode} value={country.name}>
//                             {country.name}
//                           </option>
//                         ))}
//                       </select>

//                       <select
//                         name="state"
//                         value={selectedState}
//                         onChange={(e) => {
//                           setSelectedState(e.target.value);
//                           setSelectedCity("");
//                         }}
//                         disabled={!states.length}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                       >
//                         <option value="">Select State</option>
//                         {states.map((state) => (
//                           <option key={state.isoCode} value={state.name}>
//                             {state.name}
//                           </option>
//                         ))}
//                       </select>

//                       <select
//                         name="city"
//                         value={selectedCity}
//                         onChange={(e) => setSelectedCity(e.target.value)}
//                         disabled={!cities.length}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                       >
//                         <option value="">Select City</option>
//                         {cities.map((city, index) => (
//                           <option key={index} value={city.name}>
//                             {city.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Street / Area */}
//                     <div>
//                       <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
//                         <Landmark className="w-4 h-4 text-orange-500" /> Street / Area
//                       </label>
//                       <textarea
//                         name="area"
//                         defaultValue={selectedAddress.area}
//                         className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-neutral-800 focus:ring-2 focus:ring-orange-500 outline-none"
//                         placeholder="Enter street / area"
//                         rows={3}
//                       />
//                     </div>

//                     {/* Submit */}
//                     <button
//                       type="submit"
//                       className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
//                     >
//                       Save Changes
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
        
//         {/* Shipping Rates */}
//         <div>
//           <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//             Shipping Options
//           </label>

//           {/* Fetch Rates Button */}
//           <button
//             onClick={fetchRates}
//             disabled={loadingRates}
//             className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition mt-2"
//           >
//             {loadingRates ? "Fetching Rates..." : "Get Shipping Rates"}
//           </button>

//           {/* Error Message */}
//           {rateError && (
//             <p className="text-red-500 text-sm mt-2">{rateError}</p>
//           )}

//           {/* Rates List */}
//           {rates.length > 0 && (
//             <ul className="mt-3 space-y-2">
//               {rates.map((rate) => (
//                 <li
//                   key={rate.object_id}
//                   className={`p-3 border rounded-lg cursor-pointer transition ${
//                     selectedRate?.object_id === rate.object_id
//                       ? "border-orange-500 bg-orange-50 dark:bg-neutral-800"
//                       : "border-gray-300 dark:border-gray-600"
//                   }`}
//                   onClick={() => setSelectedRate(rate)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium text-gray-700 dark:text-gray-200">
//                       {rate.provider} - {rate.servicelevel?.name}
//                     </p>
//                     <p className="font-semibold text-orange-600">
//                       {rate.amount_local} {rate.currency_local}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}

//           {/* Book Shipment Button */}
//           {selectedRate && (
//             <button
//               onClick={bookShipment}
//               disabled={bookingShipment}
//               className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//             >
//               {bookingShipment ? "Booking Shipment..." : "Confirm Shipping Option"}
//             </button>
//           )}

//           {/* Booking Status */}
//           {bookingMessage && (
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{bookingMessage}</p>
//           )}
//         </div>

//         {/* Payment Method */}
//         <div>
//           <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//             Payment Method
//           </label>
//           <select
//             value={selectedMethod}
//             onChange={(e) => setSelectedMethod(e.target.value)}
//             className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-orange-500 transition"
//           >
//             {paymentMethods.map((method) => (
//               <option key={method.id} value={method.id}>
//                 {method.label} — Fee: {(method.fee * 100).toFixed(1)}%
//               </option>
//             ))}
//           </select>
//           <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//             Transaction Fee:{" "}
//             <span className="text-orange-600 font-medium">{currency}{feeAmount.toFixed(2)}</span>
//           </p>
//         </div>

//         {/* Cart Summary */}
//         <hr className="border-gray-200 dark:border-gray-700 my-4 md:my-5" />
//         <div className="space-y-2 md:space-y-4 text-sm md:text-base">
//           <div className="flex justify-between font-medium text-gray-700 dark:text-gray-200">
//             <p>Items ({getCartCount()})</p>
//             <p>{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between text-gray-600 dark:text-gray-400">
//             <p>Shipping Fee</p>
//             <p className="font-medium text-gray-800 dark:text-gray-200">{currency}{shippingFee.toFixed(2)}</p>
//           </div>
//           <div className="flex justify-between text-gray-600 dark:text-gray-400">
//             <p>Tax (2%)</p>
//             <p className="font-medium text-gray-800 dark:text-gray-200">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg font-semibold border-t pt-3 text-gray-900 dark:text-gray-100">
//             <p>Total</p>
//             <p>{currency}{total.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* Continue to Payment Button */}
//         <button
//           onClick={handlePayment}
//           disabled={processing || getCartCount() === 0}
//           className={`w-full py-3 mt-4 md:mt-5 rounded-lg text-white font-medium transition ${
//             processing || getCartCount() === 0
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-orange-600 hover:bg-orange-700 shadow-md"
//           }`}
//         >
//           {processing ? "Processing..." : `Pay with ${selected.label}`}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;       




















































































// "use client";

// import React, { useEffect, useState } from "react";
// import { useAppContext } from "@/context/AppContext";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Country, State, City } from "country-state-city";
// import { X, User, Phone, Mail, MapPin, Globe, Landmark } from "lucide-react";

// const paymentMethods = [
//   { id: "stripe", label: "Stripe", fee: 0.029, url: null },
//   { id: "paystack", label: "Paystack", fee: 0.015, url: null },
// ];

// const OrderSummary = () => {
//   const router = useRouter();
//   const {
//     currency,
//     getCartCount,
//     getCartAmount,
//     getToken,
//     currentUser,
//     cartItems,
//     setCartItems,
//   } = useAppContext();

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState("stripe");
//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState(null);

//   const [rates, setRates] = useState([]);
//   const [loadingRates, setLoadingRates] = useState(false);
//   const [rateError, setRateError] = useState("");
//   const [selectedRate, setSelectedRate] = useState(null);
//   const [bookingShipment, setBookingShipment] = useState(false);
//   const [bookingMessage, setBookingMessage] = useState("");

//   const [editingAddress, setEditingAddress] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
//   const selectedPayment = paymentMethods.find((m) => m.id === selectedMethod);
//   const feeAmount = selectedPayment ? baseAmount * selectedPayment.fee : 0;
//   const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
//   const total = baseAmount + feeAmount + shippingFee;

//   // -------------------- ADDRESS --------------------
//   const fetchUserAddresses = async () => {
//     if (!currentUser) return;
//     try {
//       const token = await getToken();
//       const { data } = await axios.get("/api/user/get-address", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.success) {
//         setUserAddresses(data.addresses);
//         if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
//       } else toast.error(data.message);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsDropdownOpen(false);
//   };

//   const handleDeleteAddress = async (id) => {
//     if (!confirm("Are you sure you want to delete this address?")) return;
//     try {
//       const res = await fetch(`/api/user/add-address/${id}`, { method: "DELETE" });
//       if (res.ok) {
//         toast.success("Address deleted");
//         fetchUserAddresses();
//       } else {
//         toast.error("Failed to delete address");
//       }
//     } catch (err) {
//       toast.error("Error deleting address");
//     }
//   };

//   const handleEditAddress = (address) => {
//     setEditingAddress(address);
//     setShowEditModal(true);
//   };

//   // -------------------- SHIPPING --------------------
//   const fetchShippingRates = async () => {
//     if (!selectedAddress) return;

//     try {
//       const token = await getToken();
//       const parcel = {
//         length: "5",
//         width: "5",
//         height: "5",
//         distance_unit: "in",
//         weight: "2",
//         mass_unit: "lb",
//       };

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

//       const { data } = await axios.post("/api/shipping/create", {
//         addressTo: selectedAddress,
//         addressFrom,
//         parcel,
//       });

//       if (data.success && data.rates.length > 0) {
//         setShippingOptions(data.rates);
//         setSelectedShipping(data.rates[0]);
//       } else {
//         toast.error("No shipping rates available");
//       }
//     } catch (err) {
//       toast.error("Error fetching shipping rates");
//     }
//   };

//   const fetchRates = async () => {
//     setLoadingRates(true);
//     setRateError("");
//     try {
//       const res = await fetch("/api/shipping/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ parcel: { length: 10, width: 5, height: 5, distance_unit: "cm", weight: 1, mass_unit: "kg" } }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.message || "Failed to fetch rates");
//       setRates(data.rates);
//     } catch (err) {
//       setRateError(err.message);
//     } finally {
//       setLoadingRates(false);
//     }
//   };

//   const bookShipment = async () => {
//     if (!selectedRate) return;
//     setBookingShipment(true);
//     setBookingMessage("");
//     try {
//       const res = await fetch("/api/shipping/book", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           parcel: { length: 10, width: 5, height: 5, distance_unit: "cm", weight: 1, mass_unit: "kg" },
//           rateId: selectedRate.object_id,
//         }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.message);
//       setBookingMessage(`✅ Shipment booked! Tracking #: ${data.transaction.tracking_number}`);
//     } catch (err) {
//       setBookingMessage(`❌ ${err.message}`);
//     } finally {
//       setBookingShipment(false);
//     }
//   };

//   // -------------------- PAYMENT --------------------
//   const handlePayment = async () => {
//     if (processing) return;
//     if (!selectedAddress) return toast.error("Please select an address");

//     const cartItemsArray = Object.keys(cartItems)
//       .map((key) => ({ product: key, quantity: cartItems[key] }))
//       .filter((item) => item.quantity > 0);

//     if (cartItemsArray.length === 0) return toast.error("Cart is empty");

//     setProcessing(true);

//     try {
//       const token = await getToken();

//       const cartItemsObject = Object.keys(cartItems).reduce((acc, id) => {
//         acc[id] = cartItems[id];
//         return acc;
//       }, {});

//       if (selectedPayment.id === "stripe") {
//         const { data } = await axios.post(
//           "/api/checkout/stripe",
//           { items: cartItemsObject, address: selectedAddress, paymentMethod: selectedPayment.id },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (!data.url) throw new Error("No Stripe session URL returned");

//         sessionStorage.setItem(
//           "pendingOrder",
//           JSON.stringify({ addressId: selectedAddress._id, items: cartItemsArray, paymentMethod: selectedPayment.id })
//         );

//         window.location.href = data.url;
//         return;
//       }

//       if (selectedPayment.id === "paystack") {
//         const { data } = await axios.post(
//           "/api/checkout/paystack",
//           { items: cartItemsObject, address: selectedAddress },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (!data.success) throw new Error("Paystack init failed");

//         sessionStorage.setItem(
//           "pendingOrder",
//           JSON.stringify({ addressId: selectedAddress._id, items: cartItemsObject, paymentMethod: selectedPayment.id })
//         );

//         window.location.href = data.authorizationUrl;
//         return;
//       }

//       if (selectedPayment.url.startsWith("/")) router.push(selectedPayment.url);
//       else window.location.href = selectedPayment.url;
//     } catch (err) {
//       toast.error(err.message || "Payment failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // -------------------- COUNTRY/STATE/CITY --------------------
//   useEffect(() => setCountries(Country.getAllCountries()), []);
//   useEffect(() => fetchUserAddresses(), [currentUser]);

//   useEffect(() => {
//     if (selectedCountry) {
//       const country = countries.find((c) => c.name === selectedCountry);
//       setStates(country ? State.getStatesOfCountry(country.isoCode) : []);
//     } else setStates([]);
//     setCities([]);
//     setSelectedState("");
//     setSelectedCity("");
//   }, [selectedCountry, countries]);

//   useEffect(() => {
//     if (selectedCountry && selectedState) {
//       const country = countries.find((c) => c.name === selectedCountry);
//       const state = states.find((s) => s.name === selectedState);
//       setCities(country && state ? City.getCitiesOfState(country.isoCode, state.isoCode) : []);
//     } else setCities([]);
//   }, [selectedState, selectedCountry, countries, states]);

//   // -------------------- RENDER --------------------
//   return (
//     <div className="w-full md:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
//       <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
//         Order <span className="text-orange-600">Summary</span>
//       </h2>
//       <hr className="border-gray-200 dark:border-gray-700 my-4 md:my-5" />

//       <div className="space-y-4 md:space-y-6">
//         {/* Address Dropdown */}
//         <div>
//           <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//             Shipping Address
//           </label>
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="w-full flex justify-between items-center px-3 py-2.5 md:px-4 md:py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:ring-1 hover:ring-orange-500 transition"
//             >
//               {selectedAddress
//                 ? `${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.state}`
//                 : "Select Address"}
//               <svg
//                 className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                 {userAddresses.map((address, idx) => (
//                   <div key={idx} className="mb-2">
//                     <li
//                       onClick={() => handleAddressSelect(address)}
//                       className="px-3 py-2 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
//                     >
//                       {address.fullName}, {address.city}, {address.state}, {address.country}
//                     </li>
//                     <div className="flex justify-end gap-2 px-3 text-sm text-blue-600">
//                       <button onClick={() => handleEditAddress(address)}>Edit</button>
//                       <button onClick={() => handleDeleteAddress(address._id)}>Delete</button>
//                     </div>
//                   </div>
//                 ))}
//                 <li
//                   onClick={() => router.push("/add-address")}
//                   className="px-3 py-2 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer"
//                 >
//                   + Add New Address
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Shipping Rates */}
//         <div>
//           <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//             Shipping Options
//           </label>
//           <button
//             onClick={fetchRates}
//             disabled={loadingRates}
//             className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition mt-2"
//           >
//             {loadingRates ? "Fetching Rates..." : "Get Shipping Rates"}
//           </button>
//           {rateError && <p className="text-red-500 text-sm mt-2">{rateError}</p>}
//           {rates.length > 0 && (
//             <ul className="mt-3 space-y-2">
//               {rates.map((rate) => (
//                 <li
//                   key={rate.object_id}
//                   className={`p-3 border rounded-lg cursor-pointer transition ${
//                     selectedRate?.object_id === rate.object_id
//                       ? "border-orange-500 bg-orange-50 dark:bg-neutral-800"
//                       : "border-gray-300 dark:border-gray-600"
//                   }`}
//                   onClick={() => setSelectedRate(rate)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <p className="font-medium text-gray-700 dark:text-gray-200">
//                       {rate.provider} - {rate.servicelevel?.name}
//                     </p>
//                     <p className="font-semibold text-orange-600">
//                       {rate.amount_local} {rate.currency_local}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//           {selectedRate && (
//             <button
//               onClick={bookShipment}
//               disabled={bookingShipment}
//               className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//             >
//               {bookingShipment ? "Booking Shipment..." : "Confirm Shipping Option"}
//             </button>
//           )}
//           {bookingMessage && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{bookingMessage}</p>}
//         </div>

//         {/* Payment Method */}
//         <div>
//           <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//             Payment Method
//           </label>
//           <select
//             value={selectedMethod}
//             onChange={(e) => setSelectedMethod(e.target.value)}
//             className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-orange-500 transition"
//           >
//             {paymentMethods.map((method) => (
//               <option key={method.id} value={method.id}>
//                 {method.label} — Fee: {(method.fee * 100).toFixed(1)}%
//               </option>
//             ))}
//           </select>
//           <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//             Transaction Fee: <span className="text-orange-600 font-medium">{currency}{feeAmount.toFixed(2)}</span>
//           </p>
//         </div>

//         {/* Cart Summary */}
//         <hr className="border-gray-200 dark:border-gray-700 my-4 md:my-5" />
//         <div className="space-y-2 md:space-y-4 text-sm md:text-base">
//           <div className="flex justify-between font-medium text-gray-700 dark:text-gray-200">
//             <p>Items ({getCartCount()})</p>
//             <p>{currency}{getCartAmount()}</p>
//           </div>
//           <div className="flex justify-between text-gray-600 dark:text-gray-400">
//             <p>Shipping Fee</p>
//             <p className="font-medium text-gray-800 dark:text-gray-200">{currency}{shippingFee.toFixed(2)}</p>
//           </div>
//           <div className="flex justify-between text-gray-600 dark:text-gray-400">
//             <p>Tax (2%)</p>
//             <p className="font-medium text-gray-800 dark:text-gray-200">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
//           </div>
//           <div className="flex justify-between text-lg font-semibold border-t pt-3 text-gray-900 dark:text-gray-100">
//             <p>Total</p>
//             <p>{currency}{total.toFixed(2)}</p>
//           </div>
//         </div>

//         <button
//           onClick={handlePayment}
//           disabled={processing || getCartCount() === 0}
//           className={`w-full py-3 mt-4 md:mt-5 rounded-lg text-white font-medium transition ${
//             processing || getCartCount() === 0
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-orange-600 hover:bg-orange-700 shadow-md"
//           }`}
//         >
//           {processing ? "Processing..." : `Pay with ${selectedPayment.label}`}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;











































































































































// 'use client';

// import React, { useEffect, useState } from "react";
// import { useAppContext } from "@/context/AppContext";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Country, State, City } from "country-state-city";
// import { X, User, Phone, Mail, MapPin, Landmark } from "lucide-react";

// // Payment methods
// const paymentMethods = [
//   { id: 'stripe', label: 'Stripe', fee: 0.029, url: null },
//   { id: 'paystack', label: 'Paystack', fee: 0.015, url: null },
// ];

// const OrderSummary = () => {
//   const { currency, user, cartItems, getCartCount, getCartAmount, setCartItems } = useAppContext();
//   const router = useRouter();

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userAddresses, setUserAddresses] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState('stripe');

//   const [shippingOptions, setShippingOptions] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState(null);

//   const [editingAddress, setEditingAddress] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const [rates, setRates] = useState([]);
//   const [loadingRates, setLoadingRates] = useState(false);
//   const [rateError, setRateError] = useState("");
//   const [selectedRate, setSelectedRate] = useState(null);
//   const [bookingShipment, setBookingShipment] = useState(false);
//   const [bookingMessage, setBookingMessage] = useState("");

//   const parcel = {
//     length: 10,
//     width: 5,
//     height: 5,
//     distance_unit: "cm",
//     weight: 1,
//     mass_unit: "kg",
//   };

//   const selectedPayment = paymentMethods.find((m) => m.id === selectedMethod);
//   const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
//   const feeAmount = selectedPayment ? baseAmount * selectedPayment.fee : 0;
//   const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
//   const total = baseAmount + feeAmount + shippingFee;

//   // -------------------------------
//   // Async effects
//   // -------------------------------

//   useEffect(() => {
//     if (!user) return;

//     const fetchUserAddresses = async () => {
//       try {
//         const token = user?.token; // Replace getToken with user.token or cookie
//         const { data } = await axios.get('/api/user/get-address', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.success) {
//           setUserAddresses(data.addresses);
//           if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
//         } else {
//           toast.error(data.message);
//         }
//       } catch (err) {
//         toast.error(err.message || "Failed to fetch addresses");
//       }
//     };

//     fetchUserAddresses();
//   }, [user]);

//   useEffect(() => {
//     const fetchShippingRates = async () => {
//       if (!selectedAddress) return;
//       try {
//         const { data } = await axios.post('/api/shipping/create', {
//           addressTo: selectedAddress,
//           addressFrom: {
//             name: "Shop Admin",
//             street1: "123 Market Rd",
//             city: "Lagos",
//             state: "LA",
//             zip: "100001",
//             country: "NG",
//             phone: "+2348000000000",
//             email: "admin@example.com",
//           },
//           parcel,
//         });
//         if (data.success && data.rates.length > 0) {
//           setShippingOptions(data.rates);
//           setSelectedShipping(data.rates[0]);
//         } else {
//           toast.error("No shipping rates available");
//         }
//       } catch (err) {
//         toast.error("Error fetching shipping rates");
//       }
//     };

//     fetchShippingRates();
//   }, [selectedAddress]);

//   // Load countries initially
//   useEffect(() => setCountries(Country.getAllCountries()), []);

//   // Load states when country changes
//   useEffect(() => {
//     if (!selectedCountry) return setStates([]);
//     const country = countries.find(c => c.name === selectedCountry);
//     setStates(country ? State.getStatesOfCountry(country.isoCode) : []);
//     setSelectedState(""); setSelectedCity(""); setCities([]);
//   }, [selectedCountry, countries]);

//   // Load cities when state changes
//   useEffect(() => {
//     if (!selectedCountry || !selectedState) return setCities([]);
//     const country = countries.find(c => c.name === selectedCountry);
//     const state = states.find(s => s.name === selectedState);
//     setCities(country && state ? City.getCitiesOfState(country.isoCode, state.isoCode) : []);
//   }, [selectedCountry, selectedState, countries, states]);

//   // -------------------------------
//   // Handlers
//   // -------------------------------
//   const handleAddressSelect = (addr) => {
//     setSelectedAddress(addr);
//     setIsDropdownOpen(false);
//   };

//   const handlePayment = async () => {
//     if (!selectedAddress) return toast.error("Please select an address");
//     if (processing) return;

//     const cartArray = Object.keys(cartItems)
//       .map(id => ({ product: id, quantity: cartItems[id] }))
//       .filter(i => i.quantity > 0);

//     if (cartArray.length === 0) return toast.error("Cart is empty");

//     setProcessing(true);
//     try {
//       const token = user?.token; // replace getToken

//       // Stripe
//       if (selectedPayment.id === "stripe") {
//         const { data } = await axios.post(
//           "/api/checkout/stripe",
//           { items: cartItems, address: selectedAddress },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (!data.url) throw new Error("No Stripe URL returned");
//         sessionStorage.setItem("pendingOrder", JSON.stringify({ addressId: selectedAddress._id, items: cartArray, paymentMethod: selectedPayment.id }));
//         window.location.href = data.url;
//       }

//       // Paystack
//       else if (selectedPayment.id === "paystack") {
//         const { data } = await axios.post(
//           "/api/checkout/paystack",
//           { items: cartItems, address: selectedAddress },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (!data.success) throw new Error("Paystack init failed");
//         sessionStorage.setItem("pendingOrder", JSON.stringify({ addressId: selectedAddress._id, items: cartItems, paymentMethod: selectedPayment.id }));
//         window.location.href = data.authorizationUrl;
//       }

//       // Other methods
//       else if (selectedPayment.url) {
//         selectedPayment.url.startsWith("/") ? router.push(selectedPayment.url) : window.location.href = selectedPayment.url;
//       }
//     } catch (err) {
//       toast.error(err.message || "Payment failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this address?")) return;
//     try {
//       const res = await fetch(`/api/user/add-address/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete");
//       toast.success("Address deleted");
//       setUserAddresses(prev => prev.filter(addr => addr._id !== id));
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const handleEdit = (addr) => {
//     setEditingAddress(addr);
//     setShowEditModal(true);
//   };

//   // -------------------------------
//   // Render
//   // -------------------------------
//   return (
//     <div className="w-full md:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
//       <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
//         Order <span className="text-orange-600">Summary</span>
//       </h2>
//       <hr className="border-gray-200 dark:border-gray-700 my-4 md:my-5" />

//       {/* Address Dropdown */}
//       <div className="mb-4">
//         <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
//           Shipping Address
//         </label>
//         <div className="relative">
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="w-full flex justify-between items-center px-3 py-2.5 md:px-4 md:py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:ring-1 hover:ring-orange-500 transition"
//           >
//             {selectedAddress
//               ? `${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.state}`
//               : "Select Address"}
//             <svg
//               className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {isDropdownOpen && (
//             <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//               {userAddresses.map((addr) => (
//                 <li key={addr._id} className="px-3 py-2 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 flex justify-between items-center">
//                   <span onClick={() => handleAddressSelect(addr)}>
//                     {addr.fullName}, {addr.city}, {addr.state}, {addr.country}
//                   </span>
//                   <div className="flex gap-2">
//                     <button onClick={() => handleEdit(addr)}>Edit</button>
//                     <button onClick={() => handleDelete(addr._id)}>Delete</button>
//                   </div>
//                 </li>
//               ))}
//               <li
//                 onClick={() => router.push("/add-address")}
//                 className="px-3 py-2 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer"
//               >
//                 + Add New Address
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* Payment Button */}
//       <button
//         onClick={handlePayment}
//         disabled={processing || getCartCount() === 0}
//         className={`w-full py-3 mt-4 md:mt-5 rounded-lg text-white font-medium transition ${
//           processing || getCartCount() === 0
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-orange-600 hover:bg-orange-700 shadow-md"
//         }`}
//       >
//         {processing ? "Processing..." : `Pay with ${selectedPayment.label}`}
//       </button>
//     </div>
//   );
// };

// export default OrderSummary;






























































































































'use client';

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import { X, User, Phone, Mail, MapPin, Landmark } from "lucide-react";
import { useSession } from "next-auth/react";

// Payment methods
const paymentMethods = [
  { id: 'stripe', label: 'Stripe', fee: 0.029, url: null },
  { id: 'paystack', label: 'Paystack', fee: 0.015, url: null },
];

const OrderSummary = () => {
  const { currency, user, currentUser,  cartItems, getCartCount, getCartAmount } = useAppContext();
    const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('stripe');

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const [editingAddress, setEditingAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [rates, setRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [rateError, setRateError] = useState("");
  const [selectedRate, setSelectedRate] = useState(null);
  const [bookingShipment, setBookingShipment] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const parcel = { length: 10, width: 5, height: 5, distance_unit: "cm", weight: 1, mass_unit: "kg" };

  const selectedPayment = paymentMethods.find((m) => m.id === selectedMethod);
  const baseAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
  const feeAmount = selectedPayment ? baseAmount * selectedPayment.fee : 0;
  const shippingFee = selectedShipping ? parseFloat(selectedShipping.amount.amount) : 0;
  const total = baseAmount + feeAmount + shippingFee;

  // -------------------------------
  // Fetch user addresses
  // -------------------------------
  // useEffect(() => {
  //   if (!currentUser) return;

  //   const fetchUserAddresses = async () => {
  //     try {
  //       const { data } = await axios.get('/api/user/get-address'); // no auth header
  //       if (data.success) {
  //         setUserAddresses(data.addresses);
  //         if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } catch (err) {
  //       toast.error(err.message || "Failed to fetch addresses");
  //     }
  //   };

  //   fetchUserAddresses();
  // }, [currentUser]);
  useEffect(() => {
    if (status !== "authenticated") return; // wait for auth

    let cancelled = false;
    const fetchUserAddresses = async () => {
      try {
        // withCredentials is optional for same-origin; safe to include
        const res = await axios.get("/api/user/get-address", { withCredentials: true });
        const data = res.data;
        if (data.success) {
          if (!cancelled) {
            setUserAddresses(data.addresses || []);
            if ((data.addresses || []).length > 0) setSelectedAddress(data.addresses[0]);
          }
        } else {
          toast.error(data.message || "Failed to load addresses");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || "Failed to fetch addresses");
      }
    };

    fetchUserAddresses();
    return () => { cancelled = true; };
  }, [status]);


  // -------------------------------
  // Fetch shipping rates when address changes
  // -------------------------------
  useEffect(() => {
    const fetchShippingRates = async () => {
      if (!selectedAddress) return;
      try {
        const { data } = await axios.post('/api/shipping/create', {
          addressTo: selectedAddress,
          addressFrom: {
            name: "Shop Admin",
            street1: "123 Market Rd",
            city: "Lagos",
            state: "LA",
            zip: "100001",
            country: "NG",
            phone: "+2348000000000",
            email: "admin@example.com",
          },
          parcel,
        });
        if (data.success && data.rates.length > 0) {
          setShippingOptions(data.rates);
          setSelectedShipping(data.rates[0]);
        } else {
          toast.error("No shipping rates available");
        }
      } catch (err) {
        toast.error("Error fetching shipping rates");
      }
    };

    fetchShippingRates();
  }, [selectedAddress]);

  // -------------------------------
  // Country / State / City effects
  // -------------------------------
  useEffect(() => setCountries(Country.getAllCountries()), []);

  useEffect(() => {
    if (!selectedCountry) return setStates([]);
    const country = countries.find(c => c.name === selectedCountry);
    setStates(country ? State.getStatesOfCountry(country.isoCode) : []);
    setSelectedState(""); setSelectedCity(""); setCities([]);
  }, [selectedCountry, countries]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) return setCities([]);
    const country = countries.find(c => c.name === selectedCountry);
    const state = states.find(s => s.name === selectedState);
    setCities(country && state ? City.getCitiesOfState(country.isoCode, state.isoCode) : []);
  }, [selectedCountry, selectedState, countries, states]);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setIsDropdownOpen(false);
  };

  const handlePayment = async () => {
    if (!selectedAddress) return toast.error("Please select an address");
    if (!currentUser || !currentUser._id) return toast.error("Login required");

    if (processing) return;
    setProcessing(true);

    const cartArray = Object.keys(cartItems).map(id => ({ product: id, quantity: cartItems[id] })).filter(i => i.quantity > 0);
    if (cartArray.length === 0) return toast.error("Cart is empty");

    try {
      if (selectedMethod === "stripe") {
        const { data } = await axios.post("/api/checkout/stripe", { items: cartItems, address: selectedAddress, userId: currentUser._id });
        if (!data.url) throw new Error("No Stripe URL returned");
        sessionStorage.setItem("pendingOrder", JSON.stringify({ addressId: selectedAddress._id, items: cartArray, paymentMethod: "stripe" }));
        window.location.href = data.url;
      } else if (selectedMethod === "paystack") {
        const { data } = await axios.post("/api/checkout/paystack", { items: cartItems, address: selectedAddress, userId: currentUser._id });
        if (!data.success) throw new Error("Paystack init failed");
        sessionStorage.setItem("pendingOrder", JSON.stringify({ addressId: selectedAddress._id, items: cartItems, paymentMethod: "paystack" }));
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/user/add-address/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Address deleted");
      setUserAddresses(prev => prev.filter(addr => addr._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowEditModal(true);
  };

  // -------------------------------
  // Shipping rates booking
  // -------------------------------
  const fetchRates = async () => {
    if (!selectedAddress) return toast.error("Select address first");
    setLoadingRates(true); setRateError("");
    try {
      const { data } = await axios.post("/api/shipping/create", { parcel, addressTo: selectedAddress });
      if (!data.success) throw new Error(data.message || "Failed to fetch rates");
      setRates(data.rates);
      if (data.rates.length > 0) setSelectedRate(data.rates[0]);
    } catch (err) {
      setRateError(err.message);
    } finally {
      setLoadingRates(false);
    }
  };

  const bookShipment = async () => {
    if (!selectedRate) return toast.error("Select a shipping rate first");
    setBookingShipment(true); setBookingMessage("");
    try {
      const { data } = await axios.post("/api/shipping/book", { parcel, rateId: selectedRate.object_id });
      if (!data.success) throw new Error(data.message);
      setBookingMessage(`✅ Shipment booked! Tracking #: ${data.transaction.tracking_number}`);
    } catch (err) {
      setBookingMessage(`❌ ${err.message}`);
    } finally {
      setBookingShipment(false);
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="w-full md:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
        Order <span className="text-orange-600">Summary</span>
      </h2>
      <hr className="border-gray-200 dark:border-gray-700 my-4 md:my-5" />

      <div className="space-y-4 md:space-y-6">

        {/* Address dropdown */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Shipping Address
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center px-3 py-2.5 md:px-4 md:py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:ring-1 hover:ring-orange-500 transition"
            >
              {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.state}` : "Select Address"}
              <svg className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {userAddresses.map((addr) => (
                  <li key={addr._id} className="px-3 py-2 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 flex justify-between items-center">
                    <span onClick={() => handleAddressSelect(addr)}>{addr.fullName}, {addr.city}, {addr.state}, {addr.country}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(addr)}>Edit</button>
                      <button onClick={() => handleDelete(addr._id)}>Delete</button>
                    </div>
                  </li>
                ))}
                <li onClick={() => router.push("/add-address")} className="px-3 py-2 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-neutral-700 cursor-pointer">+ Add New Address</li>
              </ul>
            )}
          </div>
        </div>

        {/* Shipping rates */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Shipping Options</label>
          <button onClick={fetchRates} disabled={loadingRates} className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition mt-2">
            {loadingRates ? "Fetching Rates..." : "Get Shipping Rates"}
          </button>

          {rateError && <p className="text-red-500 text-sm mt-2">{rateError}</p>}

          {rates.length > 0 && (
            <ul className="mt-3 space-y-2">
              {rates.map(rate => (
                <li key={rate.object_id} className={`p-3 border rounded-lg cursor-pointer transition ${selectedRate?.object_id === rate.object_id ? "border-orange-500 bg-orange-50 dark:bg-neutral-800" : "border-gray-300 dark:border-gray-600"}`} onClick={() => setSelectedRate(rate)}>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-700 dark:text-gray-200">{rate.provider} - {rate.servicelevel?.name}</p>
                    <p className="font-semibold text-orange-600">{rate.amount_local} {rate.currency_local}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {selectedRate && <button onClick={bookShipment} disabled={bookingShipment} className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">{bookingShipment ? "Booking Shipment..." : "Confirm Shipping Option"}</button>}
          {bookingMessage && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{bookingMessage}</p>}
        </div>

        {/* Payment */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Payment Method</label>
          <select value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)} className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-orange-500 transition">
            {paymentMethods.map(pm => <option key={pm.id} value={pm.id}>{pm.label}</option>)}
          </select>
        </div>

        {/* Payment button */}
        <button onClick={handlePayment} disabled={processing || getCartCount() === 0} className={`w-full py-3 mt-4 md:mt-5 rounded-lg text-white font-medium transition ${processing || getCartCount() === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 shadow-md"}`}>
          {processing ? "Processing..." : `Pay ${currency}${total.toFixed(2)}`}
        </button>

      </div>

      {/* Edit Address Modal */}
      {showEditModal && editingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4"><X /></button>
            <h3 className="text-lg font-semibold mb-4">Edit Address</h3>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Address updated"); setShowEditModal(false); }}>
              <input type="text" placeholder="Full Name" defaultValue={editingAddress.fullName} className="w-full mb-2 p-2 border rounded" />
              <input type="text" placeholder="Street" defaultValue={editingAddress.street1} className="w-full mb-2 p-2 border rounded" />
              <input type="text" placeholder="City" defaultValue={editingAddress.city} className="w-full mb-2 p-2 border rounded" />
              <input type="text" placeholder="State" defaultValue={editingAddress.state} className="w-full mb-2 p-2 border rounded" />
              <input type="text" placeholder="Country" defaultValue={editingAddress.country} className="w-full mb-2 p-2 border rounded" />
              <button type="submit" className="w-full mt-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition">Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderSummary;
