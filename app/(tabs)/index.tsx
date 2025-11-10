import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { worshipService } from '../../services/worshipService';

interface OrganizationApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface CronogramaItem {
  id: string;
  tipo: 'cabecalho' | 'etapa' | 'musica';
  titulo: string;
  descricao?: string;
  horario: string;
  duracao?: string;
  tom?: string;
  artista?: string;
}

export default function MinhaAgendaScreen() {
  const router = useRouter();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [blockedSectionExpanded, setBlockedSectionExpanded] = useState(false);
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [currentApp, setCurrentApp] = useState('Church Helper');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showSongModal, setShowSongModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  
  const myEvents = worshipService.getMySchedule();
  const blockedDates = worshipService.getBlockedDates();
  const songs = worshipService.getSongLibrary();

  // Mock cronograma para visualização
  const mockCronograma: CronogramaItem[] = [
    { id: '1', tipo: 'cabecalho', titulo: 'Início', horario: '19:00' },
    { id: '2', tipo: 'etapa', titulo: 'Vídeo Teaser', horario: '19:00', duracao: '3min' },
    { id: '3', tipo: 'cabecalho', titulo: 'Louvor', horario: '19:03' },
    { id: '4', tipo: 'musica', titulo: 'Se Aperfeiçoa Em Mim', horario: '19:03', tom: 'C', artista: 'Ministério Zoe' },
    { id: '5', tipo: 'musica', titulo: 'TUDO É PERDA', horario: '19:08', tom: 'Db', artista: 'Morada' },
    { id: '6', tipo: 'musica', titulo: 'LINDO MOMENTO', horario: '19:13', tom: 'C#', artista: 'Ministério Zoe' },
    { id: '7', tipo: 'musica', titulo: 'Vitorioso És / Victory is Yours', horario: '19:18', tom: 'F', artista: 'Elevation Worship' },
    { id: '8', tipo: 'cabecalho', titulo: 'Oração de Guerra', horario: '19:25' },
    { id: '9', tipo: 'etapa', titulo: 'Oração', horario: '19:25', duracao: '10min' },
    { id: '10', tipo: 'cabecalho', titulo: 'News', horario: '19:35' }
  ];

  const organizationApps: OrganizationApp[] = [
    {
      id: '1',
      name: 'Church Helper',
      icon: 'church',
      color: '#1CE5C0',
      description: 'Organização de cultos e equipes'
    },
    {
      id: '2',
      name: 'Finance',
      icon: 'account-balance',
      color: '#5DBBF5',
      description: 'Gestão financeira da igreja'
    },
    {
      id: '3',
      name: 'Members',
      icon: 'people',
      color: '#F59E0B',
      description: 'Cadastro de membros'
    },
    {
      id: '4',
      name: 'School',
      icon: 'school',
      color: '#2B6B8F',
      description: 'Escola bíblica dominical'
    }
  ];

  const showBlockDatesModal = () => {
    setShowBlockModal(true);
  };

  const addBlockedDate = () => {
    if (Platform.OS === 'web') {
      console.log('Adicionar data bloqueada:', selectedDate);
    } else {
      Alert.alert('Data Bloqueada', `Data ${selectedDate} foi bloqueada com sucesso`);
    }
    setShowBlockModal(false);
  };

  const removeBlockedDate = (date: string) => {
    if (Platform.OS === 'web') {
      console.log('Remover bloqueio:', date);
    } else {
      Alert.alert('Bloqueio Removido', `Bloqueio da data ${date} foi removido`);
    }
  };

  const confirmPresence = (eventId: string) => {
    if (Platform.OS === 'web') {
      console.log('Confirmar presença:', eventId);
    } else {
      Alert.alert('Presença Confirmada', 'Sua presença foi confirmada com sucesso!');
    }
  };

  const denyPresence = (eventId: string) => {
    if (Platform.OS === 'web') {
      console.log('Negar presença:', eventId);
    } else {
      Alert.alert('Presença Negada', 'Sua ausência foi registrada. Obrigado por avisar!');
    }
  };

  const openProfile = () => {
    router.push('../perfil' as any);
  };

  const switchApp = (app: OrganizationApp) => {
    setCurrentApp(app.name);
    setShowAppSelector(false);
    
    if (Platform.OS === 'web') {
      console.log('Mudando para app:', app.name);
    } else {
      Alert.alert('App Alterado', `Agora você está no ${app.name}`);
    }
  };

  const openEventDetails = (eventId: string) => {
    router.push('/evento/view' as any);
  };

  const openSongDetails = (titulo: string) => {
    const song = songs.find(s => s.title === titulo);
    if (song) {
      setSelectedSong(song);
      setShowSongModal(true);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'cabecalho': return '#00D4AA';
      case 'etapa': return '#4A90E2';
      case 'musica': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const cronogramaOrdenado = mockCronograma.sort((a, b) => {
    return a.horario.localeCompare(b.horario);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.appSelector} 
            onPress={() => setShowAppSelector(true)}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>CH</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.currentAppName}>{currentApp}</Text>
              <View style={styles.appIndicator}>
                <MaterialIcons name="apps" size={12} color="#64748B" />
                <Text style={styles.appCount}>{organizationApps.length} apps</Text>
              </View>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.profileSection} onPress={openProfile}>
          <Text style={styles.userName}>João Silva</Text>
          <View style={styles.profileAvatar}>
            <MaterialIcons name="person" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.title}>Sua Agenda</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topSpacer} />
        <View style={styles.section}>
          {myEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <TouchableOpacity 
                style={styles.eventHeader}
                onPress={() => openEventDetails(event.id)}
              >
                <View style={styles.eventLeftSection}>
                  <View style={styles.eventIconContainer}>
                    <MaterialIcons name="church" size={20} color="#00D4AA" />
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventMetaRow}>
                      <MaterialIcons name="calendar-today" size={12} color="#4A90E2" />
                      <Text style={styles.eventDate}>{event.date} às {event.time}</Text>
                    </View>
                    <View style={styles.eventMetaRow}>
                      <MaterialIcons name="person" size={12} color="#00D4AA" />
                      <Text style={styles.eventRole}>{event.myRole}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.eventActions}>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: event.confirmed ? '#00D4AA' : '#F59E0B' 
                  }]}>
                    <MaterialIcons 
                      name={event.confirmed ? "check-circle" : "schedule"} 
                      size={10} 
                      color="#FFFFFF" 
                    />
                    <Text style={styles.statusText}>
                      {event.confirmed ? 'Confirmado' : 'Pendente'}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
              
              {!event.confirmed && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={() => confirmPresence(event.id)}
                  >
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Aceitar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.denyButton}
                    onPress={() => denyPresence(event.id)}
                  >
                    <MaterialIcons name="close" size={16} color="#FFFFFF" />
                    <Text style={styles.denyButtonText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Datas Bloqueadas */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.expandableHeader} 
            onPress={() => setBlockedSectionExpanded(!blockedSectionExpanded)}
          >
            <Text style={styles.sectionTitle}>Datas Bloqueadas</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.addBlockButton} onPress={showBlockDatesModal}>
                <MaterialIcons name="add" size={14} color="#FFFFFF" />
              </TouchableOpacity>
              <MaterialIcons 
                name={blockedSectionExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={20} 
                color="#64748B" 
              />
            </View>
          </TouchableOpacity>
          
          {blockedSectionExpanded && (
            <> 
              {blockedDates.length === 0 ? (
                <View style={styles.emptyCard}>
                  <MaterialIcons name="event-busy" size={40} color="#CBD5E1" />
                  <Text style={styles.emptyText}>Nenhuma data bloqueada</Text>
                  <Text style={styles.emptySubtext}>Toque no "+" para adicionar</Text>
                </View>
              ) : (
                blockedDates.map((blocked) => (
                  <View key={blocked.id} style={styles.blockedCard}>
                    <View style={styles.blockedInfo}>
                      <MaterialIcons name="event-busy" size={20} color="#EF4444" />
                      <View style={styles.blockedDetails}>
                        <Text style={styles.blockedDate}>{blocked.date}</Text>
                        <Text style={styles.blockedReason}>{blocked.reason}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeBlockedDate(blocked.date)}
                    >
                      <MaterialIcons name="close" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </>
          )}
        </View>

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

      {/* App Selector Modal */}
      <Modal visible={showAppSelector} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.appModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aplicativos da Organização</Text>
              <TouchableOpacity onPress={() => setShowAppSelector(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Escolha qual aplicativo você deseja usar:
            </Text>
            
            <View style={styles.appsGrid}>
              {organizationApps.map((app) => (
                <TouchableOpacity 
                  key={app.id}
                  style={[
                    styles.appCard, 
                    currentApp === app.name && styles.appCardSelected
                  ]}
                  onPress={() => switchApp(app)}
                >
                  <View style={[styles.appIcon, { backgroundColor: app.color }]}>
                    <MaterialIcons name={app.icon as any} size={32} color="#FFFFFF" />
                  </View>
                  <Text style={[
                    styles.appName, 
                    currentApp === app.name && styles.appNameSelected
                  ]}>
                    {app.name}
                  </Text>
                  <Text style={styles.appDescription}>{app.description}</Text>
                  {currentApp === app.name && (
                    <View style={styles.currentAppBadge}>
                      <MaterialIcons name="check-circle" size={16} color="#00D4AA" />
                      <Text style={styles.currentAppText}>Atual</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Bloqueios */}
      <Modal visible={showBlockModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.blockModalContent}>
            <View style={styles.blockModalHeader}>
              <MaterialIcons name="event-busy" size={24} color="#64748B" />
              <Text style={styles.blockModalTitle}>Adicionar Bloqueio</Text>
              <TouchableOpacity onPress={() => setShowBlockModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.blockModalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.blockInputGroup}>
                <Text style={styles.blockInputLabel}>Data inicial</Text>
                <TouchableOpacity style={styles.datePickerButton}>
                  <Text style={styles.datePickerText}>Selecione a data inicial</Text>
                  <MaterialIcons name="calendar-today" size={20} color="#4A90E2" />
                </TouchableOpacity>
              </View>

              <View style={styles.blockInputGroup}>
                <Text style={styles.blockInputLabel}>Data final</Text>
                <TouchableOpacity style={styles.datePickerButton}>
                  <Text style={styles.datePickerText}>Selecione a data final</Text>
                  <MaterialIcons name="calendar-today" size={20} color="#4A90E2" />
                </TouchableOpacity>
                <Text style={styles.optionalText}>(Opcional - para bloqueios de múltiplos dias)</Text>
              </View>

              <View style={styles.blockInputGroup}>
                <Text style={styles.blockInputLabel}>Motivo</Text>
                <TextInput
                  style={styles.blockTextInput}
                  placeholder="Ex: Viagem de trabalho, compromisso familiar..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.blockInputGroup}>
                <Text style={styles.blockInputLabel}>Horários indisponíveis</Text>
                <Text style={styles.periodSubtitle}>Selecione os períodos que não estará disponível:</Text>
                
                <View style={styles.timePeriodsContainer}>
                  {[
                    { id: 'madrugada', label: 'Madrugada (00h ~ 06h)', color: '#4A90E2' },
                    { id: 'manha', label: 'Manhã (06h ~ 12h)', color: '#4A90E2' },
                    { id: 'tarde', label: 'Tarde (12h ~ 18h)', color: '#4A90E2' },
                    { id: 'noite', label: 'Noite (18h ~ 00h)', color: '#4A90E2' }
                  ].map((period) => (
                    <TouchableOpacity key={period.id} style={styles.periodCheckbox}>
                      <MaterialIcons name="check-box" size={24} color={period.color} />
                      <Text style={styles.periodLabel}>{period.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.blockModalActions}>
              <TouchableOpacity style={styles.blockCancelButton} onPress={() => setShowBlockModal(false)}>
                <Text style={styles.blockCancelText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.blockConfirmButton} onPress={addBlockedDate}>
                <Text style={styles.blockConfirmText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flex: 1,
  },
  appSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: 140,
  },
  logoContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1CE5C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  logo: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appInfo: {
    flex: 1,
  },
  currentAppName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 1,
  },
  appIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  appCount: {
    fontSize: 8,
    color: '#64748B',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2B6B8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topSpacer: {
    height: 60,
  },
  section: {
    marginBottom: 20,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  addBlockButton: {
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8FFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  eventDate: {
    fontSize: 13,
    color: '#5DBBF5',
    fontWeight: '500',
  },
  eventRole: {
    fontSize: 13,
    color: '#1CE5C0',
    fontWeight: '500',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  confirmButton: {
    backgroundColor: '#1CE5C0',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  denyButton: {
    backgroundColor: '#EF4444',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  denyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  blockedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  blockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blockedDetails: {
    marginLeft: 10,
  },
  blockedDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  blockedReason: {
    fontSize: 12,
    color: '#64748B',
  },
  removeButton: {
    padding: 4,
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
    padding: 24,
  },
  appModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  appsGrid: {
    gap: 12,
  },
  appCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  appCardSelected: {
    borderColor: '#00D4AA',
    backgroundColor: '#F0FDF4',
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  appNameSelected: {
    color: '#00D4AA',
  },
  appDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  currentAppBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FFFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  currentAppText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1CE5C0',
  },
  dateOptions: {
    gap: 8,
    marginBottom: 24,
  },
  dateOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  dateOptionSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#EEF2FF',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  dateOptionTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  addBlockButtonModal: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBlockButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  addBlockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Block Modal Styles
  blockModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '95%',
    maxWidth: 400,
    maxHeight: '85%',
    padding: 0,
    overflow: 'hidden',
  },
  blockModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  blockModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  blockModalScroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  blockInputGroup: {
    marginBottom: 20,
  },
  blockInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  datePickerText: {
    fontSize: 16,
    color: '#64748B',
  },
  optionalText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  blockTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  periodSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  timePeriodsContainer: {
    gap: 12,
  },
  periodCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  periodLabel: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  blockModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  blockCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  blockCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  blockConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1CE5C0',
  },
  blockConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 80,
  },
});