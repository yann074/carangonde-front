import { useState, useEffect } from "react"
import axios from "axios"
import {
  Trash,
  Paintbrush,
  MoreHorizontal,
  Calendar,
  Search,
  Filter,
  Loader2,
  Clock,
  BookOpen,
  Eye,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Link, Outlet } from "react-router-dom"
import CourseDetailsDialog from "./CourseDetailsDialog"
import { Badge } from "../../../components/ui/badge"

interface Course {
  id: number
  title: string
  description: string
  duration: string
  created_at?: string
  updated_at?: string
  image: string
  image_url: string
  status: string
}

export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // State for course details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    axios
      .get("https://carangonde-back-production.up.railway.app/api/courses")
      .then((response) => {
        const updatedData = response.data.data.map((course: any) => ({
          ...course,
          image_url: `http://localhost:8000/storage/${course.image}`,
        }))

        setCourses(updatedData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching courses:", error)
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "inativo":
        return "bg-red-100 text-red-800"
      case "em breve":
        return "bg-yellow-100 text-yellow-800"
      case "esgotado":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (e) {
      return "Data inválida"
    }
  }

  // Action handlers
  const handleEdit = (id: number) => {
    console.log("Edit course", id)
    // Implement edit logic
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Você tem certeza que quer deletar o curso?")) return

    try {
      await axios.delete(`https://carangonde-back-production.up.railway.app/api/courses/${id}`)
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Erro ao deletar, tente novamente mais tarde.")
    }
  }

  const handleViewDetails = async (id: number) => {
    setDetailsDialogOpen(true)
    setLoadingDetails(true)
    setDetailsError(null)

    try {
      const endpoint = `https://carangonde-back-production.up.railway.app/api/courses/${id}`
      console.log(`Fetching course: ${endpoint}`)

      const response = await axios.get(endpoint)

      if (response.data && response.data.data) {
        setSelectedCourse(response.data.data)
      } else {
        const courseFromList = courses.find((course) => course.id === id)
        if (courseFromList) {
          setSelectedCourse(courseFromList)
        } else {
          setDetailsError("API response doesn't contain expected data.")
          console.error("Unexpected response:", response.data)
        }
      }
    } catch (error: any) {
      console.error("Error fetching course details:", error)

      if (error.response) {
        if (error.response.status === 404) {
          setDetailsError(`Course not found. ID ${id} may not exist in the database.`)
        } else {
          setDetailsError(`Server error: ${error.response.status} - ${error.response.statusText}`)
        }
      } else if (error.request) {
        setDetailsError("Could not connect to server. Please check if the backend is running.")
      } else {
        setDetailsError(`Error setting up request: ${error.message}`)
      }
    } finally {
      setLoadingDetails(false)
    }
  }

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || course.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md border-0">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <div>
            <CardTitle className="text-2xl font-bold text-purple-800">Cursos</CardTitle>
            <CardDescription className="text-purple-600">Gerencie os cursos disponíveis para os alunos</CardDescription>
          </div>
          <Link to="/admin/createcourse">
            <Button className="bg-purple-600 hover:bg-purple-700 transition-all">
              <BookOpen className="mr-2 h-4 w-4" />
              Adicionar Curso
            </Button>
          </Link>
          <Outlet />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Procurar Cursos"
                className="pl-9 border-purple-100 focus-visible:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] border-purple-100 focus:ring-purple-500">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="em breve">Em Breve</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="border-purple-100 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-10 w-10 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Carregando cursos...</p>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[50px] font-semibold">#</TableHead>
                    <TableHead className="w-[250px] font-semibold">Curso</TableHead>
                    <TableHead className="font-semibold">Imagem</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Duração</TableHead>
                    <TableHead className="font-semibold">Criado em</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{course.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-purple-900">{course.title}</p>
                            <p className="text-sm text-gray-500">{truncateText(course.description, 50)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                            <img
                              src={course.image_url}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(course.status)} font-medium px-2.5 py-1 rounded-full text-xs`}
                          >
                            {course.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-500" />
                            <span>{course.duration || "Não especificado"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(course.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-700">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(course.id)}
                                className="cursor-pointer hover:bg-purple-50"
                              >
                                <Eye className="mr-2 h-4 w-4 text-purple-600" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(course.id)}
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                <Paintbrush className="mr-2 h-4 w-4 text-blue-600" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer hover:bg-red-50"
                                onClick={() => handleDelete(course.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <BookOpen className="h-10 w-10 mb-2 text-gray-300" />
                          <p>Nenhum curso encontrado.</p>
                          {searchTerm && (
                            <Button variant="link" className="mt-2 text-purple-600" onClick={() => setSearchTerm("")}>
                              Limpar busca
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{filteredCourses.length}</span> de{" "}
              <span className="font-medium">{courses.length}</span> cursos
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-purple-100 text-purple-700 hover:bg-purple-50"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="border-purple-100 text-purple-700 hover:bg-purple-50">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-purple-100 text-purple-700 hover:bg-purple-50">
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CourseDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        selectedCourse={selectedCourse}
        loadingDetails={loadingDetails}
        detailsError={detailsError}
        handleEdit={handleEdit}
      />
    </div>
  )
}
