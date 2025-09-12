import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import ServiceCard from '../../components/ui/ServiceCard';
import MusicSelector from '../../components/MusicSelector';
import { worshipService } from '../../services/worshipService';

interface CronogramaItem {
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  confirmed: boolean;
  inviteStatus: 'not_sent' | 'pending' | 'confirmed';
  blocked?: boolean;
  blockReason?: string;
}

interface EquipeGroup {
  equipe: string;
  membros: TeamMember[];
}

interface HorarioExtra {
  id: string;
  nome: string;
  data: string;
  horario: string;
  local: string;
  descricao: string;
}

interface TemplateOptions {
  schedule: boolean;
  songs: boolean;
  team: boolean;
  timing: boolean;
  notes: boolean;
}

export default function PlanejarScreen() {
  const [currentView, setCurrentView] = useState<'list' | 'details'>('list');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [showVolunteerSelector, setShowVolunteerSelector] = useState(false);
  const [showHorarioModal, setShowHorarioModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [searchTeam, setSearchTeam] = useState('');
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({
    schedule: true,
    songs: true,
    team: true,
    timing: true,
    notes: false
  });
  
  const services = worshipService.getWorshipServices();
  const templates = worshipService.getEventTemplates();
  const songs = worshipService.getSongLibrary();
  const teamMembers = worshipService.getTeamMembers();

  const showServiceDetails = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentView('details');
  };

  const backToList = () => {
    setCurrentView('list');
    setSelectedServiceId('');
  };

  const createNewService = () => {
    setShowCreateModal(true);
  };

  const createFromTemplate = () => {
    if (!selectedTemplate) return;
    
    if (Platform.OS === 'web') {
      console.log('Creating service from template:', selectedTemplate);
    } else {
      Alert.alert('Evento Criado', 'Novo evento foi criado com sucesso!');
    }
    
    setShowCreateModal(false);
    setSelectedTemplate('');
  };

  const saveAsTemplate = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowSaveTemplateModal(true);
  };

  const confirmSaveTemplate = () => {
    if (!templateName.trim()) return;
    
    const selectedOptions = Object.entries(templateOptions)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);
    
    if (Platform.OS === 'web') {
      console.log('Salvar template:', templateName, 'Opções:', selectedOptions);
    } else {
      Alert.alert('Template Salvo', `Template "${templateName}" foi salvo com sucesso!`);
    }
    
    setShowSaveTemplateModal(false);
    setTemplateName('');
    setTemplateOptions({
      schedule: true,
      songs: true,
      team: true,
      timing: true,
      notes: false
    });
  };

  const duplicateService = (serviceId: string) => {
    if (Platform.OS === 'web') {
      console.log('Duplicar culto:', serviceId);
    } else {
      Alert.alert('Culto Duplicado', 'Culto foi duplicado com sucesso!');
    }
  };

  const editService = (serviceId: string) => {
    showServiceDetails(serviceId);
  };

  // Event Details Component
  const EventDetailsScreen = ({ serviceId }: { serviceId: string }) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return null;

    const [activeTab, setActiveTab] = useState<'etapas' | 'equipe' | 'midias' | 'horarios'>('etapas');
    const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop');
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [newBannerUrl, setNewBannerUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [modalTipo, setModalTipo] = useState<'cabecalho' | 'etapa' | 'musica'>('etapa');
    const [editingItem, setEditingItem] = useState<CronogramaItem | null>(null);
    const [activeEditTab, setActiveEditTab] = useState<'detalhes' | 'pessoas'>('detalhes');
    const [showSongModal, setShowSongModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState<any>(null);
    
    const [cronograma, setCronograma] = useState<CronogramaItem[]>([
      { id: '1', tipo: 'cabecalho', titulo: 'Início', horario: '19:00' },
      { id: '2', tipo: 'etapa', titulo: 'Vídeo Teaser', horario: '19:00', duracao: '3', pessoas: ['1'] },
      { id: '3', tipo: 'cabecalho', titulo: 'Louvor', horario: '19:03' },
      { id: '4', tipo: 'musica', titulo: 'Se Aperfeiçoa Em Mim', horario: '19:03', tom: 'C', artista: 'Ministério Zoe', duracao: '5', bpm: '75', assinatura: '4/4', pessoas: ['1', '2'] },
      { id: '5', tipo: 'musica', titulo: 'TUDO É PERDA', horario: '19:08', tom: 'Db', artista: 'Morada', duracao: '5', bpm: '72', assinatura: '4/4', pessoas: ['1'] },
      { id: '6', tipo: 'musica', titulo: 'LINDO MOMENTO', horario: '19:13', tom: 'C#', artista: 'Ministério Zoe', duracao: '5', bpm: '68', assinatura: '4/4', pessoas: ['2'] },
      { id: '7', tipo: 'musica', titulo: 'Vitorioso És / Victory is Yours', horario: '19:18', tom: 'F', artista: 'Elevation Worship', duracao: '7', bpm: '140', assinatura: '4/4', pessoas: ['1', '2'] },
      { id: '8', tipo: 'cabecalho', titulo: 'Oração de Guerra', horario: '19:25' },
      { id: '9', tipo: 'etapa', titulo: 'Oração', horario: '19:25', duracao: '10', pessoas: ['3'] },
      { id: '10', tipo: 'cabecalho', titulo: 'News', horario: '19:35' }
    ]);

    const [horariosExtras, setHorariosExtras] = useState<HorarioExtra[]>([
      {
        id: '1',
        nome: 'Ensaio Geral',
        data: '05/09/2024',
        horario: '19:30',
        local: 'Santuário Principal',
        descricao: 'Ensaio com toda a banda e equipe técnica'
      },
      {
        id: '2',
        nome: 'Chegada da Equipe',
        data: '07/09/2024',
        horario: '18:00',
        local: 'Entrada dos Fundos',
        descricao: 'Chegada dos voluntários para preparação'
      }
    ]);

    const [novoHorario, setNovoHorario] = useState({
      nome: '',
      data: '',
      horario: '',
      local: '',
      descricao: ''
    });

    // Mock data with invite status and blocked users
    const [equipeData, setEquipeData] = useState<EquipeGroup[]>([
      {
        equipe: 'Ministério de Louvor',
        membros: [
          { id: '1', name: 'João Silva', role: 'Vocal', confirmed: true, inviteStatus: 'confirmed' },
          { id: '2', name: 'Maria Santos', role: 'Teclado', confirmed: true, inviteStatus: 'confirmed' },
          { id: '3', name: 'Pedro Costa', role: 'Guitarra', confirmed: false, inviteStatus: 'pending' },
          { id: '4', name: 'Ana Lima', role: 'Bateria', confirmed: false, inviteStatus: 'not_sent' },
          { id: '5', name: 'Carlos Mendes', role: 'Vocal', confirmed: false, inviteStatus: 'not_sent', blocked: true, blockReason: 'Viagem de trabalho' }
        ]
      },
      {
        equipe: 'Equipe Técnica',
        membros: [
          { id: '6', name: 'Roberto Silva', role: 'Som', confirmed: true, inviteStatus: 'confirmed' },
          { id: '7', name: 'Fernanda Costa', role: 'Vídeo', confirmed: true, inviteStatus: 'confirmed' },
          { id: '8', name: 'Paulo Santos', role: 'Iluminação', confirmed: false, inviteStatus: 'not_sent', blocked: true, blockReason: 'Compromisso familiar' }
        ]
      }
    ]);
    
    const [modalData, setModalData] = useState({
      titulo: '',
      descricao: '',
      horario: '',
      duracao: '',
      tom: '',
      artista: '',
      bpm: '',
      assinatura: '',
      pessoas: [] as string[]
    });

    // Calcular duração total do evento
    const calcularDuracaoTotal = () => {
      const totalMinutos = cronograma.reduce((total, item) => {
        if (item.duracao && !isNaN(parseInt(item.duracao))) {
          return total + parseInt(item.duracao);
        }
        return total;
      }, 0);

      if (totalMinutos === 0) return 'Duração não definida';
      
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      
      if (horas > 0) {
        return `${horas}h ${minutos}min`;
      } else {
        return `${minutos}min`;
      }
    };

    const abrirModal = (tipo: 'cabecalho' | 'etapa' | 'musica', item?: CronogramaItem) => {
      setModalTipo(tipo);
      setEditingItem(item || null);
      
      if (item) {
        setModalData({
          titulo: item.titulo,
          descricao: item.descricao || '',
          horario: item.horario,
          duracao: item.duracao || '',
          tom: item.tom || '',
          artista: item.artista || '',
          bpm: item.bpm || '',
          assinatura: item.assinatura || '',
          pessoas: item.pessoas || []
        });
      } else {
        setModalData({
          titulo: '',
          descricao: '',
          horario: '',
          duracao: '',
          tom: '',
          artista: '',
          bpm: '',
          assinatura: '',
          pessoas: []
        });
      }
      
      setActiveEditTab('detalhes');
      setShowModal(true);
      setShowAddMenu(false);
    };

    const editarItem = (item: CronogramaItem) => {
      abrirModal(item.tipo, item);
    };

    const salvarItem = () => {
      if (!modalData.titulo || !modalData.horario) return;
      
      const novoItem: CronogramaItem = {
        id: editingItem?.id || Date.now().toString(),
        tipo: modalTipo,
        titulo: modalData.titulo,
        descricao: modalData.descricao || undefined,
        horario: modalData.horario,
        duracao: modalData.duracao || undefined,
        tom: modalData.tom || undefined,
        artista: modalData.artista || undefined,
        bpm: modalData.bpm || undefined,
        assinatura: modalData.assinatura || undefined,
        pessoas: modalData.pessoas.length > 0 ? modalData.pessoas : undefined
      };
      
      if (editingItem) {
        setCronograma(prev => 
          prev.map(item => item.id === editingItem.id ? novoItem : item)
        );
      } else {
        setCronograma(prev => [...prev, novoItem]);
      }
      
      setShowModal(false);
    };

    const excluirItem = (id: string) => {
      setCronograma(prev => prev.filter(item => item.id !== id));
    };

    const reorderItems = (fromIndex: number, toIndex: number) => {
      const newCronograma = [...cronograma];
      const [removed] = newCronograma.splice(fromIndex, 1);
      newCronograma.splice(toIndex, 0, removed);
      setCronograma(newCronograma);
    };

    const adicionarHorario = () => {
      if (!novoHorario.nome || !novoHorario.horario) return;
      
      const horario: HorarioExtra = {
        id: Date.now().toString(),
        ...novoHorario
      };
      
      setHorariosExtras(prev => [...prev, horario]);
      setNovoHorario({
        nome: '',
        data: '',
        horario: '',
        local: '',
        descricao: ''
      });
      setShowHorarioModal(false);
    };

    const removerHorario = (id: string) => {
      setHorariosExtras(prev => prev.filter(h => h.id !== id));
    };

    const updateBanner = () => {
      if (newBannerUrl.trim()) {
        setBannerUrl(newBannerUrl.trim());
        setShowBannerModal(false);
        setNewBannerUrl('');
      }
    };

    const addSongFromLibrary = (song: any) => {
      const novoItem: CronogramaItem = {
        id: Date.now().toString(),
        tipo: 'musica',
        titulo: song.title,
        horario: '19:00',
        tom: song.key,
        artista: song.artist,
        duracao: song.duration,
        bpm: song.tempo?.replace(' BPM', '') || '',
        assinatura: '4/4'
      };
      
      setCronograma(prev => [...prev, novoItem]);
    };

    const addVolunteerToTeam = (volunteer: any) => {
      const newMember: TeamMember = {
        id: volunteer.id,
        name: volunteer.name,
        role: volunteer.role,
        confirmed: false,
        inviteStatus: 'not_sent'
      };
      
      setEquipeData(prev => prev.map(grupo => ({
        ...grupo,
        membros: [...grupo.membros, newMember]
      })));
    };

    const sendInvite = (memberId: string) => {
      setEquipeData(prev => prev.map(grupo => ({
        ...grupo,
        membros: grupo.membros.map(member => 
          member.id === memberId 
            ? { ...member, inviteStatus: 'pending' }
            : member
        )
      })));
    };

    const sendAllInvites = () => {
      setEquipeData(prev => prev.map(grupo => ({
        ...grupo,
        membros: grupo.membros.map(member => 
          member.inviteStatus === 'not_sent' && !member.blocked
            ? { ...member, inviteStatus: 'pending' }
            : member
        )
      })));
      
      if (Platform.OS === 'web') {
        console.log('Enviando convites para todos');
      } else {
        Alert.alert('Convites Enviados', 'Convites foram enviados para todos os membros disponíveis!');
      }
    };

    const getTipoColor = (tipo: string) => {
      switch (tipo) {
        case 'cabecalho': return '#10B981';
        case 'etapa': return '#6366F1';
        case 'musica': return '#F59E0B';
        default: return '#64748B';
      }
    };

    const getTipoLabel = (tipo: string) => {
      switch (tipo) {
        case 'cabecalho': return 'Cabeçalho';
        case 'etapa': return 'Etapa';
        case 'musica': return 'Música';
        default: return 'Item';
      }
    };

    const getPersonName = (personId: string) => {
      const allMembers = equipeData.flatMap(eq => eq.membros);
      const person = allMembers.find(m => m.id === personId);
      return person?.name || 'Pessoa';
    };

    const getPersonFirstName = (personId: string) => {
      const fullName = getPersonName(personId);
      return fullName.split(' ')[0];
    };

    const togglePersonSelection = (personId: string) => {
      setModalData(prev => ({
        ...prev,
        pessoas: prev.pessoas.includes(personId)
          ? prev.pessoas.filter(id => id !== personId)
          : [...prev.pessoas, personId]
      }));
    };

    const getInviteStatusColor = (status?: string) => {
      switch (status) {
        case 'confirmed': return '#10B981';
        case 'pending': return '#F59E0B';
        case 'not_sent': return '#6B7280';
        default: return '#94A3B8';
      }
    };

    const getInviteStatusText = (status?: string) => {
      switch (status) {
        case 'confirmed': return 'Confirmado';
        case 'pending': return 'Pendente';
        case 'not_sent': return 'Não Enviado';
        default: return 'Indefinido';
      }
    };

    const getBlockedMembers = () => {
      return equipeData.flatMap(grupo => 
        grupo.membros.filter(member => member.blocked)
      );
    };

    const cronogramaOrdenado = cronograma.sort((a, b) => {
      return a.horario.localeCompare(b.horario);
    });

    // Filter team members based on search
    const filteredEquipeData = equipeData.map(grupo => ({
      ...grupo,
      membros: grupo.membros.filter(member => 
        searchTeam === '' || 
        member.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
        grupo.equipe.toLowerCase().includes(searchTeam.toLowerCase())
      )
    })).filter(grupo => grupo.membros.length > 0 || searchTeam === '');

    const allTeamMembers = equipeData.flatMap(eq => eq.membros);

    // Get songs from cronogram for midias tab
    const cronogramSongs = cronograma.filter(item => item.tipo === 'musica');

    const openSongDetails = (titulo: string) => {
      const song = songs.find(s => s.title === titulo);
      const cronogramItem = cronogramSongs.find(s => s.titulo === titulo);
      
      if (song || cronogramItem) {
        setSelectedSong({
          title: cronogramItem?.titulo || song?.title,
          artist: cronogramItem?.artista || song?.artist,
          key: cronogramItem?.tom || song?.key,
          tempo: cronogramItem?.bpm ? `${cronogramItem.bpm} BPM` : song?.tempo,
          duration: cronogramItem?.duracao ? `${cronogramItem.duracao}min` : song?.duration,
          lyrics: song?.lyrics || 'Letra não disponível'
        });
        setShowSongModal(true);
      }
    };

    // Organizar equipes para seleção
    const organizedTeams = [
      {
        name: 'Ministério de Louvor',
        members: teamMembers.filter(m => ['Vocal', 'Guitarra', 'Baixo', 'Bateria', 'Teclado'].includes(m.role))
      },
      {
        name: 'Equipe Técnica', 
        members: teamMembers.filter(m => ['Som', 'Vídeo', 'Iluminação', 'Transmissão'].includes(m.role))
      },
      {
        name: 'Ministração',
        members: teamMembers.filter(m => ['Pastor', 'Pregador', 'Intercessão'].includes(m.role))
      }
    ].filter(team => team.members.length > 0);

    const renderTabContent = () => {
      switch (activeTab) {
        case 'etapas':
          return (
            <View style={styles.tabContent}>
              {cronogramaOrdenado.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="event-note" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyTitle}>Cronograma Vazio</Text>
                  <Text style={styles.emptySubtitle}>
                    Use o botão + para adicionar itens ao cronograma
                  </Text>
                </View>
              ) : (
                <View style={styles.cronogramaContainer}>
                {cronogramaOrdenado.map((item, index) => {
                  const isLastInGroup = index === cronogramaOrdenado.length - 1 || 
                    cronogramaOrdenado[index + 1]?.tipo === 'cabecalho';
                  
                  return (
                    <View key={item.id}>
                      {item.tipo === 'cabecalho' ? (
                        <TouchableOpacity 
                          style={styles.cronogramaItem}
                          onPress={() => editarItem(item)}
                        >
                          <View style={styles.dragHandle}>
                            <MaterialIcons name="drag-indicator" size={16} color="#CBD5E1" />
                          </View>
                          <View style={styles.cronogramaContent}>
                            <View style={styles.cabecalhoContainer}>
                              <View style={styles.cabecalhoLine} />
                              <Text style={styles.cronogramaCabecalho}>{item.titulo}</Text>
                              <Text style={styles.cronogramaHorario}>{item.horario}</Text>
                            </View>
                            {item.pessoas && item.pessoas.length > 0 && (
                              <View style={styles.pessoasContainer}>
                                {item.pessoas.map((personId, idx) => (
                                  <View key={idx} style={styles.pessoaChip}>
                                    <Text style={styles.pessoaName}>
                                      {getPersonFirstName(personId)}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={[styles.cronogramaItem, styles.itemIndentado]}
                          onPress={() => editarItem(item)}
                        >
                          <View style={styles.dragHandle}>
                            <MaterialIcons name="drag-indicator" size={16} color="#CBD5E1" />
                          </View>
                          <View style={styles.cronogramaContent}>
                            <View style={styles.itemHeader}>
                              <Text style={styles.cronogramaHorario}>{item.horario}</Text>
                              <Text style={styles.cronogramaTitulo}>
                                {item.titulo}
                                {item.artista && <Text style={styles.cronogramaArtista}> - {item.artista}</Text>}
                                {item.duracao && <Text style={styles.cronogramaDuracao}> • {item.duracao}min</Text>}
                              </Text>
                              {item.tom && (
                                <View style={[styles.tomBadge, { backgroundColor: getTipoColor(item.tipo) }]}>
                                  <Text style={styles.tomText}>{item.tom}</Text>
                                </View>
                              )}
                            </View>
                            {item.pessoas && item.pessoas.length > 0 && (
                              <View style={styles.pessoasContainer}>
                                {item.pessoas.map((personId, idx) => (
                                  <View key={idx} style={styles.pessoaChip}>
                                    <Text style={styles.pessoaName}>
                                      {getPersonFirstName(personId)}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      )}
                      
                      {isLastInGroup && item.tipo !== 'cabecalho' && (
                        <View style={styles.cronogramaSeparator} />
                      )}
                    </View>
                  );
                })}
                </View>
              )}

              {/* Duração Total */}
              <View style={styles.duracaoTotalContainer}>
                <Text style={styles.duracaoTotalTitle}>Duração Total do Evento</Text>
                <Text style={styles.duracaoTotalValue}>{calcularDuracaoTotal()}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => saveAsTemplate(serviceId)}
                >
                  <MaterialIcons name="save" size={16} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Salvar Template</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => duplicateService(serviceId)}
                >
                  <MaterialIcons name="content-copy" size={16} color="#8B5CF6" />
                  <Text style={styles.actionButtonText}>Duplicar Evento</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      console.log('Imprimir/PDF cronograma');
                    } else {
                      Alert.alert('Imprimir / PDF', 'Escolha uma opção:', [
                        { text: 'Imprimir', onPress: () => console.log('Imprimir') },
                        { text: 'Salvar PDF', onPress: () => console.log('PDF') },
                        { text: 'Cancelar', style: 'cancel' }
                      ]);
                    }
                  }}
                >
                  <MaterialIcons name="print" size={16} color="#10B981" />
                  <Text style={styles.actionButtonText}>Imprimir / PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          );

        case 'equipe':
          return (
            <View style={styles.tabContent}>
              <View style={styles.equipeHeader}>
                <View style={styles.equipeSearchContainer}>
                  <MaterialIcons name="search" size={18} color="#64748B" />
                  <TextInput
                    style={styles.equipeSearchInput}
                    placeholder="Buscar por equipe ou nome..."
                    placeholderTextColor="#94A3B8"
                    value={searchTeam}
                    onChangeText={setSearchTeam}
                  />
                  {searchTeam.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchTeam('')}>
                      <MaterialIcons name="clear" size={20} color="#64748B" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <TouchableOpacity style={styles.sendAllButton} onPress={sendAllInvites}>
                  <MaterialIcons name="send" size={14} color="#FFFFFF" />
                  <Text style={styles.sendAllButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.equipeContainer}>
                {filteredEquipeData.map((grupo, index) => (
                  <View key={index}>
                    <View style={styles.equipeGroup}>
                      <View style={styles.equipeHeaderSection}>
                        <Text style={styles.equipeNome}>{grupo.equipe}</Text>
                      </View>
                      
                      {grupo.membros.map((member) => (
                        <View key={member.id} style={[
                          styles.memberItem,
                          member.blocked && styles.blockedMemberItem
                        ]}>
                          <View style={styles.memberInfo}>
                            <Text style={[
                              styles.memberName,
                              member.blocked && styles.blockedMemberName
                            ]}>
                              {member.name}
                            </Text>
                            <Text style={styles.memberRole}>{member.role}</Text>
                          </View>
                          
                          <View style={styles.memberActions}>
                            <View style={[styles.statusBadge, { 
                              backgroundColor: getInviteStatusColor(member.inviteStatus)
                            }]}>
                              <Text style={styles.statusText}>
                                {getInviteStatusText(member.inviteStatus)}
                              </Text>
                            </View>
                            
                            {!member.blocked && member.inviteStatus === 'not_sent' && (
                              <TouchableOpacity 
                                style={styles.inviteButton}
                                onPress={() => sendInvite(member.id)}
                              >
                                <MaterialIcons name="send" size={16} color="#10B981" />
                              </TouchableOpacity>
                            )}
                            
                            {member.blocked && (
                              <TouchableOpacity 
                                style={styles.infoButton}
                                onPress={() => {
                                  if (Platform.OS === 'web') {
                                    console.log('Motivo:', member.blockReason);
                                  } else {
                                    Alert.alert('Motivo do Bloqueio', member.blockReason || 'Não disponível para esta data');
                                  }
                                }}
                              >
                                <MaterialIcons name="info" size={16} color="#F59E0B" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                    
                    {index < filteredEquipeData.length - 1 && (
                      <View style={styles.equipeSeparator} />
                    )}
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.blockedListButton}
                onPress={() => setShowBlockedModal(true)}
              >
                <MaterialIcons name="block" size={16} color="#EF4444" />
                <Text style={styles.blockedListButtonText}>
                  Ver bloqueados para esta data ({getBlockedMembers().length})
                </Text>
              </TouchableOpacity>
            </View>
          );

        case 'midias':
          return (
            <View style={styles.tabContent}>
              {cronogramSongs.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="music-note" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyTitle}>Nenhuma música no cronograma</Text>
                  <Text style={styles.emptySubtitle}>
                    Adicione músicas ao cronograma na aba Etapas
                  </Text>
                </View>
              ) : (
                <View style={styles.musicasContainer}>
                  <Text style={styles.musicasHeader}>Músicas do Cronograma ({cronogramSongs.length})</Text>
                  
                  {cronogramSongs.map((song, index) => (
                    <TouchableOpacity 
                      key={song.id}
                      style={styles.musicCard}
                      onPress={() => openSongDetails(song.titulo)}
                    >
                      <View style={styles.musicIconContainer}>
                        <MaterialIcons name="music-note" size={24} color="#F59E0B" />
                      </View>
                      
                      <View style={styles.musicInfo}>
                        <Text style={styles.musicTitle}>{song.titulo}</Text>
                        {song.artista && (
                          <Text style={styles.musicArtist}>por {song.artista}</Text>
                        )}
                        <View style={styles.musicMeta}>
                          <Text style={styles.musicTime}>{song.horario}</Text>
                          {song.duracao && (
                            <Text style={styles.musicDuration}> • {song.duracao}min</Text>
                          )}
                        </View>
                        
                        {song.pessoas && song.pessoas.length > 0 && (
                          <View style={styles.musicPeople}>
                            {song.pessoas.map((personId, idx) => (
                              <View key={idx} style={styles.musicPersonChip}>
                                <Text style={styles.musicPersonName}>
                                  {getPersonFirstName(personId)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.musicActions}>
                        {song.tom && (
                          <View style={[styles.musicKeyBadge, { backgroundColor: '#F59E0B' }]}>
                            <Text style={styles.musicKeyText}>{song.tom}</Text>
                          </View>
                        )}
                        <MaterialIcons name="keyboard-arrow-right" size={20} color="#CBD5E1" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );

        case 'horarios':
          return (
            <View style={styles.tabContent}>
              <View style={styles.horariosInfo}>
                <Text style={styles.horariosEventTitle}>Evento Principal</Text>
                <Text style={styles.horariosText}>Data: {service.date}</Text>
                <Text style={styles.horariosText}>Horário: {service.time}</Text>
                <Text style={styles.horariosText}>Duração: {calcularDuracaoTotal()}</Text>
              </View>

              {horariosExtras.length > 0 && (
                <View style={styles.horariosExtrasContainer}>
                  <Text style={styles.horariosExtrasTitle}>Horários Extras</Text>
                  {horariosExtras.map((horario) => (
                    <View key={horario.id} style={styles.horarioExtraCard}>
                      <View style={styles.horarioExtraInfo}>
                        <Text style={styles.horarioExtraNome}>{horario.nome}</Text>
                        <Text style={styles.horarioExtraData}>
                          {horario.data} às {horario.horario}
                        </Text>
                        {horario.local && (
                          <Text style={styles.horarioExtraLocal}>📍 {horario.local}</Text>
                        )}
                        {horario.descricao && (
                          <Text style={styles.horarioExtraDescricao}>{horario.descricao}</Text>
                        )}
                      </View>
                      <TouchableOpacity 
                        style={styles.removeHorarioButton}
                        onPress={() => removerHorario(horario.id)}
                      >
                        <MaterialIcons name="delete" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );

        default:
          return null;
      }
    };

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity onPress={backToList} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.backButtonText}>Voltar para eventos</Text>
        </View>

        <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
          <View style={styles.bannerContainer}>
            <View style={styles.banner} />
            <View style={styles.bannerOverlay}>
              <TouchableOpacity 
                style={styles.bannerAction}
                onPress={() => setShowBannerModal(true)}
              >
                <MaterialIcons name="file-download" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bannerAction}>
                <MaterialIcons name="delete" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{service.title} ({cronograma.length})</Text>
          </View>

          <View style={styles.tabsContainer}>
            {[
              { key: 'etapas', label: 'Etapas', icon: 'list' },
              { key: 'equipe', label: 'Equipe', icon: 'groups' },
              { key: 'midias', label: 'Músicas', icon: 'library-music' },
              { key: 'horarios', label: 'Horários', icon: 'schedule' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <MaterialIcons 
                  name={tab.icon as any} 
                  size={20} 
                  color={activeTab === tab.key ? '#6366F1' : '#64748B'} 
                />
                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderTabContent()}
          <View style={styles.emptySpace} />
        </ScrollView>

        {/* Floating Add Button with Menu for Etapas */}
        {activeTab === 'etapas' && (
          <>
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={() => setShowAddMenu(!showAddMenu)}
            >
              <MaterialIcons name={showAddMenu ? "close" : "add"} size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {showAddMenu && (
              <View style={styles.addMenu}>
                <TouchableOpacity 
                  style={[styles.addMenuItem, { backgroundColor: '#10B981' }]}
                  onPress={() => abrirModal('cabecalho')}
                >
                  <MaterialIcons name="title" size={20} color="#FFFFFF" />
                  <Text style={styles.addMenuText}>Cabeçalho</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.addMenuItem, { backgroundColor: '#6366F1' }]}
                  onPress={() => abrirModal('etapa')}
                >
                  <MaterialIcons name="event-note" size={20} color="#FFFFFF" />
                  <Text style={styles.addMenuText}>Etapa</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.addMenuItem, { backgroundColor: '#F59E0B' }]}
                  onPress={() => setShowMusicSelector(true)}
                >
                  <MaterialIcons name="music-note" size={20} color="#FFFFFF" />
                  <Text style={styles.addMenuText}>Música</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Floating Add Button for Equipe */}
        {activeTab === 'equipe' && (
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={() => setShowVolunteerSelector(true)}
          >
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Floating Add Button for Horarios */}
        {activeTab === 'horarios' && (
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={() => setShowHorarioModal(true)}
          >
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Modal de Edição */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingItem ? 'Editar' : 'Adicionar'} {getTipoLabel(modalTipo)}
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Tabs do Modal */}
              <View style={styles.modalTabs}>
                <TouchableOpacity
                  style={[styles.modalTab, activeEditTab === 'detalhes' && styles.modalTabActive]}
                  onPress={() => setActiveEditTab('detalhes')}
                >
                  <MaterialIcons 
                    name="edit" 
                    size={16} 
                    color={activeEditTab === 'detalhes' ? '#6366F1' : '#64748B'} 
                  />
                  <Text style={[styles.modalTabText, activeEditTab === 'detalhes' && styles.modalTabTextActive]}>
                    Detalhes
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalTab, activeEditTab === 'pessoas' && styles.modalTabActive]}
                  onPress={() => setActiveEditTab('pessoas')}
                >
                  <MaterialIcons 
                    name="people" 
                    size={16} 
                    color={activeEditTab === 'pessoas' ? '#6366F1' : '#64748B'} 
                  />
                  <Text style={[styles.modalTabText, activeEditTab === 'pessoas' && styles.modalTabTextActive]}>
                    Pessoas
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {activeEditTab === 'detalhes' ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Horário *</Text>
                      <TextInput
                        style={styles.textInput}
                        value={modalData.horario}
                        onChangeText={(text) => setModalData(prev => ({ ...prev, horario: text }))}
                        placeholder="19:00"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        {modalTipo === 'cabecalho' ? 'Título do Cabeçalho' : 
                         modalTipo === 'etapa' ? 'Nome da Etapa' : 
                         'Nome da Música'} *
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        value={modalData.titulo}
                        onChangeText={(text) => setModalData(prev => ({ ...prev, titulo: text }))}
                        placeholder={
                          modalTipo === 'cabecalho' ? 'Ex: Abertura, Louvor, Ministração...' :
                          modalTipo === 'etapa' ? 'Ex: Oração, Oferta, Pregação...' :
                          'Ex: Como Zaqueu, Reckless Love...'
                        }
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    {modalTipo !== 'cabecalho' && (
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Duração (minutos)</Text>
                        <TextInput
                          style={styles.textInput}
                          value={modalData.duracao}
                          onChangeText={(text) => setModalData(prev => ({ ...prev, duracao: text }))}
                          placeholder="5, 10, 15..."
                          placeholderTextColor="#94A3B8"
                          keyboardType="numeric"
                        />
                      </View>
                    )}

                    {modalTipo === 'musica' && (
                      <>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Tom da Música</Text>
                          <TextInput
                            style={styles.textInput}
                            value={modalData.tom}
                            onChangeText={(text) => setModalData(prev => ({ ...prev, tom: text }))}
                            placeholder="C, D, G, F#..."
                            placeholderTextColor="#94A3B8"
                          />
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>BPM</Text>
                          <TextInput
                            style={styles.textInput}
                            value={modalData.bpm}
                            onChangeText={(text) => setModalData(prev => ({ ...prev, bpm: text }))}
                            placeholder="72, 120, 140..."
                            placeholderTextColor="#94A3B8"
                            keyboardType="numeric"
                          />
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Assinatura</Text>
                          <TextInput
                            style={styles.textInput}
                            value={modalData.assinatura}
                            onChangeText={(text) => setModalData(prev => ({ ...prev, assinatura: text }))}
                            placeholder="4/4, 3/4, 6/8..."
                            placeholderTextColor="#94A3B8"
                          />
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Artista</Text>
                          <TextInput
                            style={styles.textInput}
                            value={modalData.artista}
                            onChangeText={(text) => setModalData(prev => ({ ...prev, artista: text }))}
                            placeholder="Nome do artista ou ministério"
                            placeholderTextColor="#94A3B8"
                          />
                        </View>
                      </>
                    )}

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        {modalTipo === 'cabecalho' ? 'Observações' :
                         modalTipo === 'etapa' ? 'Descrição da Etapa' : 
                         'Observações da Música'}
                      </Text>
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        value={modalData.descricao}
                        onChangeText={(text) => setModalData(prev => ({ ...prev, descricao: text }))}
                        placeholder={
                          modalTipo === 'cabecalho' ? 'Informações adicionais...' :
                          modalTipo === 'etapa' ? 'Detalhes sobre esta etapa do culto...' :
                          'BPM, observações especiais...'
                        }
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.pessoasSelection}>
                    <Text style={styles.pessoasSelectionTitle}>Selecione as pessoas para esta {modalTipo}:</Text>
                    
                    {modalData.pessoas.length > 0 && (
                      <View style={styles.selectedPessoas}>
                        <Text style={styles.selectedPessoasTitle}>Pessoas selecionadas:</Text>
                        <View style={styles.selectedPessoasChips}>
                          {modalData.pessoas.map((personId, idx) => (
                            <View key={idx} style={styles.selectedPessoaChip}>
                              <Text style={styles.selectedPessoaName}>{getPersonName(personId)}</Text>
                              <TouchableOpacity onPress={() => togglePersonSelection(personId)}>
                                <MaterialIcons name="close" size={16} color="#64748B" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    <View style={styles.pessoasList}>
                      {allTeamMembers.filter(member => !member.blocked).map((member) => (
                        <TouchableOpacity
                          key={member.id}
                          style={[
                            styles.pessoaItem,
                            modalData.pessoas.includes(member.id) && styles.pessoaItemSelected
                          ]}
                          onPress={() => togglePersonSelection(member.id)}
                        >
                          <View style={[styles.pessoaAvatar, { backgroundColor: getTipoColor(modalTipo) }]}>
                            <Text style={styles.pessoaAvatarText}>
                              {member.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                            </Text>
                          </View>
                          <View style={styles.pessoaInfoModal}>
                            <Text style={styles.pessoaNome}>{member.name}</Text>
                            <Text style={styles.pessoaRoleModal}>{member.role}</Text>
                          </View>
                          <MaterialIcons 
                            name={modalData.pessoas.includes(member.id) ? "check-circle" : "radio-button-unchecked"} 
                            size={24} 
                            color={modalData.pessoas.includes(member.id) ? '#10B981' : '#CBD5E1'} 
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity 
                style={[
                  styles.modalSaveButton, 
                  { backgroundColor: getTipoColor(modalTipo) },
                  (!modalData.titulo || !modalData.horario) && styles.modalSaveButtonDisabled
                ]}
                onPress={salvarItem}
                disabled={!modalData.titulo || !modalData.horario}
              >
                <Text style={styles.modalSaveButtonText}>
                  {editingItem ? 'Salvar Alterações' : 'Adicionar ao Cronograma'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Horário Extra Modal */}
        <Modal visible={showHorarioModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Horário Extra</Text>
                <TouchableOpacity onPress={() => setShowHorarioModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome do Evento *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={novoHorario.nome}
                    onChangeText={(text) => setNovoHorario(prev => ({ ...prev, nome: text }))}
                    placeholder="Ex: Ensaio Geral, Chegada da Equipe..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Data</Text>
                  <TextInput
                    style={styles.textInput}
                    value={novoHorario.data}
                    onChangeText={(text) => setNovoHorario(prev => ({ ...prev, data: text }))}
                    placeholder="07/09/2024"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Horário *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={novoHorario.horario}
                    onChangeText={(text) => setNovoHorario(prev => ({ ...prev, horario: text }))}
                    placeholder="19:30"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Local</Text>
                  <TextInput
                    style={styles.textInput}
                    value={novoHorario.local}
                    onChangeText={(text) => setNovoHorario(prev => ({ ...prev, local: text }))}
                    placeholder="Santuário Principal, Sala de Ensaio..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descrição</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={novoHorario.descricao}
                    onChangeText={(text) => setNovoHorario(prev => ({ ...prev, descricao: text }))}
                    placeholder="Detalhes sobre este horário..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </ScrollView>

              <TouchableOpacity 
                style={[
                  styles.modalSaveButton, 
                  { backgroundColor: '#6366F1' },
                  (!novoHorario.nome || !novoHorario.horario) && styles.modalSaveButtonDisabled
                ]}
                onPress={adicionarHorario}
                disabled={!novoHorario.nome || !novoHorario.horario}
              >
                <Text style={styles.modalSaveButtonText}>Adicionar Horário</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Blocked Members Modal */}
        <Modal visible={showBlockedModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Pessoas Bloqueadas</Text>
                <TouchableOpacity onPress={() => setShowBlockedModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                Pessoas que não estão disponíveis para esta data:
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {getBlockedMembers().map((member) => (
                  <View key={member.id} style={styles.blockedMemberCard}>
                    <View style={styles.blockedMemberInfo}>
                      <Text style={styles.blockedMemberName}>{member.name}</Text>
                      <Text style={styles.blockedMemberRole}>{member.role}</Text>
                      <Text style={styles.blockedMemberReason}>
                        Motivo: {member.blockReason}
                      </Text>
                    </View>
                    <MaterialIcons name="block" size={24} color="#EF4444" />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Music Selector Modal */}
        <MusicSelector
          visible={showMusicSelector}
          onClose={() => setShowMusicSelector(false)}
          onSelectSong={addSongFromLibrary}
          songs={songs}
        />

        {/* Volunteer Selector Modal - Organized by Teams */}
        <Modal visible={showVolunteerSelector} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Adicionar Voluntário</Text>
                <TouchableOpacity onPress={() => setShowVolunteerSelector(false)}>
                  <MaterialIcons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.volunteerSearchContainer}>
                <MaterialIcons name="search" size={20} color="#64748B" />
                <TextInput
                  style={styles.volunteerSearchInput}
                  placeholder="Buscar voluntários..."
                  placeholderTextColor="#94A3B8"
                  value={searchTeam}
                  onChangeText={setSearchTeam}
                />
                {searchTeam.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchTeam('')}>
                    <MaterialIcons name="clear" size={20} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
              
              <ScrollView style={styles.volunteerList} showsVerticalScrollIndicator={false}>
                {organizedTeams.map((team, teamIndex) => {
                  const filteredMembers = team.members.filter(member =>
                    searchTeam === '' || 
                    member.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
                    team.name.toLowerCase().includes(searchTeam.toLowerCase())
                  );

                  if (filteredMembers.length === 0 && searchTeam !== '') return null;

                  return (
                    <View key={teamIndex}>
                      <Text style={styles.volunteerTeamTitle}>{team.name}</Text>
                      {filteredMembers.map((volunteer) => {
                        const isBlocked = volunteer.id === '5' || volunteer.id === '8'; // Mock blocked users
                        const blockReason = volunteer.id === '5' ? 'Viagem de trabalho' : 'Compromisso familiar';
                        
                        return (
                          <TouchableOpacity 
                            key={volunteer.id}
                            style={[
                              styles.volunteerItem,
                              isBlocked && styles.blockedVolunteerItem
                            ]}
                            onPress={() => {
                              if (isBlocked) {
                                if (Platform.OS === 'web') {
                                  console.log('Bloqueado:', blockReason);
                                } else {
                                  Alert.alert('Pessoa Indisponível', blockReason);
                                }
                              } else {
                                addVolunteerToTeam(volunteer);
                                setShowVolunteerSelector(false);
                              }
                            }}
                          >
                            <View style={styles.volunteerInfo}>
                              <Text style={[
                                styles.volunteerName,
                                isBlocked && styles.blockedVolunteerName
                              ]}>
                                {volunteer.name}
                              </Text>
                              <Text style={styles.volunteerRole}>{volunteer.role}</Text>
                              {isBlocked && (
                                <Text style={styles.volunteerBlockReason}>
                                  Motivo: {blockReason}
                                </Text>
                              )}
                            </View>
                            <MaterialIcons 
                              name={isBlocked ? "block" : "add-circle"} 
                              size={24} 
                              color={isBlocked ? "#EF4444" : "#10B981"} 
                            />
                          </TouchableOpacity>
                        );
                      })}
                      {teamIndex < organizedTeams.length - 1 && (
                        <View style={styles.teamSeparator} />
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Song Details Modal */}
        <Modal visible={showSongModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.songModalContent}>
              <View style={styles.songModalHeader}>
                <Text style={styles.songModalTitle}>Detalhes da Música</Text>
                <TouchableOpacity onPress={() => setShowSongModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              {selectedSong && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{selectedSong.title}</Text>
                    <Text style={styles.songArtist}>por {selectedSong.artist}</Text>
                  </View>
                  
                  <View style={styles.songDetails}>
                    <View style={styles.songDetail}>
                      <Text style={styles.songDetailLabel}>Tom:</Text>
                      <Text style={styles.songDetailValue}>{selectedSong.key}</Text>
                    </View>
                    <View style={styles.songDetail}>
                      <Text style={styles.songDetailLabel}>Tempo:</Text>
                      <Text style={styles.songDetailValue}>{selectedSong.tempo}</Text>
                    </View>
                    <View style={styles.songDetail}>
                      <Text style={styles.songDetailLabel}>Duração:</Text>
                      <Text style={styles.songDetailValue}>{selectedSong.duration}</Text>
                    </View>
                  </View>
                  
                  {selectedSong.lyrics && (
                    <View style={styles.lyricsContainer}>
                      <Text style={styles.lyricsTitle}>Letra:</Text>
                      <Text style={styles.lyricsText}>{selectedSong.lyrics}</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Banner Modal */}
        <Modal visible={showBannerModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Alterar Banner</Text>
                <TouchableOpacity onPress={() => setShowBannerModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL da Imagem</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBannerUrl}
                  onChangeText={setNewBannerUrl}
                  placeholder="https://exemplo.com/imagem.jpg"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <TouchableOpacity 
                style={[styles.modalSaveButton, { backgroundColor: '#6366F1' }]}
                onPress={updateBanner}
              >
                <Text style={styles.modalSaveButtonText}>Atualizar Banner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  if (currentView === 'details') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EventDetailsScreen serviceId={selectedServiceId} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Planejar</Text>
          <Text style={styles.subtitle}>Organize cultos e eventos</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={createNewService}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos Planejados</Text>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceContainer}>
              <ServiceCard
                service={service}
                onPress={() => showServiceDetails(service.id)}
              />
              <View style={styles.serviceActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => duplicateService(service.id)}
                >
                  <MaterialIcons name="content-copy" size={16} color="#6366F1" />
                  <Text style={styles.actionButtonText}>Duplicar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => saveAsTemplate(service.id)}
                >
                  <MaterialIcons name="save" size={16} color="#10B981" />
                  <Text style={styles.actionButtonText}>Salvar Template</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => editService(service.id)}
                >
                  <MaterialIcons name="edit" size={16} color="#F59E0B" />
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>

      {/* Modal de Criação */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Criar Novo Evento</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalText}>
              Escolha um template para começar rapidamente ou crie do zero:
            </Text>
            
            <View style={styles.templateOptions}>
              <TouchableOpacity 
                style={[styles.templateOption, selectedTemplate === 'blank' && styles.templateOptionSelected]}
                onPress={() => setSelectedTemplate('blank')}
              >
                <MaterialIcons name="add-circle" size={24} color={selectedTemplate === 'blank' ? '#6366F1' : '#64748B'} />
                <View style={styles.templateInfo}>
                  <Text style={[styles.templateName, selectedTemplate === 'blank' && styles.templateNameSelected]}>
                    Criar do Zero
                  </Text>
                  <Text style={styles.templateDescription}>Evento personalizado sem template</Text>
                </View>
              </TouchableOpacity>

              {templates.map((template) => (
                <TouchableOpacity 
                  key={template.id}
                  style={[styles.templateOption, selectedTemplate === template.name && styles.templateOptionSelected]}
                  onPress={() => setSelectedTemplate(template.name)}
                >
                  <MaterialIcons name={template.icon as any} size={24} color={selectedTemplate === template.name ? '#6366F1' : '#64748B'} />
                  <View style={styles.templateInfo}>
                    <Text style={[styles.templateName, selectedTemplate === template.name && styles.templateNameSelected]}>
                      {template.name}
                    </Text>
                    <Text style={styles.templateDescription}>{template.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.createButton, !selectedTemplate && styles.createButtonDisabled]}
              onPress={createFromTemplate}
              disabled={!selectedTemplate}
            >
              <Text style={styles.createButtonText}>
                {selectedTemplate === 'blank' ? 'Criar Evento' : 'Usar Template'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Salvar Template */}
      <Modal visible={showSaveTemplateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Salvar como Template</Text>
              <TouchableOpacity onPress={() => setShowSaveTemplateModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalText}>
              Escolha quais elementos salvar no template:
            </Text>

            <View style={styles.templateOptionsSection}>
              <Text style={styles.inputLabel}>Nome do Template</Text>
              <TextInput
                style={styles.textInput}
                value={templateName}
                onChangeText={setTemplateName}
                placeholder="Ex: Culto Dominical Padrão"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.templateOptionsSection}>
              <Text style={styles.inputLabel}>Elementos a Salvar</Text>
              
              {[
                { key: 'schedule', label: 'Cronograma', desc: 'Horários e atividades do evento' },
                { key: 'songs', label: 'Lista de Músicas', desc: 'Repertório musical completo' },
                { key: 'team', label: 'Equipe', desc: 'Membros e funções da equipe' },
                { key: 'timing', label: 'Horários', desc: 'Tempo de duração e intervalos' },
                { key: 'notes', label: 'Observações', desc: 'Notas e instruções especiais' }
              ].map((option) => (
                <TouchableOpacity 
                  key={option.key}
                  style={styles.templateCheckOption}
                  onPress={() => setTemplateOptions({
                    ...templateOptions,
                    [option.key]: !templateOptions[option.key as keyof TemplateOptions]
                  })}
                >
                  <MaterialIcons 
                    name={templateOptions[option.key as keyof TemplateOptions] ? "check-box" : "check-box-outline-blank"} 
                    size={24} 
                    color="#6366F1" 
                  />
                  <View style={styles.templateCheckInfo}>
                    <Text style={styles.templateCheckLabel}>{option.label}</Text>
                    <Text style={styles.templateCheckDesc}>{option.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.createButton, !templateName.trim() && styles.createButtonDisabled]}
              onPress={confirmSaveTemplate}
              disabled={!templateName.trim()}
            >
              <Text style={styles.createButtonText}>Salvar Template</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  serviceContainer: {
    marginBottom: 12,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: -12,
    marginHorizontal: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  // Event Details Styles
  detailsContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#64748B',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  detailsContent: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
    backgroundColor: '#6366F1',
    height: 200,
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: '#6366F1',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  bannerAction: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    minHeight: 400,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  // Cronograma Styles - Reduced spacing
  cronogramaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cronogramaItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemIndentado: {
    marginLeft: 32,
    backgroundColor: '#FEFEFE',
  },
  dragHandle: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cronogramaContent: {
    flex: 1,
  },
  cabecalhoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cabecalhoLine: {
    width: 4,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  cronogramaCabecalho: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  cronogramaHorario: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    minWidth: 40,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cronogramaTitulo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4B5563',
    flex: 1,
  },
  cronogramaArtista: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  cronogramaDuracao: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '400',
  },
  cronogramaSeparator: {
    height: 4,
    backgroundColor: '#F8FAFC',
  },
  pessoasContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  pessoaChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 40,
    alignItems: 'center',
  },
  pessoaName: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  // Duração Total Styles
  duracaoTotalContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 16,
  },
  duracaoTotalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  duracaoTotalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tomBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  tomText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  // Equipe Styles - Optimized spacing
  equipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  equipeSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    flex: 1,
  },
  equipeSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  sendAllButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  sendAllButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  equipeContainer: {
    paddingHorizontal: 16,
  },
  equipeGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  equipeHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  equipeNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  blockedMemberItem: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  blockedMemberName: {
    color: '#D97706',
  },
  memberRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inviteButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F0FDF4',
  },
  infoButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
  },
  equipeSeparator: {
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  blockedListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  blockedListButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  blockedMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  blockedMemberInfo: {
    flex: 1,
  },
  blockedMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
  },
  blockedMemberRole: {
    fontSize: 14,
    color: '#92400E',
    marginTop: 2,
  },
  blockedMemberReason: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Música Tab Styles
  musicasContainer: {
    padding: 16,
  },
  musicasHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  musicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  musicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  musicArtist: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  musicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  musicTime: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  musicDuration: {
    fontSize: 12,
    color: '#94A3B8',
  },
  musicPeople: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  musicPersonChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  musicPersonName: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '500',
  },
  musicActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  musicKeyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 24,
    alignItems: 'center',
  },
  musicKeyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  horariosInfo: {
    padding: 16,
  },
  horariosEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  horariosText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  horariosExtrasContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  horariosExtrasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  horarioExtraCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  horarioExtraInfo: {
    flex: 1,
  },
  horarioExtraNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  horarioExtraData: {
    fontSize: 14,
    color: '#6366F1',
    marginBottom: 4,
  },
  horarioExtraLocal: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  horarioExtraDescricao: {
    fontSize: 14,
    color: '#64748B',
  },
  removeHorarioButton: {
    padding: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6366F1',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addMenu: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    gap: 8,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addMenuText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  volunteerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 16,
  },
  volunteerSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  volunteerList: {
    maxHeight: 400,
  },
  volunteerTeamTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  volunteerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  blockedVolunteerItem: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  volunteerInfo: {
    flex: 1,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  blockedVolunteerName: {
    color: '#D97706',
  },
  volunteerRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  volunteerBlockReason: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 4,
    fontStyle: 'italic',
  },
  teamSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  modalTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 4,
  },
  modalTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  modalTabActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalTabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  modalTabTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  templateOptions: {
    gap: 12,
    marginBottom: 24,
  },
  templateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  templateOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  templateInfo: {
    marginLeft: 12,
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  templateNameSelected: {
    color: '#6366F1',
  },
  templateDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
  templateOptionsSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  templateCheckOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  templateCheckInfo: {
    flex: 1,
  },
  templateCheckLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  templateCheckDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalSaveButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Pessoas Selection Styles
  pessoasSelection: {
    paddingVertical: 8,
  },
  pessoasSelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  selectedPessoas: {
    marginBottom: 20,
  },
  selectedPessoasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectedPessoasChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedPessoaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedPessoaName: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  pessoasList: {
    gap: 8,
  },
  pessoaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  pessoaItemSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  pessoaAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pessoaAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pessoaInfoModal: {
    flex: 1,
  },
  pessoaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  pessoaRoleModal: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  // Song Modal Styles
  songModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
    padding: 24,
  },
  songModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  songModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  songDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  songDetail: {
    alignItems: 'center',
  },
  songDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  songDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  lyricsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  lyricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  lyricsText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  emptySpace: {
    height: 100,
  },
});