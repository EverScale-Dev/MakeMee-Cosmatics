import { useState, useEffect } from "react";
import { Mail, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import contactService from "../../services/contactService";

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchSubmissions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await contactService.getAll(page);
      setSubmissions(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      setSubmissions(prev =>
        prev.map(s => s._id === id ? { ...s, isRead: true } : s)
      );
      if (selectedSubmission?._id === id) {
        setSelectedSubmission(prev => ({ ...prev, isRead: true }));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setDeleteLoading(id);
    try {
      await contactService.delete(id);
      setSubmissions(prev => prev.filter(s => s._id !== id));
      if (selectedSubmission?._id === id) {
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-pink-500" />
          <h1 className="text-xl font-semibold">Contact Messages ({pagination.total})</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-medium">Inbox</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No messages yet
            </div>
          ) : (
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() => {
                    setSelectedSubmission(sub);
                    if (!sub.isRead) handleMarkAsRead(sub._id);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedSubmission?._id === sub._id ? "bg-pink-50" : ""
                  } ${!sub.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      {!sub.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span className={`font-medium ${!sub.isRead ? "text-black" : "text-gray-700"}`}>
                        {sub.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(sub.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{sub.email}</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {sub.subject || "(No subject)"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t flex justify-center gap-2">
              <button
                onClick={() => fetchSubmissions(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="py-2 px-4">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => fetchSubmissions(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {selectedSubmission ? (
            <>
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-medium">Message Details</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkAsRead(selectedSubmission._id)}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      selectedSubmission.isRead ? "text-gray-400" : "text-blue-500"
                    }`}
                    title={selectedSubmission.isRead ? "Already read" : "Mark as read"}
                  >
                    {selectedSubmission.isRead ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSubmission._id)}
                    disabled={deleteLoading === selectedSubmission._id}
                    className="p-2 rounded hover:bg-red-100 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase">From</label>
                  <p className="font-medium">{selectedSubmission.name}</p>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-blue-500 hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Subject</label>
                  <p>{selectedSubmission.subject || "(No subject)"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Date</label>
                  <p className="text-sm">{formatDate(selectedSubmission.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Message</label>
                  <p className="mt-2 whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedSubmission.message}
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || "Your inquiry"}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-400 h-full flex items-center justify-center">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
