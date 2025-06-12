"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
// import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const PRODUCTS_PER_PAGE = 10;

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockInputs, setStockInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("none");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const parsedStart = startDate ? new Date(startDate) : null;
  const parsedEnd = endDate ? new Date(endDate) : null;
  const [openProduct, setOpenProduct] = useState(null);
  const [editableProduct, setEditableProduct] = useState(null);

  useEffect(() => {
    if (openProduct) {
      setEditableProduct({ ...openProduct });
    }
  }, [openProduct]);

  // Set end of day for the end date so the filter includes the whole day
  if (parsedEnd) {
    parsedEnd.setHours(23, 59, 59, 999);
  }

  const fetchAdminProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/admin-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
  let temp = [...products];

  if (searchTerm) {
    temp = temp.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategory !== "All") {
    temp = temp.filter((p) => p.category === selectedCategory);
  }

  // Date range filtering
  temp = temp.filter((p) => {
  const created = new Date(p.date); // use the correct date field from your schema
  return (
    (!parsedStart || created >= parsedStart) &&
    (!parsedEnd || created <= parsedEnd)
  );
});

  // Sorting
  if (sortOption === "price-asc") {
    temp.sort((a, b) => a.offerPrice - b.offerPrice);
  } else if (sortOption === "price-desc") {
    temp.sort((a, b) => b.offerPrice - a.offerPrice);
  } else if (sortOption === "stock-asc") {
    temp.sort((a, b) => a.stock - b.stock);
  } else if (sortOption === "stock-desc") {
    temp.sort((a, b) => b.stock - a.stock);
  }

  setFilteredProducts(temp);
  setCurrentPage(1);
}, [searchTerm, selectedCategory, products, sortOption, startDate, endDate]);


