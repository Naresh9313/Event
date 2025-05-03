import express from "express"
import Event from "../models/Event.js"
import Registration from "../models/Registration.js"
import { auth } from "../middleware/auth.js"
import { sendRegistrationEmail } from "../services/emailService.js"

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json(events)
  } catch (error) {
    next(error)
  }
})


router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)
  } catch (error) {
    next(error)
  }
})


router.post("/", async (req, res, next) => {
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

router.post("/:id/register", auth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: event._id,
    })

    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event" })
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available for this event" })
    }

    const registration = new Registration({
      user: req.user._id,
      event: event._id,
    })

    event.availableSeats -= 1

    await Promise.all([registration.save(), event.save()])

    await sendRegistrationEmail(req.user.email, event)

    res.status(201).json({
      message: "Registration successful",
      registration,
    })
  } catch (error) {
    next(error)
  }
})

export default router
