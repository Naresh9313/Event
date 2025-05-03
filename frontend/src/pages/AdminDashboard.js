"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip, // Added Chip import
} from "@mui/material"
import { format } from "date-fns"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import api from "../services/api"

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [openEventDialog, setOpenEventDialog] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    totalSeats: 0,
  })

  useEffect(() => {
    fetchData()
  }, [tabValue])

  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      if (tabValue === 0) {
        const response = await api.get("/api/admin/events")
        setEvents(response.data)
      } else if (tabValue === 1) {
        const response = await api.get("/api/admin/users")
        setUsers(response.data)
      } else if (tabValue === 2) {
        const response = await api.get("/api/admin/registrations")
        setRegistrations(response.data)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenEventDialog = (event = null) => {
    if (event) {
      // Format date for the datetime-local input
      const formattedDate = new Date(event.date).toISOString().slice(0, 16)

      setCurrentEvent(event)
      setEventFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        location: event.location,
        totalSeats: event.totalSeats,
      })
    } else {
      setCurrentEvent(null)
      setEventFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        totalSeats: 0,
      })
    }
    setOpenEventDialog(true)
  }

  const handleEventFormChange = (e) => {
    const { name, value } = e.target
    setEventFormData({
      ...eventFormData,
      [name]: name === "totalSeats" ? Number.parseInt(value, 10) : value,
    })
  }

  const handleSaveEvent = async () => {
    try {
      if (currentEvent) {
        // Update existing event
        await api.put(`/api/admin/events/${currentEvent._id}`, eventFormData)
      } else {
        // Create new event
        await api.post("/api/admin/events", eventFormData)
      }

      setOpenEventDialog(false)
      fetchData()
    } catch (err) {
      console.error("Error saving event:", err)
      setError("Failed to save event. Please try again.")
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/api/admin/events/${eventId}`)
        fetchData()
      } catch (err) {
        console.error("Error deleting event:", err)
        setError("Failed to delete event. Please try again.")
      }
    }
  }

  const renderEventsTab = () => (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenEventDialog()}>
          Add Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Total Seats</TableCell>
              <TableCell>Available Seats</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{format(new Date(event.date), "PPP p")}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.totalSeats}</TableCell>
                <TableCell>{event.availableSeats}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenEventDialog(event)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteEvent(event._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )

  const renderUsersTab = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell>Registrations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{format(new Date(user.createdAt), "PPP")}</TableCell>
              <TableCell>{user.registrationCount || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  const renderRegistrationsTab = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Registration Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration._id}>
              <TableCell>{registration.user.name}</TableCell>
              <TableCell>{registration.event.title}</TableCell>
              <TableCell>{format(new Date(registration.createdAt), "PPP p")}</TableCell>
              <TableCell>
                <Chip label={registration.status} color={registration.status === "confirmed" ? "success" : "error"} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Events" />
          <Tab label="Users" />
          <Tab label="Registrations" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && renderEventsTab()}
          {tabValue === 1 && renderUsersTab()}
          {tabValue === 2 && renderRegistrationsTab()}
        </Box>
      )}

      {/* Event Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={eventFormData.title}
              onChange={handleEventFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={eventFormData.description}
              onChange={handleEventFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Date and Time"
              name="date"
              type="datetime-local"
              value={eventFormData.date}
              onChange={handleEventFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Location"
              name="location"
              value={eventFormData.location}
              onChange={handleEventFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Total Seats"
              name="totalSeats"
              type="number"
              value={eventFormData.totalSeats}
              onChange={handleEventFormChange}
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEvent} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminDashboard
