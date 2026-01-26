import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X, Percent, Truck, IndianRupee, Gift, Eye } from "lucide-react";
import couponService from "../../services/couponService";

const ITEMS_PER_PAGE = 10;

const discountTypeLabels = {
  percentage: "Percentage",
  fixed: "Fixed Amount",
  free_delivery: "Free Delivery",
  buy_x_get_y_free: "Buy X Get Y Free",
};

const discountTypeIcons = {
  percentage: Percent,
  fixed: IndianRupee,
  free_delivery: Truck,
  buy_x_get_y_free: Gift,
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAll();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    setActionLoading(id);
    try {
      await couponService.delete(id);
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete coupon");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSave = async (couponData) => {
    try {
      if (editingCoupon) {
        await couponService.update(editingCoupon._id, couponData);
      } else {
        await couponService.create(couponData);
      }
      fetchCoupons();
      handleModalClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save coupon");
    }
  };

  // Filtering
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code?.toLowerCase().includes(search.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All" || coupon.discountType === typeFilter;

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString) => {
    if (!dateString) return "No Expiry";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatValue = (coupon) => {
    switch (coupon.discountType) {
      case "percentage":
        return `${coupon.discountValue}%`;
      case "fixed":
        return `₹${coupon.discountValue}`;
      case "free_delivery":
        return "FREE";
      case "buy_x_get_y_free":
        return `B${coupon.buyQuantity || 3}G${coupon.freeQuantity || 1}`;
      default:
        return "-";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold">Coupons ({coupons.length})</h1>

        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border rounded-md w-48"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="All">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
            <option value="free_delivery">Free Delivery</option>
            <option value="buy_x_get_y_free">Buy X Get Y Free</option>
          </select>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            <Plus size={16} />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left p-4">Code</th>
              <th className="text-left">Type</th>
              <th className="text-center">Value</th>
              <th className="text-center">Min Order</th>
              <th className="text-center">Max Discount</th>
              <th className="text-center">Used</th>
              <th className="text-center">Expiry</th>
              <th className="text-center">Visible</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCoupons.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-gray-400">
                  No coupons found
                </td>
              </tr>
            ) : (
              paginatedCoupons.map((coupon) => {
                const Icon = discountTypeIcons[coupon.discountType] || Percent;
                return (
                  <tr
                    key={coupon._id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-mono font-semibold">{coupon.code}</p>
                          <p className="text-xs text-gray-500 max-w-[200px] truncate">
                            {coupon.description || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {discountTypeLabels[coupon.discountType]}
                      </span>
                    </td>

                    <td className="text-center font-semibold text-green-600">
                      {formatValue(coupon)}
                    </td>

                    <td className="text-center text-gray-600">
                      {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : "-"}
                    </td>

                    <td className="text-center text-gray-600">
                      {coupon.maxDiscount ? `₹${coupon.maxDiscount}` : "-"}
                    </td>

                    <td className="text-center">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {coupon.usedCount || 0}{coupon.maxUses ? `/${coupon.maxUses}` : ""}
                      </span>
                    </td>

                    <td className="text-center text-gray-500 text-xs">
                      {formatDate(coupon.expiryDate)}
                    </td>

                    <td className="text-center">
                      {coupon.visible ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <Eye size={12} />
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          disabled={actionLoading === coupon._id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {(() => {
            const maxButtons = 5;
            let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let end = Math.min(totalPages, start + maxButtons - 1);
            if (end - start + 1 < maxButtons) {
              start = Math.max(1, end - maxButtons + 1);
            }
            const pages = [];
            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i ? "bg-black text-white" : ""
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <CouponModal
          coupon={editingCoupon}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function CouponModal({ coupon, onClose, onSave }) {
  const [form, setForm] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || 0,
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxDiscount: coupon?.maxDiscount || "",
    maxUses: coupon?.maxUses || "",
    expiryDate: coupon?.expiryDate ? coupon.expiryDate.split("T")[0] : "",
    isActive: coupon?.isActive ?? true,
    visible: coupon?.visible || false,
    buyQuantity: coupon?.buyQuantity || 3,
    freeQuantity: coupon?.freeQuantity || 1,
    uniqueProducts: coupon?.uniqueProducts || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      alert("Coupon code is required");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        code: form.code.toUpperCase(),
        discountValue: Number(form.discountValue) || 0,
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiryDate: form.expiryDate || null,
        buyQuantity: Number(form.buyQuantity) || 3,
        freeQuantity: Number(form.freeQuantity) || 1,
        uniqueProducts: form.uniqueProducts,
        visible: form.visible,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            {coupon ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code *</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g., SUMMER20"
              className="w-full border rounded-md px-3 py-2 text-sm uppercase"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., 20% off summer sale"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Discount Type *</label>
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
              <option value="free_delivery">Free Delivery</option>
              <option value="buy_x_get_y_free">Buy X Get Y Free</option>
            </select>
          </div>

          {/* Discount Value (hidden for free_delivery and buy_x_get_y_free) */}
          {form.discountType !== "free_delivery" && form.discountType !== "buy_x_get_y_free" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value {form.discountType === "percentage" ? "(%)" : "(₹)"} *
              </label>
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Buy X Get Y Free fields */}
          {form.discountType === "buy_x_get_y_free" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Buy Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.buyQuantity}
                    onChange={(e) => setForm({ ...form, buyQuantity: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Customer must buy this many items</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Free Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.freeQuantity}
                    onChange={(e) => setForm({ ...form, freeQuantity: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cheapest items will be free</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <input
                  type="checkbox"
                  id="uniqueProducts"
                  checked={form.uniqueProducts}
                  onChange={(e) => setForm({ ...form, uniqueProducts: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="uniqueProducts" className="text-sm">
                  <span className="font-medium">Require unique products</span>
                  <p className="text-xs text-gray-600 mt-0.5">
                    If checked, customer must add {form.buyQuantity + form.freeQuantity} different products (not same product multiple times)
                  </p>
                </label>
              </div>
            </>
          )}

          {/* Min Order Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Order Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
              placeholder="0"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Max Discount (only for percentage) */}
          {form.discountType === "percentage" && (
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Discount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="No limit"
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input
                type="number"
                min="0"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Unlimited"
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Active & Visible Toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm">Active</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visible"
                checked={form.visible}
                onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="visible" className="text-sm flex items-center gap-1">
                <Eye size={14} />
                Visible to customers
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
