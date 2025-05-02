import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Calendar, CreditCard, Phone, Home } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  birthday: string;
  cpf: string;
  phone: string;
  address: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    birthday: '',
    cpf: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post('http://localhost/backend/public/register.php', form)
      .then(response => {
        console.log(response.data);
        if(response.data.message === "User Created") {
          alert("Usuário criado, faça o Login");
          navigate("/");
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleGoogleSignup = () => {
    console.log('Cadastro com Google iniciado');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center" 
         style={{ backgroundImage: "url('/src/assets/bg_gray.svg')" }}>
      <div className="flex w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl">
        {/* Left side - Presentation */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-cover bg-center p-8"
             style={{ backgroundImage: "url('/src/assets/img_login.svg')" }}>
          <h1 className="text-white text-4xl lg:text-5xl text-center mb-4 font-bold">Crie Sua Conta</h1>
          <h3 className="text-yellow-400 text-xl text-center">Junte-se à nossa comunidade e Tenha Acesso aos nossos cursos.</h3>
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-8">CADASTRE-SE</h2>
          
          <button 
            onClick={handleGoogleSignup}
            className="w-full py-3 mb-6 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            CONTINUAR COM GOOGLE
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Digite seu nome completo"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Calendar size={18} />
              </div>
              <label className="block text-sm text-gray-500 ml-10">Data de Nascimento</label>
              <input
                name="birthday"
                type="date"
                value={form.birthday}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <CreditCard size={18} />
              </div>
              <input
                name="cpf"
                type="text"
                placeholder="Digite seu CPF"
                value={form.cpf}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Phone size={18} />
              </div>
              <input
                name="phone"
                type="text"
                placeholder="Digite seu telefone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Home size={18} />
              </div>
              <input
                name="address"
                type="text"
                placeholder="Digite seu endereço"
                value={form.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Home size={18} />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
            >
              REGISTRAR
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-purple-600 hover:underline font-medium">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
