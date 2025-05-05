import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import axios from "axios"

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/userprofile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Perfil do usuário:", res.data)
        if (res.data.role === "admin") {
          setIsAdmin(true)
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

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute