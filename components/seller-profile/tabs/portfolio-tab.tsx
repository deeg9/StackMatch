"use client"

import { useState, useEffect } from "react"
import { Button, Card, Input, Modal } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useProfile } from "@/hooks/use-profile"

const { TextArea } = Input

const PortfolioTab = () => {
  const [portfolioItems, setPortfolioItems] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image_url: "",
  })
  const profile = useProfile()

  useEffect(() => {
    fetchPortfolioItems()
  }, [profile])

  const fetchPortfolioItems = async () => {
    if (!profile?.id) return
    try {
      const response = await fetch(`/api/seller-profiles/portfolio?seller_id=${profile.id}`)
      const data = await response.json()
      setPortfolioItems(data)
    } catch (error) {
      console.error("Error fetching portfolio items:", error)
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const response = await fetch("/api/seller-profiles/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newItem, seller_id: profile.id }),
      })

      if (response.ok) {
        fetchPortfolioItems()
        setNewItem({ title: "", description: "", image_url: "" })
        setIsModalVisible(false)
      } else {
        console.error("Failed to add portfolio item")
      }
    } catch (error) {
      console.error("Error adding portfolio item:", error)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem({ ...newItem, [name]: value })
  }

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Portfolio Item
      </Button>

      <div style={{ marginTop: "20px" }}>
        {portfolioItems.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            style={{ marginBottom: "16px" }}
            cover={<img alt="example" src={item.image_url || "/placeholder.svg"} />}
          >
            <p>{item.description}</p>
          </Card>
        ))}
      </div>

      <Modal title="Add New Portfolio Item" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          placeholder="Title"
          name="title"
          value={newItem.title}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <TextArea
          placeholder="Description"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Image URL"
          name="image_url"
          value={newItem.image_url}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
      </Modal>
    </div>
  )
}

export default PortfolioTab
