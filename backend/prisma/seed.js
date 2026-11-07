const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating services with real photos and Sambalpur center data...');

  // 1. Owners
  const ownerPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'sishir@hariomwash.com' },
    update: { phone: '6372662335' },
    create: {
      name: 'Sishir Ranjan Sanbad',
      email: 'sishir@hariomwash.com',
      phone: '6372662335',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'seshadev@hariomwash.com' },
    update: { phone: '8328964190' },
    create: {
      name: 'Seshadev Sanbad (Manager)',
      email: 'seshadev@hariomwash.com',
      phone: '8328964190',
      password: ownerPassword,
      role: 'OWNER',
    },
  });

  // Demo Customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      name: 'Amit Patel',
      email: 'customer@gmail.com',
      phone: '9861000000',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  // Clear old services
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();

  // Curated High-Definition Auto Detailing Photos
  const IMAGES = {
    bikeWash: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    bikePolish: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    carExterior: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    carPolish: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    carInterior: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
    carSpa: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    suvExterior: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    suvFull: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    suvSpa: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  };

  // Seed Services
  await prisma.service.createMany({
    data: [
      // 2-WHEELER SERVICES
      {
        name: 'Normal Shampoo Wash',
        category: 'BIKE',
        vehicleSize: '2-Wheeler / Scooter / Bike',
        description: 'High-pressure water rinse, active shampoo foam, wheel & rim cleaning, and air blast drying.',
        price: 60,
        durationMinutes: 20,
        image: IMAGES.bikeWash,
      },
      {
        name: 'Shampoo Wash + Polish',
        category: 'BIKE',
        vehicleSize: '2-Wheeler / Superbike',
        description: 'High-pressure wash, shampoo foam scrub, degreasing, body gloss polish, and tire shine.',
        price: 120,
        durationMinutes: 30,
        image: IMAGES.bikePolish,
      },

      // SMALL CARS & SEDANS
      {
        name: 'Normal Exterior Wash',
        category: 'CAR',
        vehicleSize: 'Small Cars & Sedans',
        description: 'Exterior high-pressure rinse, active foam shampoo, hand microfiber scrub, glass & tire cleaning.',
        price: 180,
        durationMinutes: 30,
        image: IMAGES.carExterior,
      },
      {
        name: 'Exterior Wash + Body Polish',
        category: 'CAR',
        vehicleSize: 'Small Cars & Sedans',
        description: 'Complete exterior foam wash plus full exterior machine gloss polish and tire dressing.',
        price: 330,
        durationMinutes: 45,
        image: IMAGES.carPolish,
      },
      {
        name: 'Full Wash (Exterior + Interior Vacuum)',
        category: 'CAR',
        vehicleSize: 'Small Cars & Sedans',
        description: 'Exterior shampoo wash + deep interior cabin vacuuming, floor mats wash, and dashboard clean.',
        price: 350,
        durationMinutes: 50,
        image: IMAGES.carInterior,
      },
      {
        name: 'Complete Spa + Full Polish (Exterior + Interior)',
        category: 'CAR',
        vehicleSize: 'Small Cars & Sedans',
        description: 'Exterior wash + interior vacuuming + dashboard shine + full exterior gloss body polish.',
        price: 470,
        durationMinutes: 70,
        image: IMAGES.carSpa,
      },

      // SUVs & LARGE CARS
      {
        name: 'SUV Normal Exterior Wash',
        category: 'CAR',
        vehicleSize: 'SUV / Creta / Thar / Scorpio',
        description: 'High-pressure mud removal, snow foam shampoo, underbody blast, glass & heavy tire dressing.',
        price: 200,
        durationMinutes: 35,
        image: IMAGES.suvExterior,
      },
      {
        name: 'SUV Full Wash (Exterior + Interior Vacuum)',
        category: 'CAR',
        vehicleSize: 'SUV / Creta / Thar / Scorpio',
        description: 'Complete exterior foam wash + full interior vacuuming (seats, trunk, carpets) and dashboard polish.',
        price: 400,
        durationMinutes: 60,
        image: IMAGES.suvFull,
      },
      {
        name: 'SUV Complete Spa + Full Body Polish',
        category: 'CAR',
        vehicleSize: 'SUV / Creta / Thar / Scorpio',
        description: 'Heavy exterior foam wash + underbody wash + deep interior vacuum & sanitize + full body machine polish.',
        price: 600,
        durationMinutes: 85,
        image: IMAGES.suvSpa,
      },
    ],
  });

  // Seed sample bookings
  const todayStr = new Date().toISOString().split('T')[0];
  const bikeService = await prisma.service.findFirst({ where: { name: 'Shampoo Wash + Polish' } });
  const carService = await prisma.service.findFirst({ where: { name: 'Full Wash (Exterior + Interior Vacuum)' } });

  await prisma.booking.createMany({
    data: [
      {
        userId: customer.id,
        serviceId: carService.id,
        vehicleNumber: 'OD 15 A 4567',
        vehicleModel: 'Maruti Suzuki Swift (White)',
        bookingDate: todayStr,
        timeSlot: '10:00 AM - 11:00 AM',
        totalAmount: carService.price,
        status: 'IN_WASH',
        notes: 'Extra focus on muddy rear wheels',
      },
      {
        userId: customer.id,
        serviceId: bikeService.id,
        vehicleNumber: 'OD 15 K 9988',
        vehicleModel: 'Royal Enfield Classic 350',
        bookingDate: todayStr,
        timeSlot: '11:00 AM - 12:00 PM',
        totalAmount: bikeService.price,
        status: 'CONFIRMED',
        notes: 'Chain lube required',
      },
    ],
  });

  console.log('Seeded photo-rich services for Hari Om Centre!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
