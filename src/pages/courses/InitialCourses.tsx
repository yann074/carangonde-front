import type React from "react"
import Header from "../../components/layouts/Header"
import { MyCourses } from "./myCourses"
import Footer from "../../components/layouts/Footer"

const Courses: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section - Simplificado e mais clean */}
        {/* Hero Section - Simplificado e mais clean */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
            Aprimore suas habilidades com nossos cursos
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Conhecimento transformador para capacitar você e sua comunidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#cursos"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
            >
              Ver cursos disponíveis
            </a>
            <a
              href="/events"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-all duration-200"
            >
              Ver eventos
            </a>
          </div>
        </div>

        {/* Stats Section - Redesenhado com estilo mais clean */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <span className="block text-3xl font-bold text-yellow-600 mb-2">+100</span>
              <span className="text-gray-600">Famílias Ajudadas</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <span className="block text-3xl font-bold text-yellow-600 mb-2">+10</span>
              <span className="text-gray-600">Casas Entregues</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <span className="block text-3xl font-bold text-yellow-600 mb-2">+20</span>
              <span className="text-gray-600">Cursos Disponíveis</span>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="cursos" className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Nossos Cursos</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>
          <MyCourses />
        </section>

        {/* Informações adicionais - Seção clean e minimalista */}
        <section className="bg-gray-50 rounded-lg p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Educação que Transforma</h2>
            <p className="text-gray-600 mb-8">
              Nossos cursos são projetados para oferecer conhecimento prático e relevante, ajudando no desenvolvimento
              pessoal e profissional de nossa comunidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Instrutores qualificados</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Material didático</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Certificado de conclusão</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Courses
