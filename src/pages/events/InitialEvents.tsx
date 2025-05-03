import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from '../../components/ui/button';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Events {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  active: string;
}

// Componentes personalizados para as setas de navegação
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
    aria-label="Próximo"
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
    aria-label="Anterior"
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const InitialEvents: React.FC = () => {
  const [data, setData] = useState<Events[]>([]);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events')
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        setError('Erro ao buscar eventos');
        console.error('Houve um erro!', error);
      });
  }, []);

  const openModal = (event: Events) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: true,
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
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <Header />
      <div className="text-center px-4 py-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">EVENTOS</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Junte-se a nós e faça parte de uma comunidade vibrante e dinâmica, onde os eventos são apenas o começo
        </p>
      </div>

      <div className="container mx-auto py-10 px-4">
        {/* Carrossel de Eventos */}
        <div className="relative px-8 mb-12">
          <Slider {...settings}>
            {data.map(item => (
              <div key={item.id} className="px-2">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow h-full"
                  onClick={() => openModal(item)}
                >
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {item.date} às {item.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.location}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.active === "1" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.active === "1" ? "Ativo" : "Inativo"}
                    </span>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </Slider>
        </div>

        {/* Lista de Eventos (alternativa para mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:hidden">
          {data.map(item => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => openModal(item)}
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {item.date} às {item.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <span>{item.location}</span>
                <span>{item.active === "1" ? "Ativo" : "Inativo"}</span>
              </CardFooter>
            </Card>
          ))}
        </div>

        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <CardContent>
                <p className="mb-4">{selectedEvent.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Data: {selectedEvent.date} <br />
                  Horário: {selectedEvent.time} <br />
                  Local: {selectedEvent.location} <br />
                  Status: {selectedEvent.active === "1" ? "Ativo" : "Inativo"}
                </p>
              </CardContent>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Ações do Evento
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onSelect={() => alert(`Inscrever-se em ${selectedEvent.title}`)}>
                    Inscrever-se
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => alert(`Compartilhar ${selectedEvent.title}`)}>
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => alert(`Ver detalhes de ${selectedEvent.title}`)}>
                    Ver Detalhes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {error && <div className='text-red-500 text-center mt-4'>{error}</div>}
      </div>

      <Footer />
    </>
  );
};

export default InitialEvents;