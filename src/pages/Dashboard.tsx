import { useState, useEffect } from "react";
import { Search, Calendar, Clock, MapPin, Navigation, Route, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useOptimizedScheduling, { SlotViavel } from "@/hooks/useOptimizedScheduling";

interface Agendamento {
  id: string;
  enderecoColeta: string;
  colhedor: string;
  dataHora: string;
  coordenadas: { lat: number; lng: number };
  status: 'agendado' | 'realizado' | 'cancelado';
  tempoViagem?: number;
  distancia?: number;
}

const Dashboard = () => {
  const [enderecoBusca, setEnderecoBusca] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horariosOtimizados, setHorariosOtimizados] = useState<SlotViavel[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<string>("");
  const { buscarHorariosOtimizados, isLoading } = useOptimizedScheduling();

  // Mock data - simulando dados do Firebase
  useEffect(() => {
    setAgendamentos([
      {
        id: "1",
        enderecoColeta: "Rua das Flores, 123 - Centro, Belo Horizonte - MG",
        colhedor: "SHIRLEY",
        dataHora: "2024-08-29 08:00",
        coordenadas: { lat: -19.9245, lng: -43.9352 },
        status: "agendado",
        tempoViagem: 15,
        distancia: 8.2
      },
      {
        id: "2", 
        enderecoColeta: "Av. Brasil, 456 - Savassi, Belo Horizonte - MG",
        colhedor: "CARLOS",
        dataHora: "2024-08-29 14:30",
        coordenadas: { lat: -19.9396, lng: -43.9364 },
        status: "agendado",
        tempoViagem: 20,
        distancia: 12.5
      }
    ]);
  }, []);

  const buscarMelhoresHorarios = async () => {
    if (!enderecoBusca.trim()) return;
    
    setEnderecoSelecionado(enderecoBusca);
    
    try {
      const resultados = await buscarHorariosOtimizados(enderecoBusca);
      setHorariosOtimizados(resultados);
    } catch (error) {
      console.error("Erro ao buscar horários otimizados:", error);
      setHorariosOtimizados([]);
    }
  };

  const agendarColeta = (slot: SlotViavel) => {
    const novoAgendamento: Agendamento = {
      id: Date.now().toString(),
      enderecoColeta: enderecoSelecionado,
      colhedor: slot.colhedor,
      dataHora: slot.dataHora,
      coordenadas: { lat: -19.9245, lng: -43.9352 }, // Mock coordinates
      status: "agendado",
      tempoViagem: slot.tempoViagemTotal,
      distancia: slot.distanciaTotal
    };
    
    setAgendamentos([...agendamentos, novoAgendamento]);
    setHorariosOtimizados([]);
    setEnderecoBusca("");
    setEnderecoSelecionado("");
  };

  const getEfficiencyLevel = (index: number, scoreFinal: number) => {
    if (index === 0) return { label: "Ótimo", color: "bg-success text-success-foreground", icon: Target };
    if (scoreFinal <= 200) return { label: "Bom", color: "bg-warning text-warning-foreground", icon: Zap };
    return { label: "Aceitável", color: "bg-wine text-wine-foreground", icon: Navigation };
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-wine">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rota Ágil</h1>
              <p className="text-wine-light">Sistema de Agendamento de Coletas</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Laboratório Paula Castro
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Busca por Endereço */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-wine">
                <Navigation className="h-5 w-5" />
                Buscar Melhores Horários por Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o endereço da coleta..."
                  value={enderecoBusca}
                  onChange={(e) => setEnderecoBusca(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && buscarMelhoresHorarios()}
                />
                <Button 
                  onClick={buscarMelhoresHorarios}
                  disabled={isLoading || !enderecoBusca.trim()}
                  className="bg-wine hover:bg-wine-dark"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Horários Otimizados com 4 Etapas */}
              {horariosOtimizados.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-wine" />
                    <h4 className="font-semibold text-wine">
                      Horários Otimizados para: {enderecoSelecionado}
                    </h4>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-3 w-3 text-wine" />
                      <span className="font-medium">Algoritmo de 4 Etapas Aplicado:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span>✓ Geocodificação realizada</span>
                      <span>✓ Agendas mapeadas</span>  
                      <span>✓ Slots viáveis calculados</span>
                      <span>✓ Pontuação otimizada</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {horariosOtimizados.map((slot, index) => {
                      const efficiency = getEfficiencyLevel(index, slot.scoreFinal);
                      const IconComponent = efficiency.icon;
                      
                      return (
                        <Card key={slot.id} className={`p-4 hover:shadow-soft transition-all cursor-pointer border-l-4 ${
                          index === 0 ? 'border-l-success bg-success/5' :
                          index === 1 ? 'border-l-warning bg-warning/5' : 
                          'border-l-wine bg-wine/5'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge className={efficiency.color}>
                                  <IconComponent className="h-3 w-3 mr-1" />
                                  {efficiency.label}
                                </Badge>
                                
                                {index === 0 && (
                                  <Badge className="bg-success text-success-foreground">
                                    Melhor Opção
                                  </Badge>
                                )}
                                
                                <span className="text-xs text-muted-foreground">
                                  Score: {slot.scoreFinal}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-wine" />
                                <span className="font-medium">{slot.dataHora}</span>
                                <span className="text-muted-foreground">• {slot.colhedor}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Navigation className="h-3 w-3" />
                                  <span>Total: {slot.distanciaTotal.toFixed(1)}km</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Viagem: {slot.tempoViagemTotal}min</span>
                                </div>
                              </div>
                              
                              <details className="text-xs text-muted-foreground">
                                <summary className="cursor-pointer hover:text-wine">Ver detalhes da rota</summary>
                                <div className="mt-2 pl-4 border-l-2 border-muted space-y-1">
                                  <div>Antes → Paciente: {slot.detalhes.tempoAntesPaciente}min, {slot.detalhes.distanciaAntesPaciente.toFixed(1)}km</div>
                                  <div>Paciente → Depois: {slot.detalhes.tempoPacienteDepois}min, {slot.detalhes.distanciaPacienteDepois.toFixed(1)}km</div>
                                </div>
                              </details>
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={() => agendarColeta(slot)}
                              className="bg-wine hover:bg-wine-dark"
                            >
                              Agendar
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-wine border-t-transparent rounded-full mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-medium">Executando Algoritmo de 4 Etapas</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>🗺️ Geocodificando endereço...</div>
                      <div>📅 Mapeando compromissos dos colhedores...</div>
                      <div>⏰ Calculando janelas de oportunidade...</div>
                      <div>🎯 Otimizando pontuação final...</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agendamentos do Dia */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-wine">
                <Calendar className="h-5 w-5" />
                Agendamentos de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.id} className="p-4 border-l-4 border-l-wine">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-wine" />
                          <span className="font-medium">{agendamento.dataHora}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {agendamento.enderecoColeta}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {agendamento.colhedor}
                          </Badge>
                          
                          {agendamento.tempoViagem && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Navigation className="h-3 w-3" />
                                {agendamento.distancia}km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {agendamento.tempoViagem}min
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          agendamento.status === 'agendado' ? 'bg-wine text-white' :
                          agendamento.status === 'realizado' ? 'bg-success text-white' :
                          'bg-destructive text-white'
                        }`}
                      >
                        {agendamento.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
                
                {agendamentos.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum agendamento para hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;