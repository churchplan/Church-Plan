import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ScaleMember {
  id: string;
  name: string;
  status: 'accepted' | 'declined' | 'pending';
  sent?: boolean;
}

interface DateScale {
  id: string;
  date: string;
  eventName: string;
  positions: {
    [key: string]: ScaleMember[];
  };
}

export default function PlanilhaEscalasScreen() {
  const router = useRouter();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ teamId: string; positionId: string } | null>(null);
  const [selectedDateForSend, setSelectedDateForSend] = useState<DateScale | null>(null);
  const [selectedMembersToSend, setSelectedMembersToSend] = useState<string[]>([]);
  const [searchMember, setSearchMember] = useState('');

  // Mock de membros disponíveis
  const availableMembers = [
    { id: '1', name: 'João Silva', team: 'Louvor', role: 'Vocal' },
    { id: '2', name: 'Maria Santos', team: 'Louvor', role: 'Teclado' },
    { id: '3', name: 'Pedro Costa', team: 'Louvor', role: 'Guitarra' },
    { id: '4', name: 'Ana Lima', team: 'Louvor', role: 'Bateria' },
    { id: '5', name: 'Carlos Mendes', team: 'Louvor', role: 'Vocal' },
    { id: '6', name: 'Roberto Silva', team: 'Técnica', role: 'Som' },
    { id: '7', name: 'Fernanda Costa', team: 'Técnica', role: 'Vídeo' },
    { id: '8', name: 'Paulo Santos', team: 'Técnica', role: 'Iluminação' },
  ];

  const positions = ['Vocal', 'Guitarra', 'Bateria', 'Teclado', 'Baixo'];

  const [scaleData, setScaleData] = useState<DateScale[]>([
    {
      id: '1',
      date: '07/09/2024',
      eventName: 'Culto Dominical',
      positions: {
        'Vocal': [
          { id: '1', name: 'João Silva', status: 'accepted', sent: true },
          { id: '2', name: 'Maria Santos', status: 'pending', sent: false }
        ],
        'Guitarra': [
          { id: '3', name: 'Pedro Costa', status: 'accepted', sent: false }
        ],
        'Bateria': [
          { id: '4', name: 'Ana Lima', status: 'declined', sent: false }
        ],
        'Teclado': [],
        'Baixo': []
      }
    },
    {
      id: '2',
      date: '14/09/2024',
      eventName: 'Culto de Quarta',
      positions: {
        'Vocal': [
          { id: '5', name: 'Carlos Mendes', status: 'pending', sent: false }
        ],
        'Guitarra': [],
        'Bateria': [],
        'Teclado': [
          { id: '2', name: 'Maria Santos', status: 'accepted', sent: false }
        ],
        'Baixo': []
      }
    },
    {
      id: '3',
      date: '21/09/2024',
      eventName: 'Culto Dominical',
      positions: {
        'Vocal': [],
        'Guitarra': [],
        'Bateria': [],
        'Teclado': [],
        'Baixo': []
      }
    },
    {
      id: '4',
      date: '28/09/2024',
      eventName: 'Culto Jovem',
      positions: {
        'Vocal': [],
        'Guitarra': [],
        'Bateria': [],
        'Teclado': [],
        'Baixo': []
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10B981';
      case 'declined': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  const openAddMember = (dateId: string, positionName: string) => {
    setSelectedPosition({ teamId: dateId, positionId: positionName });
    setShowAddMemberModal(true);
  };

  const addMemberToPosition = (member: any) => {
    if (!selectedPosition) return;

    const newMember: ScaleMember = {
      id: member.id,
      name: member.name,
      status: 'pending'
    };

    setScaleData(prev => prev.map(dateScale => {
      if (dateScale.id === selectedPosition.teamId) {
        return {
          ...dateScale,
          positions: {
            ...dateScale.positions,
            [selectedPosition.positionId]: [
              ...dateScale.positions[selectedPosition.positionId],
              newMember
            ]
          }
        };
      }
      return dateScale;
    }));

    setShowAddMemberModal(false);
    setSearchMember('');
    setSelectedPosition(null);
  };

  const removeMember = (dateId: string, positionName: string, memberId: string) => {
    setScaleData(prev => prev.map(dateScale => {
      if (dateScale.id === dateId) {
        return {
          ...dateScale,
          positions: {
            ...dateScale.positions,
            [positionName]: dateScale.positions[positionName].filter(m => m.id !== memberId)
          }
        };
      }
      return dateScale;
    }));
  };

  const autoFillScales = () => {
    if (Platform.OS === 'web') {
      console.log('Preencher escalas automaticamente com IA');
    } else {
      Alert.alert('Preencher Automático', 'A IA irá preencher as escalas automaticamente com base na disponibilidade dos membros.');
    }
  };

  const openSendModal = (dateId: string) => {
    const dateScale = scaleData.find(d => d.id === dateId);
    if (!dateScale) return;
    
    setSelectedDateForSend(dateScale);
    // Pré-selecionar apenas membros não enviados
    const allMembers: string[] = [];
    Object.values(dateScale.positions).forEach(members => {
      members.forEach(member => {
        if (!member.sent && !allMembers.includes(member.id)) {
          allMembers.push(member.id);
        }
      });
    });
    setSelectedMembersToSend(allMembers);
    setShowSendModal(true);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembersToSend(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const selectAllMembers = () => {
    if (!selectedDateForSend) return;
    const allMembers: string[] = [];
    Object.values(selectedDateForSend.positions).forEach(members => {
      members.forEach(member => {
        if (!member.sent && !allMembers.includes(member.id)) {
          allMembers.push(member.id);
        }
      });
    });
    setSelectedMembersToSend(allMembers);
  };

  const deselectAllMembers = () => {
    setSelectedMembersToSend([]);
  };

  const sendSelectedMembers = () => {
    if (!selectedDateForSend || selectedMembersToSend.length === 0) return;
    
    const confirmSend = () => {
      // Marcar membros como enviados
      setScaleData(prev => prev.map(dateScale => {
        if (dateScale.id === selectedDateForSend.id) {
          const updatedPositions = { ...dateScale.positions };
          Object.keys(updatedPositions).forEach(position => {
            updatedPositions[position] = updatedPositions[position].map(member => {
              if (selectedMembersToSend.includes(member.id)) {
                return { ...member, sent: true };
              }
              return member;
            });
          });
          return { ...dateScale, positions: updatedPositions };
        }
        return dateScale;
      }));
      console.log('Escala enviada para:', selectedMembersToSend);
      setShowSendModal(false);
    };
    
    if (Platform.OS === 'web') {
      confirmSend();
    } else {
      Alert.alert(
        'Enviar Escala',
        `Enviar convites para ${selectedMembersToSend.length} membro(s) em ${selectedDateForSend.date}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Enviar', onPress: confirmSend }
        ]
      );
    }
  };

  const filteredMembers = availableMembers.filter(member =>
    searchMember === '' || 
    member.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planilha de Escalas</Text>
        <TouchableOpacity style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBar}>
        <View style={styles.infoBarTop}>
          <View style={styles.infoBarLeft}>
            <Text style={styles.infoText}>Ministério de Louvor - Escalas Mensais</Text>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>Aceito</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendText}>Pendente</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Recusado</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.autoFillButton} onPress={autoFillScales}>
            <MaterialIcons name="auto-fix-high" size={14} color="#FFFFFF" />
            <Text style={styles.autoFillButtonText}>Preencher Automático</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
        <View style={styles.tableContainer}>
          {/* Cabeçalho da Tabela */}
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.dateCellHeader]}>
              <Text style={styles.headerText}>Data</Text>
            </View>
            {positions.map((position, index) => (
              <View key={index} style={[styles.tableCell, styles.positionCellHeader]}>
                <Text style={styles.headerText}>{position}</Text>
              </View>
            ))}
          </View>

          {/* Linhas de Dados */}
          <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
            {scaleData.map((dateScale) => (
              <View key={dateScale.id} style={styles.tableRow}>
                {/* Coluna de Data */}
                <View style={[styles.tableCell, styles.dateCell]}>
                  <Text style={styles.dateText}>{dateScale.date}</Text>
                  <Text style={styles.eventNameText} numberOfLines={2}>{dateScale.eventName}</Text>
                  <TouchableOpacity 
                    style={styles.sendDateButton}
                    onPress={() => openSendModal(dateScale.id)}
                  >
                    <MaterialIcons name="send" size={14} color="#FFFFFF" />
                    <Text style={styles.sendDateButtonText}>Enviar</Text>
                  </TouchableOpacity>
                </View>

                {/* Colunas de Posições */}
                {positions.map((position, index) => (
                  <View key={index} style={[styles.tableCell, styles.positionCell]}>
                    <View style={styles.membersContainer}>
                      {dateScale.positions[position].map((member) => (
                        <View 
                          key={member.id} 
                          style={[
                            styles.memberChip,
                            { borderLeftWidth: 3, borderLeftColor: getStatusColor(member.status) }
                          ]}
                        >
                          <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
                          <TouchableOpacity 
                            onPress={() => removeMember(dateScale.id, position, member.id)}
                          >
                            <MaterialIcons name="close" size={14} color="#64748B" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => openAddMember(dateScale.id, position)}
                      >
                        <MaterialIcons name="add" size={16} color="#10B981" />
                        <Text style={styles.addButtonText}>Adicionar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal Enviar Escala */}
      <Modal visible={showSendModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enviar Escala</Text>
              <TouchableOpacity onPress={() => setShowSendModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDateForSend && (
              <View style={styles.sendModalInfo}>
                <Text style={styles.sendModalDate}>{selectedDateForSend.date}</Text>
                <Text style={styles.sendModalEvent}>{selectedDateForSend.eventName}</Text>
              </View>
            )}

            <View style={styles.selectionActions}>
              <TouchableOpacity 
                style={styles.selectionActionButton}
                onPress={selectAllMembers}
              >
                <MaterialIcons name="check-circle" size={18} color="#10B981" />
                <Text style={styles.selectionActionText}>Selecionar Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.selectionActionButton}
                onPress={deselectAllMembers}
              >
                <MaterialIcons name="cancel" size={18} color="#EF4444" />
                <Text style={styles.selectionActionText}>Desmarcar Todos</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.sendMembersList}>
              {selectedDateForSend && Object.entries(selectedDateForSend.positions).map(([position, members]) => {
                const unsentMembers = members.filter(m => !m.sent);
                return unsentMembers.length > 0 && (
                  <View key={position} style={styles.sendPositionGroup}>
                    <Text style={styles.sendPositionTitle}>{position}</Text>
                    {unsentMembers.map((member) => (
                      <TouchableOpacity
                        key={member.id}
                        style={styles.sendMemberOption}
                        onPress={() => toggleMemberSelection(member.id)}
                      >
                        <View style={styles.checkboxContainer}>
                          <View style={[
                            styles.checkbox,
                            selectedMembersToSend.includes(member.id) && styles.checkboxChecked
                          ]}>
                            {selectedMembersToSend.includes(member.id) && (
                              <MaterialIcons name="check" size={18} color="#FFFFFF" />
                            )}
                          </View>
                        </View>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberInitial}>
                            {member.name.charAt(0)}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberOptionName}>{member.name}</Text>
                          <Text style={styles.memberRole}>{position}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.sendModalFooter}>
              <Text style={styles.selectedCount}>
                {selectedMembersToSend.length} membro(s) selecionado(s)
              </Text>
              <TouchableOpacity 
                style={[
                  styles.sendConfirmButton,
                  selectedMembersToSend.length === 0 && styles.sendConfirmButtonDisabled
                ]}
                onPress={sendSelectedMembers}
                disabled={selectedMembersToSend.length === 0}
              >
                <MaterialIcons name="send" size={18} color="#FFFFFF" />
                <Text style={styles.sendConfirmButtonText}>Enviar Convites</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Adicionar Membro */}
      <Modal visible={showAddMemberModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Membro</Text>
              <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar membro..."
                placeholderTextColor="#94A3B8"
                value={searchMember}
                onChangeText={setSearchMember}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredMembers.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.memberOption}
                  onPress={() => addMemberToPosition(member)}
                >
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitial}>
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberOptionName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <MaterialIcons name="add-circle" size={24} color="#10B981" />
                </TouchableOpacity>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#10B981',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  sendButton: {
    padding: 8,
  },
  infoBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  infoBarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  infoBarLeft: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 3,
  },
  autoFillButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
  horizontalScroll: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderBottomWidth: 2,
    borderBottomColor: '#00D4AA',
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    padding: 10,
    justifyContent: 'flex-start',
  },
  dateCellHeader: {
    width: 110,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
  },
  positionCellHeader: {
    width: 140,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCell: {
    width: 110,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 100,
  },
  sendDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  sendDateButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  positionCell: {
    width: 140,
    minHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  eventNameText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  membersContainer: {
    gap: 6,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    minHeight: 32,
  },
  memberName: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 3,
    borderWidth: 1,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
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
    maxHeight: '70%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  memberRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sendModalInfo: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  sendModalDate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sendModalEvent: {
    fontSize: 14,
    color: '#64748B',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  selectionActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  selectionActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  sendMembersList: {
    maxHeight: 300,
  },
  sendPositionGroup: {
    marginBottom: 20,
  },
  sendPositionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    paddingLeft: 4,
  },
  sendMemberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 4,
    gap: 8,
  },
  checkboxContainer: {
    marginRight: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },

  sendModalFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    textAlign: 'center',
  },
  sendConfirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  sendConfirmButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  sendConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

});