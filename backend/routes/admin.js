import express from "express"
import Event from "../models/Event.js"
import User from "../models/User.js"
import Registration from "../models/Registration.js"
import { auth } from "../middleware/auth.js"
import { isAdmin } from "../middleware/isAdmin.js"

const router = express.Router()

router.use(auth)
router.use(isAdmin)

router.get("/events", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json(events)
  } catch (error) {
    next(error)
  }
})

router.post("/events", async (req, res, next) => {
  try {
    const { title, description, date, location, totalSeats } = req.body

    const event = new Event({
      title,
      description,
      date,
      location,
      totalSeats,
      availableSeats: totalSeats,
    })

    await event.save()
    res.status(201).json(event)
  } catch (error) {
    next(error)
  }
})

router.put("/events/:id", async (req, res, next) => {
  try {
    const { title, description, date, location, totalSeats } = req.body

    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const seatsDifference = totalSeats - event.totalSeats

    event.title = title
    event.description = description
    event.date = date
    event.location = location
    event.totalSeats = totalSeats
    event.availableSeats = Math.max(0, event.availableSeats + seatsDifference)

    await event.save()
    res.json(event)
  } catch (error) {
    next(error)
  }
})

router.delete("/events/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    await Registration.deleteMany({ event: event._id })

    await Event.findByIdAndDelete(req.params.id)

    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    next(error)
  }
})

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    const userIds = users.map((user) => user._id)
    const registrationCounts = await Registration.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ])

    const countMap = {}
    registrationCounts.forEach((item) => {
      countMap[item._id] = item.count
    })

    const usersWithCounts = users.map((user) => {
      const userObj = user.toObject()
      userObj.registrationCount = countMap[user._id] || 0
      return userObj
    })

    res.json(usersWithCounts)
  } catch (error) {
    next(error)
  }
})

router.get("/registrations", async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email")
      .populate("event", "title date location")
      .sort({ createdAt: -1 })

    res.json(registrations)
  } catch (error) {
    next(error)
  }
})

export default router
