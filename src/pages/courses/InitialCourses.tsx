import React from 'react';
import Header from '../../components/layouts/Header';
import { MyCourses } from './myCourses';
import Footer from '../../components/layouts/Footer';

const Courses: React.FC = () => {
  return (
    <div className="bg-yellow-50 min-h-screen">
      <Header />
      <main className=" mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-yellow-600">Aprimore</span> Suas Habilidades Com Os{' '}
            <span className="text-yellow-600">Nossos Cursos</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Conhecimento transformador para capacitar você e sua comunidade. Aprenda com os melhores instrutores.
          </p>
          <a 
            href="#cursos" 
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Comece a Aprender Agora
          </a>
        </div>
        
        {/* Featured Image */}
        <figure className="w-full h-80 bg-gradient-to-r from-yellow-100 to-yellow-200 mb-12 rounded-xl overflow-hidden shadow-md flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-yellow-800 mb-4">Educação que Transforma</h2>
            <p className="text-yellow-700">Cursos práticos para o desenvolvimento pessoal e profissional</p>
          </div>
        </figure>
        
        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-yellow-600 text-white py-6 px-6 rounded-xl shadow-lg mb-8">
            <ul className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              <li className="text-center px-4 py-2 bg-yellow-700 rounded-lg">
                <span className="block text-3xl font-bold">+100</span>
                <span className="text-yellow-100">Famílias Ajudadas</span>
              </li>
              <li className="text-center px-4 py-2 bg-yellow-700 rounded-lg">
                <span className="block text-3xl font-bold">+10</span>
                <span className="text-yellow-100">Casas Entregues</span>
              </li>
              <li className="text-center px-4 py-2 bg-yellow-700 rounded-lg">
                <span className="block text-3xl font-bold">+20</span>
                <span className="text-yellow-100">Cursos Disponíveis</span>
              </li>
            </ul>
          </div>
          
          {/* Courses Section */}
          <div id="cursos" className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Nossos <span className="text-yellow-600">Cursos</span>
            </h2>
            <MyCourses />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;