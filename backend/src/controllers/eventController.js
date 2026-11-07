const prisma = require('../config/db');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (ORGANIZER or ADMIN)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, totalSeats } = req.body;

    if (!title || !description || !date || !location || price == null || !totalSeats) {
      return res.status(400).json({ message: 'All event fields are required' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price: parseFloat(price),
        totalSeats: parseInt(totalSeats, 10),
        availableSeats: parseInt(totalSeats, 10),
        organizerId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Get all events (with optional search query)
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const { search } = req.query;

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { location: { contains: search } },
          ],
        }
      : {};

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: 'asc' },
    });

    res.json({ count: events.length, events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createEvent, getAllEvents, getEventById };
