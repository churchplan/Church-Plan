import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface CronogramaItem {
  id: string;
  tipo: 'cabecalho' | 'etapa' | 'musica';
  titulo: string;
  descricao?: string;
  horario: string;
  duracao?: string;
  tom?: string;
  artista?: string;
  pessoas?: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  confirmed: boolean;
}

interface HorarioExtra {
  id: string;
  nome: string;
  data: string;
  horario: string;
  local: string;
  descricao: string;
}

export default function EventoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = id !== 'novo';
  const isViewOnly = id === 'view'; // Modo visualização para voluntários

  const [activeTab, setActiveTab] = useState<'etapas' | 'equipe' | 'midias' | 'horarios'>('etapas');
  const [eventoTitulo, setEventoTitulo] = useState(isEditing ? 'Culto Dominical' : '');
  const [eventoData, setEventoData] = useState(isEditing ? '07/09/2024' : '');
  const [eventoHorario, setEventoHorario] = useState(isEditing ? '19:00' : '');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop');
  const [showSongModal, setShowSongModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  
  const [cronograma, setCronograma] = useState<CronogramaItem[]>(isEditing ? [
    { id: '1', tipo: 'cabecalho', titulo: 'Início', horario: '19:00' },
    { id: '2', tipo: 'etapa', titulo: 'Vídeo Teaser', horario: '19:00', duracao: '3', pessoas: ['1'] },
    { id: '3', tipo: 'cabecalho', titulo: 'Louvor', horario: '19:03' },
    { id: '4', tipo: 'musica', titulo: 'Se Aperfeiçoa Em Mim', horario: '19:03', tom: 'C', artista: 'Ministério Zoe', duracao: '5', pessoas: ['1', '2'] },
    { id: '5', tipo: 'musica', titulo: 'TUDO É PERDA', horario: '19:08', tom: 'Db', artista: 'Morada', duracao: '5', pessoas: ['1'] },
    { id: '6', tipo: 'musica', titulo: 'LINDO MOMENTO', horario: '19:13', tom: 'C#', artista: 'Ministério Zoe', duracao: '5', pessoas: ['2'] },
    { id: '7', tipo: 'musica', titulo: 'Vitorioso És / Victory is Yours', horario: '19:18', tom: 'F', artista: 'Elevation Worship', duracao: '7', pessoas: ['1', '2'] },
    { id: '8', tipo: 'cabecalho', titulo: 'Oração de Guerra', horario: '19:25' },
    { id: '9', tipo: 'etapa', titulo: 'Oração', horario: '19:25', duracao: '10', pessoas: ['3'] },
    { id: '10', tipo: 'cabecalho', titulo: 'News', horario: '19:35' }
  ] : []);
  
  const [equipe, setEquipe] = useState<TeamMember[]>(isEditing ? [
    { id: '1', name: 'João Silva', role: 'Vocal', confirmed: true },
    { id: '2', name: 'Maria Santos', role: 'Teclado', confirmed: true },
    { id: '3', name: 'Pedro Costa', role: 'Guitarra', confirmed: false },
    { id: '4', name: 'Ana Lima', role: 'Bateria', confirmed: true }
  ] : []);

  const [horariosExtras] = useState<HorarioExtra[]>([
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

  const songs = [
    { id: '4', title: 'Se Aperfeiçoa Em Mim', artist: 'Ministério Zoe', key: 'C', tempo: '75 BPM', duration: '4:30', lyrics: 'Se aperfeiçoa em mim o Teu amor\nSe aperfeiçoa em mim a Tua paz...' },
    { id: '5', title: 'TUDO É PERDA', artist: 'Morada', key: 'Db', tempo: '72 BPM', duration: '5:15', lyrics: 'Tudo é perda se comparado\nAo tesouro que há em Ti...' },
    { id: '6', title: 'LINDO MOMENTO', artist: 'Ministério Zoe', key: 'C#', tempo: '68 BPM', duration: '4:45', lyrics: 'Lindo momento é este aqui\nDe estar aos Teus pés...' },
  ];

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

  const openSongDetails = (titulo: string) => {
    const song = songs.find(s => s.title === titulo);
    const cronogramItem = cronograma.find(s => s.titulo === titulo);
    
    if (song || cronogramItem) {
      setSelectedSong({
        title: cronogramItem?.titulo || song?.title,
        artist: cronogramItem?.artista || song?.artist,
        key: cronogramItem?.tom || song?.key,
        tempo: song?.tempo,
        duration: cronogramItem?.duracao ? `${cronogramItem.duracao}min` : song?.duration,
        lyrics: song?.lyrics || 'Letra não disponível'
      });
      setShowSongModal(true);
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

  const getPersonName = (personId: string) => {
    const allMembers = equipe;
    const person = allMembers.find(m => m.id === personId);
    return person?.name || 'Pessoa';
  };

  const getPersonFirstName = (personId: string) => {
    const fullName = getPersonName(personId);
    return fullName.split(' ')[0];
  };

  const cronogramaOrdenado = cronograma.sort((a, b) => {
    return a.horario.localeCompare(b.horario);
  });

  // Get songs from cronogram for midias tab
  const cronogramSongs = cronograma.filter(item => item.tipo === 'musica');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'etapas':
        return (
          <View style={styles.tabContent}>
            {cronogramaOrdenado.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="event-note" size={64} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Cronograma Vazio</Text>
                <Text style={styles.emptySubtitle}>
                  Nenhum item foi adicionado ainda
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
                        <View style={styles.cronogramaItem}>
                          <View style={styles.dragHandle}>
                            <MaterialIcons name="tag" size={16} color="#10B981" />
                          </View>
                          <View style={styles.cronogramaLeft}>
                            <Text style={styles.cronogramaHorario}>{item.horario}</Text>
                            <View style={styles.cronogramaTitleContainer}>
                              <Text style={styles.cronogramaCabecalho}>{item.titulo}</Text>
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
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity 
                          style={[styles.cronogramaItem, styles.itemIndentado]}
                          onPress={() => item.tipo === 'musica' && openSongDetails(item.titulo)}
                          disabled={item.tipo !== 'musica'}
                        >
                          <View style={styles.dragHandle}>
                            <Text style={styles.cronogramaHash}>#</Text>
                          </View>
                          <View style={styles.cronogramaLeft}>
                            <Text style={styles.cronogramaHorario}>{item.horario}</Text>
                            <View style={styles.cronogramaTitleContainer}>
                              <Text style={styles.cronogramaTitulo}>
                                {item.titulo}
                                {item.artista && <Text style={styles.cronogramaArtista}> - {item.artista}</Text>}
                                {item.duracao && <Text style={styles.cronogramaDuracao}> • {item.duracao}min</Text>}
                              </Text>
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
                          </View>
                          
                          <View style={styles.cronogramaRight}>
                            {item.tom && (
                              <View style={[styles.tomBadge, { backgroundColor: getTipoColor(item.tipo) }]}>
                                <Text style={styles.tomText}>{item.tom}</Text>
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

                {/* Duração Total */}
                <View style={styles.duracaoTotalContainer}>
                  <Text style={styles.duracaoTotalTitle}>Duração Total do Evento</Text>
                  <Text style={styles.duracaoTotalValue}>{calcularDuracaoTotal()}</Text>
                </View>

                {/* Botão Imprimir/PDF para voluntários */}
                <View style={styles.actionButtonsContainer}>
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
            )}
          </View>
        );

      case 'equipe':
        return (
          <View style={styles.tabContent}>
            <View style={styles.equipeContainer}>
              {[
                {
                  equipe: 'Ministério de Louvor',
                  membros: equipe.filter(m => ['Vocal', 'Teclado', 'Guitarra', 'Bateria'].includes(m.role))
                },
                {
                  equipe: 'Equipe Técnica',
                  membros: equipe.filter(m => ['Som', 'Vídeo', 'Iluminação'].includes(m.role))
                }
              ].map((grupo, index) => (
                <View key={index}>
                  <View style={styles.equipeGroup}>
                    <View style={styles.equipeHeader}>
                      <Text style={styles.equipeNome}>{grupo.equipe}</Text>
                    </View>
                    
                    {grupo.membros.map((member) => (
                      <View key={member.id} style={styles.memberItem}>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>{member.name}</Text>
                          <Text style={styles.memberRole}>{member.role}</Text>
                        </View>
                        <View style={[styles.statusBadge, { 
                          backgroundColor: member.confirmed ? '#10B981' : '#F59E0B' 
                        }]}>
                          <Text style={styles.statusText}>
                            {member.confirmed ? 'Confirmado' : 'Pendente'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  
                  {index < 1 && <View style={styles.equipeSeparator} />}
                </View>
              ))}
            </View>
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
              <Text style={styles.horariosText}>Data: {eventoData}</Text>
              <Text style={styles.horariosText}>Horário: {eventoHorario}</Text>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isViewOnly ? 'Visualizar Culto' : 'Editar Culto'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: bannerUrl }} style={styles.banner} />
          <View style={styles.bannerOverlay}>
            <View style={[styles.bannerBadge, { backgroundColor: 'rgba(16, 185, 129, 0.9)' }]}>
              <MaterialIcons name="church" size={16} color="#FFFFFF" />
              <Text style={styles.bannerBadgeText}>Culto</Text>
            </View>
          </View>
        </View>

        {/* Event Header */}
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{eventoTitulo || 'Novo Evento'}</Text>
          <View style={styles.eventSubInfo}>
            <View style={styles.eventInfoRow}>
              <MaterialIcons name="calendar-today" size={16} color="#6366F1" />
              <Text style={styles.eventInfoText}>{eventoData} às {eventoHorario}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <MaterialIcons name="list" size={16} color="#10B981" />
              <Text style={styles.eventInfoText}>{cronograma.length} itens no cronograma</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { key: 'etapas', label: 'Cronograma', icon: 'list' },
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

        {/* Tab Content */}
        {renderTabContent()}

        <View style={styles.emptySpace} />
      </ScrollView>
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
                  
                  <View style={styles.songDetailsExtended}>
                    <View style={styles.songDetailRow}>
                      <Text style={styles.songDetailLabel}>BPM:</Text>
                      <Text style={styles.songDetailValue}>{selectedSong.tempo?.replace(' BPM', '') || 'N/A'}</Text>
                    </View>
                    <View style={styles.songDetailRow}>
                      <Text style={styles.songDetailLabel}>Assinatura:</Text>
                      <Text style={styles.songDetailValue}>4/4</Text>
                    </View>
                  </View>
                  
                  {selectedSong.lyrics && (
                    <View style={styles.lyricsContainer}>
                      <Text style={styles.lyricsTitle}>Letra com Cifra:</Text>
                      <Text style={styles.lyricsText}>{selectedSong.lyrics}</Text>
                    </View>
                  )}
                  
                  <View style={styles.songActions}>
                    <TouchableOpacity style={styles.printButton}>
                      <MaterialIcons name="print" size={20} color="#6366F1" />
                      <Text style={styles.printButtonText}>Imprimir / PDF</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#6366F1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#F8FAFC',
  },
  banner: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  eventHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  eventSubInfo: {
    gap: 8,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#64748B',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 13,
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
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  cronogramaContainer: {
    padding: 12,
  },
  cronogramaItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemIndentado: {
    marginLeft: 20,
    backgroundColor: '#FEFEFE',
  },
  dragHandle: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cronogramaLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  cronogramaHash: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'bold',
    width: 16,
    marginTop: 2,
  },
  cronogramaHorario: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    minWidth: 45,
    marginTop: 2,
  },
  cronogramaTitleContainer: {
    flex: 1,
  },
  cronogramaTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  cronogramaCabecalho: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  cronogramaArtista: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  cronogramaDuracao: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  cronogramaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cronogramaSeparator: {
    height: 8,
    backgroundColor: '#F8FAFC',
  },
  pessoasContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  pessoaChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  pessoaName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
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
  equipeContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  equipeGroup: {
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  equipeHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  memberRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  equipeSeparator: {
    height: 2,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  songModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 24,
  },
  songModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    marginBottom: 6,
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
    backgroundColor: '#FAFBFC',
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
  songDetailsExtended: {
    backgroundColor: '#FAFBFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  songDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lyricsContainer: {
    backgroundColor: '#FAFBFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
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
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  songActions: {
    alignItems: 'center',
  },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  printButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  emptySpace: {
    height: 100,
  },
});