/**
 * Notification Service for Hari Om Car & Bike Washing Centre
 * Handles automated SMS alerts to Admins (Sishir & Seshadev) and WhatsApp updates to Customers
 */

const ADMIN_CONTACTS = [
  { name: 'Sishir Ranjan Sanbad', phone: '6372662335' },
  { name: 'Seshadev Sanbad', phone: '8328964190' },
];

/**
 * Generates an encoded WhatsApp Web/App direct link
 * @param {string} phone 10-digit mobile number
 * @param {string} message Pre-composed text
 */
const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Triggered when a customer reserves a washing slot
 */
const notifyNewBooking = async ({ booking, user, service }) => {
  const adminMessage = 
`🚨 *NEW BOOKING - HARI OM WASHING CENTRE*
----------------------------------------
👤 Customer: ${user.name} (${user.phone || 'No phone'})
🚗 Vehicle: ${booking.vehicleNumber} (${booking.vehicleModel})
📦 Package: ${service.name}
💰 Amount: ₹${booking.totalAmount}
📅 Date: ${booking.bookingDate}
⏰ Slot: ${booking.timeSlot}
📝 Notes: ${booking.notes || 'None'}
Ref: #HARIOM-${booking.id}
----------------------------------------`;

  const customerMessage = 
`✅ *BOOKING CONFIRMED - HARI OM CENTRE*
----------------------------------------
Dear ${user.name}, your washing bay slot has been reserved!

🚗 Vehicle: ${booking.vehicleNumber} (${booking.vehicleModel})
📦 Package: ${service.name}
📅 Date: ${booking.bookingDate}
⏰ Slot: ${booking.timeSlot}
💰 Total Due at Centre: ₹${booking.totalAmount}
📍 Location: Near Bhatra Petrol Pump, Cuttack Road, Dhanupali, Sambalpur.

Please arrive 5 minutes before your slot time. Thank you!
- Sishir & Seshadev (Hari Om Auto Spa)`;

  // Console Broadcast (Simulating SMS & WhatsApp Cloud Dispatch)
  console.log('\n================== [AUTOMATED SMS / WHATSAPP DISPATCH] ==================');
  ADMIN_CONTACTS.forEach((admin) => {
    console.log(`📱 [SMS sent to Admin: ${admin.name} (+91 ${admin.phone})]:\n${adminMessage}\n`);
  });

  if (user.phone) {
    console.log(`💬 [WhatsApp queued for Customer (+91 ${user.phone})]:\n${customerMessage}\n`);
  }
  console.log('=========================================================================\n');

  return {
    adminMessage,
    customerMessage,
    customerWhatsAppLink: user.phone ? generateWhatsAppLink(user.phone, customerMessage) : null,
    adminWhatsAppLinks: ADMIN_CONTACTS.map((a) => ({
      name: a.name,
      link: generateWhatsAppLink(a.phone, adminMessage),
    })),
  };
};

/**
 * Triggered when Admin advances vehicle status
 */
const notifyStatusUpdate = async ({ booking, user, service, newStatus }) => {
  if (!user.phone) return null;

  let message = '';

  if (newStatus === 'IN_WASH') {
    message = 
`🚿 *WASH STARTED - HARI OM CENTRE*
----------------------------------------
Hello ${user.name}, your vehicle *${booking.vehicleNumber}* is now in the washing bay undergoing high-pressure foam rinse & cleaning!`;
  } else if (newStatus === 'READY_FOR_PICKUP') {
    message = 
`✨ *READY FOR PICKUP! - HARI OM CENTRE*
----------------------------------------
Hello ${user.name}, your vehicle *${booking.vehicleNumber}* has been washed, dried, polished, and is sparkling clean!

🔑 Please collect your vehicle from our centre.
📍 Near Bhatra Petrol Pump, Cuttack Road, Dhanupali, Sambalpur.
💰 Amount Due: ₹${booking.totalAmount}

Thank you for choosing Hari Om Car & Bike Washing Centre!
📞 Call us: 8328964190 / 6372662335`;
  } else if (newStatus === 'COMPLETED') {
    message = 
`🎉 *THANK YOU FOR VISITING - HARI OM CENTRE*
----------------------------------------
Dear ${user.name}, thank you for trusting Hari Om Washing Centre with your ${booking.vehicleModel} (${booking.vehicleNumber}). Drive safe, and see you next time!`;
  }

  if (message) {
    console.log(`💬 [Automated WhatsApp to Customer (+91 ${user.phone})]:\n${message}\n`);
  }

  return {
    message,
    whatsAppLink: message ? generateWhatsAppLink(user.phone, message) : null,
  };
};

module.exports = {
  notifyNewBooking,
  notifyStatusUpdate,
  generateWhatsAppLink,
  ADMIN_CONTACTS,
};
