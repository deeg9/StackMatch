"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Profile } from "@/types/profile"

interface Service {
  id?: string
  name: string
  description: string
  price: number
}

interface ServicesTabProps {
  profile: Profile
}

const ServicesTab: React.FC<ServicesTabProps> = ({ profile }) => {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState<Service>({ name: "", description: "", price: 0 })
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service>({ name: "", description: "", price: 0 })

  useEffect(() => {
    fetchServices()
  }, [profile.id])

  const fetchServices = async () => {
    if (!profile.id) return
    const response = await fetch(`/api/seller-profiles/services?sellerId=${profile.id}`)
    const data = await response.json()
    setServices(data)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewService({ ...newService, [name]: value })
  }

  const handleAddService = async () => {
    if (!profile.id) return
    const response = await fetch("/api/seller-profiles/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newService, seller_id: profile.id }),
    })

    if (response.ok) {
      fetchServices()
      setNewService({ name: "", description: "", price: 0 })
    } else {
      console.error("Failed to add service")
    }
  }

  const handleDeleteService = async (id: string) => {
    const response = await fetch(`/api/seller-profiles/services/${id}?sellerId=${profile.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      fetchServices()
    } else {
      console.error("Failed to delete service")
    }
  }

  const handleEditService = (service: Service) => {
    setEditingServiceId(service.id || null)
    setEditingService({ ...service })
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditingService({ ...editingService, [name]: value })
  }

  const handleUpdateService = async () => {
    if (!editingServiceId || !profile.id) return

    const response = await fetch(`/api/seller-profiles/services/${editingServiceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...editingService, seller_id: profile.id }),
    })

    if (response.ok) {
      fetchServices()
      setEditingServiceId(null)
      setEditingService({ name: "", description: "", price: 0 })
    } else {
      console.error("Failed to update service")
    }
  }

  return (
    <div>
      <h3>Services</h3>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {editingServiceId === service.id ? (
              <div>
                <input type="text" name="name" value={editingService.name} onChange={handleUpdateInputChange} />
                <textarea name="description" value={editingService.description} onChange={handleUpdateInputChange} />
                <input type="number" name="price" value={editingService.price} onChange={handleUpdateInputChange} />
                <button onClick={handleUpdateService}>Update</button>
              </div>
            ) : (
              <>
                {service.name} - {service.description} - ${service.price}
                <button onClick={() => handleEditService(service)}>Edit</button>
                <button onClick={() => handleDeleteService(service.id || "")}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h4>Add New Service</h4>
      <input type="text" name="name" placeholder="Service Name" value={newService.name} onChange={handleInputChange} />
      <textarea
        name="description"
        placeholder="Service Description"
        value={newService.description}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Service Price"
        value={newService.price}
        onChange={handleInputChange}
      />
      <button onClick={handleAddService}>Add Service</button>
    </div>
  )
}

export default ServicesTab
