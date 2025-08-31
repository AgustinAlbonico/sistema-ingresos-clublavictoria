import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, UserCheck, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total de Socios",
    value: "248",
    description: "+12 este mes",
    icon: Users,
    trend: "up",
  },
  {
    title: "Temporadas Activas",
    value: "2",
    description: "Temporada 2024-2025",
    icon: Calendar,
    trend: "neutral",
  },
  {
    title: "Socios Activos",
    value: "186",
    description: "75% del total",
    icon: UserCheck,
    trend: "up",
  },
  {
    title: "Nuevos Registros",
    value: "23",
    description: "Últimos 30 días",
    icon: TrendingUp,
    trend: "up",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p
              className={`text-xs mt-1 ${
                stat.trend === "up"
                  ? "text-primary"
                  : stat.trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
