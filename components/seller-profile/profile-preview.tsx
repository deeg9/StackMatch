import type React from "react"

interface ProfilePreviewProps {
  header: string
  contact: string
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ header, contact }) => {
  return (
    <div>
      <h2>Seller Header: {header}</h2>
      <button>Contact Seller: {contact}</button>
    </div>
  )
}

export default ProfilePreview
