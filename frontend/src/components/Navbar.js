"use client"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Event Registration System
        </Typography>

        {isAuthenticated ? (
          <Box>
            <Button color="inherit" component={Link} to="/events">
              Events
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              My Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
