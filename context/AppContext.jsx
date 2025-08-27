'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = (props) => {
    // const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const [currency, setCurrency] = useState('$'); 
    const [themeColor, setThemeColor] = useState("#f97316"); 
    const [secondaryColor, setSecondaryColor] = useState("#000000");
    const [tertiaryColor, setTertiaryColor] = useState("#ffffff");
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
        const savedTheme = localStorage.getItem("themeColor");
        const savedSecondary = localStorage.getItem("secondaryColor");
        const savedTertiary = localStorage.getItem("tertiaryColor");

        if (savedTheme) setThemeColor(savedTheme);
        if (savedSecondary) setSecondaryColor(savedSecondary);
        if (savedTertiary) setTertiaryColor(savedTertiary);
    }, []);

    useEffect(() => {
        localStorage.setItem("themeColor", themeColor);
    }, [themeColor]);
      useEffect(() => {
    localStorage.setItem("secondaryColor", secondaryColor);
    }, [secondaryColor]);

    useEffect(() => {
        localStorage.setItem("tertiaryColor", tertiaryColor);
    }, [tertiaryColor]);


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

    // const addToCart = async (product) => {
    //     const itemId = product._id;
    //     let cartData = structuredClone(cartItems);

    //     if (cartData[itemId]) {
    //         cartData[itemId] += 1;
    //     } else {
    //         cartData[itemId] = 1;
    //     }

    //     setCartItems(cartData);
    //     toast.success("Item added to cart");

    //     if (user) {
    //         try {
    //             const token = await getToken();
    //             await axios.post('/api/cart/update', { cartData }, {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //         } catch (error) {
    //             toast.error(error.message);
    //         }
    //     }
    // };
    
    const addToCart = async (product) => {
        const itemId = product._id;
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);

        // Custom toast
        toast.custom(
            (t) => (
            <div
                className={`${
                t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center gap-2 p-4`}
            >
                <ShoppingCart className="text-orange-500" size={20} />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Item added to cart
                </p>
            </div>
            ),
            { duration: 2000 }
        );

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


    const updateCartQuantity = async (productId, quantity) => {
    const updated = { ...cartItems };

    if (quantity <= 0) {
        delete updated[productId];
    } else {
        updated[productId] = quantity;
    }

    // update local state immediately
    setCartItems(updated);

    // If user is logged in, persist to backend with Clerk token
    if (user) {
        try {
        const token = await getToken();
        await axios.post(
            "/api/cart/update",
            { cartData: updated }, // ✅ object
            { headers: { Authorization: `Bearer ${token}` } }
        );
        } catch (err) {
        console.error("Failed to save cart to server:", err);
        toast.error("Could not update cart on the server");
        }
    }
    };

    

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
        secondaryColor,
        setSecondaryColor,
        tertiaryColor,
        setTertiaryColor,
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
