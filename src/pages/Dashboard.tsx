import { useState } from "react";
import { Search, Calendar, Clock, MapPin, Navigation, Route, Target, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import useOptimizedScheduling, { SlotViavel, Coordinates } from "@/hooks/useOptimizedScheduling";
import AgendamentoForm from "@/components/AgendamentoForm";
import { Agendamento, Paciente } from "@/types/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, addDoc, serverTimestamp, Timestamp, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Dashboard = () => {
  const [enderecoBusca, setEnderecoBusca] = useState("");
  const [horariosOtimizados, setHorariosOtimizados] = useState<SlotViavel[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<string>("");
  const [coordenadasSelecionadas, setCoordenadasSelecionadas] = useState<Coordinates | null>(null);
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotViavel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { buscarHorariosOtimizados, isLoading } = useOptimizedScheduling();

  const [agendamentos, loadingAgendamentos] = useCollectionData(
    query(collection(db, "agendamentos"))
  );

  const buscarMelhoresHorarios = async () => {
    if (!enderecoBusca.trim()) return;
    
    setError(null);
    setHorariosOtimizados([]);
    setEnderecoSelecionado(enderecoBusca);
    
    try {
      // O hook agora retorna coordenadas junto com os horários.
      // Esta parte precisa de um ajuste no hook, mas por agora vamos simular.
      const resultados = await buscarHorariosOtimizados(enderecoBusca);
      setHorariosOtimizados(resultados);
    } catch (err: any) {
      console.error("Erro ao buscar horários otimizados:", err);
      setError(err.message || "Não foi possível buscar horários. Verifique o endereço ou a configuração da API.");
    }
  };

  const agendarColeta = (slot: SlotViavel) => {
    setSelectedSlot(slot);
    setShowAgendamentoForm(true);
  };

  const confirmarAgendamento = async (dadosPaciente: Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedSlot || !enderecoSelecionado) return;

    try {
      // 1. Salvar o paciente
      const pacienteRef = await addDoc(collection(db, "pacientes"), {
        ...dadosPaciente,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Encontrar o ID do coletor pelo nome
      const coletoresQuery = query(collection(db, "coletores"), where("nome", "==", selectedSlot.colhedor), limit(1));
      const coletorSnapshot = await getDocs(coletoresQuery);
      if (coletorSnapshot.empty) {
        throw new Error(`Coletor "${selectedSlot.colhedor}" não encontrado no banco de dados.`);
      }
      const coletorId = coletorSnapshot.docs[0].id;

      // 3. Salvar o agendamento
      const novoAgendamento: Omit<Agendamento, 'id' | 'createdAt' | 'updatedAt'> = {
        pacienteId: pacienteRef.id,
        coletorId: coletorId,
        nomePaciente: dadosPaciente.nome,
        enderecoColeta: enderecoSelecionado,
        coordenadas: coordenadasSelecionadas || { lat: 0, lng: 0 }, // Idealmente, as coordenadas viriam da busca
        dataHora: Timestamp.fromDate(selectedSlot.inicio),
        status: "agendado",
        tempoViagem: selectedSlot.tempoViagemTotal,
        distancia: selectedSlot.distanciaTotal,
        taxa: dadosPaciente.taxa, // Assumindo que o form tem esses campos
        examesParticulares: dadosPaciente.examesParticulares,
      };

      await addDoc(collection(db, "agendamentos"), {
        ...novoAgendamento,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 4. Limpar o estado
      setHorariosOtimizados([]);
      setEnderecoBusca("");
      setEnderecoSelecionado("");
      setSelectedSlot(null);

    } catch (err) {
      console.error("Erro ao confirmar agendamento:", err);
      // Idealmente, mostrar um toast/alert para o usuário
    }
  };

  const getEfficiencyLevel = (index: number, scoreFinal: number) => {
    if (index === 0) return { label: "Ótimo", color: "bg-success text-success-foreground", icon: Target };
    if (scoreFinal <= 200) return { label: "Bom", color: "bg-warning text-warning-foreground", icon: Zap };
    return { label: "Aceitável", color: "bg-wine text-wine-foreground", icon: Navigation };
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-gradient-primary text-white shadow-wine">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rota Ágil</h1>
              <p className="text-wine-light">Dashboard de Agendamentos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-wine"><Navigation /> Buscar Melhores Horários</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o endereço da coleta..."
                  value={enderecoBusca}
                  onChange={(e) => setEnderecoBusca(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && buscarMelhoresHorarios()}
                />
                <Button onClick={buscarMelhoresHorarios} disabled={isLoading || !enderecoBusca.trim()} className="bg-wine hover:bg-wine-dark">
                  {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erro na Busca</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {horariosOtimizados.length > 0 && (
                <div className="space-y-3 pt-4">
                  {horariosOtimizados.map((slot, index) => {
                    const efficiency = getEfficiencyLevel(index, slot.scoreFinal);
                    const IconComponent = efficiency.icon;
                    return (
                      <Card key={slot.id} className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className={efficiency.color}><IconComponent className="h-3 w-3 mr-1" />{efficiency.label}</Badge>
                                    <span className="text-xs text-muted-foreground">Score: {slot.scoreFinal}</span>
                                </div>
                                <div className="flex items-center gap-2 font-medium"><Clock className="h-4 w-4 text-wine" />{slot.dataHora} <span className="text-muted-foreground">• {slot.colhedor}</span></div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Navigation className="h-3 w-3" />Total: {slot.distanciaTotal.toFixed(1)}km, {slot.tempoViagemTotal}min</div>
                            </div>
                            <Button size="sm" onClick={() => agendarColeta(slot)} className="bg-wine hover:bg-wine-dark">Agendar</Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
              
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-wine"><Calendar /> Agendamentos de Hoje</CardTitle></CardHeader>
            <CardContent>
              {loadingAgendamentos && <p>Carregando agendamentos...</p>}
              <div className="space-y-3">
                {agendamentos?.map((agendamento) => (
                  <Card key={agendamento.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{agendamento.nomePaciente}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />{agendamento.enderecoColeta}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />{new Date(agendamento.dataHora.seconds * 1000).toLocaleString('pt-BR')}</p>
                        <Badge variant="secondary" className="text-xs">{agendamento.coletorId}</Badge>
                      </div>
                      <Badge className={agendamento.status === 'agendado' ? 'bg-wine text-white' : 'bg-success'}>{agendamento.status}</Badge>
                    </div>
                  </Card>
                ))}
                {!loadingAgendamentos && agendamentos?.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum agendamento encontrado.</p>}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <AgendamentoForm
        open={showAgendamentoForm}
        onOpenChange={setShowAgendamentoForm}
        slot={selectedSlot}
        onConfirm={confirmarAgendamento}
      />
    </div>
  );
};

export default Dashboard;