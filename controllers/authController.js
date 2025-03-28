import User from "../models/User.js";
import { hashPassword } from "../helpers/authHelper.js";
import { comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// This function handles user registration
export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address, role} = req.body;

        if(!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Create new user
        // Hash password before saving
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role
        });
        // Save user to database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// This function handles user login

export const loginController = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: "Login successful", token, user });

    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

