import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AddProductModal from "../AddProductModal";

export default function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Face Serum",
      price: 40,
      stock: 120,
      category: "Skin Care",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Body Lotion",
      price: 25,
      stock: 80,
      category: "Body Care",
      badge: "New"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const addOrUpdateProduct = (product) => {
    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id ? { ...product, id: editProduct.id } : p
        )
      );
    } else {
      setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    }

    setEditProduct(null);
    setShowModal(false);
  };

  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {/* PAGE CONTENT */}
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
                  <th>Badge</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">${product.price}</td>
                    <td className="text-center">{product.stock}</td>

                    {/* Badge */}
                    <td className="text-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                        {product.badge || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditProduct(product);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={16} />
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <AddProductModal
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
          onAdd={addOrUpdateProduct}
          initialData={editProduct}   // 👈 edit support
          isEdit={Boolean(editProduct)}
        />
      )}
    </>
  );
}
