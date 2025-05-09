import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, MapPin, User, Users } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  start_date: string
  end_date: string
  location: string
  image: string
  slots: number
  active: boolean
  image_url: string
}

// Componente personalizado para as setas de navegação
const SampleNextArrow = (props: any) => {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-yellow-50 transition-all duration-300 hover:scale-110"
      aria-label="Próximo"
    >
      <ChevronRight className="w-5 h-5 text-yellow-600" />
    </button>
  )
}

const SamplePrevArrow = (props: any) => {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-yellow-50 transition-all duration-300 hover:scale-110"
      aria-label="Anterior"
    >
      <ChevronLeft className="w-5 h-5 text-yellow-600" />
    </button>
  )
}

export const MyCourses: React.FC = () => {
  const [data, setData] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    setLoading(true)
    axios
      .get("https://carangonde-back-production.up.railway.app/api/courses")
      .then((response) => {
        const updatedData = response.data.data.map((course: any) => ({
          ...course,
          image_url: `http://localhost:8000/storage/${course.image}`,
        }))

        setData(updatedData)
        setLoading(false)
      })
      .catch((error) => {
        setError("Erro ao buscar cursos")
        console.error("Houve um erro!", error)
        setLoading(false)
      })
  }, [])

  const openModal = (course: Course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCourse(null)
  }

  // Formatação de data
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="container mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore nossa variedade de cursos projetados para desenvolver suas habilidades e expandir seus conhecimentos.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="relative px-8 mb-12">
          <Slider {...settings}>
            {data.map((item) => (
              <div key={item.id} className="px-3 pb-4">
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-yellow-100 hover:border-yellow-300 h-full flex flex-col hover:translate-y-[-5px]"
                  onClick={() => openModal(item)}
                >
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=192&width=384"
                      }}
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm font-medium">
                        {item.slots} vagas
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-yellow-600">
                      <User className="h-3.5 w-3.5" />
                      {item.instructor || "Instrutor não informado"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.description}</p>

                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mt-0.5" />
                      <span>
                        {formatDate(item.start_date)}
                        {item.end_date && ` até ${formatDate(item.end_date)}`}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <Badge variant={item.active ? "default" : "secondary"} className="text-xs">
                      {item.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Modal de detalhes do curso */}
      {isModalOpen && selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48">
              <img
                src={selectedCourse.image_url || "/placeholder.svg"}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=192&width=384"
                }}
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <Badge variant={selectedCourse.active ? "default" : "secondary"} className="mb-2">
                  {selectedCourse.active ? "Ativo" : "Inativo"}
                </Badge>
                <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">{selectedCourse.instructor || "Instrutor não informado"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span>
                    {formatDate(selectedCourse.start_date)}
                    {selectedCourse.end_date && ` até ${formatDate(selectedCourse.end_date)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                  <span>{selectedCourse.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-yellow-600" />
                  <span>{selectedCourse.slots} vagas disponíveis</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sobre o curso</h3>
                <p className="text-gray-700">{selectedCourse.description}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Ações do Curso</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-yellow-100">
                  <DropdownMenuItem
                    onSelect={() => alert(`Inscrever-se em ${selectedCourse.title}`)}
                    className="cursor-pointer focus:bg-yellow-50 focus:text-yellow-600"
                  >
                    Inscrever-se
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => alert(`Compartilhar ${selectedCourse.title}`)}
                    className="cursor-pointer focus:bg-yellow-50 focus:text-yellow-600"
                  >
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => alert(`Ver detalhes de ${selectedCourse.title}`)}
                    className="cursor-pointer focus:bg-yellow-50 focus:text-yellow-600"
                  >
                    Ver Detalhes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  )
}
