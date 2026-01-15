import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DisplayImage from "./DisplayImage";
import productCategory from "../utils/product";
import uploadimage from "../utils/uploadimage";

const AdminAddProduct = ({ onClose, onAdd }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    selling: ""
  });

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // upload image
  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadImageCloudinary = await uploadimage(file);

    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }));
  };

  const handleDeleteProductImage = (index) => {
    const newImages = [...data.productImage];
    newImages.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: newImages
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.productImage.length) {
      alert("Please upload at least one product image");
      return;
    }

    onAdd(data);
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Add Product</h2>
          <div
            className="text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        {/* Form */}
        <form
          className="grid gap-2 overflow-y-scroll h-full pb-6 pr-1"
          onSubmit={handleSubmit}
        >
          <label>Product Name :</label>
          <input
            type="text"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label className="mt-3">Brand Name :</label>
          <input
            type="text"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label className="mt-3">Category :</label>
          <select
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          >
            <option value="">Select Category</option>
            {productCategory.map((el, index) => (
              <option key={el.value + index} value={el.value}>
                {el.label}
              </option>
            ))}
          </select>

          {/* Image Upload */}
          <label className="mt-3">Product Images :</label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex flex-col items-center gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Upload Product Images</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>

          {/* Image Preview */}
          <div className="flex gap-2 flex-wrap">
            {data.productImage.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt="product"
                  width={80}
                  height={80}
                  className="border bg-slate-100 cursor-pointer"
                  onClick={() => {
                    setOpenFullScreenImage(true);
                    setFullScreenImage(img);
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 p-1 bg-red-600 text-white rounded-full hidden group-hover:block cursor-pointer"
                  onClick={() => handleDeleteProductImage(index)}
                >
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>

          <label className="mt-3">Price :</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label className="mt-3">Selling Price :</label>
          <input
            type="number"
            name="selling"
            value={data.selling}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label className="mt-3">Description :</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleOnChange}
            className="h-28 bg-slate-100 border resize-none p-2 rounded"
            required
          />

          <button className="px-3 py-2 bg-black text-white rounded hover:bg-gray-800 mt-4">
            Add Product
          </button>
        </form>
      </div>

      {/* Full screen image */}
      {openFullScreenImage && (
        <DisplayImage
          imgUrl={fullScreenImage}
          onClose={() => setOpenFullScreenImage(false)}
        />
      )}
    </div>
  );
};

export default AdminAddProduct;
