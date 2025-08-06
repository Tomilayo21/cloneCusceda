'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = (props) => {
    // const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const [currency, setCurrency] = useState('USD'); 
    const [themeColor, setThemeColor] = useState("#f97316"); 
    const [themeMode, setThemeMode] = useState("system");
    const [contrastMode, setContrastMode] = useState(false);
    const [layoutStyle, setLayoutStyle] = useState("default"); 
    const [previewLayoutStyle, setPreviewLayoutStyle] = useState(null); 
    const [layout, setLayout] = useState("grid");
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState("medium");
    const [previewFontSize, setPreviewFontSize] = useState(null);
    const effectiveLayout = previewLayoutStyle || layoutStyle;
    const effectiveFontSize = previewFontSize || fontSize;


    const router = useRouter();

    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cartItems, setCartItems] = useState({}); 

    //Currency
    useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) setCurrency(saved);
    }, []);

    useEffect(() => {
    localStorage.setItem('currency', currency);
    }, [currency]);

    //Theme Color
    useEffect(() => {
        const savedColor = localStorage.getItem("themeColor");
        if (savedColor) setThemeColor(savedColor);
    }, []);

    useEffect(() => {
        localStorage.setItem("themeColor", themeColor);
    }, [themeColor]);


    //Cart
    useEffect(() => {
        const fetchCart = async () => {
            const res = await fetch("/api/cart/get");
            const data = await res.json();
            if (data.success) {
            setCartItems(data.cartItems); // <- this will rehydrate your cart
            }
        };

        fetchCart();
    }, []);


    // Sync with localStorage and system preference
    useEffect(() => {
    const saved = localStorage.getItem("themeMode") || "system";
    setThemeMode(saved);
    }, []);

    useEffect(() => {
    if (themeMode === "system") {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => {
        document.documentElement.classList.toggle("dark", mq.matches);
        };
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    } else {
        document.documentElement.classList.toggle("dark", themeMode === "dark");
    }
    localStorage.setItem("themeMode", themeMode);
    }, [themeMode]);

    //High Contrast
    useEffect(() => {
        const saved = localStorage.getItem("contrastMode") === "true";
        setContrastMode(saved);
    }, []);

    useEffect(() => {
        if (contrastMode) {
            document.documentElement.classList.add("high-contrast");
        } else {
            document.documentElement.classList.remove("high-contrast");
        }
        localStorage.setItem("contrastMode", contrastMode);
    }, [contrastMode]);

    
    //LAyout
    useEffect(() => {
        const fetchSettings = async () => {
            try {
            const res = await fetch("/api/user-settings");
            if (!res.ok) throw new Error("Unauthorized");
            const data = await res.json();

            if (data?.fontSize) setFontSize(data.fontSize);
            if (data?.layoutStyle) setLayoutStyle(data.layoutStyle); // Keep key names consistent
            } catch (err) {
            console.error("Error loading user settings:", err);
            } finally {
            setLoading(false);
            }
        };

        if (user) fetchSettings();
    }, [user]);



    const updateSettings = () => {};
    const cancelPreview = () => {};


    const savePreferences = async (newFontSize, newLayoutStyle) => {
    try {
        const res = await fetch("/api/user-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fontSize: newFontSize, layoutStyle: newLayoutStyle }),
        });

        if (!res.ok) throw new Error("Failed to save settings");

        const data = await res.json();
        if (data.fontSize) setFontSize(data.fontSize);
        if (data.layoutStyle) setLayoutStyle(data.layoutStyle);
        toast.success("Preferences saved!");
    } catch (err) {
        console.error(err);
        toast.error("Error saving preferences");
    }
    };


    const saveLayoutStyle = async (newLayout) => {
        try {
            setLayout(newLayout);

            const res = await fetch("/api/user/settings", {
            method: "POST",
            body: JSON.stringify({ layoutStyle: newLayout }),
            });

            if (!res.ok) throw new Error("Failed to update layout");

            const data = await res.json();
            console.log("Layout saved:", data);
        } catch (error) {
            console.error("Error saving layout style:", error);
        }
    };



    useEffect(() => {
        const fetchPreferences = async () => {
            try {
            const res = await fetch("/api/user/settings");
            const data = await res.json();

            if (data) {
                setFontSize(data.fontSize || "medium");
            }
            } catch (err) {
            console.error("Failed to load user preferences:", err);
            } finally {
            setLoading(false);
            }
        };

        fetchPreferences();
    }, []);



    //Product List

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'admin') {
                setIsAdmin(true);
            }

            const token = await getToken();
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);

                // ✅ Fallback to empty object if cartItems is undefined
                setCartItems(data.user.cartItems || {});
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addToCart = async (product) => {
        const itemId = product._id;
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Item added to cart");

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    // Load cartItems from localStorage on mount



    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cartItems to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = quantity;
      }
      return updated;
    });
  };

