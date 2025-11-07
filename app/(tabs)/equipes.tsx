import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { worshipService } from '../../services/worshipService';

interface CustomTeam {
  id: string;
  name: string;
  color: string;
  subgroups: string[];
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  team: string;
  subgroup: string;
  isAdmin: boolean;
  adminType?: 'full' | 'team_only' | 'read_only';
  active: boolean;
  lastService?: string;
}

export default function EquipesScreen() {
  const router = useRouter();
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newSubgroups, setNewSubgroups] = useState(['']);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [functionSearch, setFunctionSearch] = useState('');
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    phone: '',
    team: '',
    subgroup: '',
    isAdmin: false,
    adminType: 'read_only' as 'full' | 'team_only' | 'read_only'
  });

  const [customTeams, setCustomTeams] = useState<CustomTeam[]>([
    {
      id: '1',
      name: 'Ministério de Louvor',
      color: '#6366F1',
      subgroups: ['Vocal', 'Guitarra', 'Baixo', 'Bateria', 'Teclado'],
      members: [
        { id: '1', name: 'João Silva', email: 'joao@igreja.com', phone: '(11) 99999-9999', team: 'Ministério de Louvor', subgroup: 'Vocal', isAdmin: false, active: true, lastService: '31/08/2024' },
        { id: '2', name: 'Maria Santos', email: 'maria@igreja.com', phone: '(11) 88888-8888', team: 'Ministério de Louvor', subgroup: 'Teclado', isAdmin: true, adminType: 'team_only', active: true, lastService: '31/08/2024' }
      ]
    },
    {
      id: '2',
      name: 'Equipe Técnica',
      color: '#10B981',
      subgroups: ['Som', 'Vídeo', 'Iluminação', 'Transmissão'],
      members: [
        { id: '3', name: 'Pedro Costa', email: 'pedro@igreja.com', phone: '(11) 77777-7777', team: 'Equipe Técnica', subgroup: 'Som', isAdmin: false, active: true, lastService: '24/08/2024' },
        { id: '4', name: 'Ana Lima', email: 'ana@igreja.com', phone: '(11) 66666-6666', team: 'Equipe Técnica', subgroup: 'Vídeo', isAdmin: true, adminType: 'full', active: true, lastService: '31/08/2024' }
      ]
    },
    {
      id: '3',
      name: 'Ministração',
      color: '#8B5CF6',
      subgroups: ['Pastor', 'Pregador', 'Intercessão'],
      members: [
        { id: '5', name: 'Pastor Marcos', email: 'marcos@igreja.com', phone: '(11) 55555-5555', team: 'Ministração', subgroup: 'Pastor', isAdmin: true, adminType: 'full', active: true, lastService: '31/08/2024' }
      ]
    }
  ]);

  const addSubgroup = () => {
    setNewSubgroups([...newSubgroups, '']);
  };

  const updateSubgroup = (index: number, value: string) => {
    const updated = [...newSubgroups];
    updated[index] = value;
    setNewSubgroups(updated);
  };

  const removeSubgroup = (index: number) => {
    if (newSubgroups.length > 1) {
      const updated = newSubgroups.filter((_, i) => i !== index);
      setNewSubgroups(updated);
    }
  };

  const createNewTeam = () => {
    if (!newTeamName.trim()) return;
    
    const validSubgroups = newSubgroups.filter(sg => sg.trim() !== '');
    if (validSubgroups.length === 0) return;
    
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const newTeam: CustomTeam = {
      id: Date.now().toString(),
      name: newTeamName,
      color: colors[customTeams.length % colors.length],
      subgroups: validSubgroups,
      members: []
    };
    
    setCustomTeams([...customTeams, newTeam]);
    setNewTeamName('');
    setNewSubgroups(['']);
    setShowCreateTeamModal(false);
    
    if (Platform.OS === 'web') {
      console.log('Equipe criada:', newTeam.name);
    } else {
      Alert.alert('Sucesso', `Equipe "${newTeam.name}" foi criada!`);
    }
  };

  const addNewMember = () => {
    if (!newMemberData.name || !newMemberData.email || !newMemberData.team || !newMemberData.subgroup) return;
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberData.name,
      email: newMemberData.email,
      phone: newMemberData.phone,
      team: newMemberData.team,
      subgroup: newMemberData.subgroup,
      isAdmin: newMemberData.isAdmin,
      adminType: newMemberData.adminType,
      active: true
    };
    
    const updatedTeams = customTeams.map(team => 
      team.name === newMemberData.team 
        ? { ...team, members: [...team.members, newMember] }
        : team
    );
    
    setCustomTeams(updatedTeams);
    setNewMemberData({
      name: '',
      email: '',
      phone: '',
      team: '',
      subgroup: '',
      isAdmin: false,
      adminType: 'read_only'
    });
    setShowAddMemberModal(false);
    
    if (Platform.OS === 'web') {
      console.log('Membro adicionado:', newMember.name);
    } else {
      Alert.alert('Sucesso', `${newMember.name} foi adicionado à equipe!`);
    }
  };

  const toggleTeamExpansion = (teamName: string) => {
    if (expandedTeams.includes(teamName)) {
      setExpandedTeams(expandedTeams.filter(name => name !== teamName));
    } else {
      setExpandedTeams([...expandedTeams, teamName]);
    }
  };

  const selectTeamAndFunction = (teamName: string, functionName: string) => {
    setNewMemberData(prev => ({
      ...prev,
      team: teamName,
      subgroup: functionName
    }));
  };

  const getAdminTypeText = (type?: string) => {
    switch (type) {
      case 'full': return 'Admin Geral';
      case 'team_only': return 'Admin da Equipe';
      case 'read_only': return 'Visualização';
      default: return 'Membro';
    }
  };

  const toggleMemberStatus = (teamId: string, memberId: string) => {
    const updatedTeams = customTeams.map(team => 
      team.id === teamId 
        ? {
            ...team, 
            members: team.members.map(member => 
              member.id === memberId 
                ? { ...member, active: !member.active }
                : member
            )
          }
        : team
    );
    setCustomTeams(updatedTeams);
  };

  const filteredTeamsForFunction = customTeams.map(team => ({
    ...team,
    subgroups: team.subgroups.filter(subgroup =>
      functionSearch === '' || 
      subgroup.toLowerCase().includes(functionSearch.toLowerCase()) ||
      team.name.toLowerCase().includes(functionSearch.toLowerCase())
    )
  })).filter(team => team.subgroups.length > 0 || functionSearch === '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Equipes</Text>
          <Text style={styles.subtitle}>Gerencie equipes e membros</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.createTeamButton} onPress={() => setShowCreateTeamModal(true)}>
            <MaterialIcons name="group-add" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Criar Equipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addMemberButton} onPress={() => setShowAddMemberModal(true)}>
            <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Adicionar Pessoa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão Ver Pontuações */}
      <TouchableOpacity 
        style={styles.scoreButton}
        onPress={() => router.push('/pontuacoes-equipe')}
      >
        <MaterialIcons name="emoji-events" size={24} color="#FFFFFF" />
        <Text style={styles.scoreButtonText}>Ver Pontuações da Equipe</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar equipes ou pessoas..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Teams */}
        {customTeams.filter(team => 
          searchQuery === '' || 
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.members.some(member => 
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ).map((team) => (
          <View key={team.id} style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={styles.teamTitle}>
                <View style={[styles.teamColorIndicator, { backgroundColor: team.color }]} />
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamCount}>({team.members.length})</Text>
              </View>
            </View>

            {/* Subgroups */}
            <View style={styles.subgroupsContainer}>
              <Text style={styles.subgroupsTitle}>Funções:</Text>
              <View style={styles.subgroupsList}>
                {team.subgroups.map((subgroup, index) => (
                  <View key={index} style={[styles.subgroupBadge, { borderColor: team.color }]}>
                    <Text style={[styles.subgroupText, { color: team.color }]}>{subgroup}</Text>
                  </View>
                ))}
              </View>
            </View>

            {team.members.filter(member =>
              searchQuery === '' ||
              member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              team.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={[styles.memberAvatar, { backgroundColor: team.color }]}>
                    <Text style={styles.memberInitial}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.memberDetails}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                    <Text style={styles.memberPhone}>{member.phone}</Text>
                    <View style={styles.memberBadges}>
                      <View style={[styles.badge, { backgroundColor: team.color }]}>
                        <Text style={styles.badgeText}>{member.subgroup}</Text>
                      </View>
                      {member.isAdmin && (
                        <View style={[styles.badge, styles.adminBadge]}>
                          <MaterialIcons name="admin-panel-settings" size={12} color="#FFFFFF" />
                          <Text style={styles.badgeText}>{getAdminTypeText(member.adminType)}</Text>
                        </View>
                      )}
                      <View style={[styles.badge, { backgroundColor: member.active ? '#10B981' : '#94A3B8' }]}>
                        <Text style={styles.badgeText}>{member.active ? 'Ativo' : 'Inativo'}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.memberActions}>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => toggleMemberStatus(team.id, member.id)}
                  >
                    <MaterialIcons 
                      name={member.active ? "pause-circle" : "play-circle"} 
                      size={20} 
                      color={member.active ? "#F59E0B" : "#10B981"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.emptySpace} />
      </ScrollView>

      {/* Modal Criar Equipe */}
      <Modal visible={showCreateTeamModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Criar Nova Equipe</Text>
              <TouchableOpacity onPress={() => setShowCreateTeamModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome da Equipe</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTeamName}
                  onChangeText={setNewTeamName}
                  placeholder="Ex: Ministério de Louvor, Equipe Técnica..."
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Funções/Subgrupos</Text>
                {newSubgroups.map((subgroup, index) => (
                  <View key={index} style={styles.subgroupInputRow}>
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      value={subgroup}
                      onChangeText={(text) => updateSubgroup(index, text)}
                      placeholder="Ex: Vocal, Guitarra, Som..."
                      placeholderTextColor="#94A3B8"
                    />
                    {newSubgroups.length > 1 && (
                      <TouchableOpacity 
                        style={styles.removeSubgroupButton}
                        onPress={() => removeSubgroup(index)}
                      >
                        <MaterialIcons name="remove-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity style={styles.addSubgroupButton} onPress={addSubgroup}>
                  <MaterialIcons name="add-circle" size={20} color="#10B981" />
                  <Text style={styles.addSubgroupText}>Adicionar Função</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.createButton, (!newTeamName.trim() || newSubgroups.filter(sg => sg.trim()).length === 0) && styles.createButtonDisabled]}
              onPress={createNewTeam}
              disabled={!newTeamName.trim() || newSubgroups.filter(sg => sg.trim()).length === 0}
            >
              <Text style={styles.createButtonText}>Criar Equipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Adicionar Membro */}
      <Modal visible={showAddMemberModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Pessoa</Text>
              <TouchableOpacity onPress={() => setShowAddMemberModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.textInput}
                  value={newMemberData.name}
                  onChangeText={(text) => setNewMemberData({...newMemberData, name: text})}
                  placeholder="Digite o nome completo"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={newMemberData.email}
                  onChangeText={(text) => setNewMemberData({...newMemberData, email: text})}
                  placeholder="email@igreja.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.textInput}
                  value={newMemberData.phone}
                  onChangeText={(text) => setNewMemberData({...newMemberData, phone: text})}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Seção de Equipes e Posições Colapsável */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Equipes e Posições</Text>
                
                {!newMemberData.team || !newMemberData.subgroup ? (
                  <View style={styles.noPositionContainer}>
                    <Text style={styles.noPositionText}>SEM POSIÇÕES DEFINIDAS</Text>
                  </View>
                ) : (
                  <View style={styles.selectedPositionContainer}>
                    <Text style={styles.selectedPositionTeam}>{newMemberData.team}</Text>
                    <Text style={styles.selectedPositionFunction}>{newMemberData.subgroup}</Text>
                  </View>
                )}

                <Text style={styles.selectPositionLabel}>Selecione uma Equipe e Posição</Text>
                
                {/* Barra de Pesquisa de Funções */}
                <View style={styles.functionSearchContainer}>
                  <MaterialIcons name="search" size={16} color="#64748B" />
                  <TextInput
                    style={styles.functionSearchInput}
                    placeholder="Buscar função..."
                    placeholderTextColor="#94A3B8"
                    value={functionSearch}
                    onChangeText={setFunctionSearch}
                  />
                  {functionSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setFunctionSearch('')}>
                      <MaterialIcons name="clear" size={16} color="#64748B" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Lista de Equipes e Funções */}
                <View style={styles.teamsListContainer}>
                  {filteredTeamsForFunction.map((team) => (
                    <View key={team.id}>
                      <TouchableOpacity 
                        style={styles.teamHeaderCollapsible}
                        onPress={() => toggleTeamExpansion(team.name)}
                      >
                        <Text style={styles.teamHeaderText}>{team.name}</Text>
                        <MaterialIcons 
                          name={expandedTeams.includes(team.name) ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                          size={24} 
                          color="#64748B" 
                        />
                      </TouchableOpacity>

                      {expandedTeams.includes(team.name) && (
                        <View style={styles.functionsContainer}>
                          {team.subgroups.map((subgroup, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.functionItem,
                                newMemberData.team === team.name && newMemberData.subgroup === subgroup && styles.functionItemSelected
                              ]}
                              onPress={() => selectTeamAndFunction(team.name, subgroup)}
                            >
                              <Text style={[
                                styles.functionText,
                                newMemberData.team === team.name && newMemberData.subgroup === subgroup && styles.functionTextSelected
                              ]}>
                                {subgroup}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.addPositionButton}>
                  <MaterialIcons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.addPositionText}>Adicionar Posição</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.checkboxGroup}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => setNewMemberData({...newMemberData, isAdmin: !newMemberData.isAdmin})}
                  >
                    <MaterialIcons 
                      name={newMemberData.isAdmin ? "check-box" : "check-box-outline-blank"} 
                      size={24} 
                      color="#6366F1" 
                    />
                    <Text style={styles.checkboxLabel}>É Administrador</Text>
                  </TouchableOpacity>
                </View>

                {newMemberData.isAdmin && (
                  <View style={styles.adminTypeGroup}>
                    <Text style={styles.inputLabel}>Tipo de Administrador</Text>
                    {[
                      { value: 'read_only', label: 'Visualização Apenas', desc: 'Pode apenas visualizar informações' },
                      { value: 'team_only', label: 'Administrador da Equipe', desc: 'Gerencia apenas sua equipe' },
                      { value: 'full', label: 'Administrador Geral', desc: 'Acesso completo ao sistema' }
                    ].map((type) => (
                      <TouchableOpacity 
                        key={type.value}
                        style={[styles.adminTypeOption, newMemberData.adminType === type.value && styles.adminTypeOptionSelected]}
                        onPress={() => setNewMemberData({...newMemberData, adminType: type.value as any})}
                      >
                        <MaterialIcons 
                          name={newMemberData.adminType === type.value ? "radio-button-checked" : "radio-button-unchecked"} 
                          size={20} 
                          color="#6366F1" 
                        />
                        <View style={styles.adminTypeInfo}>
                          <Text style={[styles.adminTypeLabel, newMemberData.adminType === type.value && styles.adminTypeLabelSelected]}>
                            {type.label}
                          </Text>
                          <Text style={styles.adminTypeDesc}>{type.desc}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.createButton, (!newMemberData.name || !newMemberData.email || !newMemberData.team || !newMemberData.subgroup) && styles.createButtonDisabled]}
              onPress={addNewMember}
              disabled={!newMemberData.name || !newMemberData.email || !newMemberData.team || !newMemberData.subgroup}
            >
              <Text style={styles.createButtonText}>Adicionar Pessoa</Text>
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
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  createTeamButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  addMemberButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  teamHeader: {
    marginBottom: 16,
  },
  teamTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  teamCount: {
    fontSize: 14,
    color: '#64748B',
  },
  subgroupsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subgroupsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  subgroupsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subgroupBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  subgroupText: {
    fontSize: 12,
    fontWeight: '500',
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  memberDetails: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  memberEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  memberPhone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  memberBadges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  adminBadge: {
    backgroundColor: '#6366F1',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 4,
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
  inputGroup: {
    marginBottom: 20,
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
  },
  subgroupInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  removeSubgroupButton: {
    padding: 4,
  },
  addSubgroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  addSubgroupText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxGroup: {
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  adminTypeGroup: {
    gap: 8,
  },
  adminTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  adminTypeOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  adminTypeInfo: {
    flex: 1,
  },
  adminTypeLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  adminTypeLabelSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
  adminTypeDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para interface colapsável
  noPositionContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  noPositionText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedPositionContainer: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  selectedPositionTeam: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  selectedPositionFunction: {
    fontSize: 14,
    color: '#4F46E5',
    marginTop: 2,
  },
  selectPositionLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  functionSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  functionSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  teamsListContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  teamHeaderCollapsible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  teamHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  functionsContainer: {
    backgroundColor: '#FFFFFF',
  },
  functionItem: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  functionItemSelected: {
    backgroundColor: '#6366F1',
  },
  functionText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  functionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addPositionButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addPositionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptySpace: {
    height: 100,
  },
  scoreButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
});