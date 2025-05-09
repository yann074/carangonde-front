import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const ConfirmEmail: React.FC = () => {
  const [message, setMessage] = useState("Confirmando sua conta...");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      axios
        .get(`http://127.0.0.1:8000/api/confirm-email/${token}`)
        .then((response) => {
          setMessage("Conta ativada com sucesso! Redirecionando...");
          setTimeout(() => {
            navigate(response.data.redirect_url.replace("http://localhost:5173", ""));
          }, 3000);
        })
        .catch((error) => {
          setMessage("Erro ao confirmar o e-mail.");
          setError(true);
          console.error(error);
        });
    } else {
      setMessage("Token não encontrado na URL.");
      setError(true);
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-black/10">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            {error ? (
              <AlertTriangle className="h-12 w-12 text-red-500" />
            ) : (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {error ? "Erro na Confirmação" : "Confirmação de E-mail"}
          </CardTitle>
          <p className="text-gray-500 text-md">
            {error
              ? "Não foi possível ativar sua conta."
              : "Estamos confirmando seu e-mail..."}
          </p>
        </CardHeader>

        <CardContent className="text-center mt-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded-md text-gray-800">
            <p className="font-mono">{message}</p>
          </div>

          {error && (
            <p className="text-sm text-gray-500">
              Verifique se o link está correto ou já foi utilizado.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <Button
            variant="default"
            className="bg-black hover:bg-gray-800 text-white"
            onClick={() => navigate("/")}
          >
            Voltar para o Início
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
