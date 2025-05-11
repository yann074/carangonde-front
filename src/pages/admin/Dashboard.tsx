import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { BookOpen, Calendar, Users, Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import { Link, Outlet } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import axios from "axios"

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentView, setCurrentView] = useState("dashboard")
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  function baixarExcel() {
    axios({
      url: "https://carangonde-back-production.up.railway.app/api/exportar-dados",
      method: "GET",
      responseType: "blob"
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dados.xlsx'); // nome do arquivo
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://carangonde-back-production.up.railway.app/api/admin/dashboard")
        const data = await response.json()

        const transformedData = {
          courses: {
            total_courses: data.data.courses.total_courses,
            enrollment_over_time: data.data.courses.enrollment_over_time.map((item: any) => ({
              dia: item.dia,
              inscritos: item.inscritos,
            })),
            recent_courses: data.data.courses.recent_courses,
          },
          events: {
            active_events: data.data.event.active_events.length,
            upcoming_events: data.data.event.upcoming_events,
            participation_rate: 0,
          },
          users: {
            total_users: data.data.users.total_users,
            recent_users: data.data.users.recent_users,
            user_to_day: data.data.users.user_to_day,
            enrollment_over_time: data.data.users.enrollment_over_time.map((item: any) => ({
              dia: item.dia,
              inscritos: item.inscritos,
            })),
          },
        }

        console.log("Dashboard data:", data)
        setStats(transformedData)
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          {
            "-translate-x-full lg:translate-x-0 lg:w-20": collapsed,
            "translate-x-0": mobileOpen,
            "-translate-x-full lg:translate-x-0": !mobileOpen,
          },
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div
            className={cn("flex items-center", {
              "justify-center w-full": collapsed,
            })}
          >
            <BookOpen className="h-6 w-6 text-yellow-700 flex-shrink-0" />
            {!collapsed && <span className="ml-2 text-lg font-semibold text-yellow-700">ONG Carangondé</span>}
          </div>
          <Button variant="ghost" size="icon" className="lg:flex hidden" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden flex" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="h-67 py-4 px-2 flex flex-col space-y-2 overflow-y-auto">
          <SidebarItem
            icon={<LayoutDashboard />}
            title="Dashboard"
            active={currentView === "dashboard"}
            collapsed={collapsed}
            to="/admin"
            onClick={() => setCurrentView("dashboard")}
          />
          <SidebarItem
            icon={<BookOpen />}
            title="Cursos"
            active={currentView === "courses"}
            collapsed={collapsed}
            to="courses"
            onClick={() => setCurrentView("courses")}
          />
          <SidebarItem
            icon={<Calendar />}
            title="Eventos"
            active={currentView === "events"}
            collapsed={collapsed}
            to="events"
            onClick={() => setCurrentView("events")}
          />
          <SidebarItem
            icon={<Users />}
            title="Usuários"
            active={currentView === "users"}
            collapsed={collapsed}
            to="users"
            onClick={() => setCurrentView("users")}
          />
          <SidebarItem
            icon={<Users />}
            title="Usuários Cadastrados"
            active={currentView === "applieds"}
            collapsed={collapsed}
            to="applieds"
            onClick={() => setCurrentView("applieds")}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <SidebarItem
            icon={<LogOut />}
            title="Sair"
            collapsed={collapsed}
            to="/login"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">
              {currentView === "dashboard" && "Painel Administrativo"}
              {currentView === "courses" && "Gestão de Cursos"}
              {currentView === "events" && "Gestão de Eventos"}
              {currentView === "users" && "Gestão de Usuários"}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {currentView === "dashboard" ? (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cursos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "-" : stats?.courses?.total_courses || 0}</div>
                    <p className="text-xs text-muted-foreground">oferecidos pela ONG</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Eventos Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "-" : stats?.events?.active_events || 0}</div>
                    <p className="text-xs text-muted-foreground">acontecendo este mês</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? "-" : stats?.users?.total_users || 0}</div>
                    <p className="text-xs text-muted-foreground">cadastrados no sistema</p>
                  </CardContent>
                </Card>

                
                <Card>
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={baixarExcel}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Exportar Excel
                      </button>
                    </div>
                </Card>

              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Inscrições de Usuários por Dia</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Evolução diária das inscrições de usuários no sistema
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">Carregando...</div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                    ) : stats?.users?.enrollment_over_time ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={stats.users.enrollment_over_time}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="dia" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="inscritos"
                            stroke="#34d399"
                            activeDot={{ r: 6 }}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Nenhum dado encontrado.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>



              {/* Recent Activity Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Últimos Cursos Adicionados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-4">Carregando dados...</div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-4 text-red-500">{error}</div>
                    ) : (
                      <div className="space-y-4">
                        {stats?.courses?.recent_courses?.slice(0, 3).map((course: any) => (
                          <div key={course.id} className="border-b pb-3 last:border-b-0">
                            <p className="text-sm font-medium">{course.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(course.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-4">Carregando dados...</div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-4 text-red-500">{error}</div>
                    ) : (
                      <div className="space-y-4">
                        {stats?.events?.upcoming_events?.slice(0, 3).map((event: any) => (
                          <div key={event.id} className="border-b pb-3 last:border-b-0">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString("pt-BR")} {event.time && `às ${event.time}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Últimos Usuários Cadastrados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-4">Carregando dados...</div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-4 text-red-500">{error}</div>
                    ) : (
                      <div className="space-y-4">
                        {stats?.users?.recent_users?.slice(0, 3).map((user: any) => (
                          <div key={user.id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  active?: boolean
  collapsed?: boolean
  to?: string
  className?: string
  onClick?: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  active = false,
  collapsed = false,
  to,
  className = "",
  onClick,
}) => {
  const baseClasses = cn(
    "w-full p-2 rounded-md transition-colors flex",
    collapsed ? "justify-center" : "items-center",
    active ? "bg-yellow-50 text-yellow-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    className,
  )

  const content = (
    <>
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3">{title}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  )
}

export default Dashboard
