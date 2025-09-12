export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: string;
  duration: string;
  lyrics?: string;
  chords?: string;
  audioUrl?: string;
  sheetMusic?: string;
  category?: 'Louvor' | 'Adoração' | 'Comunhão' | 'Evangelística';
  bpm?: string;
  assinatura?: string;
}

export interface CronogramaItem {
  id: string;
  tipo: 'cabecalho' | 'etapa' | 'musica';
  titulo: string;
  descricao?: string;
  horario: string;
  duracao?: string;
  tom?: string;
  artista?: string;
  bpm?: string;
  assinatura?: string;
  pessoas?: string[];
}

export interface WorshipService {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Domingo' | 'Quarta' | 'Especial';
  status: 'Planejado' | 'Em Andamento' | 'Concluído';
  songs: Song[];
  team: TeamMember[];
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Vocal' | 'Guitarra' | 'Baixo' | 'Bateria' | 'Teclado' | 'Produção' | 'Técnico' | 'Pastor' | 'Violão';
  confirmed: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  responsible: string;
  notes?: string;
  type: 'Ensaio' | 'Passagem Som' | 'Culto' | 'Setup' | 'Limpeza';
}