//   const getCartCount = () =>
//     Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
    
//     const updateCartQuantity = (productId, quantity) => {
//   setCartItems(prev => {
//     if (quantity <= 0) {
//       const updated = { ...prev };
//       delete updated[productId];
//       return updated;
//     }

//     const product = products.find(p => p._id === productId);
//         if (!product) return prev;

//         return {
//         ...prev,
//         [productId]: {
//             name: product.name,
//             image: product.image[0],
//             price: product.offerPrice,
//             quantity
//         }
//         };
//     });
//     };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            const itemInfo = products.find(product => product._id === itemId);

            if (itemInfo && typeof itemInfo.offerPrice === 'number') {
                totalAmount += itemInfo.offerPrice * quantity;
            }
        }

        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        } else {
            // ✅ Clear cart when user logs out
            setCartItems({});
        }
    }, [user]);

    const value = {
        user,
        getToken,
        currency,
        router,
        isAdmin,
        setIsAdmin,
        userData,
        fetchUserData,
        products,
        setProducts,
        addToCart,
        updateCartQuantity,
        cartItems,
        setCartItems,
        getCartCount,
        setCurrency,
        getCartAmount,
        themeColor,
        setThemeColor,
        themeMode,
        setThemeMode,
        contrastMode,
        setContrastMode,
        saveLayoutStyle,
        cancelPreview,
        layout, 
        loading,
        layoutStyle: effectiveLayout,
        setLayoutStyle,
        previewLayoutStyle,
        setPreviewLayoutStyle,
        fontSize: effectiveFontSize,
        setFontSize,
        previewFontSize,
        setPreviewFontSize,
        savePreferences,
        updateSettings,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};































































































































// 'use client';

// import { useAuth, useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";
// import axios from 'axios';
// import toast from "react-hot-toast";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext);
// };

// export const AppContextProvider = (props) => {
//     // const currency = process.env.NEXT_PUBLIC_CURRENCY;
//     const [currency, setCurrency] = useState('USD'); 
//     const [themeColor, setThemeColor] = useState("#f97316"); 
//     const [themeMode, setThemeMode] = useState("system");
//     const [contrastMode, setContrastMode] = useState(false);
//     const [layoutStyle, setLayoutStyle] = useState("default"); 
//     const [previewLayoutStyle, setPreviewLayoutStyle] = useState(null); 
//     const [layout, setLayout] = useState("grid");
//     const [loading, setLoading] = useState(true);
//     // const [fontSize, setFontSize] = useState("medium");
//     // const [previewFontSize, setPreviewFontSize] = useState(null);
//     // const effectiveLayout = previewLayoutStyle || layoutStyle;
//     // const effectiveFontSize = previewFontSize || fontSize;
//     // const [layoutStyle, setLayoutStyle] = useState('default');
//     const [fontSize, setFontSize] = useState('medium');


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
//         const savedColor = localStorage.getItem("themeColor");
//         if (savedColor) setThemeColor(savedColor);
//     }, []);

//     useEffect(() => {
//         localStorage.setItem("themeColor", themeColor);
//     }, [themeColor]);


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
//     if (themeMode === "system") {
//         const mq = window.matchMedia("(prefers-color-scheme: dark)");
//         const apply = () => {
//         document.documentElement.classList.toggle("dark", mq.matches);
//         };
//         apply();
//         mq.addEventListener("change", apply);
//         return () => mq.removeEventListener("change", apply);
//     } else {
//         document.documentElement.classList.toggle("dark", themeMode === "dark");
//     }
//     localStorage.setItem("themeMode", themeMode);
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


//     // Extend fetchUserData to set these
// const fetchUserDat = async () => {
//   const token = await getToken();
//   const res = await fetch('/api/user-settings', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   const data = await res.json();

//   setUserData(data);
//   setLayoutStyle(data.layoutStyle || 'default');
//   setFontSize(data.fontSize || 'medium');
// };

// // Sync API when changed
// const syncUserPreferences = async (key, value) => {
//   const token = await getToken();
//   await fetch('/api/user-settings', {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`
//     },
//     body: JSON.stringify({ [key]: value })
//   });
// };
























//     // //LAyout
//     // useEffect(() => {
//     //     const fetchSettings = async () => {
//     //         try {
//     //         const res = await fetch("/api/user-settings");
//     //         if (!res.ok) throw new Error("Unauthorized");
//     //         const data = await res.json();

