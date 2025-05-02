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
import Header from '../../components/layouts/Header';

interface Events {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  active: string;
}

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

  return (
    <>
    <Header />
    <div className="text-center px-4 py-8 max-w-3xl mx-auto">
  <h1 className="text-4xl font-bold text-gray-900 mb-4">EVENTOS</h1>
    <p className="text-lg text-gray-700 leading-relaxed">
        Junte-se a nós e faça parte de uma <br />
        comunidade vibrante e dinâmica, onde os <br />
        eventos são apenas o começo
    </p>
    </div>

    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">EVENTOS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <Card 
            key={item.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => openModal(item)}
          >
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              {/* Usando a data e hora como descrição */}
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
    </>
  );
};

export default InitialEvents;