const handleExportCSV = () => {
  const headers = ["Name", "Category", "Price", "Stock", "Created At"];
  const rows = filteredProducts.map((p) => [
    p.name,
    p.category,
    p.offerPrice,
    p.stock,
    new Date(p.createdAt).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "products.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  useEffect(() => {
    if (user) fetchAdminProduct();
  }, [user]);

  useEffect(() => {
    let temp = [...products];

    if (searchTerm) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      temp = temp.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(temp);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [searchTerm, selectedCategory, products]);

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
          prev.map((p) =>
            p._id === id ? { ...p, visible: data.visible } : p
          )
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

  //Update Product
  const handleProductUpdate = async (updatedProduct) => {
    try {
      const res = await fetch(`/api/product/${updatedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      const updated = await res.json();

      // Optionally update local state or re-fetch data
      toast.success("Product updated successfully");
      setOpenProduct(null);
      // Optional: re-fetch product list
      router.refresh?.(); // If using Next.js 13+ app router
    } catch (error) {
      console.error(error);
      toast.error("Error updating product");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      {/* {loading ? (
        <Loading />
      ) : ()} */}
      <div className="w-full md:p-10 p-4 max-w-7xl mx-auto">
          <h2 className="pb-4 text-xl font-semibold">All Products</h2>
          {/* Filters Section */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="none">Sort</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
              <option value="stock-asc">Stock Low to High</option>
              <option value="stock-desc">Stock High to Low</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              Export CSV
            </button>
          </div>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-gray-300 rounded-md overflow-x-auto">
            <table className="table-fixed w-full">
              <thead className="text-gray-900 text-sm text-left bg-gray-100">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate">Stock</th>
                  <th className="px-4 py-3 font-medium truncate">Status</th>
                  <th className="px-4 py-3 font-medium truncate">Visibility</th>
                  <th className="px-4 py-3 font-medium truncate">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {paginatedProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <Image
                        src={product.image[0]}
                        alt="product image"
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                      />
                      <span className="truncate">{product.name}</span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">${product.offerPrice}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={stockInputs[product._id] ?? product.stock}
                        min={0}
                        onChange={(e) =>
                          setStockInputs((prev) => ({
                            ...prev,
                            [product._id]: parseInt(e.target.value, 10),
                          }))
                        }
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
                        <span className="text-black-400 font-semibold">
                        In Stock</span>
                      ) : (
                        <span className="text-orange-600 font-semibold">Sold Out</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisibility(product._id)}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          product.visible ? "bg-orange-600" : "bg-gray-400"
                        }`}
                      >
                        {product.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 flex flex-col gap-2">
                      {/* <button
                        onClick={() => router.push(`/admin/product/edit/${product._id}`)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1 justify-center"
                      > */}
                      <button
                        onClick={() => setOpenProduct(product)}
                        className="text-black bg-orange rounded-md hover:text-white px-3 py-2 hover:bg-black flex items-center gap-1"
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

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4">
            {paginatedProducts.map((product) => (
              <div key={product._id} className="bg-white border rounded-md shadow-sm p-4 flex gap-4">
                <Image
                  src={product.image[0]}
                  alt="product image"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-800 font-medium">${product.offerPrice}</p>
                  <p className="text-sm">
                    {product.stock > 0 ? (
                      <div>
                        <input
                        type="number"
                        value={stockInputs[product._id] ?? product.stock}
                        min={0}
                        onChange={(e) =>
                          setStockInputs((prev) => ({
                            ...prev,
                            [product._id]: parseInt(e.target.value, 10),
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleStockUpdate(product._id, stockInputs[product._id]);
                          }
                        }}
                        className="w-12 px-2 py-1 border rounded"
                      /><span className="text-black-400 ml-2">In Stock</span></div>
                    ) : (
                      <span className="text-orange-600">Sold Out</span>
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {/* <button
                      onClick={() => router.push(`/admin/product/edit/${product._id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md flex items-center gap-1"
                    > */}
                    <button
                      onClick={() => setOpenProduct(product)}
                      className="text-black bg-orange rounded-md hover:text-white px-3 py-2 hover:bg-black flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => toggleVisibility(product._id)}
                      className={`px-3 py-1 text-sm rounded-md text-white ${
                        product.visible ? "bg-orange-600" : "bg-gray-500"
                      }`}
                    >
                      {product.visible ? "Visible" : "Hidden"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Modal Pop-Up */}
          {openProduct && editableProduct && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-lg p-4 max-w-md w-full relative shadow-xl space-y-2 text-sm max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setOpenProduct(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                  ✖
                </button>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    value={editableProduct.name}
                    onChange={(e) =>
                      setEditableProduct({ ...editableProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>

                {/* Category dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Category</label>
                  <select
                    value={editableProduct.category}
                    onChange={(e) =>
                      setEditableProduct({ ...editableProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  >
                    <option value="Earphone">Earphone</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Watch">Watch</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Camera">Camera</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* Brand dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Brand</label>
                  <select
                    value={editableProduct.brand}
                    onChange={(e) =>
                      setEditableProduct({ ...editableProduct, brand: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Sony">Sony</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Bose">Bose</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Color dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Color</label>
                  <select
                    value={editableProduct.color}
                    onChange={(e) =>
                      setEditableProduct({ ...editableProduct, color: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  >
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Silver">Silver</option>
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="Gold">Gold</option>
                    <option value="Green">Green</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Offer Price ($)</label>
                  <input
                    type="number"
                    value={editableProduct.offerPrice}
                    onChange={(e) =>
                      setEditableProduct({
                        ...editableProduct,
                        offerPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Stock</label>
                  <input
                    type="number"
                    value={editableProduct.stock}
                    onChange={(e) =>
                      setEditableProduct({
                        ...editableProduct,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={editableProduct.description}
                    onChange={(e) =>
                      setEditableProduct({ ...editableProduct, description: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border rounded resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Visibility</label>
                  <select
                    value={editableProduct.visible ? "visible" : "hidden"}
                    onChange={(e) =>
                      setEditableProduct({
                        ...editableProduct,
                        visible: e.target.value === "visible",
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="text-xs text-gray-400">
                  Created {new Date(openProduct.createdAt).toLocaleString()}
                </div>

                <div>
                  <Image
                    src={editableProduct.image?.[0] || "/placeholder.jpg"}
                    alt={editableProduct.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>

                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                  onClick={() => handleProductUpdate(editableProduct)}
                >
                  Update Product
                </button>
              </div>
            </div>
          )}

        </div>

      <Footer />
    </div>
  );
};

export default ProductList;
