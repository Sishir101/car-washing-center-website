const prisma = require('../config/db');

// @desc    Get all washing service packages (filter by category: BIKE or CAR)
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;

    const where = category ? { category: category.toUpperCase() } : {};

    const services = await prisma.service.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    res.json({ count: services.length, services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Create new service package (Owner only)
// @route   POST /api/services
// @access  Private (OWNER)
const createService = async (req, res) => {
  try {
    const { name, category, vehicleSize, description, price, durationMinutes } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category (BIKE/CAR), and price are required' });
    }

    const service = await prisma.service.create({
      data: {
        name,
        category: category.toUpperCase(),
        vehicleSize: vehicleSize || 'Standard',
        description: description || '',
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes, 10) || 45,
      },
    });

    res.status(201).json({ message: 'Service package created successfully', service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllServices, createService };
