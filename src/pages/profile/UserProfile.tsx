import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import Swal from "sweetalert2"
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Key,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  LogOut,
  Edit,
  Save,
  X,
  Lock,
  AlertTriangle,
  Camera,
  Upload,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  role: string
  cpf: string
  email_verified_at: string | null
  created_at: string
}

interface UserWithAvatar extends User {
  avatar_url?: string | null
}

export default function PerfilUsuario() {
  const router = useNavigate()
  const [user, setUser] = useState<UserWithAvatar | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        console.log("Token:", token)

        const response = await fetch("http://127.0.0.1:8000/api/userprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        console.log(response)
        if (!response.ok) {
          throw new Error("Falha ao carregar dados do usuário")
        }

        const data = await response.json()
        setUser(data)
        setFormData(data)
      } catch (error) {
        console.error("Erro:", error)
        Swal.fire({
          title: "Erro",
          text: "Algo deu errado!",
          icon: "error",
          confirmButtonColor: "#3085d6",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Calcular força da senha se for o campo new_password
    if (name === "new_password") {
      let strength = 0
      if (value.length >= 8) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Erro",
        text: "Por favor, selecione uma imagem válida",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
      return
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Erro",
        text: "A imagem deve ter no máximo 5MB",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
      return
    }

    setSelectedFile(file)

    // Criar URL para preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Abrir diálogo de confirmação
    setShowAvatarDialog(true)
  }

  const handleAvatarUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("avatar", selectedFile)

      Swal.fire({
        title: "Enviando...",
        text: "Atualizando sua foto de perfil",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await fetch("http://127.0.0.1:8000/api/userprofile/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar imagem")
      }

      const data = await response.json()

      // Atualizar avatar no estado
      setAvatarUrl(data.avatar_url)
      setUser((prev) => (prev ? { ...prev, avatar_url: data.avatar_url } : null))

      Swal.fire({
        title: "Sucesso!",
        text: "Foto de perfil atualizada com sucesso",
        icon: "success",
        confirmButtonColor: "#3085d6",
      })
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar a foto de perfil",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
    } finally {
      setIsUploading(false)
      setShowAvatarDialog(false)
      setSelectedFile(null)
      setPreviewUrl(null)

      // Limpar o input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem("token")

      Swal.fire({
        title: "Removendo...",
        text: "Removendo sua foto de perfil",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await fetch("http://127.0.0.1:8000/api/userprofile/avatar", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao remover imagem")
      }

      // Atualizar avatar no estado
      setAvatarUrl(null)
      setUser((prev) => (prev ? { ...prev, avatar_url: null } : null))

      Swal.fire({
        title: "Sucesso!",
        text: "Foto de perfil removida com sucesso",
        icon: "success",
        confirmButtonColor: "#3085d6",
      })
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível remover a foto de perfil",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token")

      Swal.fire({
        title: "Salvando...",
        text: "Atualizando suas informações",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await fetch("http://127.0.0.1:8000/api/userprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar perfil")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setEditing(false)

      Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso",
        icon: "success",
        confirmButtonColor: "#3085d6",
      })
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar o perfil",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
    }
  }

  const handleSavePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      Swal.fire({
        title: "Erro",
        text: "As senhas não coincidem",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
      return
    }

    if (passwordStrength < 3) {
      Swal.fire({
        title: "Senha fraca",
        text: "Sua senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas, números e caracteres especiais",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")

      Swal.fire({
        title: "Salvando...",
        text: "Atualizando sua senha",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const response = await fetch("http://127.0.0.1:8000/api/userprofile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          password: passwordData.new_password,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar senha")
      }

      setChangingPassword(false)
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
      setPasswordStrength(0)

      Swal.fire({
        title: "Sucesso!",
        text: "Senha atualizada com sucesso",
        icon: "success",
        confirmButtonColor: "#3085d6",
      })
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar a senha",
        icon: "error",
        confirmButtonColor: "#3085d6",
      })
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você será desconectado do sistema",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        router("/login")
      }
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="text-2xl font-bold mb-4">Usuário não encontrado</h1>
          <p className="text-gray-600 mb-6">
            Não foi possível encontrar as informações do seu perfil. Por favor, faça login novamente.
          </p>
          <Button onClick={() => router("/")} className="w-full" size="lg">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não verificado"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Gerar iniciais para o avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Gerar cor de fundo baseada no nome do usuário
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
        <Button variant="outline" className="mt-4 md:mt-0 flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 mb-4 border-2 border-background">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user.name} />
                    ) : (
                      <>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                          alt={user.name}
                        />
                        <AvatarFallback className={getAvatarColor(user.name)}>{getInitials(user.name)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
                    <div className="relative z-10 flex gap-2">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                          <Camera className="h-4 w-4" />
                        </div>
                      </label>
                      {avatarUrl && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-gray-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
                <CardTitle className="text-center text-xl">{user.name}</CardTitle>
                <CardDescription className="text-center">{user.email}</CardDescription>
                <Badge className="mt-2 capitalize">{user.role}</Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                    <p>{formatDate(user.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user.email_verified_at ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status do email</p>
                    <p>{user.email_verified_at ? "Verificado" : "Não verificado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="info" className="flex-1 md:flex-none">
                <UserCircle className="h-4 w-4 mr-2" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1 md:flex-none">
                <Lock className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
                  </div>
                  {!editing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  {!editing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Nome</p>
                            <p className="text-lg font-medium">{user.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-lg font-medium">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">CPF</p>
                            <p className="text-lg font-medium">{user.cpf}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                            <p className="text-lg font-medium">{user.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                            <p className="text-lg font-medium">{user.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Função</p>
                            <p className="text-lg font-medium capitalize">{user.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            className="h-10"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            className="h-10"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleInputChange}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          name="cpf"
                          value={formData.cpf || ""}
                          onChange={handleInputChange}
                          disabled={user.cpf ? true : false}
                          className="h-10"
                        />
                        {user.cpf && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />O CPF não pode ser alterado após o cadastro
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                {editing && (
                  <>
                    <Separator />
                    <CardFooter className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false)
                          setFormData(user)
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Salvar Alterações
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                  {!changingPassword ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Senha</p>
                          <p className="text-lg">••••••••</p>
                        </div>
                      </div>

                      <Button onClick={() => setChangingPassword(true)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Alterar Senha
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-2">
                        <Label htmlFor="current_password">Senha Atual</Label>
                        <Input
                          id="current_password"
                          name="current_password"
                          type="password"
                          value={passwordData.current_password}
                          onChange={handlePasswordChange}
                          className="h-10"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="new_password">Nova Senha</Label>
                        <Input
                          id="new_password"
                          name="new_password"
                          type="password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          className="h-10"
                        />
                        {passwordData.new_password && (
                          <div className="mt-2">
                            <p className="text-xs mb-1">Força da senha:</p>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  passwordStrength === 0
                                    ? "bg-red-500 w-1/4"
                                    : passwordStrength === 1
                                      ? "bg-orange-500 w-2/4"
                                      : passwordStrength === 2
                                        ? "bg-yellow-500 w-3/4"
                                        : "bg-green-500 w-full"
                                }`}
                              />
                            </div>
                            <p className="text-xs mt-1 text-muted-foreground">
                              {passwordStrength < 3 &&
                                "Use pelo menos 8 caracteres, letras maiúsculas, números e símbolos"}
                              {passwordStrength >= 3 && "Senha forte"}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                        <Input
                          id="confirm_password"
                          name="confirm_password"
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="h-10"
                        />
                        {passwordData.confirm_password &&
                          passwordData.new_password !== passwordData.confirm_password && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              As senhas não coincidem
                            </p>
                          )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setChangingPassword(false)
                            setPasswordData({
                              current_password: "",
                              new_password: "",
                              confirm_password: "",
                            })
                            setPasswordStrength(0)
                          }}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancelar
                        </Button>
                        <Button onClick={handleSavePassword} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Salvar Nova Senha
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Sessões Ativas
                    </h3>
                    <div className="rounded-md border p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Sessão Atual</p>
                          <p className="text-sm text-muted-foreground">
                            Iniciada em {new Date().toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleLogout}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Atualizar foto de perfil</DialogTitle>
            <DialogDescription>Visualize e confirme sua nova foto de perfil</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            {previewUrl && (
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAvatarDialog(false)
                setSelectedFile(null)
                setPreviewUrl(null)
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAvatarUpload}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>Enviando...</>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Salvar foto
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
