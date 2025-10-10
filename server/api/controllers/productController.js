const Product = require('../../models/Product');
const cloudinary = require('../../config/cloudinary');

/// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, regularPrice, salePrice, description,} = req.body;
   
     // Collect image file paths
     let imagePaths = [];

     if (req.files && req.files.length > 0) {
       // Upload images to Cloudinary
       const uploadPromises = req.files.map(file => {
         return cloudinary.uploader.upload(file.path, {
           folder: "products"
         }).then(result => result.secure_url);
       });
       imagePaths = await Promise.all(uploadPromises);
     }

    // Create new product with regular price and optional sale price
    const newProduct = new Product({
      name,
      regularPrice,
      salePrice, 
      description,
      images: imagePaths, // Store image paths
    });

    await newProduct.save();
    // console.log('Product created:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
        ]
      };
    }

    // Remove .populate('category')
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    // Remove .populate('category')
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



// @desc    Update product by ID
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, regularPrice, salePrice} = req.body;
  
    // Check if product exists
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Replace images if new ones are uploaded
    if (req.files && req.files.length > 0) {

       // Delete existing images from Cloudinary
       if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map(imgUrl => {
          const publicId = imgUrl.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(`products/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      // If new images are uploaded, replace the old ones
      const uploadPromises = req.files.map(file => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products"
        }).then(result => result.secure_url);
      });
      product.images = await Promise.all(uploadPromises);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.regularPrice = regularPrice || product.regularPrice;
    product.salePrice = salePrice || product.salePrice;

    // Save updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product", details: error });
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(imgUrl => {
        const publicId = imgUrl.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`products/${publicId}`);
      });
      await Promise.all(deletePromises);
    }
    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
