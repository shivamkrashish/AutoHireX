import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// =================================================================
// 1. Create Booking (FIXED: YYYY-MM-DD to UTC Parsing)
// =================================================================
export const createBooking = async (req, res) => {
  try {
    // Client से YYYY-MM-DD स्ट्रिंग प्राप्त करें
    const { car, pickupDate, returnDate } = req.body; 
    const user = req.user; 

    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // FIX: YYYY-MM-DD स्ट्रिंग को UTC में 00:00:00 (Start of Day) और 23:59:59 (End of Day) के रूप में पार्स करें।
    // इससे टाइमज़ोन से जुड़ी समस्याओं को ठीक करता है।
    const pickup = new Date(pickupDate + 'T00:00:00.000Z'); 
    const ret = new Date(returnDate + 'T23:59:59.999Z'); 

    if (isNaN(pickup.getTime()) || isNaN(ret.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format received. Please re-select dates." });
    }

    if (ret <= pickup) {
      return res.status(400).json({ success: false, message: "Return date must be after pickup date" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const overlappingBooking = await Booking.findOne({
      car,
      pickupDate: { $lt: ret },
      returnDate: { $gt: pickup },
    });

    if (overlappingBooking) {
      return res.status(400).json({ success: false, message: "Car is already booked for selected dates" });
    }

    const totalDays = Math.ceil((ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * totalDays;
    const ownerId = carData.owner;

    const newBooking = await Booking.create({
      car,
      user: user._id,
      owner: ownerId, 
      pickupDate: pickup,
      returnDate: ret,
      price,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =================================================================
// 2. Fetch User Bookings (MyBookings Page - Safe Fetching)
// =================================================================
export const getUserBookings = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
             return res.status(401).json({ success: false, message: "Authentication required." });
        }
        // सुनिश्चित करें कि car पाथ सही हो
        const bookings = await Booking.find({ user: req.user._id })
            .populate('car')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Fetch User Bookings Error:", error);
        res.status(500).json({ success: false, message: "Failed to load user bookings." });
    }
};

// =================================================================
// 3. Fetch Owner Bookings (ManageBookings Page - Safe Fetching)
// =================================================================
export const getOwnerBookings = async (req, res) => {
    try {
        const ownerId = req.user._id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Owner ID is missing." });
        }
        
        // सुनिश्चित करें कि car और user पाथ सही हो
        const bookings = await Booking.find({ owner: ownerId })
            .populate('car') 
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Fetch Owner Bookings Error:", error);
        res.status(500).json({ success: false, message: "Failed to load owner bookings." });
    }
};

// =================================================================
// 4. Change Booking Status (Unchanged)
// =================================================================
export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        
        if (!['confirmed', 'cancelled'].includes(status)) {
             return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        const booking = await Booking.findOneAndUpdate(
            { _id: bookingId, owner: req.user._id }, 
            { status: status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found or you are not the owner." });
        }

        res.status(200).json({ success: true, message: `Booking ${status} successfully.`, booking });
    } catch (error) {
        console.error("Change Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to change booking status." });
    }
};

// =================================================================
// 5. Check Availability (Unchanged - Placeholder)
// =================================================================
export const checkAvailabilityOfCar = async (req, res) => {
    return res.status(200).json({ success: true, available: true });
};