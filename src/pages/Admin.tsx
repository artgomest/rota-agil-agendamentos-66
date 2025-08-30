import { useState, useEffect } from "react";
import { Settings, Users, Calendar, BarChart, MapPin, Clock, User, Phone, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Paciente {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  cpf: string;
}

interface Colhedor {
  nome: string;
  calendarId: string;
  ativo: boolean;
}

interface Configuracao {
  diasDeBusca: number;
  enderecoLaboratorio: string;
  pesos: {
    data: number;
    tempoViagem: number;
    distancia: number;
  };
}

const Admin = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [colhedores, setColhedores] = useState<Colhedor[]>([]);
  const [configuracao, setConfiguracao] = useState<Configuracao>({
    diasDeBusca: 7,
    enderecoLaboratorio: "Av. Pasteur, 106 - Santa Efigênia, Belo Horizonte - MG",
    pesos: {
      data: 1,
      tempoViagem: 1,
      distancia: 1
    }
  });

  const [novoPaciente, setNovoPaciente] = useState<Partial<Paciente>>({});
  const [novoColhedor, setNovoColhedor] = useState<Partial<Colhedor>>({});

  // Mock data
  useEffect(() => {
    setPacientes([
      {
        id: "1",
        nome: "Maria Silva Santos",
        endereco: "Rua das Flores, 123 - Centro, Belo Horizonte - MG",
        telefone: "(31) 99999-9999",
        cpf: "123.456.789-00"
      },
      {
        id: "2",
        nome: "João Costa Oliveira", 
        endereco: "Av. Brasil, 456 - Savassi, Belo Horizonte - MG",
        telefone: "(31) 88888-8888",
        cpf: "987.654.321-00"
      },
      {
        id: "3",
        nome: "Ana Carolina Silva",
        endereco: "Rua C, 789 - Funcionários, Belo Horizonte - MG",
        telefone: "(31) 77777-7777",
        cpf: "456.789.123-00"
      }
    ]);

    setColhedores([
      { nome: "SHIRLEY", calendarId: "shirley@laboratorio.com", ativo: true },
      { nome: "CARLOS", calendarId: "carlos@laboratorio.com", ativo: true }
    ]);
  }, []);

  const adicionarPaciente = () => {
    if (novoPaciente.nome && novoPaciente.endereco && novoPaciente.telefone && novoPaciente.cpf) {
      const paciente: Paciente = {
        id: Date.now().toString(),
        nome: novoPaciente.nome,
        endereco: novoPaciente.endereco,
        telefone: novoPaciente.telefone,
        cpf: novoPaciente.cpf
      };
      setPacientes([...pacientes, paciente]);
      setNovoPaciente({});
    }
  };

  const adicionarColhedor = () => {
    if (novoColhedor.nome && novoColhedor.calendarId) {
      const colhedor: Colhedor = {
        nome: novoColhedor.nome,
        calendarId: novoColhedor.calendarId,
        ativo: true
      };
      setColhedores([...colhedores, colhedor]);
      setNovoColhedor({});
    }
  };

  const removerPaciente = (id: string) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  const toggleColhedor = (nome: string) => {
    setColhedores(colhedores.map(c => 
      c.nome === nome ? { ...c, ativo: !c.ativo } : c
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-wine">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-wine-light">Gestão do Sistema Rota Ágil</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Administrador
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pacientes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pacientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="colhedores" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Colhedores
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Gestão de Pacientes */}
          <TabsContent value="pacientes">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-wine">
                    <Users className="h-5 w-5" />
                    Gestão de Pacientes ({pacientes.length})
                  </CardTitle>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-wine hover:bg-wine-dark">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Paciente
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Paciente</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input
                            id="nome"
                            value={novoPaciente.nome || ""}
                            onChange={(e) => setNovoPaciente({...novoPaciente, nome: e.target.value})}
                            placeholder="Nome completo do paciente"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endereco">Endereço Completo</Label>
                          <Input
                            id="endereco"
                            value={novoPaciente.endereco || ""}
                            onChange={(e) => setNovoPaciente({...novoPaciente, endereco: e.target.value})}
                            placeholder="Endereço completo com CEP"
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={novoPaciente.telefone || ""}
                            onChange={(e) => setNovoPaciente({...novoPaciente, telefone: e.target.value})}
                            placeholder="(31) 99999-9999"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            value={novoPaciente.cpf || ""}
                            onChange={(e) => setNovoPaciente({...novoPaciente, cpf: e.target.value})}
                            placeholder="000.000.000-00"
                          />
                        </div>
                        <Button onClick={adicionarPaciente} className="w-full bg-wine hover:bg-wine-dark">
                          Salvar Paciente
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pacientes.map((paciente) => (
                    <Card key={paciente.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h5 className="font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-wine" />
                            {paciente.nome}
                          </h5>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {paciente.endereco}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {paciente.telefone}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            CPF: {paciente.cpf}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removerPaciente(paciente.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestão de Colhedores */}
          <TabsContent value="colhedores">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-wine">
                    <User className="h-5 w-5" />
                    Colhedores ({colhedores.filter(c => c.ativo).length} ativos)
                  </CardTitle>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-wine hover:bg-wine-dark">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Colhedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Colhedor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nomeColhedor">Nome do Colhedor</Label>
                          <Input
                            id="nomeColhedor"
                            value={novoColhedor.nome || ""}
                            onChange={(e) => setNovoColhedor({...novoColhedor, nome: e.target.value})}
                            placeholder="Nome do colhedor"
                          />
                        </div>
                        <div>
                          <Label htmlFor="calendarId">ID do Google Calendar</Label>
                          <Input
                            id="calendarId"
                            value={novoColhedor.calendarId || ""}
                            onChange={(e) => setNovoColhedor({...novoColhedor, calendarId: e.target.value})}
                            placeholder="email@laboratorio.com"
                          />
                        </div>
                        <Button onClick={adicionarColhedor} className="w-full bg-wine hover:bg-wine-dark">
                          Salvar Colhedor
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {colhedores.map((colhedor) => (
                    <Card key={colhedor.nome} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h5 className="font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-wine" />
                            {colhedor.nome}
                          </h5>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {colhedor.calendarId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${colhedor.ativo ? 'bg-success' : 'bg-muted text-muted-foreground'}`}
                          >
                            {colhedor.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleColhedor(colhedor.nome)}
                          >
                            {colhedor.ativo ? 'Desativar' : 'Ativar'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="configuracoes">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wine">
                  <Settings className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="diasBusca">Dias de busca para agendamento</Label>
                      <Input
                        id="diasBusca"
                        type="number"
                        value={configuracao.diasDeBusca}
                        onChange={(e) => setConfiguracao({...configuracao, diasDeBusca: parseInt(e.target.value)})}
                        min="1"
                        max="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="enderecoLab">Endereço do Laboratório</Label>
                      <Input
                        id="enderecoLab"
                        value={configuracao.enderecoLaboratorio}
                        onChange={(e) => setConfiguracao({...configuracao, enderecoLaboratorio: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-wine">Pesos do Algoritmo</h4>
                    <div>
                      <Label htmlFor="pesoData">Peso da Data</Label>
                      <Input
                        id="pesoData"
                        type="number"
                        step="0.1"
                        value={configuracao.pesos.data}
                        onChange={(e) => setConfiguracao({
                          ...configuracao, 
                          pesos: {...configuracao.pesos, data: parseFloat(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pesoTempo">Peso do Tempo de Viagem</Label>
                      <Input
                        id="pesoTempo"
                        type="number"
                        step="0.1"
                        value={configuracao.pesos.tempoViagem}
                        onChange={(e) => setConfiguracao({
                          ...configuracao,
                          pesos: {...configuracao.pesos, tempoViagem: parseFloat(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pesoDistancia">Peso da Distância</Label>
                      <Input
                        id="pesoDistancia"
                        type="number"
                        step="0.1"
                        value={configuracao.pesos.distancia}
                        onChange={(e) => setConfiguracao({
                          ...configuracao,
                          pesos: {...configuracao.pesos, distancia: parseFloat(e.target.value)}
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="bg-wine hover:bg-wine-dark">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-wine">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Pacientes cadastrados:</span>
                      <Badge className="bg-wine">{pacientes.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Colhedores ativos:</span>
                      <Badge className="bg-success">{colhedores.filter(c => c.ativo).length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Agendamentos hoje:</span>
                      <Badge className="bg-warning text-warning-foreground">3</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-wine">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Coletas realizadas:</span>
                      <Badge className="bg-success">147</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de sucesso:</span>
                      <Badge className="bg-success">98.5%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo médio/rota:</span>
                      <Badge className="bg-wine">2h 30min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-wine">Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-success">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Última sincronização:</span>
                      <Badge variant="secondary">Agora</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Versão:</span>
                      <Badge variant="secondary">v1.0.0</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;