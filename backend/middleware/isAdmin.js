export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.email === "admin@example.com") {
      next()
    } else {
      res.status(403).json({ message: "Access denied. Admin privileges required." })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
