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
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  start_date: string;
  end_date: string;
  location: string;
  image: string;
  slots: number;
  active: boolean;
}

// Componente personalizado para as setas de navegação
const SampleNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
      aria-label="Próximo"
    >
      <ChevronRight className="w-6 h-6 text-yellow-600" />
    </button>
  );
};

const SamplePrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
      aria-label="Anterior"
    >
      <ChevronLeft className="w-6 h-6 text-yellow-600" />
    </button>
  );
};

export const MyCourses: React.FC = () => {
  const [data, setData] = useState<Course[]>([]);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/courses')
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        setError('Erro ao buscar cursos');
        console.error('Houve um erro!', error);
      });
  }, []);

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: true,
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
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-600">NOSSOS CURSOS</h1>

      <div className="relative px-8">
        <Slider {...settings}>
          {data.map(item => (
            <div key={item.id} className="px-2">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-yellow-100 hover:border-yellow-300 h-full"
                onClick={() => openModal(item)}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <span>{item.start_date.split('T')[0]}</span>
                  <span>{item.location}</span>
                </CardFooter>
              </Card>
            </div>
          ))}
        </Slider>
      </div>

      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-yellow-100">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-yellow-600">
                {selectedCourse.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-yellow-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedCourse.image}
              alt={selectedCourse.title}
              className="w-full h-48 object-cover mb-4 rounded-lg border border-yellow-100"
            />

            <p className="mb-4 text-gray-700">{selectedCourse.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Instrutor:</span>
                <span>{selectedCourse.instructor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Período:</span>
                <span>{selectedCourse.start_date.split('T')[0]} a {selectedCourse.end_date.split('T')[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Local:</span>
                <span>{selectedCourse.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Vagas:</span>
                <span>{selectedCourse.slots} disponíveis</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Ações do Curso
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full border-yellow-100">
                <DropdownMenuItem 
                  onSelect={() => alert(`Inscrever-se em ${selectedCourse.title}`)}
                  className="focus:bg-yellow-50 focus:text-yellow-600"
                >
                  Inscrever-se
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => alert(`Compartilhar ${selectedCourse.title}`)}
                  className="focus:bg-yellow-50 focus:text-yellow-600"
                >
                  Compartilhar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => alert(`Ver detalhes de ${selectedCourse.title}`)}
                  className="focus:bg-yellow-50 focus:text-yellow-600"
                >
                  Ver Detalhes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {error && <div className='text-red-500 text-center mt-4'>{error}</div>}
    </div>
  );
};