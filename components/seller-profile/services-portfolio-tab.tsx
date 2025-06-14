import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Smartphone, Cloud, Settings, ExternalLink, Calendar, User } from "lucide-react"

interface ServicesPortfolioTabProps {
  isViewOnly?: boolean
}

export function ServicesPortfolioTab({ isViewOnly = false }: ServicesPortfolioTabProps) {
  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Full-stack web applications with modern frameworks",
      icon: Code,
      priceRange: "$5,000 - $15,000",
      duration: "4-8 weeks",
      technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    },
    {
      id: 2,
      title: "Mobile Applications",
      description: "Native and cross-platform mobile app development",
      icon: Smartphone,
      priceRange: "$8,000 - $25,000",
      duration: "6-12 weeks",
      technologies: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment",
      icon: Cloud,
      priceRange: "$3,000 - $10,000",
      duration: "2-6 weeks",
      technologies: ["AWS", "Azure", "Docker", "Kubernetes"],
    },
    {
      id: 4,
      title: "DevOps & Automation",
      description: "CI/CD pipelines and infrastructure automation",
      icon: Settings,
      priceRange: "$2,000 - $8,000",
      duration: "2-4 weeks",
      technologies: ["Jenkins", "GitHub Actions", "Terraform", "Ansible"],
    },
  ]

  const portfolioProjects = [
    {
      id: 1,
      title: "E-commerce Platform",
      client: "RetailCorp",
      duration: "6 months",
      description:
        "Built a comprehensive e-commerce platform with inventory management, payment processing, and analytics dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      client: "FinanceFirst",
      duration: "8 months",
      description:
        "Developed a secure mobile banking application with biometric authentication and real-time transactions.",
      technologies: ["React Native", "Node.js", "PostgreSQL", "AWS"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "SaaS Analytics Dashboard",
      client: "DataTech",
      duration: "4 months",
      description:
        "Created a real-time analytics dashboard for SaaS metrics with custom reporting and data visualization.",
      technologies: ["Vue.js", "Python", "Redis", "D3.js"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Services Offered</h2>
            <p className="text-muted-foreground">Professional software development services</p>
          </div>
          {!isViewOnly && <Button>Add New Service</Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Price Range:</span>
                      <span>{service.priceRange}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Duration:</span>
                      <span>{service.duration}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isViewOnly && <Button className="w-full mt-4">Request Quote</Button>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Portfolio</h2>
            <p className="text-muted-foreground">Recent projects and case studies</p>
          </div>
          {!isViewOnly && <Button>Add Project</Button>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {portfolioProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  {isViewOnly && (
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {project.client}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div>
                  <p className="text-sm font-medium mb-2">Technologies Used:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
