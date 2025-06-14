"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Button, Grid, Typography, CircularProgress } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled Components for better UI
const StyledTextField = styled(TextField)({
  marginBottom: "16px",
})

interface SellerProfile {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  description: string
}

const BasicInformationTab = () => {
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [tempSellerProfile, setTempSellerProfile] = useState<SellerProfile | null>(null)

  useEffect(() => {
    const fetchSellerProfile = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/seller-profiles/123") // Replace '123' with actual seller ID
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: SellerProfile = await response.json()
        setSellerProfile(data)
        setTempSellerProfile(data ? { ...data } : null)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSellerProfile()
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    if (tempSellerProfile) {
      setTempSellerProfile({
        ...tempSellerProfile,
        [name]: value,
      })
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    setTempSellerProfile(sellerProfile ? { ...sellerProfile } : null)
  }

  const handleSaveClick = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/seller-profiles/123", {
        // Replace '123' with actual seller ID
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempSellerProfile),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedSellerProfile: SellerProfile = await response.json()
      setSellerProfile(updatedSellerProfile)
      setTempSellerProfile(updatedSellerProfile)
      setIsEditing(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      {sellerProfile && tempSellerProfile ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={tempSellerProfile.companyName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Contact Name"
              name="contactName"
              value={tempSellerProfile.contactName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              value={tempSellerProfile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              fullWidth
              label="Phone"
              name="phone"
              value={tempSellerProfile.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Address"
              name="address"
              value={tempSellerProfile.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField
              fullWidth
              label="City"
              name="city"
              value={tempSellerProfile.city}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField
              fullWidth
              label="State"
              name="state"
              value={tempSellerProfile.state}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={tempSellerProfile.zipCode}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={tempSellerProfile.description}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            {isEditing ? (
              <div>
                <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginRight: "10px" }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="contained" color="primary" onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </Grid>
        </Grid>
      ) : (
        <Typography>No seller profile data available.</Typography>
      )}
    </div>
  )
}

export default BasicInformationTab
