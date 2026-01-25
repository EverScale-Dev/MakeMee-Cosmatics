const Product = require('../../models/Product');
const cloudinary = require('../../config/cloudinary');
const slugify = require('slugify');

// Helper function to process features/ingredients arrays from request body
// The front-end or form might send these as JSON strings if using FormData.
const parseArrayField = (data, defaultValue = []) => {
    if (!data) return defaultValue;
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse JSON string:", data);
            return defaultValue;
        }
    }
    return data;
};

// --- CREATE NEW PRODUCT ---
// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const {
            name, brand, regularPrice, salePrice, description,
            shortDescription, badge, weight,
            rating, reviews,
            features: featuresStr, ingredients: ingredientsStr, sourcingInfo,
            sizes: sizesStr
        } = req.body;

        // 1. Generate Slug
        const slug = slugify(name, { lower: true, strict: true });

        // 2. Process Complex Array Fields
        const features = parseArrayField(featuresStr);
        const ingredients = parseArrayField(ingredientsStr);
        const sizes = parseArrayField(sizesStr);
        
        // 3. Collect Image URLs
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                    // Use product name/slug for better public IDs if desired
                    public_id: `${slug}-${Date.now()}` 
                }).then(result => result.secure_url);
            });
            imagePaths = await Promise.all(uploadPromises);
        } else if (!req.body.existingImages) {
             // Throw error if no images provided for a new product
             return res.status(400).json({ message: 'At least one image is required.' });
        }


        // 4. Create Product
        const newProduct = new Product({
            name,
            brand,
            slug,
            regularPrice,
            salePrice,
            sizes,
            description,
            shortDescription,
            badge,
            weight,
            rating,
            reviews,
            images: imagePaths,
            features,
            ingredients,
            sourcingInfo,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        // Catch Mongoose validation or uniqueness errors and return a clean 400
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ message: 'Validation failed or Product name/slug already exists.', details: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// -------------------------------------------------------------
// --- GET ALL PRODUCTS ---
// @desc    Get all products
// @route   GET /api/products
// @query   search - search by name/description
// @query   badge - filter by badge (e.g., "BEST SELLER", "NEW LAUNCH")
// @query   featured - if "true", returns products with any badge
// @query   limit - max number of products to return
exports.getProducts = async (req, res) => {
    try {
        const { search, badge, featured, limit } = req.query;
        let filter = {};

        // Search Filter (by name or description)
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Badge Filter (exact match, case-insensitive)
        if (badge) {
            filter.badge = { $regex: new RegExp(`^${badge}$`, 'i') };
        }

        // Featured products (any product with a badge)
        if (featured === 'true') {
            filter.badge = { $exists: true, $ne: null, $ne: '' };
        }

        let query = Product.find(filter).sort({ createdAt: -1 });

        // Limit results if specified
        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }

        const products = await query;

        // Disable caching to prevent 304 Not Modified responses
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// -------------------------------------------------------------
// --- GET PRODUCT BY ID ---
// @desc    Get product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        // Removed .populate('category', 'name')
        const product = await Product.findById(req.params.id); 

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        // Handle case where ID format is invalid (e.g., 'CastError')
        if (error.name === 'CastError') {
             return res.status(404).json({ message: 'Product not found.' });
        }
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// -------------------------------------------------------------
// --- UPDATE PRODUCT ---
// @desc    Update product by ID
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {
            name, brand, description, shortDescription, regularPrice, salePrice,
            badge, weight, sourcingInfo, rating, reviews,
            features: featuresStr, ingredients: ingredientsStr, existingImages,
            sizes: sizesStr
        } = req.body;
    
        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // 1. Image Update Logic (No change needed here)
        let updatedImages = parseArrayField(existingImages, product.images);
        let imagesToDelete = []; 

        const oldImages = product.images;
        const imagesToKeep = new Set(updatedImages);
        
        oldImages.forEach(imgUrl => {
            if (!imagesToKeep.has(imgUrl)) {
                imagesToDelete.push(imgUrl);
            }
        });
        
        // Delete old images from Cloudinary
        if (imagesToDelete.length > 0) {
            const deletePromises = imagesToDelete.map(imgUrl => {
                const publicId = imgUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(`products/${publicId}`);
            });
            await Promise.all(deletePromises);
        }

        // ⚡️ ADDED: Image size check before uploading
        // Upload new files
        if (req.files && req.files.length > 0) {

            // === Check for file size > 1 MB ===
            const tooLarge = req.files.find(file => file.size > 1 * 1024 * 1024);
            if (tooLarge) {
                return res.status(400).json({
                    message: "Product image size must be less than 1 MB."
                });
            }

            const uploadPromises = req.files.map(file => {
                const slug = slugify(name || product.name, { lower: true, strict: true });
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                    public_id: `${slug}-${Date.now()}` 
                }).then(result => result.secure_url);
            });
            const newImages = await Promise.all(uploadPromises);
            updatedImages = [...updatedImages, ...newImages];
        }
        
        // 2. Update Product Fields
        product.name = name || product.name;
        product.brand = brand || product.brand;
        // Removed assignment for product.category
        
        // Update slug only if name changes
        if (name && name !== product.name) {
             product.slug = slugify(name, { lower: true, strict: true });
        }

        product.description = description || product.description;
        product.shortDescription = shortDescription || product.shortDescription;
        product.regularPrice = regularPrice || product.regularPrice;
        product.salePrice = salePrice || product.salePrice;
        product.badge = badge || product.badge;
        product.weight = weight || product.weight;
        product.rating = rating || product.rating;
        product.reviews = reviews || product.reviews;
        product.sourcingInfo = sourcingInfo || product.sourcingInfo;

        // Update arrays (requires merging/replacing)
        product.features = parseArrayField(featuresStr, product.features);
        product.ingredients = parseArrayField(ingredientsStr, product.ingredients);
        product.images = updatedImages; // Final image list

        // Update sizes if provided
        if (sizesStr) {
            product.sizes = parseArrayField(sizesStr, product.sizes);
        }
        
        // Check for empty image array validation from the model
        if (product.images.length === 0) {
             return res.status(400).json({ message: 'Product must have at least one image.' });
        }

        // 3. Save
        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
         if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ message: 'Validation failed or Product name/slug already exists.', details: error.message });
        }
        res.status(500).json({ error: "Failed to update product", details: error });
    }
};


// -------------------------------------------------------------
// --- DELETE PRODUCT ---
// @desc    Delete product by ID
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the product from the database first (most important)
        await Product.findByIdAndDelete(req.params.id);

        // Try to delete associated images from Cloudinary (non-blocking)
        // Don't let Cloudinary errors prevent product deletion
        if (product.images && product.images.length > 0) {
            try {
                const deletePromises = product.images.map(imgUrl => {
                    // Extract public ID from Cloudinary URL
                    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{timestamp}/products/{public_id}.{ext}
                    const publicId = imgUrl.split('/').pop().split('.')[0];
                    return cloudinary.uploader.destroy(`products/${publicId}`).catch(err => {
                        console.error(`Failed to delete image ${publicId}:`, err.message);
                        return null; // Don't throw, just log
                    });
                });
                await Promise.all(deletePromises);
            } catch (cloudinaryError) {
                // Log but don't fail the request
                console.error('Cloudinary cleanup error:', cloudinaryError.message);
            }
        }

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};