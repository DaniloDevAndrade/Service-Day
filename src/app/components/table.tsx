'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CarFront, LogIn, LogOut, MoreVertical, Pencil, RefreshCcw, Search, Trash2, UserCheck, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormAdd from "./FormAdd";
import FormSearch from "./FormSearch";
import { fetchMovimentos } from "../api/fetchMovimentos";
import { MovimentoCompleto, MovimentoComRelacionados } from "@/lib/types";
import { Movimentos, Pessoas, Veiculos } from "@/generated/prisma";
import FormEdit from "./FormEdit";
import FormMovimentacao from "./FormMovimentacao";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FormEditMovimentacao from "./FormEditMovimentacao";
import deleteMovimento from "../api/deleteMovimentacao";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Props {
  initialMovimentos?: MovimentoComRelacionados[];
}

type PessoaComVeiculos = Pessoas & {
  veiculos: {
    id: string;
    placa: string;
    modelo: string;
    cartao: string;
  }[];
};


const patenteLabelMap: Record<string, string> = {
    Coronel: "Coronel",
    TenenteCoronel: "Tenente-Coronel",
    Major: "Major",
    Capitao: "Capitão",
    PrimeiroTenente: "1º Tenente",
    SegundoTenente: "2º Tenente",
    Aspirante: "Aspirante a Oficial",
    AlunoOficial: "Aluno Oficial",
    SubTenente: "Subtenente",
    PrimeiroSargento: "1º Sargento",
    SegundoSargento: "2º Sargento",
    TerceiroSargento: "3º Sargento",
    AlunoSargento: "Aluno Sargento",
    Cabo: "Cabo",
    Soldado: "Soldado",
    Civil: "Civil",
    Outros: "Outros"
  };

