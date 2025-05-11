import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Loader2,
  User
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Outlet } from "react-router-dom";


interface User {
  id: number;
  user: string;
  email: string;
  course: string;
  data_aplicacao: string;
  status: string;
}


const UsersApplied = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://carangonde-back-production.up.railway.app/api/apply_opportunities")
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const isConfirmed = user.status === "Cadastrado";

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "confirmed" && isConfirmed) ||
      (filterStatus === "unconfirmed" && !isConfirmed);

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6">
  <Card>
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle className="text-2xl">Gerenciamento de Inscritos</CardTitle>
        <CardDescription>Lista de usuários aplicados às oportunidades.</CardDescription>
      </div>
      <Outlet />
    </CardHeader>

    <CardContent>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="confirmed">Cadastrados</SelectItem>
              <SelectItem value="unconfirmed">Não cadastrados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 text-yellow-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando usuários...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Data de Aplicação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.user}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.course}</TableCell>
                    <TableCell>{formatDate(user.data_aplicacao)}</TableCell>
                    <TableCell>
                      {user.status === "Cadastrado" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Cadastrado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-sm font-semibold text-red-700">
                          <XCircle className="h-4 w-4" />
                          Pendente
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
</div>

  )
}

export default UsersApplied