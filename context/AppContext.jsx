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
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cartItems, setCartItems] = useState({}); // Start cart from 0 (empty object)
    
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
        getCartAmount,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
