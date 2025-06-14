"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button, Table, Input, Space, Popconfirm } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useAuth } from "../../../contexts/AuthContext"

interface Member {
  id?: string
  name: string
  email: string
  role: string
  seller_id?: string
}

interface TeamTabProps {
  profile: any
}

const TeamTab: React.FC<TeamTabProps> = ({ profile }) => {
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [editingKey, setEditingKey] = useState("")
  const { authToken } = useAuth()

  useEffect(() => {
    fetchTeamMembers()
  }, [profile])

  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/seller-profiles/${profile.id}/team`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      } else {
        console.error("Failed to fetch team members:", response.status)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const [newMember, setNewMember] = useState<Member>({
    name: "",
    email: "",
    role: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Member) => {
    setNewMember({ ...newMember, [field]: e.target.value })
  }

  const handleAddMember = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/seller-profiles/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...newMember, seller_id: profile.id }),
      })

      if (response.ok) {
        setNewMember({ name: "", email: "", role: "" })
        fetchTeamMembers()
      } else {
        console.error("Failed to add team member:", response.status)
      }
    } catch (error) {
      console.error("Error adding team member:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/seller-profiles/team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        fetchTeamMembers()
      } else {
        console.error("Failed to delete team member:", response.status)
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
    } finally {
      setLoading(false)
    }
  }

  const EditableCell: React.FC<any> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <Input />
    return (
      <td {...restProps}>
        {editing ? (
          <Input
            defaultValue={record[dataIndex]}
            onBlur={async (e) => {
              const newData = [...teamMembers]
              const index = newData.findIndex((item) => record.id === item.id)
              if (index > -1) {
                const item = newData[index]
                newData.splice(index, 1, {
                  ...item,
                  [dataIndex]: e.target.value,
                })
                setTeamMembers(newData)
              }
            }}
            onPressEnter={async (e) => {
              const newData = [...teamMembers]
              const index = newData.findIndex((item) => record.id === item.id)
              if (index > -1) {
                const item = newData[index]
                newData.splice(index, 1, {
                  ...item,
                  [dataIndex]: e.target.value,
                })
                setTeamMembers(newData)
              }
            }}
          />
        ) : (
          children
        )}
      </td>
    )
  }

  const isEditing = (record: Member) => record.id === editingKey

  const edit = (record: Member) => {
    setEditingKey(record.id)
  }

  const cancel = () => {
    setEditingKey("")
  }

  const save = async (record: Member) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/seller-profiles/team/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(record),
      })

      if (response.ok) {
        fetchTeamMembers()
        setEditingKey("")
      } else {
        console.error("Failed to update team member:", response.status)
      }
    } catch (error) {
      console.error("Error updating team member:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<Member> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record)
        return editable ? <Input defaultValue={text} /> : text
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record)
        return editable ? <Input defaultValue={text} /> : text
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record)
        return editable ? <Input defaultValue={text} /> : text
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Member) => {
        const editable = isEditing(record)
        return editable ? (
          <Space size="middle">
            <Button onClick={() => save(record)} type="primary">
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
              Edit
            </Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteMember(record.id)}>
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: Member) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <div>
      <h2>Team Members</h2>
      <Space direction="horizontal">
        <Input placeholder="Name" value={newMember.name} onChange={(e) => handleInputChange(e, "name")} />
        <Input placeholder="Email" value={newMember.email} onChange={(e) => handleInputChange(e, "email")} />
        <Input placeholder="Role" value={newMember.role} onChange={(e) => handleInputChange(e, "role")} />
        <Button type="primary" onClick={handleAddMember} loading={loading}>
          Add Member
        </Button>
      </Space>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={teamMembers}
        columns={mergedColumns}
        rowClassName="editable-row"
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </div>
  )
}

export default TeamTab
