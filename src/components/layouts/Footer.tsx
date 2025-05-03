const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo e direitos autorais */}
          <div className="flex items-center mb-4 md:mb-0">
            <span className="ml-2 text-lg font-semibold text-gray-800">Carangondé </span>
          </div>
          
          {/* Links mínimos */}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">Termos</a>
            <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">Privacidade</a>
            <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">Contato</a>
          </div>
        </div>

        {/* Direitos autorais */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Smith Dev. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;