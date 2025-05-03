export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message)
    return res.status(400).json({ message: errors.join(", ") })
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate key error" })
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" })
  }

  res.status(500).json({ message: "Server error" })
}
