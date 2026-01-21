import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DisplayImage from "./DisplayImage";
import productCategory from "../utils/product";
import uploadimage from "../utils/uploadimage";

const emptyProduct = {
  productName: "",
  brandName: "",
  badge: "",
  category: "",
  productImage: [],
  shortDescription: "",
  description: "",
  sourcingInfo: "",
  price: 0,
  salePrice: 0,
  weight: "",
  rating: 0,
  reviews: 0,
  features: [],
  ingredients: []
};

const AdminAddProduct = ({ onClose, onAdd, initialData, isEdit }) => {
  const [data, setData] = useState(emptyProduct);

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  /* ======================= EFFECT ======================= */
  useEffect(() => {
    if (initialData) {
      setData({ ...emptyProduct, ...initialData });
    } else {
      setData(emptyProduct);
    }
  }, [initialData]);

  /* ======================= HANDLERS ======================= */
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadimage(file);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, res.url]
    }));
  };

  const handleDeleteProductImage = (index) => {
    setData((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== index)
    }));
  };

  const addListItem = (key) => {
    setData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  };

  const updateListItem = (key, index, value) => {
    const updated = [...data[key]];
    updated[index] = value;
    setData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.productImage.length) {
      alert("Upload at least one image");
      return;
    }

    onAdd(data);
    onClose();
  };

  /* ======================= UI ======================= */
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
                name="productName"
                value={data.productName}
                onChange={handleOnChange}
                placeholder="Product Name"
                className="input"
                required
              />

              <input
                name="brandName"
                value={data.brandName}
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
                <option value="">Badge</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New">New</option>
              </select>

              <select
                name="category"
                value={data.category}
                onChange={handleOnChange}
                className="input col-span-2"
                required
              >
                <option value="">Select Category</option>
                {productCategory.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <textarea
                name="shortDescription"
                value={data.shortDescription}
                onChange={handleOnChange}
                placeholder="Short Description"
                className="input col-span-2"
              />

              <textarea
                name="description"
                value={data.description}
                onChange={handleOnChange}
                placeholder="Detailed Description"
                className="input col-span-2 h-28"
              />

              <textarea
                name="sourcingInfo"
                value={data.sourcingInfo}
                onChange={handleOnChange}
                placeholder="Sourcing & Ingredients Info"
                className="input col-span-2"
              />
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-4">Pricing & Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <input type="number" name="price" value={data.price} onChange={handleOnChange} className="input" placeholder="Regular Price" />
              <input type="number" name="salePrice" value={data.salePrice} onChange={handleOnChange} className="input" placeholder="Sale Price" />
              <input name="weight" value={data.weight} onChange={handleOnChange} className="input" placeholder="Weight" />
              <input type="number" name="rating" value={data.rating} onChange={handleOnChange} className="input" placeholder="Rating" />
              <input type="number" name="reviews" value={data.reviews} onChange={handleOnChange} className="input" placeholder="Reviews Count" />
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">Key Features</h3>
            {data.features.map((f, i) => (
              <input
                key={i}
                value={f}
                onChange={(e) => updateListItem("features", i, e.target.value)}
                className="input mb-2"
                placeholder={`Feature ${i + 1}`}
              />
            ))}
            <button type="button" onClick={() => addListItem("features")} className="btn-outline">
              <FaPlus /> Add Feature
            </button>
          </section>

          {/* Ingredients */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">Key Ingredients</h3>
            {data.ingredients.map((ing, i) => (
              <input
                key={i}
                value={ing}
                onChange={(e) => updateListItem("ingredients", i, e.target.value)}
                className="input mb-2"
                placeholder={`Ingredient ${i + 1}`}
              />
            ))}
            <button type="button" onClick={() => addListItem("ingredients")} className="btn-outline">
              <FaPlus /> Add Ingredient
            </button>
          </section>

          {/* Images */}
          <section>
            <h3 className="text-blue-600 font-semibold mb-3">Product Images</h3>
            <label className="upload-box">
              <FaCloudUploadAlt className="text-4xl" />
              <p>Upload Images</p>
              <input type="file" hidden onChange={handleUploadProduct} />
            </label>

            <div className="flex gap-3 mt-3 flex-wrap">
              {data.productImage.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    className="w-20 h-20 object-cover border rounded cursor-pointer"
                    onClick={() => {
                      setFullScreenImage(img);
                      setOpenFullScreenImage(true);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteProductImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <MdDelete />
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
            <button type="submit" className="btn-primary">
              {isEdit ? "Update Product" : "Add Product"}
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
