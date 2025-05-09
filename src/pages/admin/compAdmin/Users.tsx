import { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Loader2,
  ShieldCheck,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Link, Outlet } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  confimation_token: string | null
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/users")
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const isConfirmed = user.confimation_token === null;

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
            <CardTitle className="text-2xl">Gerenciamento de Usuários</CardTitle>
            <CardDescription>Administre os usuários da plataforma.</CardDescription>
          </div>
          <Link to="/admin/createuser">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              Novo Usuário
            </Button>
          </Link>
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
                  <SelectItem value="confirmed">Ativos</SelectItem>
                  <SelectItem value="unconfirmed">Inativos</SelectItem>
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
                    <TableHead>Função</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                              <ShieldCheck className="h-4 w-4" />
                              Administrador
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-sm font-semibold text-red-700">
                              <User className="h-4 w-4" />
                              Usuário
                            </span>
                          )}
                        </TableCell>

                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.confimation_token === null ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Status do email</p>
                              <p>{user.confimation_token ? "Não verificado" : "Verificado"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
  );
}
