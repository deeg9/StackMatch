"use client"

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store"
import { uploadNewVersion, setAsCurrentVersion, rollbackVersion } from "../../store/dealRoomsSlice"
import type { FileVersion } from "../../types"

const VersionCompare: React.FC = () => {
  const dispatch = useDispatch()
  const { currentFile, versions } = useSelector((state: RootState) => state.dealRooms)
  const [selectedVersion1, setSelectedVersion1] = React.useState<FileVersion | null>(null)
  const [selectedVersion2, setSelectedVersion2] = React.useState<FileVersion | null>(null)

  const handleUploadNewVersion = (file: File, changeNotes: string) => {
    dispatch(uploadNewVersion({ file, changeNotes }))
  }

  const handleSetAsCurrentVersion = (version: FileVersion) => {
    dispatch(setAsCurrentVersion(version))
  }

  const handleRollbackVersion = (version: FileVersion) => {
    dispatch(rollbackVersion(version))
  }

  return (
    <div className="version-compare">
      <h1>File Version Control</h1>
      <div className="version-history">
        <h2>Version History</h2>
        <ul>
          {versions.map((version) => (
            <li key={version.id}>
              <span>{version.versionNumber}</span>
              <span>{version.uploadDate}</span>
              <span>{version.user}</span>
              <span>{version.fileSize} KB</span>
              <button onClick={() => setSelectedVersion1(version)}>Compare</button>
              <button onClick={() => handleSetAsCurrentVersion(version)}>Set as Current</button>
              <button onClick={() => handleRollbackVersion(version)}>Rollback</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="version-comparison">
        <h2>Version Comparison</h2>
        {selectedVersion1 && selectedVersion2 && (
          <div>
            <h3>Version {selectedVersion1.versionNumber}</h3>
            <p>Uploaded on: {selectedVersion1.uploadDate}</p>
            <p>Uploaded by: {selectedVersion1.user}</p>
            <p>File size: {selectedVersion1.fileSize} KB</p>
            <h3>Version {selectedVersion2.versionNumber}</h3>
            <p>Uploaded on: {selectedVersion2.uploadDate}</p>
            <p>Uploaded by: {selectedVersion2.user}</p>
            <p>File size: {selectedVersion2.fileSize} KB</p>
            <button onClick={() => console.log("Download both versions")}>Download Both</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VersionCompare
