import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import crypto from "crypto"

const router = express.Router()

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body

 
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    
    const user = new User({
      name,
      email,
      password,
    })

    await user.save()

  

    res.status(201).json({
      message: "User registered successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
})


router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
})



export default router
