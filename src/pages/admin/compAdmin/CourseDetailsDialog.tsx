import { 
    Paintbrush, 
    BookOpen, 
    MapPin, 
    Calendar, 
    Loader2,
    Clock,
    DollarSign,
    X,
    School,
    FileText,
    Users,
    Award,
    Bookmark,
    BarChart2,
    Layers
  } from "lucide-react";
  import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "../../../components/ui/dialog";
  import { Button } from "../../../components/ui/button";
  import { 
    Card, 
    CardContent, 
    CardDescription,  
    CardHeader, 
    CardTitle 
  } from "../../../components/ui/card";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "../../../components/ui/tabs";
  
  interface Course {
    id: number;
    title: string;
    description: string;
    duration: string;
    objectives: string;
    requirements: string;
    syllabus: string;
    modality: string;
    level: string;
    category_id: string;
    institution_id: string;
    price: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    institution?: {
      name: string;
    };
    category?: {
      name: string;
    };
  }
  
  function CourseDetailsDialog({
    open,
    onOpenChange,
    selectedCourse,
    loadingDetails,
    detailsError,
    handleEdit
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCourse: Course | null;
    loadingDetails: boolean;
    detailsError: string | null;
    handleEdit: (id: number) => void;
  }) {
    const formatDate = (dateString?: string) => {
      if (!dateString) return "Não disponível";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (e) {
        return "Data inválida";
      }
    };
  
    const getStatusColor = (status: string) => {
      switch(status.toLowerCase()) {
        case 'ativo':
        case 'aberto':
          return 'bg-emerald-100 text-emerald-800';
        case 'pendente':
          return 'bg-amber-100 text-amber-800';
        case 'encerrado':
        case 'fechado':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    const getModalityIcon = (modality: string) => {
      switch(modality.toLowerCase()) {
        case 'online':
          return <School className="h-4 w-4" />;
        case 'presencial':
          return <MapPin className="h-4 w-4" />;
        case 'híbrido':
          return <Layers className="h-4 w-4" />;
        default:
          return <BookOpen className="h-4 w-4" />;
      }
    };
  
    const getLevelBadge = (level: string) => {
      switch(level.toLowerCase()) {
        case 'iniciante':
          return 'bg-blue-100 text-blue-800';
        case 'intermediário':
          return 'bg-purple-100 text-purple-800';
        case 'avançado':
          return 'bg-indigo-100 text-indigo-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-lg bg-white border shadow-lg" onInteractOutside={(e) => e.preventDefault()}>
          {loadingDetails ? (
            <div className="flex flex-col justify-center items-center py-16 px-6">
              <Loader2 className="h-10 w-10 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Carregando detalhes do C...</p>
            </div>
          ) : detailsError ? (
            <div className="p-6">
              <DialogHeader className="pb-4 border-b">
                <DialogTitle className="text-xl text-red-600 flex items-center">
                  <X className="mr-2 h-5 w-5" /> Erro ao carregar o curso
                </DialogTitle>
              </DialogHeader>
              <div className="bg-red-50 p-4 rounded-lg my-4">
                <p className="text-red-500 mb-4">{detailsError}</p>
                <h3 className="font-medium text-gray-800 mb-2">Possíveis soluções:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Verifique se o ID do curso existe no banco de dados</li>
                  <li>Confirme se o modelo Curso está retornando resultados corretamente</li>
                  <li>Verifique os logs do servidor para identificar erros específicos</li>
                </ul>
              </div>
              <DialogFooter>
                <Button 
                  onClick={() => onOpenChange(false)}
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          ) : selectedCourse ? (
            <>
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedCourse.title}
                    </DialogTitle>
                    <div className="flex mt-2 gap-2 items-center flex-wrap">
                      <div className={`${getStatusColor(selectedCourse.status)} px-3 py-1`}>
                        {selectedCourse.status}
                      </div>
                      <div className="bg-gray-100 text-gray-800 px-3 py-1 flex items-center">
                        {getModalityIcon(selectedCourse.modality)}
                        <span className="ml-1">{selectedCourse.modality}</span>
                      </div>
                      <div className={`${getLevelBadge(selectedCourse.level)} px-3 py-1`}>
                        {selectedCourse.level}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 inline mr-1" /> 
                        Criado em {formatDate(selectedCourse.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="detalhes" className="px-6">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                  <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                  <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="detalhes" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-purple-600" />
                          Descrição do Curso
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-line">{selectedCourse.description}</p>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                            Investimento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 font-medium">{selectedCourse.price || "Gratuito"}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-blue-500" />
                            Duração
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{selectedCourse.duration || "Não especificado"}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <School className="mr-2 h-5 w-5 text-indigo-600" />
                            Instituição
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{selectedCourse.institution?.name || "Não especificado"}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Bookmark className="mr-2 h-5 w-5 text-purple-600" />
                            Categoria
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{selectedCourse.category?.name || "Não especificado"}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="conteudo" className="mt-0">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Award className="mr-2 h-5 w-5 text-amber-600" />
                          Objetivos de Aprendizagem
                        </CardTitle>
                        <CardDescription>
                          O que os alunos serão capazes de fazer após completar o curso
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-line text-gray-700">
                          {selectedCourse.objectives}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart2 className="mr-2 h-5 w-5 text-green-600" />
                          Ementa/Conteúdo Programático
                        </CardTitle>
                        <CardDescription>
                          Tópicos e módulos que serão abordados no curso
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-line text-gray-700">
                          {selectedCourse.syllabus}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="requisitos" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-blue-600" />
                        Pré-requisitos
                      </CardTitle>
                      <CardDescription>
                        Conhecimentos ou habilidades necessárias para participar do curso
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-line text-gray-700">
                        {selectedCourse.requirements || "Nenhum pré-requisito específico"}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="p-6 border-t mt-6 bg-gray-50">
                <div className="w-full flex justify-end">
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                    >
                      Fechar
                    </Button>
                    <Button
                      onClick={() => handleEdit(selectedCourse.id)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Paintbrush className="mr-2 h-4 w-4" />
                      Editar Curso
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="flex flex-col items-center justify-center">
                <X className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Curso não encontrado</h3>
                <p className="text-gray-500 mb-6">Não foi possível encontrar os detalhes deste curso no sistema.</p>
                <Button 
                  onClick={() => onOpenChange(false)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  export default CourseDetailsDialog;