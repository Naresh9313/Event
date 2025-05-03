"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
} from "@mui/material"
import { format } from "date-fns"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

const UserProfile = () => {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get("/api/users/registrations")
        setRegistrations(response.data)
      } catch (err) {
        console.error("Error fetching registrations:", err)
        setError("Failed to load your registrations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

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
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* User Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.name || "User"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Member Since:</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* User Registrations */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            My Registered Events
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {registrations.length === 0 ? (
            <Alert severity="info">You haven't registered for any events yet.</Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {registrations.map((registration) => (
                <Card key={registration._id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {registration.event.title}
                    </Typography>

                    <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        label={format(new Date(registration.event.date), "PPP")}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={format(new Date(registration.event.date), "p")}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip label={registration.event.location} size="small" color="secondary" variant="outlined" />
                      <Chip
                        label={`Registered on ${format(new Date(registration.createdAt), "PP")}`}
                        size="small"
                        color="success"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {registration.event.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserProfile
