import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">CURSOS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal(item)}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.instructor}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <span>{item.start_date.split('T')[0]} - {item.end_date.split('T')[0]}</span>
              <span>{item.location}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedCourse.image}
              alt={selectedCourse.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />

            <p className="mb-4">{selectedCourse.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Início: {selectedCourse.start_date.split('T')[0]} <br />
              Fim: {selectedCourse.end_date.split('T')[0]} <br />
              Local: {selectedCourse.location}
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Ações do Curso
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onSelect={() => alert(`Inscrever-se em ${selectedCourse.title}`)}>
                  Inscrever-se
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => alert(`Compartilhar ${selectedCourse.title}`)}>
                  Compartilhar
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => alert(`Ver detalhes de ${selectedCourse.title}`)}>
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
