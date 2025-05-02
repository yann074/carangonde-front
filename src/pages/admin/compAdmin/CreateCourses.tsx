import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

// Constantes para limites de caracteres
const MAX_OBJECTIVES_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_REQUIREMENTS_LENGTH = 500;

interface Institution {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  duration: string;
  objectives: string;
  requirements: string;
  syllabus: string;
  modality: 'Presencial' | 'Online' | 'Híbrido';
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  category_id: string;
  institution_id: string;
  price: string;
  status: 'ativo' | 'rascunho' | 'pausado';
}

type TabType = 'sobre' | 'conteudo' | 'requisitos' | 'configuracoes';

const CourseCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("sobre");
  const [modalityTypes, setModalityTypes] = useState<string[]>([]);
  const [levelTypes, setLevelTypes] = useState<string[]>([]);
  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    duration: '',
    objectives: '',
    requirements: '',
    syllabus: '',
    modality: 'Presencial',
    level: 'Iniciante',
    category_id: '',
    institution_id: '',
    price: '',
    status: 'ativo'
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Limitar tamanho dos campos de texto
    if (name === 'objectives' && value.length > MAX_OBJECTIVES_LENGTH) {
      processedValue = value.substring(0, MAX_OBJECTIVES_LENGTH);
    } else if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      processedValue = value.substring(0, MAX_DESCRIPTION_LENGTH);
    } else if (name === 'requirements' && value.length > MAX_REQUIREMENTS_LENGTH) {
      processedValue = value.substring(0, MAX_REQUIREMENTS_LENGTH);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSelectChange = (name: keyof FormData) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modalityRes, levelRes, statusRes, institutionRes, categoryRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/enums/course-modality'),
          axios.get('http://127.0.0.1:8000/api/enums/course-level'),
          axios.get('http://127.0.0.1:8000/api/enums/status'),
          axios.get('http://127.0.0.1:8000/api/institutions'),
          axios.get('http://127.0.0.1:8000/api/categories')
        ]);

        setModalityTypes(modalityRes.data.data);
        setLevelTypes(levelRes.data.data);
        setStatusTypes(statusRes.data.data);
        setInstitutions(institutionRes.data.data);
        setCategories(categoryRes.data.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post('http://127.0.0.1:8000/api/courses', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      Swal.fire({
        title: 'Curso criado com sucesso!',
        text: 'O curso foi cadastrado e já está disponível.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        navigate(-1);
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        duration: '',
        objectives: '',
        requirements: '',
        syllabus: '',
        modality: 'Presencial',
        level: 'Iniciante',
        category_id: '',
        institution_id: '',
        price: '',
        status: 'ativo'
      });
      setActiveTab("sobre");

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido';
      setError(errorMessage);

      Swal.fire({
        title: 'Erro ao criar curso',
        text: 'Ocorreu um erro ao tentar criar o curso. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    const tabs: TabType[] = ["sobre", "conteudo", "requisitos", "configuracoes"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs: TabType[] = ["sobre", "conteudo", "requisitos", "configuracoes"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Criar novo curso</CardTitle>
        <CardDescription>
          Adicione as informações do novo curso que será oferecido.
        </CardDescription>
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
              <TabsTrigger value="sobre">1. Sobre o curso</TabsTrigger>
              <TabsTrigger value="conteudo">2. Conteúdo</TabsTrigger>
              <TabsTrigger value="requisitos">3. Requisitos</TabsTrigger>
              <TabsTrigger value="configuracoes">4. Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="sobre" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-title">Título do curso *</Label>
                <Input
                  id="input-title"
                  name="title"
                  placeholder="Ex: Introdução ao Desenvolvimento Web"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution_id">Instituição *</Label>
                  <Select
                    value={formData.institution_id}
                    onValueChange={handleSelectChange('institution_id')}
                  >
                    <SelectTrigger id="select-institution">
                      <SelectValue placeholder="Selecione a instituição" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions.map((institution) => (
                        <SelectItem key={institution.id} value={institution.id.toString()}>
                          {institution.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Categoria *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={handleSelectChange('category_id')}
                  >
                    <SelectTrigger id="select-category">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-description">
                  Descrição do curso *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.description.length}/{MAX_DESCRIPTION_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-description"
                  name="description"
                  placeholder="Descreva o curso, seus objetivos gerais e público-alvo..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="input-duration">Duração *</Label>
                  <Input
                    id="input-duration"
                    name="duration"
                    placeholder="Ex: 40 horas"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="select-modality">Modalidade *</Label>
                  <Select
                    value={formData.modality}
                    onValueChange={handleSelectChange('modality')}
                  >
                    <SelectTrigger id="select-modality">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalityTypes.map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="select-level">Nível *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={handleSelectChange('level')}
                  >
                    <SelectTrigger id="select-level">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelTypes.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-price">Preço</Label>
                <Input
                  id="input-price"
                  name="price"
                  placeholder="Ex: R$ 499,00 ou Gratuito"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="conteudo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-objectives">
                  Objetivos de aprendizagem *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.objectives.length}/{MAX_OBJECTIVES_LENGTH})
                  </span>
                </Label>
                <Alert className="mb-2">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Liste os objetivos específicos que os alunos alcançarão ao concluir o curso.
                  </AlertDescription>
                </Alert>
                <Textarea
                  id="input-objectives"
                  name="objectives"
                  placeholder="Ex: Ao final deste curso, o aluno será capaz de..."
                  value={formData.objectives}
                  onChange={handleChange}
                  rows={4}
                  required
                  maxLength={MAX_OBJECTIVES_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-syllabus">
                  Ementa/Conteúdo programático *
                </Label>
                <Textarea
                  id="input-syllabus"
                  name="syllabus"
                  placeholder="Descreva os tópicos que serão abordados no curso..."
                  value={formData.syllabus}
                  onChange={handleChange}
                  rows={8}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="requisitos" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-requirements">
                  Requisitos *
                  <span className="text-sm text-muted-foreground ml-2">
                    ({formData.requirements.length}/{MAX_REQUIREMENTS_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="input-requirements"
                  name="requirements"
                  placeholder="Liste os conhecimentos prévios, softwares ou equipamentos necessários..."
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={6}
                  required
                  maxLength={MAX_REQUIREMENTS_LENGTH}
                />
              </div>
            </TabsContent>

            <TabsContent value="configuracoes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-status">Status do curso</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleSelectChange("status")}
                >
                  <SelectTrigger id="select-status">
                    <SelectValue placeholder="Selecione o status do curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Revisão</AlertTitle>
                <AlertDescription>
                  Revise todas as informações antes de finalizar. Após a criação, o curso poderá ser editado no painel administrativo.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevTab} disabled={activeTab === "sobre"}>
          Voltar
        </Button>

        {activeTab === "configuracoes" ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar curso"}
          </Button>
        ) : (
          <Button onClick={nextTab}>
            Próximo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCreationForm;