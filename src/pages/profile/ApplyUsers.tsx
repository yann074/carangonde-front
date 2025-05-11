import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    applyForJob();
  }, []);

  const applyForJob = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://carangonde-back-production.up.railway.app/api/apply_opportunities/${id}`,
        { id_vaga: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setAlreadyApplied(true);
      } else {
        setError(error.response?.data?.message || "Erro ao enviar candidatura");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToCourses = () => navigate("/courses");
  const handleGoToProfile = () => navigate("/profile");
  const handleTryAgain = () => {
    setError(null);
    setIsLoading(true);
    applyForJob();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300 mx-auto"></div>
          <p className="mt-4 text-gray-500">Processando sua candidatura...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ocorreu um erro</h3>
            <p className="text-gray-500 mb-6">{error}</p>
          </div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={handleGoToCourses} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Voltar
            </button>
            <button 
              onClick={handleTryAgain} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Candidatura já realizada</h3>
            <p className="text-gray-500 mb-6">
              Você já se candidatou a esta oportunidade.
            </p>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={handleGoToCourses} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Ver outras oportunidades
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Sucesso!</h3>
            <p className="text-gray-500 mb-6">
              Sua candidatura foi enviada com sucesso.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={handleGoToCourses} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Ver oportunidades
            </button>
            <button 
              onClick={handleGoToProfile} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Meu perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}