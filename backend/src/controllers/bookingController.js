const prisma = require('../config/db');
const {
  notifyNewBooking,
  notifyStatusUpdate,
  generateWhatsAppLink,
} = require('../services/notificationService');

// Hari Om Center Capacity: 2 Cars and 4 Bikes simultaneously
const MAX_CAR_BAYS = 2;
const MAX_BIKE_BAYS = 4;

// @desc    Book a washing slot (with bay concurrency protection & automated notification)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { serviceId, vehicleNumber, vehicleModel, bookingDate, timeSlot, notes } = req.body;

    if (!serviceId || !vehicleNumber || !vehicleModel || !bookingDate || !timeSlot) {
      return res.status(400).json({
        message: 'serviceId, vehicleNumber, vehicleModel, bookingDate, and timeSlot are required',
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId, 10) },
    });

    if (!service) {
      return res.status(404).json({ message: 'Selected washing service not found' });
    }

    // Determine max bay capacity based on vehicle category
    const maxBaysAllowed = service.category === 'CAR' ? MAX_CAR_BAYS : MAX_BIKE_BAYS;

    // Atomic Transaction to prevent double booking of washing bays
    const booking = await prisma.$transaction(async (tx) => {
      // Check existing bookings for this exact date, timeSlot, and category
      const existingBookingsCount = await tx.booking.count({
        where: {
          bookingDate,
          timeSlot,
          status: { not: 'CANCELLED' },
          service: {
            category: service.category,
          },
        },
      });

      if (existingBookingsCount >= maxBaysAllowed) {
        throw new Error('SLOT_CAPACITY_REACHED');
      }

      // Create confirmed booking
      return await tx.booking.create({
        data: {
          userId: req.user.id,
          serviceId: service.id,
          vehicleNumber: vehicleNumber.toUpperCase().trim(),
          vehicleModel: vehicleModel.trim(),
          bookingDate,
          timeSlot,
          totalAmount: service.price,
          status: 'CONFIRMED',
          notes: notes || '',
        },
        include: {
          service: true,
          user: true,
        },
      });
    });

    // Trigger Automated WhatsApp & SMS notification dispatch
    const notificationData = await notifyNewBooking({
      booking,
      user: req.user,
      service,
    });

    res.status(201).json({
      message: 'Washing appointment booked successfully!',
      booking,
      notifications: notificationData,
    });
  } catch (error) {
    if (error.message === 'SLOT_CAPACITY_REACHED') {
      return res.status(400).json({
        message: 'Sorry! All washing bays for this time slot are fully booked. Please select another slot.',
      });
    }

    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Get customer's appointments with live status
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Get Owner's live queue / dashboard (filtered by date)
// @route   GET /api/bookings/queue
// @access  Private (OWNER)
const getQueue = async (req, res) => {
  try {
    const { date } = req.query;
    const filterDate = date || new Date().toISOString().split('T')[0];

    const bookings = await prisma.booking.findMany({
      where: { bookingDate: filterDate },
      include: {
        service: true,
        user: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { timeSlot: 'asc' },
    });

    // Attach direct WhatsApp update links for owner convenience
    const enrichedBookings = bookings.map((b) => {
      let waText = '';
      if (b.status === 'CONFIRMED') {
        waText = `Hello ${b.user?.name}, this is Hari Om Washing Centre, Sambalpur. Your slot for ${b.vehicleNumber} (${b.vehicleModel}) is confirmed for today at ${b.timeSlot}. See you soon!`;
      } else if (b.status === 'IN_WASH') {
        waText = `Hello ${b.user?.name}, your vehicle ${b.vehicleNumber} is currently in our washing bay!`;
      } else if (b.status === 'READY_FOR_PICKUP') {
        waText = `✨ Hello ${b.user?.name}, your ${b.vehicleModel} (${b.vehicleNumber}) is washed, polished, and READY FOR PICKUP at Hari Om Centre, Dhanupali! Total due: ₹${b.totalAmount}.`;
      }

      return {
        ...b,
        whatsAppLink: b.user?.phone ? generateWhatsAppLink(b.user.phone, waText) : null,
      };
    });

    res.json({ count: enrichedBookings.length, date: filterDate, bookings: enrichedBookings });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Update wash progress status (Owner action & triggers customer alert)
// @route   PATCH /api/bookings/:id/status
// @access  Private (OWNER)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['CONFIRMED', 'IN_WASH', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await prisma.booking.update({
      where: { id: parseInt(id, 10) },
      data: { status },
      include: { service: true, user: true },
    });

    // Send automated WhatsApp notification
    const notification = await notifyStatusUpdate({
      booking: updated,
      user: updated.user,
      service: updated.service,
      newStatus: status,
    });

    res.json({
      message: 'Status updated successfully',
      booking: updated,
      notification,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createBooking, getMyBookings, getQueue, updateStatus };
