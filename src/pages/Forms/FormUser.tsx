import type React from "react"
import { useState, type FormEvent, type ChangeEvent } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AlertCircle, CheckCircle, User, Mail, Phone, MapPin, Lock, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Switch } from "../../components/ui/switch"

interface FormData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
  address: string
  cpf: string
  role: string
  active: boolean
}

type TabType = "basic" | "contact" | "security" | "settings"

const FormUsers: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("basic")

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    cpf: "",
    role: "user",
    active: true,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Formatação do CPF
    if (name === "cpf") {
      const numericValue = value.replace(/\D/g, '')
      let formattedValue = numericValue
      
      if (numericValue.length > 3) {
        formattedValue = `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`
      }
      if (numericValue.length > 6) {
        formattedValue = `${formattedValue.substring(0, 7)}.${formattedValue.substring(7)}`
      }
      if (numericValue.length > 9) {
        formattedValue = `${formattedValue.substring(0, 11)}-${formattedValue.substring(11)}`
      }
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }
    
    // Formatação do telefone
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, '')
      let formattedValue = numericValue
      
      if (numericValue.length > 0) {
        formattedValue = `(${numericValue.substring(0, 2)}`
      }
      if (numericValue.length > 2) {
        formattedValue = `${formattedValue}) ${numericValue.substring(2, 7)}`
      }
      if (numericValue.length > 7) {
        formattedValue = `${formattedValue}-${numericValue.substring(7, 11)}`
      }
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validação básica
    if (formData.password !== formData.password_confirmation) {
      setError("As senhas não coincidem")
      setIsSubmitting(false)
      return
    }

    try {
      const payload = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        active: formData.active ? 1 : 0
      }

      const token = localStorage.getItem("token")

      await axios.post("https://carangonde-back-production.up.railway.app/api/users", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      Swal.fire({
        title: "Usuário criado com sucesso!",
        text: "O usuário foi cadastrado no sistema.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate(-1)
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        address: "",
        cpf: "",
        role: "user",
        active: true,
      })
      setActiveTab("basic")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Ocorreu um erro desconhecido"
      setError(errorMessage)

      Swal.fire({
        title: "Erro ao criar usuário",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    const tabs: TabType[] = ["basic", "contact", "security", "settings"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const prevTab = () => {
    const tabs: TabType[] = ["basic", "contact", "security", "settings"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Cadastrar novo usuário</CardTitle>
        <CardDescription>Preencha os dados do novo usuário do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabType)} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="basic">1. Básico</TabsTrigger>
              <TabsTrigger value="contact">2. Contato</TabsTrigger>
              <TabsTrigger value="security">3. Segurança</TabsTrigger>
              <TabsTrigger value="settings">4. Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-name">
                  <User className="inline h-4 w-4 mr-2" />
                  Nome completo *
                </Label>
                <Input
                  id="input-name"
                  name="name"
                  placeholder="Ex: João da Silva"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-cpf">
                  <Shield className="inline h-4 w-4 mr-2" />
                  CPF *
                </Label>
                <Input
                  id="input-cpf"
                  name="cpf"
                  placeholder="Ex: 123.456.789-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  maxLength={14}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-email">
                  <Mail className="inline h-4 w-4 mr-2" />
                  E-mail *
                </Label>
                <Input
                  id="input-email"
                  name="email"
                  type="email"
                  placeholder="Ex: joao@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-phone">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Telefone *
                </Label>
                <Input
                  id="input-phone"
                  name="phone"
                  placeholder="Ex: (11) 98765-4321"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-address">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Endereço *
                </Label>
                <Input
                  id="input-address"
                  name="address"
                  placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  maxLength={255}
                />
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-password">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Senha *
                </Label>
                <Input
                  id="input-password"
                  name="password"
                  type="password"
                  placeholder="Digite uma senha segura"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <p className="text-sm text-muted-foreground">
                  Mínimo de 8 caracteres, incluindo letras e números.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-password-confirmation">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Confirmar Senha *
                </Label>
                <Input
                  id="input-password-confirmation"
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirme a senha"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Tipo de usuário *</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <Button
                      type="button"
                      variant={formData.role === "admin" ? "default" : "outline"}
                      onClick={() => handleRoleChange("admin")}
                    >
                      Administrador
                    </Button>
                    <Button
                      type="button"
                      variant={formData.role === "user" ? "default" : "outline"}
                      onClick={() => handleRoleChange("user")}
                    >
                      Usuário Comum
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="user-active" className="text-base">
                      Status do usuário
                    </Label>
                    <Switch id="user-active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formData.active
                      ? "O usuário está ativo e poderá acessar o sistema."
                      : "O usuário está inativo e não poderá acessar o sistema."}
                  </p>
                </div>
              </div>

              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Revisão</AlertTitle>
                <AlertDescription>
                  Revise todas as informações antes de finalizar. Após a criação, o usuário poderá ser editado no painel
                  administrativo.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevTab} disabled={activeTab === "basic"}>
          Voltar
        </Button>

        {activeTab === "settings" ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar usuário"}
          </Button>
        ) : (
          <Button onClick={nextTab}>Próximo</Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default FormUsers