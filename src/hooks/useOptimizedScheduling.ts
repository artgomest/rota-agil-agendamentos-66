import { useState } from "react";

// Tipos para o sistema de agendamento otimizado
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CalendarSlot {
  colhedor: string;
  inicio: Date;
  fim: Date;
  enderecoAntes?: string;
  coordenadasAntes?: Coordinates;
  enderecoDepois?: string;
  coordenadasDepois?: Coordinates;
}

export interface SlotViavel {
  id: string;
  colhedor: string;
  dataHora: string;
  inicio: Date;
  fim: Date;
  tempoViagemTotal: number;
  distanciaTotal: number;
  scoreFinal: number;
  detalhes: {
    tempoAntesPaciente: number;
    tempoPacienteDepois: number;
    distanciaAntesPaciente: number;
    distanciaPacienteDepois: number;
  };
}

export interface PesosConfig {
  data: number;
  tempoViagem: number;
  distancia: number;
}

const useOptimizedScheduling = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Configurações dos pesos (normalmente viriam do Firestore)
  const pesos: PesosConfig = {
    data: 10, // Peso para penalizar datas futuras
    tempoViagem: 15, // Peso para tempo de viagem
    distancia: 8 // Peso para distância
  };

  // Etapa 1: Geocodificar endereço do paciente
  const geocodificarEndereco = async (endereco: string): Promise<Coordinates> => {
    // Simulação da API do Google Geocoding
    // Em produção: usar Google Geocoding API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Coordenadas simuladas para Belo Horizonte
    const baseCoords = { lat: -19.9245, lng: -43.9352 };
    const randomOffset = () => (Math.random() - 0.5) * 0.1;
    
    return {
      lat: baseCoords.lat + randomOffset(),
      lng: baseCoords.lng + randomOffset()
    };
  };

  // Etapa 1: Mapear compromissos dos colhedores
  const mapearCompromissos = async (): Promise<CalendarSlot[]> => {
    // Simulação da Google Calendar API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const hoje = new Date();
    const compromissos: CalendarSlot[] = [];

    // Simular compromissos para os próximos 7 dias
    for (let dia = 0; dia < 7; dia++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + dia);
      
      // SHIRLEY - compromissos simulados
      compromissos.push({
        colhedor: "SHIRLEY",
        inicio: new Date(data.getFullYear(), data.getMonth(), data.getDate(), 8, 0),
        fim: new Date(data.getFullYear(), data.getMonth(), data.getDate(), 8, 30),
        enderecoAntes: "Laboratório - Av. Pasteur, 106",
        coordenadasAntes: { lat: -19.9245, lng: -43.9352 },
        enderecoDepois: "Rua A, 100 - Centro",
        coordenadasDepois: { lat: -19.9200, lng: -43.9300 }
      });
      
      compromissos.push({
        colhedor: "SHIRLEY", 
        inicio: new Date(data.getFullYear(), data.getMonth(), data.getDate(), 14, 0),
        fim: new Date(data.getFullYear(), data.getMonth(), data.getDate(), 14, 30),
        enderecoAntes: "Rua B, 200 - Savassi",
        coordenadasAntes: { lat: -19.9396, lng: -43.9364 },
        enderecoDepois: "Laboratório - Av. Pasteur, 106",
        coordenadasDepois: { lat: -19.9245, lng: -43.9352 }
      });

      // CARLOS - compromissos simulados
      compromissos.push({
        colhedor: "CARLOS",
        inicio: new Date(data.getFullYear(), data.getMonth(), data.getDate(), 9, 30),
        fim: new Date(data.getFullYear(), data.getMonth(), data.getDate(), 10, 0),
        enderecoAntes: "Laboratório - Av. Pasteur, 106", 
        coordenadasAntes: { lat: -19.9245, lng: -43.9352 },
        enderecoDepois: "Av. Brasil, 500 - Centro",
        coordenadasDepois: { lat: -19.9180, lng: -43.9280 }
      });
    }

    return compromissos;
  };

  // Etapa 2: Encontrar janelas de oportunidade (slots vagos)
  const encontrarSlotsVagos = (compromissos: CalendarSlot[]): CalendarSlot[] => {
    const slotsVagos: CalendarSlot[] = [];
    const colhedores = ["SHIRLEY", "CARLOS"];
    
    colhedores.forEach(colhedor => {
      const compromissosColhedor = compromissos
        .filter(c => c.colhedor === colhedor)
        .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

      for (let i = 0; i < compromissosColhedor.length - 1; i++) {
        const atual = compromissosColhedor[i];
        const proximo = compromissosColhedor[i + 1];
        
        // Verificar se há tempo suficiente entre compromissos (mín. 90 minutos)
        const diferencaTempo = proximo.inicio.getTime() - atual.fim.getTime();
        const minutosDisponiveis = diferencaTempo / (1000 * 60);
        
        if (minutosDisponiveis >= 90) {
          slotsVagos.push({
            colhedor,
            inicio: new Date(atual.fim.getTime() + 15 * 60 * 1000), // 15min buffer
            fim: new Date(proximo.inicio.getTime() - 15 * 60 * 1000), // 15min buffer
            enderecoAntes: atual.enderecoDepois,
            coordenadasAntes: atual.coordenadasDepois,
            enderecoDepois: proximo.enderecoAntes,
            coordenadasDepois: proximo.coordenadasAntes
          });
        }
      }
    });

    return slotsVagos;
  };

  // Etapa 3: Calcular tempo e distância usando Distance Matrix API
  const calcularTempoDistancia = async (
    origem: Coordinates,
    destino: Coordinates
  ): Promise<{ tempo: number; distancia: number }> => {
    // Simulação da Google Distance Matrix API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Fórmula de distância euclidiana simplificada + fatores de trânsito
    const deltaLat = Math.abs(origem.lat - destino.lat);
    const deltaLng = Math.abs(origem.lng - destino.lng);
    const distanciaKm = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) * 111; // aprox km por grau
    
    // Tempo considerando trânsito (simulado)
    const velocidadeMedia = 25; // km/h na cidade
    const tempoMinutos = Math.round((distanciaKm / velocidadeMedia) * 60);
    
    return {
      tempo: Math.max(5, tempoMinutos), // mínimo 5 minutos
      distancia: Math.round(distanciaKm * 10) / 10 // arredondado 1 casa decimal
    };
  };

  // Etapa 3: Teste de viabilidade de cada slot
  const testarViabilidade = async (
    slots: CalendarSlot[],
    coordenadasPaciente: Coordinates
  ): Promise<SlotViavel[]> => {
    const slotsViaveis: SlotViavel[] = [];
    
    for (const slot of slots) {
      if (!slot.coordenadasAntes || !slot.coordenadasDepois) continue;
      
      // Calcular tempos de viagem
      const [viagemAntesPaciente, viagemPacienteDepois] = await Promise.all([
        calcularTempoDistancia(slot.coordenadasAntes, coordenadasPaciente),
        calcularTempoDistancia(coordenadasPaciente, slot.coordenadasDepois)
      ]);
      
      const duracaoColeta = 30; // minutos
      const tempoTotalNecessario = viagemAntesPaciente.tempo + duracaoColeta + viagemPacienteDepois.tempo;
      const tempoDisponivelSlot = (slot.fim.getTime() - slot.inicio.getTime()) / (1000 * 60);
      
      // Verificar se é viável
      if (tempoTotalNecessario <= tempoDisponivelSlot) {
        // Calcular horário ideal de início
        const inicioIdeal = new Date(slot.inicio.getTime() + viagemAntesPaciente.tempo * 60 * 1000);
        
        slotsViaveis.push({
          id: `${slot.colhedor}-${slot.inicio.getTime()}`,
          colhedor: slot.colhedor,
          dataHora: inicioIdeal.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          inicio: inicioIdeal,
          fim: new Date(inicioIdeal.getTime() + duracaoColeta * 60 * 1000),
          tempoViagemTotal: viagemAntesPaciente.tempo + viagemPacienteDepois.tempo,
          distanciaTotal: viagemAntesPaciente.distancia + viagemPacienteDepois.distancia,
          scoreFinal: 0, // Será calculado na etapa 4
          detalhes: {
            tempoAntesPaciente: viagemAntesPaciente.tempo,
            tempoPacienteDepois: viagemPacienteDepois.tempo,
            distanciaAntesPaciente: viagemAntesPaciente.distancia,
            distanciaPacienteDepois: viagemPacienteDepois.distancia
          }
        });
      }
    }
    
    return slotsViaveis;
  };

  // Etapa 4: Calcular pontuação e classificar
  const calcularPontuacaoFinal = (slots: SlotViavel[]): SlotViavel[] => {
    const hoje = new Date();
    
    return slots.map(slot => {
      // Peso da data - penaliza agendamentos no futuro
      const diasNoFuturo = Math.ceil((slot.inicio.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      const custoDias = diasNoFuturo * pesos.data;
      
      // Peso do tempo de viagem
      const custoTempo = slot.tempoViagemTotal * pesos.tempoViagem;
      
      // Peso da distância
      const custoDistancia = slot.distanciaTotal * pesos.distancia;
      
      // Score final (menor é melhor)
      const scoreFinal = custoDias + custoTempo + custoDistancia;
      
      return {
        ...slot,
        scoreFinal: Math.round(scoreFinal)
      };
    }).sort((a, b) => a.scoreFinal - b.scoreFinal);
  };

  // Função principal que executa todas as 4 etapas
  const buscarHorariosOtimizados = async (endereco: string): Promise<SlotViavel[]> => {
    setIsLoading(true);
    
    try {
      // Etapa 1: Preparação do Cenário
      const [coordenadasPaciente, compromissos] = await Promise.all([
        geocodificarEndereco(endereco),
        mapearCompromissos()
      ]);
      
      // Etapa 2: Encontrar Janelas de Oportunidade
      const slotsVagos = encontrarSlotsVagos(compromissos);
      
      // Etapa 3: Teste de Viabilidade  
      const slotsViaveis = await testarViabilidade(slotsVagos, coordenadasPaciente);
      
      // Etapa 4: Pontuação e Classificação
      const slotsClassificados = calcularPontuacaoFinal(slotsViaveis);
      
      return slotsClassificados.slice(0, 6); // Retornar top 6 opções
      
    } catch (error) {
      console.error("Erro no processo de otimização:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    buscarHorariosOtimizados,
    isLoading
  };
};

export default useOptimizedScheduling;