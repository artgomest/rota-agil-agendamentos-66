import { Timestamp } from "firebase/firestore";

/**
 * Representa um paciente no sistema.
 * Coleção: 'pacientes'
 */
export interface Paciente {
  id?: string; // ID do documento no Firestore
  nome: string;
  dataNascimento: string;
  cpf: string;
  nomeMae: string;
  telefone: string;
  convenio?: string;
  numeroCarteirinha?: string;
  medicamentos?: string;
  enderecoCompleto: string; // Endereço principal do paciente
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Representa um coletor (funcionário).
 * Coleção: 'coletores'
 */
export interface Coletor {
  id?: string; // ID do documento no Firestore
  nome: string;
  calendarId: string; // ID do Google Calendar para este coletor
  ativo: boolean;
  createdAt: Timestamp;
}

/**
 * Representa um agendamento de coleta.
 * Coleção: 'agendamentos'
 */
export interface Agendamento {
  id?: string; // ID do documento no Firestore

  // Referências
  pacienteId: string;
  coletorId: string;

  // Snapshot de informações para fácil acesso
  nomePaciente: string;
  enderecoColeta: string;
  coordenadas: {
    lat: number;
    lng: number;
  };

  // Informações do agendamento
  dataHora: Timestamp; // Horário que a coleta foi agendada
  status: 'agendado' | 'realizado' | 'cancelado';

  // Detalhes da otimização (opcional)
  tempoViagem?: number; // em minutos
  distancia?: number; // em km

  // Informações financeiras do formulário
  taxa?: string;
  examesParticulares?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
