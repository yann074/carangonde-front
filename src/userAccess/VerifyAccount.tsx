import { Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "./AuthProvider"
import axios from "axios"

const VerifyAccount = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setisVerified] = useState(false)
const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await axios.get("https://carangonde-back-production.up.railway.app/api/userprofile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Perfil do usuário:", res.data)
        if (res.data.confirm_token === "null") {
          setisVerified(true)
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }
 if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Conta não verificada</h2>
        <p className="text-gray-700 mb-2">
          Verifique seu e-mail para confirmar sua conta antes de continuar.
        </p>
        <p className="text-gray-500 mb-6">Caso já tenha confirmado, tente atualizar a página.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Voltar ao Início
        </button>
      </div>
    )
  }

  return <>{children}</>
}

export default VerifyAccount