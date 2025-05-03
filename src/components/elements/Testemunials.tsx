import { Home, Leaf, Hand, User } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Testemunials = () => {
  // Configurações do carrossel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Dados dos depoimentos
  const testimonials = [
    {
      id: 1,
      icon: User,
      iconBg: 'amber-100',
      iconColor: 'amber-600',
      title: 'Beneficiária do Programa Social',
      subtitle: 'Contemplada com cesta básica',
      quote: '"Hoje fui receber minha cesta básica doada pela Carangondé Cidadania. Essa ação veio na hora certa, num momento de muita necessidade para minha família."'
    },
    {
      id: 2,
      icon: Home,
      iconBg: 'yellow-100',
      iconColor: 'yellow-600',
      title: 'Beneficiária do Programa Habitacional',
      subtitle: 'Contemplada com moradia',
      quote: '"Agradeço a vocês e a Deus por esse privilégio. Minha nova casa trouxe dignidade e segurança para minha família."'
    },
    {
      id: 3,
      icon: Hand,
      iconBg: 'amber-100',
      iconColor: 'amber-600',
      title: 'Participante do Programa de Capacitação',
      subtitle: 'Formada em curso profissionalizante',
      quote: '"O curso mudou minha vida. Hoje tenho uma profissão e consigo sustentar minha família graças à oportunidade que recebi."'
    },
    {
      id: 4,
      icon: Leaf,
      iconBg: 'yellow-100',
      iconColor: 'yellow-600',
      title: 'Agricultor Beneficiado',
      subtitle: 'Projeto de sustentabilidade',
      quote: '"Aprendi técnicas de cultivo sustentável que melhoraram minha produção e preservam o meio ambiente. Minha renda aumentou em 40%."'
    }
  ];

  return (
    <>
      <div className='bg-white'>
        {/* ... outras seções permanecem iguais ... */}

        {/* Testimonials Section - Modificada com Carrossel */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Vozes que Inspiram</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Histórias reais de transformação e esperança. Cada depoimento é um testemunho do poder da solidariedade.
              </p>
            </div>

            <div className="testimonial-slider">
              <Slider {...sliderSettings}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="px-4">
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 h-full">
                      <div className="flex items-center mb-4">
                        <div className={`bg-${testimonial.iconBg} p-3 rounded-full mr-4`}>
                          <testimonial.icon className={`w-6 h-6 text-${testimonial.iconColor}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.title}</h4>
                          <p className="text-sm text-gray-500">{testimonial.subtitle}</p>
                        </div>
                      </div>
                      <blockquote className="text-gray-700 italic leading-relaxed">
                        {testimonial.quote}
                      </blockquote>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Estilos personalizados para os dots do carrossel */}
            <style>{`
              .slick-dots li button:before {
                color: #d1d5db; /* Cor dos dots inativos */
                opacity: 1;
                font-size: 10px;
              }
              .slick-dots li.slick-active button:before {
                color: #d97706; /* Cor do dot ativo (amber-600) */
              }
              .slick-dots {
                bottom: -50px;
              }
              @media (max-width: 768px) {
                .slick-dots {
                  bottom: -40px;
                }
              }
            `}</style>
          </div>
        </section>

        {/* ... resto do código permanece igual ... */}
      </div>
    </>
  );
};

export default Testemunials;