//     //         if (data?.fontSize) setFontSize(data.fontSize);
//     //         if (data?.layoutStyle) setLayoutStyle(data.layoutStyle); // Keep key names consistent
//     //         } catch (err) {
//     //         console.error("Error loading user settings:", err);
//     //         } finally {
//     //         setLoading(false);
//     //         }
//     //     };

//     //     if (user) fetchSettings();
//     // }, [user]);



//     // const updateSettings = () => {};
//     // const cancelPreview = () => {};


//     // const savePreferences = async (newFontSize, newLayoutStyle) => {
//     // try {
//     //     const res = await fetch("/api/user-settings", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ fontSize: newFontSize, layoutStyle: newLayoutStyle }),
//     //     });

//     //     if (!res.ok) throw new Error("Failed to save settings");

//     //     const data = await res.json();
//     //     if (data.fontSize) setFontSize(data.fontSize);
//     //     if (data.layoutStyle) setLayoutStyle(data.layoutStyle);
//     //     toast.success("Preferences saved!");
//     // } catch (err) {
//     //     console.error(err);
//     //     toast.error("Error saving preferences");
//     // }
//     // };


//     // const saveLayoutStyle = async (newLayout) => {
//     //     try {
//     //         setLayout(newLayout);

//     //         const res = await fetch("/api/user/settings", {
//     //         method: "POST",
//     //         body: JSON.stringify({ layoutStyle: newLayout }),
//     //         });

//     //         if (!res.ok) throw new Error("Failed to update layout");

//     //         const data = await res.json();
//     //         console.log("Layout saved:", data);
//     //     } catch (error) {
//     //         console.error("Error saving layout style:", error);
//     //     }
//     // };



//     // useEffect(() => {
//     //     const fetchPreferences = async () => {
//     //         try {
//     //         const res = await fetch("/api/user/settings");
//     //         const data = await res.json();

//     //         if (data) {
//     //             setFontSize(data.fontSize || "medium");
//     //         }
//     //         } catch (err) {
//     //         console.error("Failed to load user preferences:", err);
//     //         } finally {
//     //         setLoading(false);
//     //         }
//     //     };

//     //     fetchPreferences();
//     // }, []);



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

//     const addToCart = async (product) => {
//         const itemId = product._id;
//         let cartData = structuredClone(cartItems);

//         if (cartData[itemId]) {
//             cartData[itemId] += 1;
//         } else {
//             cartData[itemId] = 1;
//         }

//         setCartItems(cartData);
//         toast.success("Item added to cart");

//         if (user) {
//             try {
//                 const token = await getToken();
//                 await axios.post('/api/cart/update', { cartData }, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//             } catch (error) {
//                 toast.error(error.message);
//             }
//         }
//     };

//     // Load cartItems from localStorage on mount



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

//   const updateCartQuantity = (productId, quantity) => {
//     setCartItems((prev) => {
//       const updated = { ...prev };
//       if (quantity <= 0) {
//         delete updated[productId];
//       } else {
//         updated[productId] = quantity;
//       }
//       return updated;
//     });
//   };

// //   const getCartCount = () =>
// //     Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
    
// //     const updateCartQuantity = (productId, quantity) => {
// //   setCartItems(prev => {
// //     if (quantity <= 0) {
// //       const updated = { ...prev };
// //       delete updated[productId];
// //       return updated;
// //     }

// //     const product = products.find(p => p._id === productId);
// //         if (!product) return prev;

// //         return {
// //         ...prev,
// //         [productId]: {
// //             name: product.name,
// //             image: product.image[0],
// //             price: product.offerPrice,
// //             quantity
// //         }
// //         };
// //     });
// //     };

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
//         themeMode,
//         setThemeMode,
//         contrastMode,
//         setContrastMode,
//         // saveLayoutStyle,
//         // cancelPreview,
//         layout, 
//         loading,
//         layoutStyle,
//         setLayoutStyle,
//         previewLayoutStyle,
//         setPreviewLayoutStyle,
//         // fontSize: effectiveFontSize,
//         setFontSize,
//         // previewFontSize,
//         // setPreviewFontSize,
//         // savePreferences,
//         // updateSettings,
//         // layoutStyle,
//         setLayoutStyle: (style) => {
//             setLayoutStyle(style);
//             syncUserPreferences('layoutStyle', style);
//         },
//         fontSize,
//         setFontSize: (size) => {
//             setFontSize(size);
//             syncUserPreferences('fontSize', size);
//         },
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     );
// };
