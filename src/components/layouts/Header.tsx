import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img 
            src="/path/to/logo.png" 
            alt="Logo" 
            className="w-16 h-16 object-contain hover:scale-105 transition-transform" 
          />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">
            Instituto Carangondé Cidadania
          </h2>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
          >
            Início
          </Link>
          <a 
            href="#nos" 
            className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
          >
            Quem Somos
          </a>
          <Link 
            to="/eventos" 
            className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
          >
            Eventos
          </Link>
          <a 
            href="#footer" 
            className="text-gray-300 hover:text-orange-400 transition-colors font-medium"
          >
            Contato
          </a>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full w-10 h-10 p-0 hover:bg-gray-700 transition-colors"
                >
                  <UserCircle className="h-6 w-6 text-orange-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-gray-800 border-gray-700 text-white p-1 rounded-md shadow-xl"
              >
                <DropdownMenuItem 
                  onSelect={handleLogout} 
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer rounded"
                >
                  <span className="text-orange-400">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg hover:shadow-orange-500/30 transition-all">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}