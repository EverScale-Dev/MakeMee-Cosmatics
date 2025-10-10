"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import useAuth from '../withauth';

export default function AdminCategoryList() {
  useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal with selected category details
  const handleOpen = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setImage(null); // Reset image state on close
  };

  // Handle changes in category inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategory({ ...selectedCategory, [name]: value });
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("name", selectedCategory.name);
    formData.append("description", selectedCategory.description);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCategories();
      handleClose();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Update category details
  const handleCategoryUpdate = async () => {
    const formData = new FormData();
    formData.append("name", selectedCategory.name);
    formData.append("description", selectedCategory.description);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${selectedCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCategories();
      handleClose();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // Delete category
  const handleCategoryDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Categories List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedCategory({}); // Reset selected category for adding a new category
            setOpen(true); // Open the modal
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* Category Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.image && (
                      <img
                        src={`${category.image}`}
                        alt={category.name}
                        width={60}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleCategoryDelete(category._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Category Modal */}
      {selectedCategory && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            {selectedCategory._id ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <TextField
                label="Category Name"
                fullWidth
                name="name"
                value={selectedCategory.name || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={selectedCategory.description || ""}
                onChange={handleInputChange}
                margin="normal"
              />
              {/* Hidden file input for image upload */}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="category-image-upload"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />

              {/* Styled label and button to trigger image upload */}
              <label htmlFor="category-image-upload">
                <Button variant="contained" color="primary" component="span">
                  Upload Image
                </Button>
              </label>

              {/* Display selected image name */}
              {image && (
                <Box mt={2}>
                  <Typography>Selected Image: {image.name}</Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={
                selectedCategory._id ? handleCategoryUpdate : handleAddCategory
              }
              variant="contained"
              color="primary"
            >
              {selectedCategory._id ? "Save Changes" : "Add Category"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
