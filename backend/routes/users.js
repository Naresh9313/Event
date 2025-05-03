import express from "express"
import { auth } from "../middleware/auth.js"
import Registration from "../models/Registration.js"

const router = express.Router()

router.get("/me", auth, async (req, res) => {
  res.json(req.user)
})

router.get("/registrations", auth, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id }).populate("event").sort({ createdAt: -1 })

    res.json(registrations)
  } catch (error) {
    next(error)
  }
})

export default router
