"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockInputs, setStockInputs] = useState({});

  const fetchAdminProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/admin-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdminProduct();
    }
  }, [user]);

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}`, userid: user.id },
      });

      if (data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const toggleVisibility = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `/api/product/${id}`,
        { toggleVisibility: true },
        {
          headers: { Authorization: `Bearer ${token}`, userid: user.id },
        }
      );

      if (data.success) {
        toast.success("Visibility updated");
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, visible: data.visible } : p))
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: user.id,
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!res.ok) throw new Error("Failed to update stock");

      toast.success("Stock updated");

      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (err) {
      toast.error("Error updating stock");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4 max-w-7xl mx-auto">
          <h2 className="pb-4 text-xl font-semibold">All Products</h2>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-gray-300 rounded-md overflow-x-auto">
            <table className="table-fixed w-full">
              <thead className="text-gray-900 text-sm text-left bg-gray-100">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate">Stock</th>
                  <th className="px-4 py-3 font-medium truncate">Status</th>
                  <th className="px-4 py-3 font-medium truncate">Visibility</th>
                  <th className="px-4 py-3 font-medium truncate">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <div className="bg-gray-100 rounded p-1">
                        <Image
                          src={product.image[0]}
                          alt="product image"
                          className="w-16 h-16 object-cover rounded"
                          width={64}
                          height={64}
                        />
                      </div>
                      <span className="truncate">{product.name}</span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">${product.offerPrice}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={stockInputs[product._id] ?? product.stock}
                        min={0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          setStockInputs((prev) => ({ ...prev, [product._id]: value }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleStockUpdate(product._id, stockInputs[product._id]);
                          }
                        }}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Sold Out</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisibility(product._id)}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          product.visible ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {product.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 flex flex-col gap-2">
                      <button
                        onClick={() => router.push(`/admin/product/edit/${product._id}`)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1 justify-center"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md text-sm flex items-center gap-1 justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-300 rounded-md p-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 rounded p-1 flex-shrink-0">
                    <Image
                      src={product.image[0]}
                      alt="product image"
                      className="w-20 h-20 object-cover rounded"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{product.category}</p>
                    <p className="mt-1 font-semibold">${product.offerPrice}</p>
                    <p
                      className={
                        product.stock > 0
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {product.stock > 0 ? "In Stock" : "Sold Out"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col space-y-3">
                  <label className="flex flex-col text-sm font-medium">
                    Stock:
                    <input
                      type="number"
                      value={stockInputs[product._id] ?? product.stock}
                      min={0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setStockInputs((prev) => ({ ...prev, [product._id]: value }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleStockUpdate(product._id, stockInputs[product._id]);
                        }
                      }}
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                  </label>

                  <button
                    onClick={() => toggleVisibility(product._id)}
                    className={`w-full py-2 rounded-md text-white font-semibold ${
                      product.visible ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    {product.visible ? "Visible" : "Hidden"}
                  </button>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => router.push(`/admin/product/edit/${product._id}`)}
                      className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-full py-1 bg-red-600 text-white rounded-md font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
