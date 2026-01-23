"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axiosClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip,
  Paper,
  Chip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/review/admin/all");
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Error fetching reviews");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      setActionLoading(true);
      await api.put(`/api/review/admin/approve/${id}`);
      fetchReviews();
      setSnackbarMessage("Review approved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(
        `Error approving review: ${err.response?.data?.message || err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      setActionLoading(true);
      await api.delete(`/api/review/admin/delete/${id}`);
      fetchReviews();
      setSnackbarMessage("Review deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage(
        `Error deleting review: ${err.response?.data?.message || err.message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const confirmDelete = (id) => {
    setDeleteTarget(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDeleteDialogOpen(false);
  };

  if (loading)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Customer Reviews
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
            <TableRow>
              {["Name", "Product ID", "Rating", "Message", "Status", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                      textTransform: "uppercase",
                      fontSize: 14,
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <TableRow
                  key={r._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fafb" },
                    transition: "background-color 0.3s",
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={600}>{r.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{r.productId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{Array(r.rating).fill("⭐").join("")}</Typography>
                  </TableCell>
                  <TableCell>{r.message}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.isApproved ? "Approved" : "Pending"}
                      color={r.isApproved ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {!r.isApproved && (
                      <Tooltip title="Approve Review">
                        <IconButton
                          color="primary"
                          onClick={() => approveReview(r._id)}
                          disabled={actionLoading}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete Review">
                      <IconButton
                        color="error"
                        onClick={() => confirmDelete(r._id)}
                        disabled={actionLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No reviews found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>
          Are you sure you want to delete this review?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => deleteReview(deleteTarget)}
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
