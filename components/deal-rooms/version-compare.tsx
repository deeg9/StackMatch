"use client"

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store"
// import { uploadNewVersion, setAsCurrentVersion, rollbackVersion } from "../../store/slices/dealRoomsSlice"
import type { ContractFileVersion as FileVersion } from "../../types"

const VersionCompare: React.FC = () => {
  const dispatch = useDispatch()
  const { currentFile, versions } = useSelector((state: RootState) => state.dealRooms)
  const [selectedVersion1, setSelectedVersion1] = React.useState<FileVersion | null>(null)
  const [selectedVersion2, setSelectedVersion2] = React.useState<FileVersion | null>(null)

  const handleUploadNewVersion = (file: File, changeNotes: string) => {
    // TODO: Implement upload new version
    console.log("Upload new version:", file, changeNotes)
  }

  const handleSetAsCurrentVersion = (version: FileVersion) => {
    // TODO: Implement set as current version
    console.log("Set as current version:", version)
  }

  const handleRollbackVersion = (version: FileVersion) => {
    // TODO: Implement rollback version
    console.log("Rollback version:", version)
  }

  return (
    <div className="version-compare">
      <h1>File Version Control</h1>
      <div className="version-history">
        <h2>Version History</h2>
        <ul>
          {versions?.map((version) => (
            <li key={version.id}>
              <span>{version.version_number}</span>
              <span>{version.created_at}</span>
              <span>{version.uploaded_by}</span>
              <span>{version.file_size_bytes} bytes</span>
              <button onClick={() => setSelectedVersion1(version)}>Compare</button>
              <button onClick={() => handleSetAsCurrentVersion(version)}>Set as Current</button>
              <button onClick={() => handleRollbackVersion(version)}>Rollback</button>
            </li>
          )) || <li>No versions available</li>}
        </ul>
      </div>
      <div className="version-comparison">
        <h2>Version Comparison</h2>
        {selectedVersion1 && selectedVersion2 && (
          <div>
            <h3>Version {selectedVersion1.version_number}</h3>
            <p>Uploaded on: {selectedVersion1.created_at}</p>
            <p>Uploaded by: {selectedVersion1.uploaded_by}</p>
            <p>File size: {selectedVersion1.file_size_bytes} bytes</p>
            <h3>Version {selectedVersion2.version_number}</h3>
            <p>Uploaded on: {selectedVersion2.created_at}</p>
            <p>Uploaded by: {selectedVersion2.uploaded_by}</p>
            <p>File size: {selectedVersion2.file_size_bytes} bytes</p>
            <button onClick={() => console.log("Download both versions")}>Download Both</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VersionCompare
