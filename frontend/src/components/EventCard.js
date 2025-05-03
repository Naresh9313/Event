
import { useState } from "react"
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CardMedia,
  Box,
} from "@mui/material"
import { format } from "date-fns"
import api from "../services/api"

const EventCard = ({ event, isRegistered, onRegister }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleRegister = async () => {
    setLoading(true)
    try {
      await api.post(`/api/events/${event._id}/register`)
      setSnackbar({
        open: true,
        message: "Registration successful! Check your email for confirmation.",
        severity: "success",
      })
      onRegister(event._id)
      setOpenDialog(false)
    } catch (error) {
      console.error("Registration error:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Registration failed",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPP")
  }

  const formatTime = (dateString) => {
    return format(new Date(dateString), "p")
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardMedia
          component="img"
          height="140"
          image={event.image || "/placeholder.svg?height=140&width=300"}
          alt={event.title}
        />
        <CardContent className="flex-grow">
          <Typography variant="h5" component="div" gutterBottom>
            {event.title}
          </Typography>

          <Box className="mb-4 flex flex-wrap gap-2">
            <Chip label={formatDate(event.date)} size="small" color="primary" variant="outlined" />
            <Chip label={formatTime(event.date)} size="small" color="primary" variant="outlined" />
            <Chip label={event.location} size="small" color="secondary" variant="outlined" />
            <Chip label={event.category} size="small" color="info" />
          </Box>

          <Typography variant="body2" color="text.secondary" className="mb-4">
            {event.description}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Available Seats:</strong> {event.availableSeats}
          </Typography>
        </CardContent>

        <CardActions>
          {isRegistered ? (
            <Button variant="contained" color="success" disabled fullWidth>
              Registered
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              disabled={event.availableSeats === 0}
              fullWidth
            >
              {event.availableSeats === 0 ? "Sold Out" : "Register"}
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Registration Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to register for "{event.title}" on {formatDate(event.date)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary" variant="contained" disabled={loading}>
            {loading ? "Registering..." : "Confirm Registration"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EventCard
