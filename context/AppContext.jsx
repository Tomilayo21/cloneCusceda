// 'use client';

// import { useAuth, useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";
// import axios from 'axios';
// import toast from "react-hot-toast";
// import { ShoppingCart } from "lucide-react";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext);
// };

// export const AppContextProvider = (props) => {
//     // const currency = process.env.NEXT_PUBLIC_CURRENCY;
//     const [currency, setCurrency] = useState('$'); 
//     const [themeColor, setThemeColor] = useState("#f97316"); 
//     const [secondaryColor, setSecondaryColor] = useState("#000000");
//     const [tertiaryColor, setTertiaryColor] = useState("#ffffff");
//     const [themeMode, setThemeMode] = useState("system");
//     const [contrastMode, setContrastMode] = useState(false);
//     const [layoutStyle, setLayoutStyle] = useState("default"); 
//     const [previewLayoutStyle, setPreviewLayoutStyle] = useState(null); 
//     const [layout, setLayout] = useState("grid");
//     const [loading, setLoading] = useState(true);
//     const [fontSize, setFontSize] = useState("medium");
//     const [previewFontSize, setPreviewFontSize] = useState(null);
//     const effectiveLayout = previewLayoutStyle || layoutStyle;
//     const effectiveFontSize = previewFontSize || fontSize;


//     const router = useRouter();

//     const { user } = useUser();
//     const { getToken } = useAuth();

//     const [products, setProducts] = useState([]);
//     const [userData, setUserData] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [cartItems, setCartItems] = useState({}); 

//     //Currency
//     useEffect(() => {
//     const saved = localStorage.getItem('currency');
//     if (saved) setCurrency(saved);
//     }, []);

//     useEffect(() => {
//     localStorage.setItem('currency', currency);
//     }, [currency]);

//     //Theme Color
//     useEffect(() => {
//         const savedTheme = localStorage.getItem("themeColor");
//         const savedSecondary = localStorage.getItem("secondaryColor");
//         const savedTertiary = localStorage.getItem("tertiaryColor");

//         if (savedTheme) setThemeColor(savedTheme);
//         if (savedSecondary) setSecondaryColor(savedSecondary);
//         if (savedTertiary) setTertiaryColor(savedTertiary);
//     }, []);

//     useEffect(() => {
//         localStorage.setItem("themeColor", themeColor);
//     }, [themeColor]);
//       useEffect(() => {
//     localStorage.setItem("secondaryColor", secondaryColor);
//     }, [secondaryColor]);

//     useEffect(() => {
//         localStorage.setItem("tertiaryColor", tertiaryColor);
//     }, [tertiaryColor]);


//     //Cart
//     useEffect(() => {
//         const fetchCart = async () => {
//             const res = await fetch("/api/cart/get");
//             const data = await res.json();
//             if (data.success) {
//             setCartItems(data.cartItems); // <- this will rehydrate your cart
//             }
//         };

//         fetchCart();
//     }, []);


//     // Sync with localStorage and system preference
//     useEffect(() => {
//     const saved = localStorage.getItem("themeMode") || "system";
//     setThemeMode(saved);
//     }, []);

//     useEffect(() => {
//         if (themeMode === "system") {
//             const mq = window.matchMedia("(prefers-color-scheme: dark)");
//             const apply = () => {
//             document.documentElement.classList.toggle("dark", mq.matches);
//             };
//             apply();
//             mq.addEventListener("change", apply);
//             return () => mq.removeEventListener("change", apply);
//         } else {
//             document.documentElement.classList.toggle("dark", themeMode === "dark");
//         }
//         localStorage.setItem("themeMode", themeMode);
//     }, [themeMode]);

//     //High Contrast
//     useEffect(() => {
//         const saved = localStorage.getItem("contrastMode") === "true";
//         setContrastMode(saved);
//     }, []);

//     useEffect(() => {
//         if (contrastMode) {
//             document.documentElement.classList.add("high-contrast");
//         } else {
//             document.documentElement.classList.remove("high-contrast");
//         }
//         localStorage.setItem("contrastMode", contrastMode);
//     }, [contrastMode]);

    
//     //LAyout
//     useEffect(() => {
//         const fetchSettings = async () => {
//             try {
//             const res = await fetch("/api/user-settings");
//             if (!res.ok) throw new Error("Unauthorized");
//             const data = await res.json();

//             if (data?.fontSize) setFontSize(data.fontSize);
//             if (data?.layoutStyle) setLayoutStyle(data.layoutStyle); // Keep key names consistent
//             } catch (err) {
//             console.error("Error loading user settings:", err);
//             } finally {
//             setLoading(false);
//             }
//         };

