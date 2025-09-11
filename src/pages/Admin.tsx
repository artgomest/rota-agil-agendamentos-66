import { useState } from "react";
import { Settings, Users, User, BarChart, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Coletor } from "@/types/firestore";

// Mantendo as outras abas como placeholders por enquanto
const PacientesTab = () => <Card><CardHeader><CardTitle>Gestão de Pacientes</CardTitle></CardHeader><CardContent><p>Funcionalidade a ser implementada.</p></CardContent></Card>;
const ConfiguracoesTab = () => <Card><CardHeader><CardTitle>Configurações do Sistema</CardTitle></CardHeader><CardContent><p>Funcionalidade a ser implementada.</p></CardContent></Card>;
const RelatoriosTab = () => <Card><CardHeader><CardTitle>Relatórios</CardTitle></CardHeader><CardContent><p>Funcionalidade a ser implementada.</p></CardContent></Card>;


const Admin = () => {
  const [colhedoresSnapshot, loadingColhedores, errorColhedores] = useCollection(collection(db, "coletores"));
  const colhedores = colhedoresSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coletor)) || [];

  const [novoColhedor, setNovoColhedor] = useState({ nome: "", calendarId: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const adicionarColhedor = async () => {
    if (novoColhedor.nome && novoColhedor.calendarId) {
      await addDoc(collection(db, "coletores"), {
        ...novoColhedor,
        ativo: true,
        createdAt: serverTimestamp()
      });
      setNovoColhedor({ nome: "", calendarId: "" });
      setIsDialogOpen(false);
    }
  };

  const toggleColhedor = async (id: string, ativo: boolean) => {
    const colhedorDoc = doc(db, "coletores", id);
    await updateDoc(colhedorDoc, { ativo: !ativo });
  };

  const removerColhedor = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este colhedor?")) {
      const colhedorDoc = doc(db, "coletores", id);
      await deleteDoc(colhedorDoc);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
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
        <Tabs defaultValue="colhedores" className="space-y-6">
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

          <TabsContent value="pacientes"><PacientesTab /></TabsContent>

          <TabsContent value="colhedores">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-wine">
                    <User className="h-5 w-5" />
                    Gestão de Colhedores ({colhedores.length})
                  </CardTitle>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-wine hover:bg-wine-dark" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Colhedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Colhedor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="nomeColhedor">Nome do Colhedor</Label>
                          <Input
                            id="nomeColhedor"
                            value={novoColhedor.nome}
                            onChange={(e) => setNovoColhedor({...novoColhedor, nome: e.target.value})}
                            placeholder="Nome do colhedor"
                          />
                        </div>
                        <div>
                          <Label htmlFor="calendarId">ID do Google Calendar</Label>
                          <Input
                            id="calendarId"
                            value={novoColhedor.calendarId}
                            onChange={(e) => setNovoColhedor({...novoColhedor, calendarId: e.target.value})}
                            placeholder="email@exemplo.com ou ID do calendário"
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
                {loadingColhedores && <p>Carregando colhedores...</p>}
                {errorColhedores && <p className="text-destructive">Erro ao carregar colhedores: {errorColhedores.message}</p>}
                {!loadingColhedores && (
                  <div className="space-y-3">
                    {colhedores.map((colhedor) => (
                      <Card key={colhedor.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h5 className="font-semibold">{colhedor.nome}</h5>
                            <p className="text-sm text-muted-foreground">{colhedor.calendarId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={colhedor.ativo ? 'bg-success' : 'bg-muted text-muted-foreground'}>
                              {colhedor.ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleColhedor(colhedor.id!, colhedor.ativo)}
                            >
                              {colhedor.ativo ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removerColhedor(colhedor.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes"><ConfiguracoesTab /></TabsContent>
          <TabsContent value="relatorios"><RelatoriosTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;