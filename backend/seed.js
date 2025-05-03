import mongoose from "mongoose"
import dotenv from "dotenv"
import Event from "./models/Event.js"
import User from "./models/User.js"

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/EventRegistrationSystem")
  .then(() => {
    console.log("Connected to MongoDB")
    seedDatabase()
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Event.deleteMany({})
    console.log("Cleared existing events")

    // Create sample events
    const events = [
      {
        title: "Web Development Workshop",
        description:
          "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This workshop is perfect for beginners who want to start their journey in web development.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: "Tech Hub, Downtown",
        totalSeats: 30,
        availableSeats: 30,
      },
      {
        title: "Data Science Conference",
        description:
          "Join industry experts as they discuss the latest trends and technologies in data science. Topics include machine learning, AI, and big data analytics.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: "Science Center, University Campus",
        totalSeats: 100,
        availableSeats: 100,
      },
      {
        title: "Mobile App Development Bootcamp",
        description:
          "An intensive 2-day bootcamp covering React Native and Flutter. Build your first mobile app by the end of the weekend!",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        location: "Innovation Lab, Tech Park",
        totalSeats: 50,
        availableSeats: 50,
      },
      {
        title: "Networking Mixer for Tech Professionals",
        description:
          "Expand your professional network and meet like-minded individuals in the tech industry. Light refreshments will be served.",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: "Skyline Lounge, Business District",
        totalSeats: 75,
        availableSeats: 75,
      },
      {
        title: "Cybersecurity Workshop",
        description:
          "Learn about the latest threats and how to protect your systems. This workshop covers basic to advanced security concepts.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: "Security Institute, East Campus",
        totalSeats: 40,
        availableSeats: 40,
      },
      {
        title: "UI/UX Design Principles",
        description:
          "Discover the fundamentals of good design and how to create user-friendly interfaces. Hands-on exercises included.",
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        location: "Design Studio, Arts District",
        totalSeats: 35,
        availableSeats: 35,
      },
    ]

    await Event.insertMany(events)
    console.log(`Added ${events.length} events to the database`)

    // Create a test admin user if it doesn't exist
    const adminEmail = "admin@example.com"
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      const adminUser = new User({
        name: "Admin User",
        email: adminEmail,
        password: "password123",
      })

      await adminUser.save()
      console.log("Created admin user:", adminEmail)
    }

    console.log("Database seeding completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}
