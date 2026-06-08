const PrivateRoom = require('../models/PrivateRoom');
const { uploadImage } = require('../config/cloudinary');

// @desc Get all private venue rooms
// @route GET /api/venues
// @access Public
exports.getVenues = async (req, res) => {
  try {
    const rooms = await PrivateRoom.find({}).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a private room (Admin)
// @route POST /api/venues
// @access Private/Admin
exports.createVenue = async (req, res) => {
  try {
    const { title, description, capacity, acoustics, panorama, depositPrice, imageUrl, features } = req.body;

    const exists = await PrivateRoom.findOne({ title });
    if (exists) return res.status(400).json({ message: 'Venue with this title already exists' });

    let resolvedImage = imageUrl;
    if (!resolvedImage) {
      resolvedImage = await uploadImage(null, 'venue');
    }

    const room = await PrivateRoom.create({
      title,
      description,
      capacity: Number(capacity),
      acoustics,
      panorama,
      depositPrice: Number(depositPrice) || 0,
      imageUrl: resolvedImage,
      features: features || []
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a venue (Admin)
// @route PUT /api/venues/:id
// @access Private/Admin
exports.updateVenue = async (req, res) => {
  try {
    const room = await PrivateRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Venue not found' });

    const { title, description, capacity, acoustics, panorama, depositPrice, imageUrl, features } = req.body;

    room.title = title || room.title;
    room.description = description || room.description;
    room.capacity = capacity !== undefined ? Number(capacity) : room.capacity;
    room.acoustics = acoustics || room.acoustics;
    room.panorama = panorama || room.panorama;
    room.depositPrice = depositPrice !== undefined ? Number(depositPrice) : room.depositPrice;
    room.imageUrl = imageUrl || room.imageUrl;
    room.features = features || room.features;

    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a venue (Admin)
// @route DELETE /api/venues/:id
// @access Private/Admin
exports.deleteVenue = async (req, res) => {
  try {
    const room = await PrivateRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Venue not found' });
    await PrivateRoom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Venue removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
