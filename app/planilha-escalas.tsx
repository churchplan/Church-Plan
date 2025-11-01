import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ScaleMember {
  id: string;
  name: string;
  status: 'accepted' | 'declined' | 'pending';
}

interface DateScale {
  id: string;
  date: string;
  positions: {
    [key: string]: ScaleMember[];
  };
}

export default function PlanilhaEscalasScreen() {
  const router = useRouter();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ teamId: string; positionId: string } | null>(null);
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
      positions: {
        'Vocal': [
          { id: '1', name: 'João Silva', status: 'accepted' },
          { id: '2', name: 'Maria Santos', status: 'pending' }
        ],
        'Guitarra': [
          { id: '3', name: 'Pedro Costa', status: 'accepted' }
        ],
        'Bateria': [
          { id: '4', name: 'Ana Lima', status: 'declined' }
        ],
        'Teclado': [],
        'Baixo': []
      }
    },
    {
      id: '2',
      date: '14/09/2024',
      positions: {
        'Vocal': [
          { id: '5', name: 'Carlos Mendes', status: 'pending' }
        ],
        'Guitarra': [],
        'Bateria': [],
        'Teclado': [
          { id: '2', name: 'Maria Santos', status: 'accepted' }
        ],
        'Baixo': []
      }
    },
    {
      id: '3',
      date: '21/09/2024',
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
    width: 100,
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
    width: 100,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
  },
  positionCell: {
    width: 140,
    minHeight: 80,
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
  membersContainer: {
    gap: 6,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  memberRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },

});