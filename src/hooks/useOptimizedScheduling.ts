import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Coletor } from "@/types/firestore";
import { Loader } from "@googlemaps/js-api-loader";

// Tipos para o sistema de agendamento
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

  // Carrega a API do Google Maps uma vez
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geocoding", "routes"],
    });
    loader.load().then(setGoogleMaps).catch(console.error);
  }, []);


  // Etapa 1: Geocodificar endereço do paciente
  const geocodificarEndereco = async (endereco: string): Promise<Coordinates> => {
    if (!googleMaps) throw new Error("Google Maps API not loaded.");
    const geocoder = new googleMaps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: endereco }, (results: any, status: any) => {
        if (status === 'OK' && results) {
          resolve(results[0].geometry.location.toJSON());
        } else {
          reject(new Error(`Geocoding failed for address "${endereco}" with status: ${status}`));
        }
      });
    });
  };

  // Etapa 1.2: Mapear compromissos dos colhedores
  const mapearCompromissos = async (): Promise<CalendarSlot[]> => {
    // Buscar coletores ativos do Firestore
    const coletoresQuery = query(collection(db, "coletores"), where("ativo", "==", true));
    const querySnapshot = await getDocs(coletoresQuery);
    const coletores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coletor));

    const hoje = new Date();
    const timeMin = hoje.toISOString();
    const timeMax = new Date(new Date().setDate(hoje.getDate() + 7)).toISOString(); // Buscar por 7 dias

    const promises = coletores.map(async (colhedor) => {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(colhedor.calendarId)}/events?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
      const response = await fetch(url);
      const calendarData = await response.json();
      
      if (calendarData.error) {
        console.error(`Erro ao buscar agenda de ${colhedor.nome}:`, calendarData.error.message);
        return [];
      }
      if (!calendarData.items) return [];

      return calendarData.items.map((event: any) => ({
        colhedor: colhedor.nome,
        inicio: new Date(event.start.dateTime || event.start.date),
        fim: new Date(event.end.dateTime || event.end.date),
        coordenadasAntes: { lat: -19.9245, lng: -43.9352 }, // Mock
        coordenadasDepois: { lat: -19.9245, lng: -43.9352 }, // Mock
      }));
    });

    const todosOsCompromissos = await Promise.all(promises);
    return todosOsCompromissos.flat();
  };

  // Etapa 2: Encontrar janelas de oportunidade (slots vagos)
  const encontrarSlotsVagos = (compromissos: CalendarSlot[]): CalendarSlot[] => {
    const slotsVagos: CalendarSlot[] = [];
    const colhedoresUnicos = [...new Set(compromissos.map(c => c.colhedor))];
    
    colhedoresUnicos.forEach(colhedor => {
      const compromissosColhedor = compromissos
        .filter(c => c.colhedor === colhedor)
        .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

      for (let i = 0; i < compromissosColhedor.length - 1; i++) {
        const atual = compromissosColhedor[i];
        const proximo = compromissosColhedor[i + 1];
        
        const diferencaTempo = (proximo.inicio.getTime() - atual.fim.getTime()) / (1000 * 60);
        
        if (diferencaTempo >= 90) {
          slotsVagos.push({
            colhedor,
            inicio: new Date(atual.fim.getTime() + 15 * 60 * 1000),
            fim: new Date(proximo.inicio.getTime() - 15 * 60 * 1000),
            coordenadasAntes: atual.coordenadasDepois,
            coordenadasDepois: proximo.coordenadasAntes,
          });
        }
      }
    });
    return slotsVagos;
  };

  // Etapa 3: Calcular tempo e distância usando Distance Matrix API
  const calcularTempoDistancia = async (origem: Coordinates, destino: Coordinates): Promise<{ tempo: number; distancia: number }> => {
    if (!googleMaps) throw new Error("Google Maps API not loaded.");
    const service = new googleMaps.DistanceMatrixService();

    const request = {
      origins: [new googleMaps.LatLng(origem.lat, origem.lng)],
      destinations: [new googleMaps.LatLng(destino.lat, destino.lng)],
      travelMode: googleMaps.TravelMode.DRIVING,
    };

    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(request, (response: any, status: any) => {
        if (status === 'OK' && response) {
          const element = response.rows[0].elements[0];
          if (element.status === "OK") {
            const tempo = Math.round(element.duration.value / 60);
            const distancia = element.distance.value / 1000;
            resolve({ tempo, distancia });
          } else {
            reject(new Error(`Distance Matrix element status: ${element.status}`));
          }
        } else {
          reject(new Error(`Distance Matrix request failed with status: ${status}`));
        }
      });
    });
  };

  // Etapa 3.2: Teste de viabilidade de cada slot
  const testarViabilidade = async (slots: CalendarSlot[], coordenadasPaciente: Coordinates): Promise<SlotViavel[]> => {
    const slotsViaveis: SlotViavel[] = [];
    for (const slot of slots) {
      if (!slot.coordenadasAntes || !slot.coordenadasDepois) continue;
      
      try {
        const [viagemAntes, viagemDepois] = await Promise.all([
          calcularTempoDistancia(slot.coordenadasAntes, coordenadasPaciente),
          calcularTempoDistancia(coordenadasPaciente, slot.coordenadasDepois)
        ]);
        
        const duracaoColeta = 30;
        const tempoTotalNecessario = viagemAntes.tempo + duracaoColeta + viagemDepois.tempo;
        const tempoDisponivelSlot = (slot.fim.getTime() - slot.inicio.getTime()) / (1000 * 60);

        if (tempoTotalNecessario <= tempoDisponivelSlot) {
          const inicioIdeal = new Date(slot.inicio.getTime() + viagemAntes.tempo * 60 * 1000);
          slotsViaveis.push({
            id: `${slot.colhedor}-${slot.inicio.getTime()}`,
            colhedor: slot.colhedor,
            dataHora: inicioIdeal.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
            inicio: inicioIdeal,
            fim: new Date(inicioIdeal.getTime() + duracaoColeta * 60 * 1000),
            tempoViagemTotal: viagemAntes.tempo + viagemDepois.tempo,
            distanciaTotal: viagemAntes.distancia,
            scoreFinal: 0,
            detalhes: {
              tempoAntesPaciente: viagemAntes.tempo,
              tempoPacienteDepois: viagemDepois.tempo,
              distanciaAntesPaciente: viagemAntes.distancia,
              distanciaPacienteDepois: viagemDepois.distancia,
            }
          });
        }
      } catch (error) {
        console.warn(`Could not test viability for a slot due to API error:`, error);
      }
    }
    return slotsViaveis;
  };

  // Etapa 4: Calcular pontuação e classificar
  const calcularPontuacaoFinal = (slots: SlotViavel[], pesos: PesosConfig): SlotViavel[] => {
    const hoje = new Date();
    return slots.map(slot => {
      const diasNoFuturo = Math.ceil((slot.inicio.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      const custoDias = diasNoFuturo * pesos.data;
      const custoTempo = slot.tempoViagemTotal * pesos.tempoViagem;
      const custoDistancia = slot.distanciaTotal * pesos.distancia;
      const scoreFinal = custoDias + custoTempo + custoDistancia;
      return { ...slot, scoreFinal: Math.round(scoreFinal) };
    }).sort((a, b) => a.scoreFinal - b.scoreFinal);
  };

  // Função principal que executa todas as etapas
  const buscarHorariosOtimizados = async (endereco: string): Promise<SlotViavel[]> => {
    if (!googleMaps) {
      throw new Error("A API do Google Maps ainda não foi carregada. Tente novamente em alguns segundos.");
    }
    setIsLoading(true);
    try {
      const configDoc = await getDoc(doc(db, "configuracoes", "default"));
      const pesos = configDoc.exists() ? configDoc.data().pesos as PesosConfig : { data: 10, tempoViagem: 15, distancia: 8 };

      const [coordenadasPaciente, compromissos] = await Promise.all([
        geocodificarEndereco(endereco),
        mapearCompromissos()
      ]);
      
      const slotsVagos = encontrarSlotsVagos(compromissos);
      const slotsViaveis = await testarViabilidade(slotsVagos, coordenadasPaciente);
      const slotsClassificados = calcularPontuacaoFinal(slotsViaveis, pesos);
      
      return slotsClassificados.slice(0, 6);
      
    } catch (error) {
      console.error("Erro no processo de otimização:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Ocorreu um erro desconhecido durante a otimização.");
    } finally {
      setIsLoading(false);
    }
  };

  return { buscarHorariosOtimizados, isLoading };
};

export default useOptimizedScheduling;