//         if (user) fetchSettings();
//     }, [user]);



//     const updateSettings = () => {};
//     const cancelPreview = () => {};


//     const savePreferences = async (newFontSize, newLayoutStyle) => {
//     try {
//         const res = await fetch("/api/user-settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fontSize: newFontSize, layoutStyle: newLayoutStyle }),
//         });

//         if (!res.ok) throw new Error("Failed to save settings");

//         const data = await res.json();
//         if (data.fontSize) setFontSize(data.fontSize);
//         if (data.layoutStyle) setLayoutStyle(data.layoutStyle);
//         toast.success("Preferences saved!");
//     } catch (err) {
//         console.error(err);
//         toast.error("Error saving preferences");
//     }
//     };


//     const saveLayoutStyle = async (newLayout) => {
//         try {
//             setLayout(newLayout);

//             const res = await fetch("/api/user/settings", {
//             method: "POST",
//             body: JSON.stringify({ layoutStyle: newLayout }),
//             });

//             if (!res.ok) throw new Error("Failed to update layout");

//             const data = await res.json();
//             console.log("Layout saved:", data);
//         } catch (error) {
//             console.error("Error saving layout style:", error);
//         }
//     };



//     useEffect(() => {
//         const fetchPreferences = async () => {
//             try {
//             const res = await fetch("/api/user/settings");
//             const data = await res.json();

//             if (data) {
//                 setFontSize(data.fontSize || "medium");
//             }
//             } catch (err) {
//             console.error("Failed to load user preferences:", err);
//             } finally {
//             setLoading(false);
//             }
//         };

//         fetchPreferences();
//     }, []);



//     //Product List

//     const fetchProductData = async () => {
//         try {
//             const { data } = await axios.get('/api/product/list');
//             if (data.success) {
//                 setProducts(data.products);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     const fetchUserData = async () => {
//         try {
//             if (user?.publicMetadata?.role === 'admin') {
//                 setIsAdmin(true);
//             }

//             const token = await getToken();
//             const { data } = await axios.get('/api/user/data', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (data.success) {
//                 setUserData(data.user);

//                 // ✅ Fallback to empty object if cartItems is undefined
//                 setCartItems(data.user.cartItems || {});
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };



//     // Load cartItems from localStorage on mount
//     const addToCart = async (product) => {
//         const itemId = product._id;
//         let cartData = structuredClone(cartItems);

//         if (cartData[itemId]) {
//             cartData[itemId] += 1;
//         } else {
//             cartData[itemId] = 1;
//         }

//         setCartItems(cartData);

//         // Custom animated toast
//         toast.custom(
//             (t) => (
//             <div
//                 className={`
//                 max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4
//                 transform transition-all duration-300 ease-in-out
//                 ${t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
//                 `}
//             >
//                 <ShoppingCart className="text-orange-500" size={20} />
//                 <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                 Item added to cart
//                 </p>
//             </div>
//             ),
//             { duration: 2000, position: "top-right" } // top-right for premium e-commerce feel
//         );

//         if (user) {
//             try {
//             const token = await getToken();
//             await axios.post('/api/cart/update', { cartData }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             } catch (error) {
//             toast.error(error.message);
//             }
//         }
//     };


//     useEffect(() => {
//         const savedCart = localStorage.getItem('cartItems');
//         if (savedCart) {
//         setCartItems(JSON.parse(savedCart));
//         }
//     }, []);

//     // Save cartItems to localStorage whenever it changes
//     useEffect(() => {
//         localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     }, [cartItems]);


//     const updateCartQuantity = async (productId, quantity) => {
//     const updated = { ...cartItems };

//     if (quantity <= 0) {
//         delete updated[productId];
//     } else {
//         updated[productId] = quantity;
//     }

//     // update local state immediately
//     setCartItems(updated);

