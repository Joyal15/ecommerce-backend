import JWT from "jsonwebtoken";
import User from "../models/User.js";

export const requireSignIn = async (req, res, next) => {
    try{
        const token = req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdmin = async (req, res, next) => { 
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}