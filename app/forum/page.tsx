import type { Metadata } from "next"
import ForumClientPage from "./ForumClientPage"

export const metadata: Metadata = {
  title: "StackTalk Community Forum | Discussions, Questions & Answers",
  description:
    "Join the StackTalk community forum to discuss topics, ask questions, and share knowledge about SaaS, development, and business solutions.",
}

export default function ForumPage() {
  return <ForumClientPage />
}