//     // If user is logged in, persist to backend with Clerk token
//     if (user) {
//         try {
//         const token = await getToken();
//         await axios.post(
//             "/api/cart/update",
//             { cartData: updated }, // ✅ object
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         } catch (err) {
//         console.error("Failed to save cart to server:", err);
//         toast.error("Could not update cart on the server");
//         }
//     }
//     };

    

//     const getCartCount = () => {
//         let totalCount = 0;
//         for (const items in cartItems) {
//             if (cartItems[items] > 0) {
//                 totalCount += cartItems[items];
//             }
//         }
//         return totalCount;
//     }

//     const getCartAmount = () => {
//         let totalAmount = 0;

//         for (const itemId in cartItems) {
//             const quantity = cartItems[itemId];
//             const itemInfo = products.find(product => product._id === itemId);

//             if (itemInfo && typeof itemInfo.offerPrice === 'number') {
//                 totalAmount += itemInfo.offerPrice * quantity;
//             }
//         }

//         return Math.floor(totalAmount * 100) / 100;
//     };

//     useEffect(() => {
//         fetchProductData();
//     }, []);

//     useEffect(() => {
//         if (user) {
//             fetchUserData();
//         } else {
//             // ✅ Clear cart when user logs out
//             setCartItems({});
//         }
//     }, [user]);

//     const value = {
//         user,
//         getToken,
//         currency,
//         router,
//         isAdmin,
//         setIsAdmin,
//         userData,
//         fetchUserData,
//         products,
//         setProducts,
//         addToCart,
//         updateCartQuantity,
//         cartItems,
//         setCartItems,
//         getCartCount,
//         setCurrency,
//         getCartAmount,
//         themeColor,
//         setThemeColor,
//         secondaryColor,
//         setSecondaryColor,
//         tertiaryColor,
//         setTertiaryColor,
//         themeMode,
//         setThemeMode,
//         contrastMode,
//         setContrastMode,
//         saveLayoutStyle,
//         cancelPreview,
//         layout, 
//         loading,
//         layoutStyle: effectiveLayout,
//         setLayoutStyle,
//         previewLayoutStyle,
//         setPreviewLayoutStyle,
//         fontSize: effectiveFontSize,
//         setFontSize,
//         previewFontSize,
//         setPreviewFontSize,
//         savePreferences,
//         updateSettings,
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     );
// };



































































// 'use client';

// import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { ShoppingCart } from "lucide-react";

// export const AppContext = createContext();

// export const useAppContext = () => useContext(AppContext);

// export const AppContextProvider = ({ children }) => {
//   const router = useRouter();

//   // -------------------- Auth --------------------
//   const [currentUser, setCurrentUser] = useState(null);

//   // -------------------- Theme & Layout --------------------
//   const [currency, setCurrency] = useState("$");
//   const [themeColor, setThemeColor] = useState("#f97316");
//   const [secondaryColor, setSecondaryColor] = useState("#000000");
//   const [tertiaryColor, setTertiaryColor] = useState("#ffffff");
//   const [themeMode, setThemeMode] = useState("system");
//   const [contrastMode, setContrastMode] = useState(false);
//   const [layoutStyle, setLayoutStyle] = useState("default");
//   const [previewLayoutStyle, setPreviewLayoutStyle] = useState(null);
//   const [layout, setLayout] = useState("grid");
//   const [fontSize, setFontSize] = useState("medium");
//   const [previewFontSize, setPreviewFontSize] = useState(null);
//   const effectiveLayout = previewLayoutStyle || layoutStyle;
//   const effectiveFontSize = previewFontSize || fontSize;
//   const [loading, setLoading] = useState(true);

//   // -------------------- Products & Cart --------------------
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState({});

//   // -------------------- Helper: Auth --------------------
//   const loginUser = async (email, password) => {
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Login failed");
//       setCurrentUser(data.user);
//       setCartItems(data.user.cartItems || {});
//       return data.user;
//     } catch (err) {
//       throw err;
//     }
//   };

//   const signupUser = async (formData) => {
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Signup failed");
//       return data.user;
//     } catch (err) {
//       throw err;
//     }
//   };

//   const logoutUser = () => {
//     setCurrentUser(null);
//     setCartItems({});
//   };

//   // -------------------- Persist Auth --------------------
//   useEffect(() => {
//     const saved = localStorage.getItem("currentUser");
//     if (saved) setCurrentUser(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
//     else localStorage.removeItem("currentUser");
//   }, [currentUser]);

//   // -------------------- Persist Theme / Currency --------------------
//   useEffect(() => {
//     const saved = localStorage.getItem("currency");
//     if (saved) setCurrency(saved);
//   }, []);
//   useEffect(() => localStorage.setItem("currency", currency), [currency]);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("themeColor");
//     const savedSecondary = localStorage.getItem("secondaryColor");
//     const savedTertiary = localStorage.getItem("tertiaryColor");
//     if (savedTheme) setThemeColor(savedTheme);
//     if (savedSecondary) setSecondaryColor(savedSecondary);
//     if (savedTertiary) setTertiaryColor(savedTertiary);
//   }, []);
//   useEffect(() => localStorage.setItem("themeColor", themeColor), [themeColor]);
//   useEffect(() => localStorage.setItem("secondaryColor", secondaryColor), [secondaryColor]);
//   useEffect(() => localStorage.setItem("tertiaryColor", tertiaryColor), [tertiaryColor]);