export default function TableInit({ initialMovimentos = [] }: Props){
    const [openAdd, setOpenAdd] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState("todos")
    const [filtroCategoria, setFiltroCategoria] = useState("todos")
    const [busca, setBusca] = useState("")
    const [movimentos, setMovimentos] = useState<MovimentoComRelacionados[]>(initialMovimentos)
    const [openEdit, setOpenEdit] = useState(false);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaComVeiculos | null>(null);
    const [openMovimentacao, setOpenMovimentacao] = useState(false);
    const [pessoaParaMovimentacao, setPessoaParaMovimentacao] = useState<PessoaComVeiculos | null>(null);
    const [openEditMovimentacao, setOpenEditMovimentacao] = useState(false);
    const [movimentoSelecionado, setMovimentoSelecionado] = useState<MovimentoCompleto | null>(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [movimentoIdParaExcluir, setMovimentoIdParaExcluir] = useState<string | null>(null);


    const registrosFiltrados = movimentos.filter((movimento) => {
      const matchTipo = filtroTipo === "todos" || movimento.tipo === filtroTipo
      const matchCategoria = filtroCategoria === "todos" || movimento.categoria === filtroCategoria
      const matchBusca =
        busca === "" ||
        movimento.pessoa.nome.toLowerCase().includes(busca.toLowerCase()) ||
        movimento.pessoa.documento.includes(busca) ||
        movimento.veiculo?.placa.includes(busca.toUpperCase())

    return matchTipo && matchCategoria && matchBusca
  })

    const fetchData = async () =>{
      const res = await fetchMovimentos()

      if(res.success){
        setMovimentos(res.movimentos ?? [])
      }
    }

    const handleExcluirMovimento = async () => {
      if (!movimentoIdParaExcluir) return;

      const res = await deleteMovimento(movimentoIdParaExcluir);

      if (res.success) {
        setOpenConfirmDelete(false);
        setMovimentoIdParaExcluir(null);
        fetchData();
      } else {
        alert("Erro ao excluir movimentação: " + res.message);
      }
    };

    return(
        <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Registros de Movimentação
              </div>
              <div className="flex flex-row gap-2">
                <FormAdd open={openAdd} setOpen={setOpenAdd}></FormAdd>
                <FormSearch
                  open={openSearch}
                  setOpen={setOpenSearch}
                  onNovaPessoaClick={() => {
                    setOpenSearch(false);
                    setOpenAdd(true);
                  }}
                  onEditarPessoaClick={(pessoa) => {
                    setPessoaSelecionada(pessoa);
                    setOpenSearch(false);
                    setOpenEdit(true);
                  }}
                  onSelecionarPessoaClick={(pessoa) => {
                    setPessoaParaMovimentacao(pessoa);
                    setOpenSearch(false);
                    setOpenMovimentacao(true);
                  }}
                />
                <Button onClick={fetchData}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Atualizar Lista
                </Button>
              </div>
                
            </CardTitle>
            <CardDescription>Controle de entrada e saída de pessoal e veículos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="registros" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="registros">Registros Recentes</TabsTrigger>
                {/* <TabsTrigger value="presentes">Presentes no Batalhão</TabsTrigger> */}
              </TabsList>

              <TabsContent value="registros" className="space-y-4">
                {/* Filtros e Busca */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, documento ou placa..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="Entrada">Entrada</SelectItem>
                      <SelectItem value="Saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas categorias</SelectItem>
                      <SelectItem value="Pessoa">Pessoa</SelectItem>
                      <SelectItem value="Veiculo">Veículo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela de Registros */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nome/Posto</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Documento/RE</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrosFiltrados.map((movimento) => (
                        <TableRow key={movimento.id}>
                          {/* Colunas anteriores permanecem as mesmas... */}
                          <TableCell>
                            <Badge
                              variant={movimento.tipo === "Entrada" ? "default" : "secondary"}
                              className={
                                movimento.tipo === "Entrada"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }
                            >
                              {movimento.tipo === "Entrada" ? (
                                <>
                                  <LogIn className="h-3 w-3 mr-1" /> Entrada
                                </>
                              ) : (
                                <>
                                  <LogOut className="h-3 w-3 mr-1" /> Saída
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {movimento.categoria === "Pessoa" ? (
                                <Users className="h-4 w-4 text-blue-500" />
                              ) : (
                                <CarFront className="h-4 w-4 text-green-500" />
                              )}
                              <div>
                                <div className="font-medium">{movimento.pessoa.nome}</div>
                                <div className="text-sm text-muted-foreground">
                                  {patenteLabelMap[movimento.pessoa.patente] ?? movimento.pessoa.patente}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{movimento.pessoa.unidade}</TableCell>
                          <TableCell className="font-mono text-sm">{movimento.pessoa.documento}</TableCell>
                          <TableCell>
                            {movimento.veiculo ? (
                              <div>
                                <div className="font-medium">{movimento.veiculo.placa}</div>
                                <div className="text-sm text-muted-foreground">
                                  {movimento.veiculo.tipo} - {movimento.veiculo.modelo}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {movimento.datahora.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {movimento.datahora.toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setMovimentoSelecionado(movimento);
                                    setOpenEditMovimentacao(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setMovimentoIdParaExcluir(movimento.id);
                                    setOpenConfirmDelete(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-x4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex flex-row items-center justify-center text-center py-8 gap-3">    
                    <Button>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Gerar Relatório de Pessoas
                    </Button>
                    <Button>
                      <Car className="h-4 w-4 mr-2" />
                      Gerar Relatório de Veiculos
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* <TabsContent value="presentes" className="space-y-4">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Lista de Presentes</h3>
                  <p className="text-muted-foreground mb-4">
                    Visualize todos os militares e veículos atualmente no batalhão
                  </p>
                  <Button>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Gerar Relatório de Presentes
                  </Button>
                </div>
              </TabsContent> */}
            </Tabs>
          </CardContent>
        </Card>
        <FormEdit
          open={openEdit}
          setOpen={setOpenEdit}
          pessoa={pessoaSelecionada}
        />
        <FormMovimentacao
          open={openMovimentacao}
          setOpen={setOpenMovimentacao}
          pessoa={pessoaParaMovimentacao}
          atualizarLista={fetchData}
        />
        <FormEditMovimentacao
          open={openEditMovimentacao}
          setOpen={setOpenEditMovimentacao}
          movimento={movimentoSelecionado}
          atualizarLista={fetchData}
        />

        <AlertDialog open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta movimentação? Esta ação não poderá ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleExcluirMovimento} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
}