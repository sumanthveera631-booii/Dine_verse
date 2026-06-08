const MenuItem = require('../models/MenuItem');
const { uploadImage } = require('../config/cloudinary');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new menu item (Admin only)
// @route   POST /api/menu
// @access  Private/Admin
exports.addMenuItem = async (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  try {
    // Check if item with this name already exists
    const exists = await MenuItem.findOne({ title });
    if (exists) {
      return res.status(400).json({ message: 'A menu item with this title already exists' });
    }

    // Process the Cloudinary-ready asset pipeline
    let resolvedImageUrl = imageUrl;
    if (!resolvedImageUrl) {
      // Simulate/trigger image upload
      resolvedImageUrl = await uploadImage(null, category);
    }

    const item = await MenuItem.create({
      title,
      description,
      price: Number(price),
      category,
      imageUrl: resolvedImageUrl,
      rating: 5.0 // Initial rating
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a menu item (Admin only)
// @route   PUT /api/menu/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // If category has shifted and no custom image provided, fetch another premium image
    let resolvedImageUrl = imageUrl || item.imageUrl;
    if (category && category !== item.category && !imageUrl) {
      resolvedImageUrl = await uploadImage(null, category);
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.price = price !== undefined ? Number(price) : item.price;
    item.category = category || item.category;
    item.imageUrl = resolvedImageUrl;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a menu item (Admin only)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