//   useEffect(() => {
//     const saved = localStorage.getItem("themeMode") || "system";
//     setThemeMode(saved);
//   }, []);

//     useEffect(() => {
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");

//     const applyTheme = () => {
//         if (themeMode === "system") {
//         document.documentElement.classList.toggle("dark", mq.matches);
//         } else {
//         document.documentElement.classList.toggle("dark", themeMode === "dark");
//         }
//     };

//     applyTheme(); // Apply immediately

//     if (themeMode === "system") {
//         mq.addEventListener("change", applyTheme);
//         return () => mq.removeEventListener("change", applyTheme);
//     }

//     return () => {}; // always return a cleanup function, even if empty
//     }, [themeMode]);

//   useEffect(() => {
//     const saved = localStorage.getItem("contrastMode") === "true";
//     setContrastMode(saved);
//   }, []);
//   useEffect(() => {
//     document.documentElement.classList.toggle("high-contrast", contrastMode);
//     localStorage.setItem("contrastMode", contrastMode);
//   }, [contrastMode]);

//   // -------------------- Products --------------------
//     useEffect(() => {
//     // Define async function inside effect
//     async function fetchData() {
//         try {
//         const { data } = await axios.get("/api/product/list");
//         if (data.success) setProducts(data.products);
//         else toast.error(data.message);
//         } catch (err) {
//         toast.error(err.message);
//         }
//     }

//     fetchData(); // Call it immediately
//     }, []);

//   // -------------------- Cart --------------------
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cartItems");
//     if (savedCart) setCartItems(JSON.parse(savedCart));
//   }, []);
//   useEffect(() => localStorage.setItem("cartItems", JSON.stringify(cartItems)), [cartItems]);

//   const addToCart = async (product) => {
//     const itemId = product._id;
//     let cartData = structuredClone(cartItems);
//     cartData[itemId] = (cartData[itemId] || 0) + 1;
//     setCartItems(cartData);

//     toast.custom(
//       (t) => (
//         <div
//           className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg flex items-center gap-3 p-4 transform transition-all duration-300 ${
//             t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
//           }`}
//         >
//           <ShoppingCart className="text-orange-500" size={20} />
//           <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Item added to cart</p>
//         </div>
//       ),
//       { duration: 2000, position: "top-right" }
//     );
//   };

//   const updateCartQuantity = (productId, quantity) => {
//     const updated = { ...cartItems };
//     if (quantity <= 0) delete updated[productId];
//     else updated[productId] = quantity;
//     setCartItems(updated);
//   };

//   const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

//   const getCartAmount = () => {
//     let total = 0;
//     for (const itemId in cartItems) {
//       const product = products.find((p) => p._id === itemId);
//       if (product) total += (product.offerPrice || 0) * cartItems[itemId];
//     }
//     return Math.round(total * 100) / 100;
//   };

//   const value = {
//     currentUser,
//     loginUser,
//     signupUser,
//     logoutUser,
//     currency,
//     setCurrency,
//     themeColor,
//     setThemeColor,
//     secondaryColor,
//     setSecondaryColor,
//     tertiaryColor,
//     setTertiaryColor,
//     themeMode,
//     setThemeMode,
//     contrastMode,
//     setContrastMode,
//     layout,
//     setLayout,
//     layoutStyle: effectiveLayout,
//     setLayoutStyle,
//     fontSize: effectiveFontSize,
//     setFontSize,
//     previewFontSize,
//     setPreviewFontSize,
//     previewLayoutStyle,
//     setPreviewLayoutStyle,
//     products,
//     setProducts,
//     cartItems,
//     setCartItems,
//     addToCart,
//     updateCartQuantity,
//     getCartCount,
//     getCartAmount,
//     loading,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };


































