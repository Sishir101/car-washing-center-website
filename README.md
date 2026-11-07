# Hari Om Car and Bike Washing Centre 🚗 🏍️
> **A Real-World Full-Stack Slot Booking, Live Queue & Automated Notification SaaS**  
> *Engineered by Sishir Ranjan Sanbad for his family business in Dhanupali, Sambalpur, Odisha.*

---

## 📍 About the Business

* **Business Name:** Hari Om Car and Bike Washing Centre
* **Location:** Near Bhatra Petrol Pump, Cuttack Road (50m from Aditya Kalyan Mandap), Dhanupali, Sambalpur
* **Owners / Operators:** Sishir Ranjan Sanbad (`6372662335`) & Seshadev Sanbad (`8328964190`)
* **Operating Hours:** 7:00 AM – 8:00 PM
* **Live Bay Capacity:** 4 Bike Bays & 2 Car Bays simultaneously

---

## 🔔 Automated WhatsApp & SMS Notification System

1. **Instant SMS to Center Owners (Sishir & Seshadev):**
   * As soon as a customer reserves a bay, an automated SMS alert is fired to both admin numbers with customer name, phone number, vehicle plate number, model, booked time slot, and price.
2. **Customer WhatsApp Confirmation:**
   * Customers receive an automated WhatsApp confirmation token with their booking reference, date, time slot, and address.
3. **1-Click WhatsApp Stage Alerts for Seshadev:**
   * When Seshadev clicks **"Mark Ready for Pickup"** in the Owner Live Queue, an automated message is dispatched:
     > *"Hello Rahul! Your Swift (`OD 15 A 4567`) is washed, polished, and READY FOR PICKUP at Hari Om Centre, Dhanupali! Total due: ₹350."*

---

## 💰 Real Services & Pricing Matrix

| Vehicle Category | Package | Price | Duration |
| :--- | :--- | :--- | :--- |
| **2-Wheeler (Bike / Scooter)** | Normal Shampoo Wash | **₹60** | 20 mins |
| **2-Wheeler (Bike / Scooter)** | Shampoo Wash + Polish | **₹120** | 30 mins |
| **Small Cars & Sedans** | Normal Exterior Wash | **₹180** | 30 mins |
| **Small Cars & Sedans** | Exterior Wash + Polish | **₹330** | 45 mins |
| **Small Cars & Sedans** | Full Wash (Exterior + Interior Vacuum) | **₹350** | 50 mins |
| **Small Cars & Sedans** | Complete Spa + Full Polish | **₹470** | 70 mins |
| **SUVs & Large 4x4** | SUV Normal Exterior Wash | **₹200** | 35 mins |
| **SUVs & Large 4x4** | SUV Full Wash (Exterior + Interior) | **₹400** | 60 mins |
| **SUVs & Large 4x4** | SUV Complete Spa + Machine Polish | **₹600** | 85 mins |

---

## 🚀 Key Engineering & Architecture Highlights (MCA Placement Ready)

* **Bay Concurrency & Slot Locking:**
  * Uses an atomic database transaction (`prisma.$transaction`) to enforce **max 2 Cars** and **max 4 Bikes** per hourly time slot. Guarantees zero double-booking even under concurrent traffic.
* **Notification Subsystem (`notificationService.js`):**
  * Event-driven alert dispatching for booking creation and stage transitions.
* **Live Stage Tracker:**
  * Real-time customer stepper: `Slot Confirmed` ➔ `In Washing Bay 🚿` ➔ `Ready for Pickup 🧽` ➔ `Delivered ✅`.
* **Owner & Manager Control Room:**
  * Seshadev and Sishir can view today's queue, see customer phone numbers, trigger WhatsApp messages with 1 click, and advance wash stages.

---

## 🏃 Running the Application

In your project root terminal:
```bash
npm run dev
```
* **Frontend:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000`

### 🔑 Pre-Seeded Accounts:
* **Center Owner Login (Sishir):** `sishir@hariomwash.com` / `admin123`
* **Center Manager Login (Seshadev):** `seshadev@hariomwash.com` / `admin123`
* **Test Customer:** `customer@gmail.com` / `customer123`
