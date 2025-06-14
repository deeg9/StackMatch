"use client"

import type React from "react"
import { Button, Tooltip } from "@mui/material"

interface ProposalRequestButtonProps {
  onClick: () => void
  disabled?: boolean
}

const ProposalRequestButton: React.FC<ProposalRequestButtonProps> = ({ onClick, disabled }) => {
  // Handler function for requesting a proposal
  const handleRequestProposal = () => {
    onClick()
  }

  return (
    <Tooltip title="Request a Proposal" placement="top">
      <span>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRequestProposal}
          disabled={disabled}
          aria-label="Request Proposal"
        >
          Request Proposal
        </Button>
      </span>
    </Tooltip>
  )
}

export default ProposalRequestButton