'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const router = useRouter();

  // -------------------- Auth --------------------
  const [currentUser, setCurrentUser] = useState(null);

  const loginUser = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.user && data.token) {
        const mongoUser = {
          ...data.user,
          _id: data.user._id, // ensure Mongo _id is included
        };

        setCurrentUser(mongoUser);
        setCartItems(data.user.cartItems || {});
        localStorage.setItem("currentUser", JSON.stringify(mongoUser));
        localStorage.setItem("authToken", data.token);

        return { success: true, user: mongoUser, token: data.token };
      }

      throw new Error("Invalid login response");
    } catch (err) {
      throw err;
    }
  };

  const signupUser = async (formData) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCartItems({});
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
  };

  // -------------------- Persist Auth --------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedToken = localStorage.getItem("authToken");

    if (savedUser && savedToken && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser._id) {
          console.error("Mongo _id missing in savedUser");
        } else {
          setCurrentUser(parsedUser); // now API will receive a valid userId
        }
      } catch (err) {
        console.error("Failed to parse savedUser:", err);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);


  // -------------------- Theme & Layout --------------------
  const [currency, setCurrency] = useState("$");
  const [themeColor, setThemeColor] = useState("#f97316");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [tertiaryColor, setTertiaryColor] = useState("#ffffff");
  const [themeMode, setThemeMode] = useState("system");
  const [contrastMode, setContrastMode] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState("default");
  const [previewLayoutStyle, setPreviewLayoutStyle] = useState(null);
  const [layout, setLayout] = useState("grid");
  const [fontSize, setFontSize] = useState("medium");
  const [previewFontSize, setPreviewFontSize] = useState(null);
  const effectiveLayout = previewLayoutStyle || layoutStyle;
  const effectiveFontSize = previewFontSize || fontSize;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved) setCurrency(saved);
  }, []);
  useEffect(() => localStorage.setItem("currency", currency), [currency]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeColor");
    const savedSecondary = localStorage.getItem("secondaryColor");
    const savedTertiary = localStorage.getItem("tertiaryColor");
    if (savedTheme) setThemeColor(savedTheme);
    if (savedSecondary) setSecondaryColor(savedSecondary);
    if (savedTertiary) setTertiaryColor(savedTertiary);
  }, []);
  useEffect(() => localStorage.setItem("themeColor", themeColor), [themeColor]);
  useEffect(() => localStorage.setItem("secondaryColor", secondaryColor), [secondaryColor]);
  useEffect(() => localStorage.setItem("tertiaryColor", tertiaryColor), [tertiaryColor]);

  useEffect(() => {
    const saved = localStorage.getItem("themeMode") || "system";
    setThemeMode(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (themeMode === "system") {
        document.documentElement.classList.toggle("dark", mq.matches);
      } else {
        document.documentElement.classList.toggle("dark", themeMode === "dark");
      }
    };

    applyTheme();

    if (themeMode === "system") {
      mq.addEventListener("change", applyTheme);
      return () => mq.removeEventListener("change", applyTheme);
    }

    return () => {};
  }, [themeMode]);

  useEffect(() => {
    const saved = localStorage.getItem("contrastMode") === "true";
    setContrastMode(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", contrastMode);
    localStorage.setItem("contrastMode", contrastMode);
  }, [contrastMode]);

  // -------------------- Products & Cart --------------------
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("/api/product/list");
        if (data.success) setProducts(data.products);
        else toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false); // ✅ Important: mark loading done
      }
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);
  useEffect(() => localStorage.setItem("cartItems", JSON.stringify(cartItems)), [cartItems]);

  const addToCart = async (product) => {
    const itemId = product._id;
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);

    toast.custom(
      (t) => (
        <div
          className={`max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg flex items-center gap-3 p-4 transform transition-all duration-300 ${
            t.visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          <ShoppingCart className="text-orange-500" size={20} />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Item added to cart</p>
        </div>
      ),
      { duration: 2000, position: "top-right" }
    );
  };

  const updateCartQuantity = (productId, quantity) => {
    const updated = { ...cartItems };
    if (quantity <= 0) delete updated[productId];
    else updated[productId] = quantity;
    setCartItems(updated);
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) total += (product.offerPrice || 0) * cartItems[itemId];
    }
    return Math.round(total * 100) / 100;
  };

  const value = {
    currentUser,
    loginUser,
    signupUser,
    logoutUser,
    currency,
    setCurrency,
    themeColor,
    setThemeColor,
    secondaryColor,
    setSecondaryColor,
    tertiaryColor,
    setTertiaryColor,
    themeMode,
    setThemeMode,
    contrastMode,
    setContrastMode,
    layout,
    setLayout,
    layoutStyle: effectiveLayout,
    setLayoutStyle,
    fontSize: effectiveFontSize,
    setFontSize,
    previewFontSize,
    setPreviewFontSize,
    previewLayoutStyle,
    setPreviewLayoutStyle,
    products,
    setProducts,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
