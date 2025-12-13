import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";
import ImageKit from "imagekit";

// ImageKit initialization
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Change role to owner
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) return res.status(400).json({ success: false, message: "Image required" });

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
    });

    await Car.create({ ...car, owner: _id, image: optimizedImageUrl, isAvailable: true });
    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get owner cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle car availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car || car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car || car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();
    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized: Not an owner" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter(b => b.status === "pending");
    const completedBookings = bookings.filter(b => b.status === "confirmed");
    const monthlyRevenue = completedBookings.reduce((acc, b) => acc + (b.price || 0), 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;
    if (!imageFile) return res.status(400).json({ success: false, message: "Image required" });

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [{ width: "400" }, { quality: "auto" }, { format: "webp" }],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
