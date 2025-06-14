import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plus, Pencil, Trash2 } from "lucide-react"

export interface TeamManagementTabProps {
  isViewOnly?: boolean
}

export function TeamManagementTab({ isViewOnly = false }: TeamManagementTabProps) {
  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "Lead Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      bio: "Full-stack developer with expertise in React and Node.js. Specializes in building scalable web applications and API development.",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      experience: "4+ years",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      bio: "Creative designer focused on creating intuitive user experiences. Combines aesthetic design with practical usability principles.",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      experience: "6+ years",
      skills: ["Python", "PostgreSQL", "Docker", "Microservices"],
      bio: "Backend specialist with strong database and system architecture skills. Experienced in building high-performance APIs and services.",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      experience: "7+ years",
      skills: ["Agile", "Scrum", "Client Communication", "Resource Planning"],
      bio: "Certified project manager with a track record of delivering complex projects on time and within budget. Strong communication skills.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">
            {isViewOnly
              ? "Meet the talented professionals behind our services"
              : "Manage your team members and their roles"}
          </p>
        </div>

        {!isViewOnly && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>

                {!isViewOnly && (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Bio</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isViewOnly && teamMembers.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This team has {teamMembers.length} members with expertise across development, design, and project
              management.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
