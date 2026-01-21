import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AddProductModal from "../AddProductModal";
import { productService } from "../../services";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddOrUpdateProduct = async (productData) => {
    try {
      if (editProduct) {
        await productService.update(editProduct._id, productData);
      } else {
        await productService.create(productData);
      }
      fetchProducts();
      setEditProduct(null);
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeleteLoading(id);
    try {
      await productService.delete(id);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* PAGE CONTENT */}
      <div className={showModal ? "blur-sm pointer-events-none" : ""}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Products ({products.length})</h1>
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
                  <th className="text-left p-4">Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Regular Price</th>
                  <th>Sale Price</th>
                  <th>Badge</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b last:border-none hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="text-center">{product.brand || "—"}</td>
                      <td className="text-center">{product.category || "—"}</td>
                      <td className="text-center">{formatCurrency(product.regularPrice)}</td>
                      <td className="text-center text-green-600 font-medium">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="text-center">
                        {product.badge ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                            {product.badge}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
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
                            onClick={() => deleteProduct(product._id)}
                            disabled={deleteLoading === product._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {deleteLoading === product._id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
          onAdd={handleAddOrUpdateProduct}
          initialData={editProduct}
          isEdit={Boolean(editProduct)}
        />
      )}
    </>
  );
}
