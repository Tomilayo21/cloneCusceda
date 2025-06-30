'use client';
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);


const AddAddress = () => {
  const { getToken, router } = useAppContext();

  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    area: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setAddress({ ...address, country: countryCode, state: '', city: '' });
    setStateList(State.getStatesOfCountry(countryCode));
    setCityList([]);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setAddress({ ...address, state: stateCode, city: '' });
    setCityList(City.getCitiesOfState(address.country, stateCode));
  };

  const handleCityChange = (e) => {
    setAddress({ ...address, city: e.target.value });
  };

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();

  //   if (
  //     !address.fullName ||
  //     !address.phoneNumber ||
  //     !address.zipcode ||
  //     !address.area ||
  //     !address.city ||
  //     !address.state ||
  //     !address.country
  //   ) {
  //     toast.error("Please fill all required fields");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const token = await getToken();

  //     const { data } = await axios.post(
  //       '/api/user/add-address',
  //       { address },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (data.success) {
  //       toast.success(data.message);
  //       router.push('/cart');
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/user/add-address',
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const addressId = data.addressId; // ✅ Get the address ID from the response
        localStorage.setItem("addressId", addressId); // 🔐 Save for checkout use
        toast.success(data.message);
        router.push('/cart'); // 🚚 Navigate to next step
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add address");
    }
  };


  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full max-w-xl">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping <span className="font-semibold text-orange-600">Address</span>
          </p>
          <div className="space-y-3 mt-10">
            <input
              type="text"
              placeholder="Full name"
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone number"
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              value={address.phoneNumber}
              onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Zipcode / Postal Code"
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              value={address.zipcode}
              onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
            />
            <textarea
              rows={4}
              placeholder="Address (Area and Street)"
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            ></textarea>

            {/* Country */}
            <select
              value={address.country}
              onChange={handleCountryChange}
              className="px-2 py-2.5 border rounded w-full text-gray-500"
            >
              <option value="">Select Country</option>
              {countryList.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State */}
            <select
              value={address.state}
              onChange={handleStateChange}
              disabled={!stateList.length}
              className="px-2 py-2.5 border rounded w-full text-gray-500"
            >
              <option value="">Select State</option>
              {stateList.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* City */}
            <select
              value={address.city}
              onChange={handleCityChange}
              disabled={!cityList.length}
              className="px-2 py-2.5 border rounded w-full text-gray-500"
            >
              <option value="">Select City</option>
              {cityList.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="email"
              placeholder="Email"
              className="px-2 py-2.5 border rounded w-full text-gray-500"
              value={address.email}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
            >
              {loading ? "Saving..." : "Save address"}
            </button>
          </div>
        </form>

        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="my_location_image"
        />
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;
