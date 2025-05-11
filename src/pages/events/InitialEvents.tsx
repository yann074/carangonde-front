"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import Header from "../../components/layouts/Header"
import Footer from "../../components/layouts/Footer"
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Share2, UserPlus, Eye } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  location: string
  date: string
  time: string
  image: File | null
  active: string
  image_url: string
}

// Componentes personalizados para as setas de navegação
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none"
    aria-label="Próximo"
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
)

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none"
    aria-label="Anterior"
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
)

const InitialEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    setLoading(true)
    axios
      .get("https://carangonde-back-production.up.railway.app/api/events")
      .then((response) => {
        const updatedData = response.data.data.map((event: any) => ({
          ...event,
          image_url: event.image,
        }))

        setEvents(updatedData)
        setLoading(false)
      })
      .catch((error) => {
        setError("Erro ao buscar eventos")
        console.error("Houve um erro!", error)
        setLoading(false)
      })
  }, [])

  const openModal = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  // Formatação de data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-yellow-50 to-blue-50 py-16">
        <div className="text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-blue-600 mb-6">
            EVENTOS
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Junte-se a nós e faça parte de uma comunidade vibrante e dinâmica, onde os eventos são apenas o começo
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-6">
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
          <>
            {/* Título da seção */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Próximos Eventos</h2>
              <div className="w-20 h-1 bg-yellow-500 rounded"></div>
            </div>

            {/* Carrossel de Eventos */}
            <div className="relative px-8 mb-16">
              {events.length > 0 ? (
                <Slider {...settings}>
                  {events.map((event) => (
                    <div key={event.id} className="px-3 pb-4">
                      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image_url || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute top-0 right-0 m-3">
                            <Badge variant={event.active === "1" ? "default" : "secondary"} className="font-medium">
                              {event.active === "1" ? "Ativo" : "Encerrado"}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-yellow-600">
                            <Calendar className="h-4 w-4" />
                            {formatDate(event.date)}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-grow">
                          <div className="flex items-start gap-2 mb-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mt-0.5" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-start gap-2 mb-4 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            <span>{event.location}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
                        </CardContent>

                        <CardFooter>
                          <Button
                            onClick={() => openModal(event)}
                            className="w-full bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-700 hover:to-blue-700"
                          >
                            Ver detalhes
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum evento encontrado</p>
                </div>
              )}
            </div>

            {/* Eventos em destaque */}
            {events.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Eventos em Destaque</h2>
                <div className="w-20 h-1 bg-yellow-500 rounded mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {events.slice(0, 2).map((event) => (
                    <div
                      key={`featured-${event.id}`}
                      className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="md:w-2/5 h-48 md:h-auto">
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/5 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <Badge variant={event.active === "1" ? "default" : "secondary"}>
                            {event.active === "1" ? "Ativo" : "Encerrado"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                          <span>•</span>
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{event.description}</p>

                        <Button
                          onClick={() => openModal(event)}
                          className="w-full md:w-auto bg-gradient-to-r from-yellow-600 to-blue-600 hover:from-yellow-700 hover:to-blue-700"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalhes do evento */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-0 max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedEvent.image_url || "/placeholder.svg"}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
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
                <Badge variant={selectedEvent.active === "1" ? "default" : "secondary"} className="mb-2">
                  {selectedEvent.active === "1" ? "Ativo" : "Encerrado"}
                </Badge>
                <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sobre o evento</h3>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => alert(`Inscrever-se em ${selectedEvent.title}`)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Inscrever-se</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => alert(`Compartilhar ${selectedEvent.title}`)}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhar</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => alert(`Ver detalhes de ${selectedEvent.title}`)}
                >
                  <Eye className="h-4 w-4" />
                  <span>Mais detalhes</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default InitialEvents
