'use client';

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";



// ... paymentMethods here
const paymentMethods = [
  { id: 'stripe', label: 'Stripe', fee: 0.029, url: null },
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
  const [editingAddress, setEditingAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  


  // ✅ FIXED: Declare handleAddressSelect before using it
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
    setShowAddressDropdown(false);
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

  // const handlePayment = async () => {
  //   if (processing) return;
  //   if (!selectedAddress) return toast.error('Please select an address');

  //   const cartItemsArray = Object.keys(cartItems)
  //     .map((key) => ({ product: key, quantity: cartItems[key] }))
  //     .filter((item) => item.quantity > 0);

  //   if (cartItemsArray.length === 0) return toast.error('Cart is empty');

  //   setProcessing(true);

  //   try {
  //     const token = await getToken();

  //     const orderRes = await axios.post('/api/order/create', {
  //       address: selectedAddress._id,
  //       items: cartItemsArray,
  //       paymentMethod: selected.id,
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (!orderRes.data.success) {
  //       toast.error(orderRes.data.message);
  //       return;
  //     }

  //     // ✅ Stripe dynamic Checkout redirect
  //     if (selected.id === "stripe") {
  //       const { data } = await axios.post(
  //         "/api/checkout/stripe",
  //         { items: cartItems },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       if (!data.url) throw new Error("No Stripe session URL returned");

  //       setCartItems({});
  //       return (window.location.href = data.url);
  //     }

  //     // ✅ All other payment methods
  //     setCartItems({});
  //     if (selected.url.startsWith("/")) {
  //       router.push(selected.url);
  //     } else {
  //       window.location.href = selected.url;
  //     }

  //   } catch (error) {
  //     toast.error(error.message || "Error placing order");
  //   } finally {
  //     setProcessing(false);
  //   }
  // };


















































  

  // const handlePayment = async () => {
  //   if (processing) return;
  //   if (!selectedAddress) return toast.error("Please select an address");

  //   const cartItemsArray = Object.keys(cartItems)
  //     .map((key) => ({ product: key, quantity: cartItems[key] }))
  //     .filter((item) => item.quantity > 0);

  //   if (cartItemsArray.length === 0) return toast.error("Cart is empty");

  //   setProcessing(true);

  //   try {
  //     const token = await getToken();

  //     if (selected.id === "stripe") {
  //       const { data } = await axios.post(
  //         "/api/checkout/stripe", // ✅ the correct dynamic endpoint
  //         { items: Object.keys(cartItems).reduce((acc, id) => {
  //           acc[id] = cartItems[id];
  //           return acc;
  //         }, {}),
  //         address: selectedAddress,          // optional but good
  //         paymentMethod: selected.id     },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       if (!data.url) throw new Error("No Stripe session URL returned");

  //       return (window.location.href = data.url);
  //     }

  //     // 🔁 Other payment methods (like PayPal, bank transfer, etc.)
  //     if (selected.url.startsWith("/")) {
  //       router.push(selected.url);
  //     } else {
  //       window.location.href = selected.url;
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Payment initialization failed");
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  //.......................................................................................................
  const handlePayment = async () => {
    if (processing) return;
    if (!selectedAddress) return toast.error("Please select an address");

    // Convert cart to array: [{ product, quantity }]
    const cartItemsArray = Object.keys(cartItems)
      .map((key) => ({ product: key, quantity: cartItems[key] }))
      .filter((item) => item.quantity > 0);

    if (cartItemsArray.length === 0) return toast.error("Cart is empty");

    setProcessing(true);

    try {
      const token = await getToken();

      // ✅ Stripe payment flow
      if (selected.id === "stripe") {
        const cartItemsObject = Object.keys(cartItems).reduce((acc, id) => {
          acc[id] = cartItems[id];
          return acc;
        }, {});

        const { data } = await axios.post(
          "/api/checkout/stripe",
          {
            items: cartItemsObject,
            address: selectedAddress,       // optional, for metadata or future use
            paymentMethod: selected.id
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!data.url) throw new Error("No Stripe session URL returned");

        // Save order info temporarily to finalize after redirect
        sessionStorage.setItem("pendingOrder", JSON.stringify({
          addressId: selectedAddress._id,
          items: cartItemsArray,
          paymentMethod: selected.id
        }));

        return (window.location.href = data.url);
      }

      // ✅ Other payment methods (bank transfer, PayPal, etc.)
      if (selected.url.startsWith("/")) {
        router.push(selected.url);
      } else {
        window.location.href = selected.url;
      }

    } catch (error) {
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setProcessing(false);
    }
  };
  //.......................................................................



//   const handlePayment = async () => {
//   if (processing) return;
//   if (!selectedAddress) return toast.error('Please select an address');

//   const cartItemsArray = Object.keys(cartItems)
//     .map((key) => ({ product: key, quantity: cartItems[key] }))
//     .filter((item) => item.quantity > 0);

//   if (cartItemsArray.length === 0) return toast.error('Cart is empty');

//   setProcessing(true);

//   try {
//     const token = await getToken();

//     const orderPayload = {
//       address: selectedAddress._id,
//       items: cartItemsArray,
//       paymentMethod: selected.id,
//     };

//     // Only include shippingRate if selectedShipping exists
//     if (selectedShipping) {
//       orderPayload.shippingRate = selectedShipping.object_id;
//     }

//     const orderRes = await axios.post('/api/order/create', orderPayload, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!orderRes.data.success) {
//       toast.error(orderRes.data.message);
//       return;
//     }

//     // Only book shipment if shippingRate was included
//     if (orderRes.data.shipmentId && selectedShipping) {
//       const bookingRes = await axios.post('/api/shipping/book', {
//         shipmentId: orderRes.data.shipmentId,
//         rateObjectId: selectedShipping.object_id
//       });

//       if (bookingRes.data.success) {
//         toast.success('Shipment booked and label generated. Redirecting to payment...');
//       }
//     }

//     setCartItems({});

//     if (selected.url.startsWith('/')) {
//       router.push(selected.url);
//     } else {
//       window.location.href = selected.url;
//     }
//   } catch (error) {
//     toast.error(error.message || "Error placing order");
//   } finally {
//     setProcessing(false);
//   }
// };


  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  useEffect(() => {
    fetchShippingRates();
  }, [selectedAddress]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/user/add-address/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address deleted");
        // fetchAddresses(); // Re-fetch the list
        fetchUserAddresses(); // ✅ not fetchAddresses()
      } else {
        toast.error("Failed to delete address");
      }
    } catch (err) {
      toast.error("Error deleting address");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address); // set this to open modal with pre-filled values
    setShowEditModal(true);
  };

  // Load countries initially
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      if (country) {
        const stateList = State.getStatesOfCountry(country.isoCode);
        setStates(stateList);
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }

    setCities([]);
    setSelectedState("");
    setSelectedCity("");
  }, [selectedCountry, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const country = countries.find(c => c.name === selectedCountry);
      const state = states.find(s => s.name === selectedState);

      if (country && state) {
        const cityList = City.getCitiesOfState(country.isoCode, state.isoCode);
        setCities(cityList);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry, countries, states]);

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
                ? `${selectedAddress.fullName}, ${selectedAddress.country}, ${selectedAddress.state}, ${selectedAddress.city}`
                : "Select Address"}
              <svg className={`w-5 h-5 float-right ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="relative w-full">
                <button
                  onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-left"
                >
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.country} ${selectedAddress.state}, ${selectedAddress.city}, ${selectedAddress.area}`
                    : "Select Address"}
                </button>

                {showAddressDropdown && (
                  <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-y-auto">
                    {userAddresses.map((address, index) => (
                      <div key={index} className="border-t py-2 px-4 hover:bg-gray-500/10">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            handleAddressSelect(address);
                            setSelectedAddressId(address._id); // optional if you're tracking ID
                            setShowAddressDropdown(false);
                          }}
                        >
                          {address.fullName}, {address.country} {address.state}, {address.city}, {address.area}
                        </div>
                        <div className="mt-2 flex justify-end gap-2 text-sm text-blue-600">
                          <button onClick={() => handleEdit(address)}>Edit</button>
                          <button onClick={() => handleDelete(address._id)}>Delete</button>
                        </div>
                      </div>
                    ))}

                    <li
                      onClick={() => {
                        router.push("/add-address");
                        setShowAddressDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-green-600 font-medium"
                    >
                      + Add New Address
                    </li>
                  </ul>
                )}
              </div>

            )}
          </div>
        </div>

        {/* Shipping + Payment + Summary */}
        {/* Shipping Options */}
        {/* {shippingOptions.length > 0 && (
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
        )} */}

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
        {showEditModal && selectedAddress && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow max-w-lg w-full overflow-y-auto max-h-[80vh] relative">
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updated = Object.fromEntries(formData.entries());

                  try {
                    const res = await fetch(`/api/user/add-address/${editingAddress._id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(updated),
                    });

                    if (!res.ok) throw new Error("Failed to update");

                    // 🧠 Update local state so UI reflects changes instantly
                    setUserAddresses(prev =>
                      prev.map(addr =>
                        addr._id === editingAddress._id ? { ...addr, ...updated } : addr
                      )
                    );

                    toast.success("Address updated");
                    setShowEditModal(false);
                    setEditingAddress(null);
                  } catch (err) {
                    toast.error("Update failed");
                  }
                }}

                className="space-y-4"
              >
                <input name="fullName" defaultValue={selectedAddress.fullName} className="input w-full" placeholder="Full Name" />
                <input name="phoneNumber" defaultValue={selectedAddress.phoneNumber} className="input w-full" placeholder="Phone Number" />
                <input name="email" defaultValue={selectedAddress.email} className="input w-full" placeholder="Email" />
                <input name="zipcode" defaultValue={selectedAddress.zipcode} className="input w-full" placeholder="Zip Code" />
                <select
                  name="country"
                  className="input w-full"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState("");
                    setSelectedCity("");
                  }}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <select
                  name="state"
                  className="input w-full"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity("");
                  }}
                  disabled={!states.length}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>

                <select
                  name="city"
                  className="input w-full"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!cities.length}
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <textarea name="area" defaultValue={selectedAddress.area} className="input w-full" placeholder="Street / Area" />
                <button type="submit" className="btn bg-grey-400 btn-primary w-full">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}



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
