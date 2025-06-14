"use client"

import type React from "react"
import { StackJackCopilot } from "./stackjack-copilot"

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StackJackCopilot />
    </>
  )
}
