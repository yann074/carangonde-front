"use client"

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
import { AlertCircle, CheckCircle, Calendar, MapPin, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Switch } from "../../components/ui/switch"

// Constantes para limites de caracteres
const MAX_DESCRIPTION_LENGTH = 500

interface FormData {
  title: string
  description: string
  location: string
  date: string
  time: string
  image: string
  active: number
}

type TabType = "details" | "location" | "datetime" | "settings"

const FormEvents: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("details")

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: "",
    active: 1,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let processedValue = value

    // Limitar tamanho dos campos de texto
    if (name === "description" && value.length > MAX_DESCRIPTION_LENGTH) {
      processedValue = value.substring(0, MAX_DESCRIPTION_LENGTH)
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked ? 1 : 0 }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    console.log("Enviando formData:", formData)
    try {
      await axios.post("http://127.0.0.1:8000/api/events", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Exibe o SweetAlert2 de sucesso
      Swal.fire({
        title: "Evento criado com sucesso!",
        text: "O evento foi publicado e já está disponível.",
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
        location: "",
        date: "",
        time: "",
        image: "",
        active: 1,
      })
      setActiveTab("details")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Ocorreu um erro desconhecido"
      setError(errorMessage)

      // Exibe o SweetAlert2 de erro
      Swal.fire({
        title: "Erro ao criar evento",
        text: "Ocorreu um erro ao tentar criar o evento. Tente novamente.",
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    const tabs: TabType[] = ["details", "location", "datetime", "settings"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const prevTab = () => {
    const tabs: TabType[] = ["details", "location", "datetime", "settings"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Criar novo evento</CardTitle>
        <CardDescription>Adicione as informações do novo evento que será publicado no portal.</CardDescription>
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
              <TabsTrigger value="details">1. Detalhes</TabsTrigger>
              <TabsTrigger value="location">2. Localização</TabsTrigger>
              <TabsTrigger value="datetime">3. Data e Hora</TabsTrigger>
              <TabsTrigger value="settings">4. Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-title">Título do evento *</Label>
                <Input
                  id="input-title"
                  name="title"
                  placeholder="Ex: Workshop de Artesanato"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-description">
                  Descrição do evento *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.description.length}/{MAX_DESCRIPTION_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-description"
                  name="description"
                  placeholder="Descreva detalhadamente o evento, incluindo programação, público-alvo e objetivos..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-image">URL da imagem</Label>
                <Input
                  id="input-image"
                  name="image"
                  placeholder="Ex: https://exemplo.com/imagem.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  maxLength={255}
                />
                <p className="text-sm text-muted-foreground">
                  Adicione uma URL de imagem para ilustrar o evento. Recomendamos imagens de 1200x630 pixels.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-location">Localização do evento *</Label>
                <Alert className="mb-2">
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>Informe o endereço completo onde o evento será realizado.</AlertDescription>
                </Alert>
                <Textarea
                  id="input-location"
                  name="location"
                  placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
                  value={formData.location}
                  onChange={handleChange}
                  rows={3}
                  required
                  maxLength={255}
                />
              </div>
            </TabsContent>

            <TabsContent value="datetime" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="input-date">Data do evento *</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="input-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input-time">Horário do evento</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input id="input-time" name="time" type="time" value={formData.time} onChange={handleChange} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Opcional. Deixe em branco se o evento não tiver um horário específico.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="event-active" className="text-base">
                    Status do evento
                  </Label>
                  <Switch id="event-active" checked={formData.active === 1} onCheckedChange={handleSwitchChange} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.active === 1
                    ? "O evento está ativo e será exibido no portal."
                    : "O evento está inativo e não será exibido no portal."}
                </p>
              </div>

              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Revisão</AlertTitle>
                <AlertDescription>
                  Revise todas as informações antes de finalizar. Após a criação, o evento poderá ser editado no painel
                  administrativo.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevTab} disabled={activeTab === "details"}>
          Voltar
        </Button>

        {activeTab === "settings" ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar evento"}
          </Button>
        ) : (
          <Button onClick={nextTab}>Próximo</Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default FormEvents
