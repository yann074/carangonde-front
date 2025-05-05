import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Separator } from "../../components/ui/separator"
import Swal from "sweetalert2"
import { UserCircle, Mail, Phone, MapPin, Key, Calendar, Shield } from "lucide-react"

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

export default function PerfilUsuario() {
  const router = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/userprofile")
        if (!response.ok) {
          throw new Error("Falha ao carregar dados do usuário")
        }
        const data = await response.json()
        setUser(data)
        setFormData(data)
      } catch (error) {
        console.error("Erro:", error)
        Swal.fire({
            title: 'Erro',
            text: 'Algo deu errado!',
            icon: 'error'
          });          
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/userprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
        title: "Sucesso",
        text: "Perfil atualizado com sucesso",
      })
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar o perfil",
        icon: "error",
      })
    }
  }

  const handleSavePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      Swal.fire({
        title: "Erro",
        text: "As senhas não coincidem",
        icon: "error",
      })
      return
    }

    try {
      const response = await fetch("/userprofile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      Swal.fire({
        title: "Sucesso",
        text: "Senha atualizada com sucesso",
      })
    } catch (error) {
      console.error("Erro:", error)
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar a senha",
        icon: "error",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Usuário não encontrado</h1>
        <Button onClick={() => router("/")}>Voltar para a página inicial</Button>
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!editing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nome</p>
                      <p className="text-lg">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-lg">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                      <p className="text-lg">{user.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CPF</p>
                      <p className="text-lg">{user.cpf}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Função</p>
                      <p className="text-lg capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                      <p className="text-lg">{formatDate(user.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email verificado</p>
                      <p className="text-lg">{formatDate(user.email_verified_at)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" name="address" value={formData.address || ""} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf || ""}
                      onChange={handleInputChange}
                      disabled={user.cpf ? true : false}
                    />
                    {user.cpf && (
                      <p className="text-xs text-muted-foreground">O CPF não pode ser alterado após o cadastro</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!editing ? (
                <Button onClick={() => setEditing(true)}>Editar Perfil</Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false)
                      setFormData(user)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!changingPassword ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Senha</p>
                      <p className="text-lg">••••••••</p>
                    </div>
                  </div>

                  <Button onClick={() => setChangingPassword(true)}>Alterar Senha</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current_password">Senha Atual</Label>
                    <Input
                      id="current_password"
                      name="current_password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
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
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                    />
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
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSavePassword}>Salvar Nova Senha</Button>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sessões Ativas</h3>
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sessão Atual</p>
                      <p className="text-sm text-muted-foreground">
                        Iniciada em {new Date().toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
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
  )
}
