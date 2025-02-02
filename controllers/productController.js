const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinaryConfig');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, price, categoryType, menuType } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const product = new Product({ title, price, categoryType, menuType, image: imageUrl });
    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all products (with optional filtering)
exports.getProducts = async (req, res) => {
  try {
    const { categoryType, menuType } = req.query;
    const filter = {};

    if (categoryType) filter.categoryType = categoryType;
    if (menuType) filter.menuType = menuType;
    console.log(categoryType, menuType);

    const products = await Product.find(filter);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, categoryType, menuType } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const updatedData = { title, price, categoryType, menuType };
    if (imageUrl) updatedData.image = imageUrl;

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Delete image from Cloudinary
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
