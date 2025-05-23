import { Link } from 'react-router-dom';
import { Sun, Users, Home, Leaf, Hand, Phone, Banknote, Mail, Check } from 'lucide-react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import Testimonials from '../components/elements/Testemunials';
import Actions from '../components/elements/Actions';

const HomePage = () => {
  return (
    <>

      <div className='bg-white'>
        <Header />

        {/* Hero Section - Yellow Focus */}
        <section className="py-10" id="inicio">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="w-full lg:w-1/2 space-y-8">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Construindo Esperança, <br />
                  Erguendo Lares: <span className="text-amber-600">Juntos</span> Transformamos <br />
                  <span className="text-yellow-600">Vidas na Zona Rural</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Nossa missão é levar dignidade através de moradias seguras e programas de desenvolvimento comunitário para famílias em áreas rurais.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Cadastre-se Agora
                  </Link>
                  <a
                    href="#about"
                    className="px-8 py-4 border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 font-semibold rounded-lg transition-colors duration-300 text-center"
                  >
                    Conheça Nosso Trabalho
                  </a>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <img
                        key={item}
                        src={`/avatar-${item}.jpg`}
                        alt="Voluntário"
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Junte-se a <span className="font-semibold">+200 voluntários</span> que já fazem parte
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-1/2 relative">
                <div className="bg-amber-100 rounded-3xl p-8 w-full h-full flex items-center justify-center">
                  <Sun className="w-64 h-64 text-amber-500" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white px-6 py-3 rounded-lg shadow-lg border border-gray-100">
                  <p className="font-bold text-amber-600">+500 famílias impactadas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="bg-white py-20" id="about">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className="bg-amber-100 rounded-2xl p-8 w-full h-full flex items-center justify-center">
                    <Users className="w-32 h-32 text-amber-600" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg">
                    <span className="font-bold">+10 anos</span> transformando vidas
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Nossa <span className="text-amber-600">Missão</span> e <span className="text-yellow-600">História</span>
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  A ONG Carangondé tem como finalidade incentivar, promover e apoiar a defesa, preservação e conservação do meio ambiente,
                  o desenvolvimento sustentável, a provisão de moradia digna e a preservação das culturas tradicionais.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-gray-700">Promoção de ações sociais que fortalecem a cidadania</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-gray-700">Defesa e conservação do meio ambiente</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                      <Check className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-gray-700">Desenvolvimento sustentável das comunidades</p>
                  </div>
                </div>

                <a href='#about' className="mt-8 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                  Conheça nosso trabalho
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Princípios</h2>
              <p className="text-xl text-gray-600">
                A essência que guia cada ação e decisão em nossa organização
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Missão Sem Fins Lucrativos</h3>
                <p className="text-gray-600">
                  Organização social comprometida exclusivamente com o desenvolvimento comunitário
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hand className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cidadania Ativa</h3>
                <p className="text-gray-600">
                  Empoderamos pessoas em situação de vulnerabilidade social através de direitos e oportunidades
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Acesso Facilitado</h3>
                <p className="text-gray-600">
                  Conectamos comunidades com serviços públicos essenciais de forma humanizada
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Testimonials Section */}
        <Testimonials />

        {/* Donation Section */}
        <section className="bg-gradient-to-r from-amber-500 to-yellow-600 py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h4 className="text-2xl font-bold mb-2">FAÇA A DIFERENÇA COM SUA DOAÇÃO</h4>
                <p className="text-lg opacity-90">
                  Sua contribuição ajuda a transformar vidas e comunidades. Cada doação faz a diferença!
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
                    <img
                      src="path-to-pix-image"
                      alt="QR Code para doação via PIX"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <p className="text-gray-700 font-medium">Escaneie para doar via PIX</p>
                </div>

                <div className="text-center md:text-left">
                  <div className="mb-8">
                    <h5 className="text-xl font-semibold mb-4">OUTRAS FORMAS DE DOAR</h5>
                    <div className="space-y-3">
                      <p className="flex items-center justify-center md:justify-start">
                        <Phone className="w-5 h-5 mr-2" />
                        <span className="text-lg">(XX) XXXX-XXXX</span>
                      </p>
                      <p className="flex items-center justify-center md:justify-start">
                        <Mail className="w-5 h-5 mr-2" />
                        <span className="text-lg">doacoes@ong.org.br</span>
                      </p>
                      <p className="flex items-center justify-center md:justify-start">
                        <Banknote className="w-5 h-5 mr-2" />
                        <span className="text-lg">Dados bancários disponíveis</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Obrigado por querer doar! ❤️")}
                    className="bg-white hover:bg-gray-100 text-amber-600 font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
                  >
                    Quero doar agora
                  </button>

                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Actions Section */}
        <Actions />

        {/* Footer Section */}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;