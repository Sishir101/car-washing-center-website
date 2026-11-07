const { PrismaClient } = require('@prisma/client');

// PrismaClient singleton prevents multiple instances in dev mode
const prisma = new PrismaClient();

module.exports = prisma;
