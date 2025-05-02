import React from 'react';
import Header from '../../components/layouts/Header';
import { MyCourses } from './myCourses';

const Cousers: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-yellow-500">Aprimore</span> Suas Habilidades Com Os{' '}
            <span className="text-yellow-500">Nossos Cursos</span>
          </h1>
          <a 
            href="#cursos" 
            className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Vamos Aprender
          </a>
        </div>
        
        <figure className="w-full h-64 bg-gray-300 mb-12 rounded-lg overflow-hidden">
          {/* Placeholder for presentation image */}
        </figure>
        
        <section className="mb-16">
          <div className="bg-black text-white py-4 px-6 rounded-lg mb-8">
            <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <li className="text-center">
                <span className="block text-2xl font-bold text-yellow-500">+100</span>
                Famílias Ajudadas
              </li>
              <li className="hidden md:block">|</li>
              <li className="text-center">
                <span className="block text-2xl font-bold text-yellow-500">+10</span>
                Casas Entregues
              </li>
              <li className="hidden md:block">|</li>
              <li className="text-center">
                <span className="block text-2xl font-bold text-yellow-500">+20</span>
                Cursos Disponíveis
              </li>
            </ul>
          </div>
          
          <MyCourses />
        </section>
      </main>
      {/** Footer Section */}
    </div>
  );
};

export default Cousers;