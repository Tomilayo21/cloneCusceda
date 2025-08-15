"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/admin/Footer";
// import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import TiptapEditor from "@/components/TiptapEditor";

const PRODUCTS_PER_PAGE = 15;

const ProductListPanel = () => {
  const { router, getToken, user, currency } = useAppContext();
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  

  
  dayjs.extend(relativeTime);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
 
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
        setFilteredProducts((prev) => prev.filter((p) => p._id !== productId));
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
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (err) {
      toast.error("Error updating stock");
    }
  };

  const handleProductUpdate = async (product) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("brand", product.brand);
      formData.append("color", product.color);
      formData.append("price", product.price);
      formData.append("offerPrice", product.offerPrice);
      formData.append("stock", product.stock);
      formData.append("visible", product.visible);
      formData.append("description", product.description);
      formData.append("existingImages", JSON.stringify(product.image || []));

      if (product.newImages && product.newImages.length > 0) {
        for (let i = 0; i < product.newImages.length; i++) {
          formData.append("newImages", product.newImages[i]);
        }
      }

      const res = await fetch(`/api/product/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Product updated");
      setOpenProduct(null);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, ...product } : p
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
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
          <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="table-fixed w-full border-collapse">
              <thead className="bg-gray-50 text-gray-800 text-sm">
                <tr>
                  <th className="w-2/3 md:w-1/5 px-4 py-3 font-medium text-left">Product</th>
                  <th className="px-4 py-3 font-medium text-left">Category</th>
                  <th className="px-4 py-3 font-medium text-left">Price</th>
                  <th className="px-4 py-3 font-medium text-left">Stock</th>
                  <th className="px-4 py-3 font-medium text-left">Status</th>
                  <th className="px-4 py-3 font-medium text-left">Visibility</th>
                  <th className="px-4 py-3 font-medium text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {paginatedProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-t border-gray-200 hover:bg-orange-50 transition`}
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center space-y-2">
                        <Image
                          src={product.image[0]}
                          alt="product image"
                          className="w-14 h-14 object-cover rounded-md border"
                          width={56}
                          height={56}
                        />
                        <span className="truncate font-medium text-center">{product.name}</span>
                      </div>
                    </td>


                    {/* Category */}
                    <td className="px-4 py-3">{product.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3 font-semibold">${product.offerPrice}</td>

                    {/* Stock Input */}
                    {/* <td className="px-4 py-3">
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
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-orange-400 outline-none"
                      />
                    </td> */}
                    <td className="px-4 py-3 text-center">
                      <span className="w-20 px-2 py-1  border-gray-300 rounded-md text-center inline-block">
                        {stockInputs[product._id] ?? product.stock}
                      </span>
                    </td>


                    {/* Stock Status */}
                    <td className="px-4 py-3">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Sold Out</span>
                      )}
                    </td>

                    {/* Visibility */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisibility(product._id)}
                        className={`px-3 py-1.5 rounded-md text-white text-xs font-medium transition ${
                          product.visible ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 hover:bg-gray-500"
                        }`}
                      >
                        {product.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 flex flex-col gap-2">
                      <button
                        onClick={() => setOpenProduct(product)}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs flex items-center gap-1 justify-center transition"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => setViewProduct(product)}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs flex items-center gap-1 justify-center transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs flex items-center gap-1 justify-center transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
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
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex gap-4 hover:shadow-md transition"
              >
                {/* Product Image */}
                <Image
                  src={product.image[0]}
                  alt="product image"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md border"
                />

                {/* Product Info */}
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-base truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-sm font-medium text-gray-800">${product.offerPrice}</p>

                  {/* Stock Status */}
                  {/* <div className="mt-1 flex items-center gap-2">
                    {product.stock > 0 ? (
                      <>
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
                          className="w-14 px-2 py-1 border border-gray-300 rounded-md text-center text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                        <span className="text-green-600 text-xs font-medium">In Stock</span>
                      </>
                    ) : (
                      <span className="text-red-500 text-xs font-medium">Sold Out</span>
                    )}
                  </div> */}
                  <div className="mt-1 flex items-center gap-2">
                    {product.stock > 0 ? (
                      <>
                        <span className="text-sm font-medium">{product.stock}</span>
                        <span className="text-green-600 text-xs font-medium">In Stock</span>
                      </>
                    ) : (
                      <span className="text-red-500 text-xs font-medium">Sold Out</span>
                    )}
                  </div>


                  {/* Action Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setOpenProduct(product)}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs flex items-center gap-1 transition"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button
                      onClick={() => setViewProduct(product)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs flex items-center gap-1 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toggleVisibility(product._id)}
                      className={`px-3 py-1.5 text-xs rounded-md text-white transition ${
                        product.visible ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 hover:bg-gray-500"
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
            <div className="flex justify-center mt-6 space-x-2 flex-wrap">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-white border disabled:opacity-50"
              >
                Prev
              </button>

              {/* Numbered Buttons with Ellipsis */}
              {(() => {
                const range = [];
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, currentPage + 2);

                if (start > 1) {
                  range.push(1);
                  if (start > 2) range.push("ellipsis-start");
                }

                for (let i = start; i <= end; i++) {
                  range.push(i);
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) range.push("ellipsis-end");
                  range.push(totalPages);
                }

                return range.map((item, index) =>
                  item === "ellipsis-start" || item === "ellipsis-end" ? (
                    <span key={index} className="px-2">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`px-4 py-2 rounded ${
                        currentPage === item ? "bg-blue-600 text-white" : "bg-white border"
                      }`}
                    >
                      {item}
                    </button>
                  )
                );
              })()}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-white border disabled:opacity-50"
              >
                Next
              </button>
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
                  <label className="block text-sm font-semibold">Original Price ({currency})</label>
                  <input
                    type="number"
                    value={editableProduct.price}
                    onChange={(e) =>
                      setEditableProduct({
                        ...editableProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Offer Price ({currency})</label>
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
                  <TiptapEditor
                    description={editableProduct.description}
                    setDescription={(value) =>
                      setEditableProduct({ ...editableProduct, description: value })
                    }
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

                {openProduct.date ? (
                  <div className="text-xs text-gray-500">
                    Created {new Date(openProduct.date).toLocaleString()} ({dayjs(openProduct.date).fromNow()})
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Created date not available</div>
                )}
                  {/* Images Section */}
                  <div className="space-y-2">
                    <p className="text-base font-medium">Product Images</p>
                      <div className="flex flex-wrap items-start gap-3 mt-2">
                      {[...(editableProduct.image || []), ...(editableProduct.newImagesPreview || [])].map((img, index) => {
                        const totalExisting = editableProduct.image?.length || 0;
                        const isNew = index >= totalExisting;
                        const realIndex = isNew ? index - totalExisting : index;

                        return (
                          <div key={index} className="relative w-24 h-24 flex-shrink-0">
                            <div className="w-24 h-24 border border-gray-300 rounded overflow-hidden relative">
                              <Image
                                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                alt={`image-${index}`}
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                              />
                              <button
                                onClick={() => {
                                  const allImages = [
                                    ...(editableProduct.image || []),
                                    ...(editableProduct.newImagesPreview || []),
                                  ];
                                  const selected = allImages[index];
                                  const reordered = [selected, ...allImages.filter((_, i) => i !== index)];

                                  const newImageArray = reordered.filter((i) => typeof i === "string");
                                  const newFileArray = reordered.filter((i) => typeof i !== "string");

                                  setEditableProduct((prev) => ({
                                    ...prev,
                                    image: newImageArray,
                                    newImages: newFileArray,
                                    newImagesPreview: newFileArray,
                                  }));
                                }}
                                className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center hover:bg-black"
                              >
                                {index === 0 ? "Primary" : "Make Primary"}
                              </button>

                              <button
                                onClick={() => {
                                  if (!isNew) {
                                    setEditableProduct((prev) => ({
                                      ...prev,
                                      image: prev.image.filter((_, i) => i !== realIndex),
                                    }));
                                  } else {
                                    const newImgs = [...(editableProduct.newImages || [])];
                                    const previews = [...(editableProduct.newImagesPreview || [])];
                                    newImgs.splice(realIndex, 1);
                                    previews.splice(realIndex, 1);

                                    setEditableProduct((prev) => ({
                                      ...prev,
                                      newImages: newImgs,
                                      newImagesPreview: previews,
                                    }));
                                  }
                                }}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-800"
                                title="Remove"
                              >
                                –
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add Image Input */}
                      {((editableProduct.image?.length || 0) + (editableProduct.newImagesPreview?.length || 0)) < 6 && (
                        <label className="w-24 h-24 border border-gray-300 rounded cursor-pointer flex items-center justify-center overflow-hidden">
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              setEditableProduct((prev) => ({
                                ...prev,
                                newImages: [...(prev.newImages || []), file],
                                newImagesPreview: [...(prev.newImagesPreview || []), file],
                              }));
                            }}
                          />
                          <ImagePlus className="w-6 h-6 text-gray-500" />
                        </label>
                      )}
                    </div>
                  </div>
                <button
                  className="mt-4 w-full bg-orange-600 text-white py-2 rounded disabled:opacity-50"
                  onClick={() => handleProductUpdate(editableProduct)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Product"}
                </button>

              </div>
            </div>
          )}

          {viewProduct && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-lg p-4 max-w-md w-full relative shadow-xl space-y-3 text-sm max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setViewProduct(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                  ✖
                </button>

                <h2 className="text-lg font-semibold mb-2">{viewProduct.name}</h2>

                <div className="space-y-1">
                  <p><span className="font-semibold">Category:</span> {viewProduct.category}</p>
                  <p><span className="font-semibold">Brand:</span> {viewProduct.brand}</p>
                  <p><span className="font-semibold">Color:</span> {viewProduct.color}</p>
                  <p><span className="font-semibold">Price:</span> ${viewProduct.price}</p>
                  <p><span className="font-semibold">Offer Price:</span> ${viewProduct.offerPrice}</p>
                  <p><span className="font-semibold">Stock:</span> {viewProduct.stock}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {viewProduct.stock > 0 ? "In Stock" : "Sold Out"}
                  </p>
                  <p>
                    <span className="font-semibold">Visibility:</span>{" "}
                    {viewProduct.visible ? "Visible" : "Hidden"}
                  </p>
                  <div>
                    <p className="font-semibold">Description:</p>
                    <div
                      className="text-gray-700 text-sm mt-1"
                      dangerouslySetInnerHTML={{ __html: viewProduct.description }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {viewProduct.image?.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          alt={`image-${index}`}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(viewProduct.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

    </div>
  );
};

export default ProductListPanel;
