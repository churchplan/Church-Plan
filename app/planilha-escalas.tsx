import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ScaleMember {
  id: string;
  name: string;
  status: 'accepted' | 'declined' | 'pending';
}

interface Position {
  id: string;
  name: string;
  members: ScaleMember[];
}

interface Team {
  id: string;
  name: string;
  positions: Position[];
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

  const [scaleData, setScaleData] = useState<Team[]>([
    {
      id: '1',
      name: 'Ministério de Louvor',
      positions: [
        { 
          id: '1', 
          name: 'Vocal', 
          members: [
            { id: '1', name: 'João Silva', status: 'accepted' },
            { id: '2', name: 'Maria Santos', status: 'pending' }
          ]
        },
        { 
          id: '2', 
          name: 'Guitarra', 
          members: [
            { id: '3', name: 'Pedro Costa', status: 'accepted' }
          ]
        },
        { 
          id: '3', 
          name: 'Bateria', 
          members: [
            { id: '4', name: 'Ana Lima', status: 'declined' }
          ]
        },
        { id: '4', name: 'Teclado', members: [] },
        { id: '5', name: 'Baixo', members: [] },
      ]
    },
    {
      id: '2',
      name: 'Equipe Técnica',
      positions: [
        { 
          id: '6', 
          name: 'Som', 
          members: [
            { id: '6', name: 'Roberto Silva', status: 'accepted' }
          ]
        },
        { 
          id: '7', 
          name: 'Vídeo', 
          members: [
            { id: '7', name: 'Fernanda Costa', status: 'pending' }
          ]
        },
        { id: '8', name: 'Iluminação', members: [] },
        { id: '9', name: 'Transmissão', members: [] },
      ]
    },
    {
      id: '3',
      name: 'Ministração',
      positions: [
        { id: '10', name: 'Pastor', members: [] },
        { id: '11', name: 'Pregador', members: [] },
        { id: '12', name: 'Intercessão', members: [] },
      ]
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

  const openAddMember = (teamId: string, positionId: string) => {
    setSelectedPosition({ teamId, positionId });
    setShowAddMemberModal(true);
  };

  const addMemberToPosition = (member: any) => {
    if (!selectedPosition) return;

    const newMember: ScaleMember = {
      id: member.id,
      name: member.name,
      status: 'pending'
    };

    setScaleData(prev => prev.map(team => {
      if (team.id === selectedPosition.teamId) {
        return {
          ...team,
          positions: team.positions.map(pos => {
            if (pos.id === selectedPosition.positionId) {
              return {
                ...pos,
                members: [...pos.members, newMember]
              };
            }
            return pos;
          })
        };
      }
      return team;
    }));

    setShowAddMemberModal(false);
    setSearchMember('');
    setSelectedPosition(null);
  };

  const removeMember = (teamId: string, positionId: string, memberId: string) => {
    setScaleData(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          positions: team.positions.map(pos => {
            if (pos.id === positionId) {
              return {
                ...pos,
                members: pos.members.filter(m => m.id !== memberId)
              };
            }
            return pos;
          })
        };
      }
      return team;
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
        <Text style={styles.infoText}>Culto Dominical - 07/09/2024</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {scaleData.map((team) => (
          <View key={team.id} style={styles.teamSection}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>{team.name}</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              style={styles.positionsScroll}
            >
              <View style={styles.gridContainer}>
                {/* Header da Grade */}
                <View style={styles.gridRow}>
                  {team.positions.map((position) => (
                    <View key={position.id} style={styles.gridCell}>
                      <Text style={styles.positionName}>{position.name}</Text>
                    </View>
                  ))}
                </View>

                {/* Conteúdo da Grade */}
                <View style={styles.gridRow}>
                  {team.positions.map((position) => (
                    <View key={position.id} style={styles.gridCell}>
                      <View style={styles.membersContainer}>
                        {position.members.map((member) => (
                          <View 
                            key={member.id} 
                            style={[
                              styles.memberChip,
                              { borderColor: getStatusColor(member.status) }
                            ]}
                          >
                            <Text style={styles.memberName}>{member.name}</Text>
                            <TouchableOpacity 
                              onPress={() => removeMember(team.id, position.id, member.id)}
                            >
                              <MaterialIcons name="close" size={14} color="#64748B" />
                            </TouchableOpacity>
                          </View>
                        ))}
                        
                        <TouchableOpacity 
                          style={styles.addButton}
                          onPress={() => openAddMember(team.id, position.id)}
                        >
                          <MaterialIcons name="add" size={16} color="#00D4AA" />
                          <Text style={styles.addButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        ))}

        <View style={styles.emptySpace} />
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
    backgroundColor: '#00D4AA',
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
  content: {
    flex: 1,
  },
  teamSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  teamHeader: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  positionsScroll: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'column',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 160,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#FEFEFE',
  },
  positionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  membersContainer: {
    gap: 8,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
  },
  memberName: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#00D4AA',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 12,
    color: '#00D4AA',
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
    backgroundColor: '#00D4AA',
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
  emptySpace: {
    height: 100,
  },
});