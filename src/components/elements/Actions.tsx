import React, { useState } from 'react';
import { Users, Home, Leaf, Hand } from 'lucide-react';

interface ActionItem {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}


const Actions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<ActionItem | null>(null);

  const actions: ActionItem[] = [
    {
      id: 1,
      title: "CIDADANIA E REDE",
      description: "Nas vastas extensões rurais da Bahia, muitas famílias enfrentam desafios diários para acessar serviços básicos como cidadãos. Nossa Instituição está empenhada em estender e juntar várias mãos solidárias nas diferentes comunidades que atuamos.",
      color: "bg-green-100 text-green-800",
      icon: <Users className="w-8 h-8" />,
    },
    {
      id: 2,
      title: "CONSTRUÇÃO DE UNIDADES HABITACIONAIS",
      description: "Nos dedicamos a construir unidades habitacionais nas áreas rurais da Bahia, proporcionando um refúgio estável e confortável para aqueles que mais necessitam.",
      color: "bg-blue-100 text-blue-800",
      icon: <Home className="w-8 h-8" />,
    },
    {
      id: 3,
      title: "IDENTIDADE E MEIO AMBIENTE",
      description: "Apoiar suas culturas valoriza sua contribuição para a conservação da biodiversidade e promove a harmonia entre humanos e natureza, protegendo territórios naturais.",
      color: "bg-amber-100 text-amber-800",
      icon: <Leaf className="w-8 h-8" />,
    },
    {
      id: 4,
      title: "CAPACITAÇÃO E EMPODERAMENTO",
      description: "Os cursos oferecem uma chance única de aprender e crescer em suas vidas profissionais. Eles abrem portas para novas habilidades.",
      color: "bg-green-100 text-green-800",
      icon: <Hand className="w-8 h-8" />,
    },
  ];

  const openModal = (content: ActionItem) => {
    setCurrentContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">O que fazemos</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Na nossa ONG, sabemos que o conhecimento é o poder que impulsiona mudanças reais. É hora de fazer a diferença.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`${action.color} p-6 rounded-xl cursor-pointer transition-all hover:shadow-md`}
            onClick={() => openModal(action)}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">{action.icon}</div>
              <h3 className="text-lg font-semibold mb-3">{action.title}</h3>
              <button
                className="mt-auto text-sm font-medium hover:underline self-start"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(action);
                }}
              >
                Saiba mais →
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && currentContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-6 ${currentContent.color.split(' ')[0]} rounded-t-xl`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-full">
                    {currentContent.icon}
                  </div>
                  <h2 className="text-xl font-bold">{currentContent.title}</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">{currentContent.description}</p>
              <button
                onClick={closeModal}
                className={`${currentContent.color.split(' ')[1]} px-4 py-2 rounded-lg font-medium`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Actions;
