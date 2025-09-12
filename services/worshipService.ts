import { WorshipService, Song, ScheduleItem } from '../types/worship';

interface MyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  myRole: string;
  confirmed: boolean;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  active: boolean;
  lastService?: string;
}

interface EventTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface CheckinMember {
  id: string;
  name: string;
  role: string;
  status: 'confirmed' | 'pending' | 'absent';
}

class WorshipServiceManager {
  private services: WorshipService[] = [
    {
      id: '1',
      title: 'Culto Dominical',
      date: '2025-09-07',
      time: '19:00',
      type: 'Domingo',
      status: 'Planejado',
      songs: [
        {
          id: '1',
          title: 'Reckless Love',
          artist: 'Cory Asbury',
          key: 'C',
          tempo: '72 BPM',
          duration: '4:30'
        },
        {
          id: '2', 
          title: 'Goodness of God',
          artist: 'Bethel Music',
          key: 'G',
          tempo: '140 BPM',
          duration: '5:15'
        }
      ],
      team: [
        { id: '1', name: 'João Silva', role: 'Vocal', confirmed: true },
        { id: '2', name: 'Maria Santos', role: 'Teclado', confirmed: true },
        { id: '3', name: 'Pedro Costa', role: 'Guitarra', confirmed: false },
        { id: '4', name: 'Ana Lima', role: 'Produção', confirmed: true }
      ],
      notes: 'Culto especial com batismo'
    },
    {
      id: '2',
      title: 'Culto de Quarta',
      date: '2025-09-10',
      time: '20:00',
      type: 'Quarta',
      status: 'Planejado',
      songs: [
        {
          id: '3',
          title: 'Way Maker',
          artist: 'Sinach',
          key: 'E',
          tempo: '130 BPM',
          duration: '4:45'
        }
      ],
      team: [
        { id: '5', name: 'Carlos Mendes', role: 'Vocal', confirmed: true },
        { id: '6', name: 'Luiza Ferreira', role: 'Violão', confirmed: true }
      ]
    }
  ];

  private songLibrary: Song[] = [
    {
      id: '1',
      title: 'Reckless Love',
      artist: 'Cory Asbury',
      key: 'C',
      tempo: '72 BPM',
      duration: '4:30',
      lyrics: 'Before I spoke a word, You were singing over me...',
      category: 'Adoração'
    },
    {
      id: '2',
      title: 'Goodness of God',
      artist: 'Bethel Music', 
      key: 'G',
      tempo: '140 BPM',
      duration: '5:15',
      lyrics: 'I love You Lord, Oh Your mercy never fails me...',
      category: 'Louvor'
    },
    {
      id: '3',
      title: 'Way Maker',
      artist: 'Sinach',
      key: 'E', 
      tempo: '130 BPM',
      duration: '4:45',
      lyrics: 'You are here, moving in our midst...',
      category: 'Adoração'
    },
    {
      id: '4',
      title: 'Oceans',
      artist: 'Hillsong United',
      key: 'D',
      tempo: '75 BPM', 
      duration: '8:30',
      lyrics: 'You call me out upon the waters...',
      chords: 'Intro: D A Bm G',
      audioUrl: 'https://example.com/oceans.mp3',
      category: 'Adoração'
    },
    {
      id: '5',
      title: 'How Great Is Our God',
      artist: 'Chris Tomlin',
      key: 'G',
      tempo: '120 BPM',
      duration: '4:15',
      lyrics: 'The splendor of the King...',
      chords: 'Verse: G Em C D',
      category: 'Louvor'
    }
  ];

