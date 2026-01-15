import { useState } from "react";
import AddProductModal from "../AddProductModal";

export default function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Face Serum",
      price: 40,
      stock: 120,
      category: "Skin Care"
    },
    {
      id: 2,
      name: "Body Lotion",
      price: 25,
      stock: 80,
      category: "Body Care"
    }
  ]);

  const [showModal, setShowModal] = useState(false);

  const addProduct = (product) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: Date.now() }
    ]);
    setShowModal(false);
  };

  return (
    <>
      {/* PAGE CONTENT (blur only this) */}
      <div className={showModal ? "blur-sm pointer-events-none" : ""}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Products</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-4 py-2 rounded-md text-sm"
            >
              Add Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-none">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">${product.price}</td>
                    <td className="text-center">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL (NOT BLURRED) */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={addProduct}
        />
      )}
    </>
  );
}
