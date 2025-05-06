import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import logo_carangonde from "../../assets/logo_carangonde.svg";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src={logo_carangonde} 
            alt="Logo Instituto Carangondé" 
            className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
            Instituto Carangondé Cidadania
          </h2>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#inicio" 
            className="relative text-gray-700 hover:text-orange-500 transition-colors font-medium group"
          >
            Início
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="#about" 
            className="relative text-gray-700 hover:text-orange-500 transition-colors font-medium group"
          >
            Quem Somos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <Link 
            to="/events" 
            className="relative text-gray-700 hover:text-orange-500 transition-colors font-medium group"
          >
            Eventos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <a 
            href="#contato" 
            className="relative text-gray-700 hover:text-orange-500 transition-colors font-medium group"
          >
            Contato
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-orange-50 transition-colors group"
                >
                  <div className="relative">
                    <UserCircle className="h-6 w-6 text-orange-500 group-hover:text-orange-600 transition-colors" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white border border-gray-100 shadow-xl rounded-lg py-1 px-1 min-w-[180px]"
              >
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-gray-700 hover:bg-orange-50 focus:bg-orange-50 cursor-pointer rounded px-3 py-2"
                >
                  <Link  to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <UserCircle className="h-4 w-4 text-orange-500"/>
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={handleLogout} 
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded px-3 py-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-sm"
                >
                  Cadastre-se
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}