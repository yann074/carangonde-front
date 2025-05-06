import type React from "react"
import { useState, type FormEvent, type ChangeEvent } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AlertCircle, CheckCircle, Calendar, MapPin, User, Users, BookOpen } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Switch } from "../../components/ui/switch"

// Constantes para limites de caracteres
const MAX_DESCRIPTION_LENGTH = 500

interface FormData {
  title: string
  description: string
  instructor: string
  start_date: string
  end_date: string
  location: string
  image: File | null
  slots: number
  active: boolean
}

type TabType = "basic" | "instructor" | "location" | "settings"

const FormCourse: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("basic")

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    instructor: "",
    start_date: "",
    end_date: "",
    location: "",
    image: null,
    slots: 0,
    active: true,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let processedValue = value

    // Limitar tamanho dos campos de texto
    if (name === "description" && value.length > MAX_DESCRIPTION_LENGTH) {
      processedValue = value.substring(0, MAX_DESCRIPTION_LENGTH)
    }

    // Handle number fields
    if (name === "slots") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, image: file }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")

      // Criar um objeto FormData para enviar arquivos
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("instructor", formData.instructor)
      data.append("start_date", formData.start_date)
      data.append("end_date", formData.end_date)
      data.append("location", formData.location)
      data.append("slots", formData.slots.toString())
      data.append("active", formData.active ? "1" : "0")

      // Adicionar a imagem apenas se existir
      if (formData.image) {
        data.append("image", formData.image)
      }

      // Enviar com o cabeçalho correto para upload de arquivos
      await axios.post("http://127.0.0.1:8000/api/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      // Exibe o SweetAlert2 de sucesso
      Swal.fire({
        title: "Curso criado com sucesso!",
        text: "O curso foi publicado e já está disponível.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        // Navega para a página anterior após fechar o alert
        navigate(-1)
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        instructor: "",
        start_date: "",
        end_date: "",
        location: "",
        image: null,
        slots: 0,
        active: true,
      })
      setActiveTab("basic")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Ocorreu um erro desconhecido"
      setError(errorMessage)

      // Exibe o SweetAlert2 de erro
      Swal.fire({
        title: "Erro ao criar curso",
        text: "Ocorreu um erro ao tentar criar o curso. Tente novamente.",
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    const tabs: TabType[] = ["basic", "instructor", "location", "settings"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const prevTab = () => {
    const tabs: TabType[] = ["basic", "instructor", "location", "settings"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Criar novo curso</CardTitle>
        <CardDescription>Adicione as informações do novo curso que será publicado no portal.</CardDescription>
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
              <TabsTrigger value="basic">1. Informações Básicas</TabsTrigger>
              <TabsTrigger value="instructor">2. Instrutor e Datas</TabsTrigger>
              <TabsTrigger value="location">3. Local e Vagas</TabsTrigger>
              <TabsTrigger value="settings">4. Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-title">Título do curso *</Label>
                <Input
                  id="input-title"
                  name="title"
                  placeholder="Ex: Curso de Artesanato"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-description">
                  Descrição do curso
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.description.length}/{MAX_DESCRIPTION_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-description"
                  name="description"
                  placeholder="Descreva detalhadamente o curso, incluindo conteúdo programático, objetivos e público-alvo..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-image">Imagem do curso</Label>
                <Input id="input-image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                <p className="text-sm text-muted-foreground">
                  Adicione uma imagem para ilustrar o curso. Recomendamos imagens de 1200x630 pixels.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-instructor">Nome do instrutor</Label>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="input-instructor"
                    name="instructor"
                    placeholder="Ex: Prof. João Silva"
                    value={formData.instructor}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="input-start-date">Data de início *</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="input-start-date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input-end-date">Data de término</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="input-end-date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Opcional. Deixe em branco se o curso não tiver data de término definida.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-location">Local do curso</Label>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="input-location"
                    name="location"
                    placeholder="Ex: Sala 101, Prédio Principal ou Online (Zoom)"
                    value={formData.location}
                    onChange={handleChange}
                    maxLength={255}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Informe o local físico onde o curso será realizado ou a plataforma, se for online.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="input-slots">Número de vagas *</Label>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="input-slots"
                    name="slots"
                    type="number"
                    min="0"
                    placeholder="Ex: 20"
                    value={formData.slots.toString()}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Informe o número máximo de participantes que podem se inscrever no curso. Use 0 para vagas ilimitadas.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="course-active" className="text-base">
                    Status do curso
                  </Label>
                  <Switch id="course-active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.active
                    ? "O curso está ativo e será exibido no portal."
                    : "O curso está inativo e não será exibido no portal."}
                </p>
              </div>

              <Alert className="mt-6">
                <BookOpen className="h-4 w-4" />
                <AlertTitle>Informações do curso</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p>
                      <strong>Título:</strong> {formData.title}
                    </p>
                    <p>
                      <strong>Instrutor:</strong> {formData.instructor || "Não informado"}
                    </p>
                    <p>
                      <strong>Período:</strong>{" "}
                      {formData.start_date ? new Date(formData.start_date).toLocaleDateString("pt-BR") : ""}
                      {formData.end_date ? ` até ${new Date(formData.end_date).toLocaleDateString("pt-BR")}` : ""}
                    </p>
                    <p>
                      <strong>Vagas:</strong> {formData.slots}
                    </p>
                    <p>
                      <strong>Local:</strong> {formData.location || "Não informado"}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Revisão</AlertTitle>
                <AlertDescription>
                  Revise todas as informações antes de finalizar. Após a criação, o curso poderá ser editado no painel
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
            {isSubmitting ? "Criando..." : "Criar curso"}
          </Button>
        ) : (
          <Button onClick={nextTab}>Próximo</Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default FormCourse
