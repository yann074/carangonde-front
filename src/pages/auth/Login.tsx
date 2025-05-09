import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/api/login", {
        email: form.email,
        password: form.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { token, role } = response.data.data;

        Swal.fire({
          icon: 'success',
          title: 'Login realizado com sucesso!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        
        localStorage.setItem("token", token);

        if (role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/courses");
        }
      })
      .catch((error) => {
        console.error("Erro de login:", error);
        Swal.fire('Erro!', 'Credenciais inválidas. Tente novamente.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    console.log('Login com Google iniciado');
  }; 

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/bg_gray.svg')", fontFamily: "'Inria Sans', sans-serif" }}>
      <div className="flex flex-row w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl">
        {/* Left side - Presentation */}
        <div 
          className="hidden md:flex flex-col justify-center items-center w-1/2 bg-cover bg-center p-8"
          style={{ backgroundImage: "url('/src/assets/img_login.svg')" }}
        >
          <h1 className="text-white text-5xl lg:text-6xl text-center w-3/4 mb-4">Bem-vindo de volta</h1>
          <h3 className="text-yellow-400 text-3xl text-center w-64 mt-4">Entre para acessar nosso conteúdo</h3>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <Card className="border-none shadow-none">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-4xl font-bold mb-8 text-yellow-600">Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-5 border-yellow-400 rounded-lg hover:bg-yellow-50"
                onClick={handleGoogleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continuar com Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou entre com email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-yellow-600">
                      <Mail size={16} />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Digite seu email"
                      value={form.email}
                      onChange={handleChange}
                      className="pl-10 border-0 border-b-2 border-yellow-400 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-yellow-600"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-yellow-600 hover:underline hover:text-yellow-700"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-yellow-600">
                      <Lock size={16} />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={form.password}
                      onChange={handleChange}
                      className="pl-10 border-0 border-b-2 border-yellow-400 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-yellow-600"
                      required
                    />
                    <div
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-3 cursor-pointer text-yellow-600 hover:text-yellow-700"
                    >
                      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-6 text-lg font-semibold shadow-md transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <div className="text-sm text-center">
                Não tem conta?{' '}
                <Link
                  to="/register"
                  className="text-yellow-600 hover:underline font-medium hover:text-yellow-700"
                >
                  Cadastre-se aqui
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;