  private scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      time: '17:00',
      activity: 'Setup dos equipamentos',
      responsible: 'Equipe Técnica',
      type: 'Setup',
      notes: 'Verificar microfones e instrumentos'
    },
    {
      id: '2', 
      time: '17:30',
      activity: 'Passagem de som',
      responsible: 'Banda + Técnico',
      type: 'Passagem Som',
      notes: 'Ajustar volumes e equalização'
    },
    {
      id: '3',
      time: '18:30',
      activity: 'Ensaio final',
      responsible: 'Banda',
      type: 'Ensaio',
      notes: 'Revisar sequência das músicas'
    },
    {
      id: '4',
      time: '19:00',
      activity: 'Início do Culto',
      responsible: 'Pastor + Banda',
      type: 'Culto',
      notes: 'Pontualidade é essencial'
    }
  ];

  private myEvents: MyEvent[] = [
    {
      id: '1',
      title: 'Culto Dominical',
      date: '07/09/2024',
      time: '19:00',
      myRole: 'Guitarra',
      confirmed: true
    },
    {
      id: '2',
      title: 'Ensaio Geral',
      date: '05/09/2024',
      time: '19:30',
      myRole: 'Guitarra',
      confirmed: false
    },
    {
      id: '3',
      title: 'Culto de Quarta',
      date: '10/09/2024',
      time: '20:00',
      myRole: 'Backing Vocal',
      confirmed: true
    }
  ];

  private blockedDates: BlockedDate[] = [
    {
      id: '1',
      date: '15/09/2024',
      reason: 'Viagem de trabalho'
    },
    {
      id: '2',
      date: '22/09/2024',
      reason: 'Compromisso familiar'
    }
  ];

  private teamMembers: TeamMember[] = [
    { id: '1', name: 'João Silva', role: 'Vocal', active: true, lastService: '31/08/2024' },
    { id: '2', name: 'Maria Santos', role: 'Teclado', active: true, lastService: '31/08/2024' },
    { id: '3', name: 'Pedro Costa', role: 'Guitarra', active: true, lastService: '24/08/2024' },
    { id: '4', name: 'Ana Lima', role: 'Produção', active: true, lastService: '31/08/2024' },
    { id: '5', name: 'Carlos Mendes', role: 'Vocal', active: true, lastService: '28/08/2024' },
    { id: '6', name: 'Luiza Ferreira', role: 'Violão', active: false, lastService: '17/08/2024' },
    { id: '7', name: 'Roberto Silva', role: 'Baixo', active: true, lastService: '31/08/2024' },
    { id: '8', name: 'Fernanda Costa', role: 'Bateria', active: true, lastService: '24/08/2024' },
    { id: '9', name: 'Pastor Marcos', role: 'Pastor', active: true, lastService: '31/08/2024' },
    { id: '10', name: 'Técnico Paulo', role: 'Técnico', active: true, lastService: '31/08/2024' }
  ];

  private eventTemplates: EventTemplate[] = [
    {
      id: '1',
      name: 'Culto Dominical',
      description: 'Culto principal de domingo com banda completa',
      icon: 'church'
    },
    {
      id: '2',
      name: 'Culto de Quarta',
      description: 'Culto de meio de semana mais intimista',
      icon: 'group'
    },
    {
      id: '3',
      name: 'Evento Especial',
      description: 'Batismos, casamentos, conferências',
      icon: 'star'
    },
    {
      id: '4',
      name: 'Ensaio',
      description: 'Ensaio da banda e equipe técnica',
      icon: 'music-note'
    }
  ];

  private upcomingEvents: UpcomingEvent[] = [
    { id: '1', title: 'Culto Dominical', date: '07/09', time: '19:00' },
    { id: '2', title: 'Culto de Quarta', date: '10/09', time: '20:00' },
    { id: '3', title: 'Ensaio Geral', date: '05/09', time: '19:30' }
  ];

  private checkinData: CheckinMember[] = [
    { id: '1', name: 'João Silva', role: 'Vocal', status: 'confirmed' },
    { id: '2', name: 'Maria Santos', role: 'Teclado', status: 'confirmed' },
    { id: '3', name: 'Pedro Costa', role: 'Guitarra', status: 'pending' },
    { id: '4', name: 'Ana Lima', role: 'Produção', status: 'confirmed' },
    { id: '5', name: 'Carlos Mendes', role: 'Vocal', status: 'pending' },
    { id: '6', name: 'Roberto Silva', role: 'Baixo', status: 'absent' },
    { id: '7', name: 'Fernanda Costa', role: 'Bateria', status: 'confirmed' }
  ];

  getWorshipServices(): WorshipService[] {
    return this.services;
  }

  getSongLibrary(): Song[] {
    return this.songLibrary;
  }

  getScheduleItems(): ScheduleItem[] {
    return this.scheduleItems;
  }

  getServiceById(id: string): WorshipService | undefined {
    return this.services.find(service => service.id === id);
  }

  getSongById(id: string): Song | undefined {
    return this.songLibrary.find(song => song.id === id);
  }

  getMySchedule(): MyEvent[] {
    return this.myEvents;
  }

  getBlockedDates(): BlockedDate[] {
    return this.blockedDates;
  }

  getTeamMembers(): TeamMember[] {
    return this.teamMembers;
  }

  getAvailableRoles(): string[] {
    return ['Vocal', 'Guitarra', 'Baixo', 'Bateria', 'Teclado', 'Produção', 'Técnico', 'Pastor'];
  }

  getEventTemplates(): EventTemplate[] {
    return this.eventTemplates;
  }

  getUpcomingEvents(): UpcomingEvent[] {
    return this.upcomingEvents;
  }

  getCheckinData(eventId: string): CheckinMember[] {
    return this.checkinData;
  }
}

export const worshipService = new WorshipServiceManager();