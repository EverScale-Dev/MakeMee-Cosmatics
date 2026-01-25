import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DisplayImage from "./DisplayImage";

const emptyProduct = {
  name: "",
  brand: "",
  badge: "",
  shortDescription: "",
  description: "",
  sourcingInfo: "",
  howToUse: "",
  regularPrice: "",
  salePrice: "",
  weight: "",
  features: [],
  ingredients: [],
  sizes: [],
  existingImages: [],
  newImages: []
};

const BADGE_OPTIONS = ["", "NEW LAUNCH", "BEST SELLER", "DISCOUNT", "LIMITED", "HOT"];

const AdminAddProduct = ({ onClose, onAdd, initialData, isEdit }) => {
  const [data, setData] = useState(emptyProduct);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData({
        name: initialData.name || "",
        brand: initialData.brand || "",
        badge: initialData.badge || "",
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
        sourcingInfo: initialData.sourcingInfo || "",
        howToUse: initialData.howToUse || "",
        regularPrice: initialData.regularPrice || "",
        salePrice: initialData.salePrice || "",
        weight: initialData.weight || "",
        features: initialData.features?.map(f => f.text || f) || [],
        ingredients: initialData.ingredients?.map(i => ({
          name: i.name || "",
          benefit: i.benefit || ""
        })) || [],
        sizes: initialData.sizes?.map(s => ({
          ...s,
          stock: s.stock || 0
        })) || [],
        existingImages: initialData.images || [],
        newImages: []
      });
    } else {
      setData(emptyProduct);
    }
  }, [initialData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalImages = data.existingImages.length + data.newImages.length + files.length;
    if (totalImages > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files]
    }));
  };

  const handleDeleteExistingImage = (index) => {
    setData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteNewImage = (index) => {
    setData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  // Features (simple array of text strings for backend)
  const addFeature = () => {
    setData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const updateFeature = (index, value) => {
    const updated = [...data.features];
    updated[index] = value;
    setData((prev) => ({ ...prev, features: updated }));
  };

  const removeFeature = (index) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Ingredients (array with name & benefit)
  const addIngredient = () => {
    setData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", benefit: "" }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...data.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, ingredients: updated }));
  };

  const removeIngredient = (index) => {
    setData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Sizes (array with ml, originalPrice, sellingPrice, stock)
  const addSize = () => {
    setData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { ml: "", originalPrice: "", sellingPrice: "", stock: "", inStock: true }]
    }));
  };

  const updateSize = (index, field, value) => {
    const updated = [...data.sizes];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, sizes: updated }));
  };

  const removeSize = (index) => {
    setData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalImages = data.existingImages.length + data.newImages.length;
    if (totalImages === 0) {
      alert("Upload at least one image");
      return;
    }

    setSaving(true);

    try {
      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("badge", data.badge);
      formData.append("shortDescription", data.shortDescription);
      formData.append("description", data.description);
      formData.append("sourcingInfo", data.sourcingInfo);
      formData.append("howToUse", data.howToUse);
      formData.append("regularPrice", data.regularPrice || 0);
      formData.append("salePrice", data.salePrice || 0);
      formData.append("weight", data.weight);

      // Features - convert to array of objects with text field
      const featuresArray = data.features
        .filter(f => f.trim())
        .map(f => ({ text: f }));
      formData.append("features", JSON.stringify(featuresArray));

      // Ingredients - already in correct format
      const ingredientsArray = data.ingredients.filter(i => i.name.trim());
      formData.append("ingredients", JSON.stringify(ingredientsArray));

      // Sizes - convert values to numbers
      const sizesArray = data.sizes
        .filter(s => s.ml)
        .map(s => ({
          ml: Number(s.ml),
          originalPrice: Number(s.originalPrice) || 0,
          sellingPrice: Number(s.sellingPrice) || 0,
          stock: Number(s.stock) || 0,
          inStock: s.inStock !== false
        }));
      formData.append("sizes", JSON.stringify(sizesArray));

      // Existing images (for update)
      formData.append("existingImages", JSON.stringify(data.existingImages));

      // New image files
      data.newImages.forEach((file) => {
        formData.append("images", file);
      });

      await onAdd(formData);
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-xl shadow-lg flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-pink-50">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500">
            <CgClose />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-8"
        >

          {/* Core Information */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-4">Core Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={data.name}
                onChange={handleOnChange}
                placeholder="Product Name"
                className="input"
                required
              />

              <input
                name="brand"
                value={data.brand}
                onChange={handleOnChange}
                placeholder="Brand Name"
                className="input"
                required
              />

              <select
                name="badge"
                value={data.badge}
                onChange={handleOnChange}
                className="input col-span-2"
              >
                <option value="">No Badge</option>
                {BADGE_OPTIONS.filter(b => b).map((badge) => (
                  <option key={badge} value={badge}>
                    {badge}
                  </option>
                ))}
              </select>

              <textarea
                name="shortDescription"
                value={data.shortDescription}
                onChange={handleOnChange}
                placeholder="Short Description (max 250 chars)"
                className="input col-span-2"
                maxLength={250}
              />

              <textarea
                name="description"
                value={data.description}
                onChange={handleOnChange}
                placeholder="Detailed Description"
                className="input col-span-2 h-28"
                required
              />

              <textarea
                name="sourcingInfo"
                value={data.sourcingInfo}
                onChange={handleOnChange}
                placeholder="Sourcing & Ingredients Info"
                className="input col-span-2"
              />

              <textarea
                name="howToUse"
                value={data.howToUse}
                onChange={handleOnChange}
                placeholder="How to Use (application instructions)"
                className="input col-span-2 h-24"
              />
            </div>
          </section>

          {/* Size Variants with Stock */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">Size Variants & Pricing</h3>
            <p className="text-sm text-gray-500 mb-3">Add at least one size variant with pricing and stock</p>
            {data.sizes.map((size, i) => (
              <div key={i} className="flex flex-wrap gap-2 mb-3 items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="number"
                  value={size.ml}
                  onChange={(e) => updateSize(i, "ml", e.target.value)}
                  className="input w-20"
                  placeholder="ml"
                />
                <span className="text-gray-400">ml</span>
                <input
                  type="number"
                  value={size.originalPrice}
                  onChange={(e) => updateSize(i, "originalPrice", e.target.value)}
                  className="input w-28"
                  placeholder="MRP"
                />
                <input
                  type="number"
                  value={size.sellingPrice}
                  onChange={(e) => updateSize(i, "sellingPrice", e.target.value)}
                  className="input w-28"
                  placeholder="Selling Price"
                />
                <input
                  type="number"
                  value={size.stock || ""}
                  onChange={(e) => updateSize(i, "stock", e.target.value)}
                  className="input w-24"
                  placeholder="Stock"
                  min="0"
                />
                <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={size.inStock !== false}
                    onChange={(e) => updateSize(i, "inStock", e.target.checked)}
                  />
                  In Stock
                </label>
                <button
                  type="button"
                  onClick={() => removeSize(i)}
                  className="text-red-500 hover:text-red-700 ml-auto"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addSize} className="btn-outline">
              <FaPlus /> Add Size Variant
            </button>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">Key Features</h3>
            {data.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={f}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  className="input flex-1"
                  placeholder={`Feature ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addFeature} className="btn-outline">
              <FaPlus /> Add Feature
            </button>
          </section>

          {/* Ingredients */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">Key Ingredients</h3>
            {data.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  className="input w-1/3"
                  placeholder="Ingredient Name"
                />
                <input
                  value={ing.benefit}
                  onChange={(e) => updateIngredient(i, "benefit", e.target.value)}
                  className="input flex-1"
                  placeholder="Benefit"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="btn-outline">
              <FaPlus /> Add Ingredient
            </button>
          </section>

          {/* Images */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">
              Product Images (Max 5, &lt;1MB each)
            </h3>
            <label className="upload-box cursor-pointer">
              <FaCloudUploadAlt className="text-4xl" />
              <p>Upload Images</p>
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            <div className="flex gap-3 mt-3 flex-wrap">
              {/* Existing images */}
              {data.existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative">
                  <img
                    src={img}
                    className="w-20 h-20 object-cover border rounded cursor-pointer"
                    onClick={() => {
                      setFullScreenImage(img);
                      setOpenFullScreenImage(true);
                    }}
                    alt={`Product ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <MdDelete size={14} />
                  </button>
                </div>
              ))}

              {/* New images (preview) */}
              {data.newImages.map((file, i) => (
                <div key={`new-${i}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 object-cover border rounded cursor-pointer"
                    onClick={() => {
                      setFullScreenImage(URL.createObjectURL(file));
                      setOpenFullScreenImage(true);
                    }}
                    alt={`New ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteNewImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <MdDelete size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Footer buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button type="button" onClick={onClose} className="btn-outline text-pink-600">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage imgUrl={fullScreenImage} onClose={() => setOpenFullScreenImage(false)} />
      )}
    </div>
  );
};

export default AdminAddProduct;
