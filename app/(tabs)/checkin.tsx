import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { worshipService } from '../../services/worshipService';

interface ServiceHistory {
  id: string;
  date: string;
  time: string;
  title: string;
  role: string;
  status: 'present' | 'absent' | 'late';
}

export default function CheckinScreen() {
  const [selectedEvent, setSelectedEvent] = useState('1');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [checkinMethod, setCheckinMethod] = useState<'qr' | 'location' | null>(null);
  
  const events = worshipService.getUpcomingEvents();
  const checkinData = worshipService.getCheckinData(selectedEvent);

  // Mock do histórico de serviços
  const serviceHistory: ServiceHistory[] = [
    { id: '1', date: '31/08/2024', time: '19:00', title: 'Culto Dominical', role: 'Vocal', status: 'present' },
    { id: '2', date: '28/08/2024', time: '20:00', title: 'Culto de Quarta', role: 'Backing Vocal', status: 'present' },
    { id: '3', date: '24/08/2024', time: '19:00', title: 'Culto Dominical', role: 'Vocal', status: 'late' },
    { id: '4', date: '21/08/2024', time: '20:00', title: 'Culto de Quarta', role: 'Backing Vocal', status: 'present' },
    { id: '5', date: '17/08/2024', time: '19:00', title: 'Culto Dominical', role: 'Vocal', status: 'absent' },
  ];

  const handleQRCheckin = () => {
    setCheckinMethod('qr');
    setShowQRScanner(true);
    // Simulação do QR Code Scanner
    setTimeout(() => {
      setShowQRScanner(false);
      if (Platform.OS === 'web') {
        console.log('Check-in via QR Code realizado');
      } else {
        Alert.alert('✅ Check-in Realizado!', 'Sua presença foi confirmada via QR Code.');
      }
    }, 2000);
  };

  const handleLocationCheckin = () => {
    setCheckinMethod('location');
    // Simulação da verificação de localização
    if (Platform.OS === 'web') {
      console.log('Check-in via localização realizado');
    } else {
      Alert.alert('✅ Check-in Realizado!', 'Sua presença foi confirmada via localização.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'present': return '#10B981';
      case 'absent': return '#EF4444';
      case 'pending': return '#F59E0B';
      case 'late': return '#F97316';
      default: return '#94A3B8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'present': return 'check-circle';
      case 'absent': return 'cancel';
      case 'pending': return 'schedule';
      case 'late': return 'access-time';
      default: return 'help';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'present': return 'Presente';
      case 'absent': return 'Ausente';
      case 'pending': return 'Pendente';
      case 'late': return 'Atrasado';
      default: return 'Indefinido';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Check-in</Text>
          <Text style={styles.subtitle}>Confirme sua presença com carinho</Text>
        </View>
        <TouchableOpacity style={styles.historyButton} onPress={() => setShowHistory(true)}>
          <MaterialIcons name="history" size={28} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Stats - Redesenhado */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>✨ Suas Conquistas</Text>
          <View style={styles.statusOverview}>
            <View style={styles.statusCard}>
              <MaterialIcons name="check-circle" size={32} color="#10B981" />
              <Text style={styles.statusNumber}>47</Text>
              <Text style={styles.statusLabel}>Check-ins</Text>
            </View>
            <View style={styles.statusCard}>
              <MaterialIcons name="emoji-events" size={32} color="#F59E0B" />
              <Text style={styles.statusNumber}>285</Text>
              <Text style={styles.statusLabel}>Pontos</Text>
            </View>
            <View style={styles.statusCard}>
              <MaterialIcons name="trending-up" size={32} color="#8B5CF6" />
              <Text style={styles.statusNumber}>2º</Text>
              <Text style={styles.statusLabel}>Posição</Text>
            </View>
          </View>
        </View>

        {/* Available Services - Redesenhado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎵 Cultos Disponíveis</Text>
          
          <View style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconContainer}>
                <MaterialIcons name="church" size={32} color="#8B5CF6" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>Culto Dominical</Text>
                <Text style={styles.serviceDate}>07/09/2024 às 19:00</Text>
                <Text style={styles.serviceRole}>🎤 Sua função: Guitarra</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Escalado</Text>
              </View>
            </View>
            
            <View style={styles.checkinActions}>
              <TouchableOpacity style={styles.checkinQRButton} onPress={handleQRCheckin}>
                <MaterialIcons name="qr-code-scanner" size={24} color="#FFFFFF" />
                <Text style={styles.checkinButtonText}>Escanear QR Code</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.checkinLocationButton} onPress={handleLocationCheckin}>
                <MaterialIcons name="location-on" size={24} color="#FFFFFF" />
                <Text style={styles.checkinButtonText}>Usar Localização</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconContainer}>
                <MaterialIcons name="group" size={32} color="#10B981" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>Culto de Quarta</Text>
                <Text style={styles.serviceDate}>10/09/2024 às 20:00</Text>
                <Text style={styles.serviceRole}>🎵 Sua função: Backing Vocal</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.statusText, { color: '#F59E0B' }]}>Aguardando</Text>
              </View>
            </View>
            
            <View style={styles.pendingContainer}>
              <MaterialIcons name="schedule" size={20} color="#F59E0B" />
              <Text style={styles.pendingMessage}>Aguardando confirmação da escalação</Text>
            </View>
          </View>
        </View>

        {/* Ranking - Redesenhado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Ranking de Pontos</Text>
          <Text style={styles.sectionSubtitle}>Ministério de Louvor</Text>
          <View style={styles.rankingList}>
            <View style={styles.rankingItem}>
              <View style={[styles.rankingPosition, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.rankingNumber}>1º</Text>
              </View>
              <Text style={styles.rankingName}>Maria Santos</Text>
              <Text style={styles.rankingPoints}>320 pts</Text>
            </View>
            
            <View style={[styles.rankingItem, styles.myRanking]}>
              <View style={[styles.rankingPosition, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.rankingNumber}>2º</Text>
              </View>
              <Text style={styles.rankingName}>João Silva (Você) 👑</Text>
              <Text style={styles.rankingPoints}>285 pts</Text>
            </View>
            
            <View style={styles.rankingItem}>
              <View style={[styles.rankingPosition, { backgroundColor: '#10B981' }]}>
                <Text style={styles.rankingNumber}>3º</Text>
              </View>
              <Text style={styles.rankingName}>Pedro Costa</Text>
              <Text style={styles.rankingPoints}>267 pts</Text>
            </View>
          </View>
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>

      {/* QR Scanner Modal - Redesenhado */}
      <Modal visible={showQRScanner} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.qrScannerContainer}>
            <View style={styles.qrScannerHeader}>
              <Text style={styles.qrScannerTitle}>📱 Escaneie o QR Code</Text>
              <TouchableOpacity onPress={() => setShowQRScanner(false)}>
                <MaterialIcons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrScannerFrame}>
              <View style={styles.qrScannerArea}>
                <MaterialIcons name="qr-code-scanner" size={80} color="#FFFFFF" />
                <Text style={styles.qrScannerText}>Posicione o QR Code no centro da tela</Text>
              </View>
            </View>
            
            <View style={styles.qrScannerInstructions}>
              <Text style={styles.instructionText}>📋 Mantenha o celular estável</Text>
              <Text style={styles.instructionText}>💡 Certifique-se de ter boa iluminação</Text>
              <Text style={styles.instructionText}>✨ O código será lido automaticamente</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* History Modal - Redesenhado */}
      <Modal visible={showHistory} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>📅 Histórico de Serviços</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <MaterialIcons name="close" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.historyContent} showsVerticalScrollIndicator={false}>
              {serviceHistory.map((service) => (
                <View key={service.id} style={styles.historyItem}>
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>{service.date}</Text>
                    <Text style={styles.historyTimeText}>{service.time}</Text>
                  </View>
                  
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyServiceTitle}>{service.title}</Text>
                    <Text style={styles.historyRole}>Função: {service.role}</Text>
                    <View style={[styles.historyStatusBadge, { backgroundColor: getStatusColor(service.status) }]}>
                      <MaterialIcons 
                        name={getStatusIcon(service.status)} 
                        size={14} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.historyStatusText}>
                        {getStatusText(service.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  historyButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 16,
  },
  statusOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 16,
    color: '#8B5CF6',
    marginBottom: 4,
    fontWeight: '600',
  },
  serviceRole: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
  },
  checkinActions: {
    gap: 16,
  },
  checkinQRButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkinLocationButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    gap: 8,
  },
  pendingMessage: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  rankingList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  myRanking: {
    backgroundColor: '#F3E8FF',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  rankingPosition: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankingNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rankingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  rankingPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScannerContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'transparent',
  },
  qrScannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrScannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrScannerFrame: {
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 24,
    overflow: 'hidden',
  },
  qrScannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  qrScannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  qrScannerInstructions: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '95%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  historyContent: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyDate: {
    width: 90,
    alignItems: 'center',
    marginRight: 20,
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  historyTimeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  historyDetails: {
    flex: 1,
  },
  historyServiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  historyRole: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  historyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  historyStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptySpace: {
    height: 40,
  },
});