// Update your EventList component to include category filtering

"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import EventCard from "../components/EventCard"
import api from "../services/api"

const EventList = () => {
  const [events, setEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState(["All"])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all events
        const eventsResponse = await api.get("/api/events")
        setEvents(eventsResponse.data)

        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(eventsResponse.data.map((event) => event.category))]
        setCategories(uniqueCategories)

        // Fetch user's registered events
        const registrationsResponse = await api.get("/api/users/registrations")
        setRegisteredEvents(registrationsResponse.data.map((reg) => reg.event._id))
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRegister = (eventId) => {
    setRegisteredEvents([...registeredEvents, eventId])

    // Update available seats in the events list
    setEvents(
      events.map((event) => (event._id === eventId ? { ...event, availableSeats: event.availableSeats - 1 } : event)),
    )
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Events
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search events by title, description or location"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredEvents.length === 0 ? (
        <Alert severity="info">No events found. Please try a different search term or category.</Alert>
      ) : (
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard
                event={event}
                isRegistered={registeredEvents.includes(event._id)}
                onRegister={handleRegister}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default EventList
