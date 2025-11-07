import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface MemberScore {
  id: string;
  name: string;
  team: string;
  subgroup: string;
  acceptedScales: number;
  declinedScales: number;
  checkins: number;
  totalPoints: number;
  avatar?: string;
}

export default function PontuacoesEquipeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'points' | 'checkins' | 'accepted'>('points');

  // Mock de dados de pontuação
  const membersScores: MemberScore[] = [
    {
      id: '1',
      name: 'Maria Santos',
      team: 'Ministério de Louvor',
      subgroup: 'Teclado',
      acceptedScales: 45,
      declinedScales: 2,
      checkins: 43,
      totalPoints: 320
    },
    {
      id: '2',
      name: 'João Silva',
      team: 'Ministério de Louvor',
      subgroup: 'Vocal',
      acceptedScales: 42,
      declinedScales: 5,
      checkins: 40,
      totalPoints: 285
    },
    {
      id: '3',
      name: 'Pedro Costa',
      team: 'Ministério de Louvor',
      subgroup: 'Guitarra',
      acceptedScales: 40,
      declinedScales: 3,
      checkins: 38,
      totalPoints: 267
    },
    {
      id: '4',
      name: 'Ana Lima',
      team: 'Ministério de Louvor',
      subgroup: 'Bateria',
      acceptedScales: 38,
      declinedScales: 4,
      checkins: 36,
      totalPoints: 245
    },
    {
      id: '5',
      name: 'Carlos Mendes',
      team: 'Ministério de Louvor',
      subgroup: 'Baixo',
      acceptedScales: 35,
      declinedScales: 7,
      checkins: 32,
      totalPoints: 218
    },
    {
      id: '6',
      name: 'Roberto Silva',
      team: 'Equipe Técnica',
      subgroup: 'Som',
      acceptedScales: 48,
      declinedScales: 1,
      checkins: 47,
      totalPoints: 345
    },
    {
      id: '7',
      name: 'Fernanda Costa',
      team: 'Equipe Técnica',
      subgroup: 'Vídeo',
      acceptedScales: 44,
      declinedScales: 3,
      checkins: 42,
      totalPoints: 298
    }
  ];

  const teams = ['all', 'Ministério de Louvor', 'Equipe Técnica', 'Ministração'];

  const filteredMembers = membersScores
    .filter(member => {
      const matchesSearch = searchQuery === '' || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.subgroup.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = selectedTeam === 'all' || member.team === selectedTeam;
      return matchesSearch && matchesTeam;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.totalPoints - a.totalPoints;
        case 'checkins':
          return b.checkins - a.checkins;
        case 'accepted':
          return b.acceptedScales - a.acceptedScales;
        default:
          return 0;
      }
    });

  const getTeamColor = (team: string) => {
    switch (team) {
      case 'Ministério de Louvor': return '#6366F1';
      case 'Equipe Técnica': return '#10B981';
      case 'Ministração': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getRankingPosition = (index: number) => {
    return index + 1;
  };

  const getRankingColor = (position: number) => {
    switch (position) {
      case 1: return '#F59E0B';
      case 2: return '#8B5CF6';
      case 3: return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Pontuações da Equipe</Text>
          <Text style={styles.headerSubtitle}>Desempenho dos membros</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar membro..."
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

          {/* Team Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamFilters}>
            {teams.map((team) => (
              <TouchableOpacity
                key={team}
                style={[
                  styles.teamFilterButton,
                  selectedTeam === team && styles.teamFilterButtonActive
                ]}
                onPress={() => setSelectedTeam(team)}
              >
                <Text style={[
                  styles.teamFilterText,
                  selectedTeam === team && styles.teamFilterTextActive
                ]}>
                  {team === 'all' ? 'Todas as Equipes' : team}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort Options */}
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'points' && styles.sortButtonActive]}
                onPress={() => setSortBy('points')}
              >
                <MaterialIcons 
                  name="emoji-events" 
                  size={16} 
                  color={sortBy === 'points' ? '#FFFFFF' : '#64748B'} 
                />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'points' && styles.sortButtonTextActive
                ]}>Pontos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'checkins' && styles.sortButtonActive]}
                onPress={() => setSortBy('checkins')}
              >
                <MaterialIcons 
                  name="check-circle" 
                  size={16} 
                  color={sortBy === 'checkins' ? '#FFFFFF' : '#64748B'} 
                />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'checkins' && styles.sortButtonTextActive
                ]}>Check-ins</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'accepted' && styles.sortButtonActive]}
                onPress={() => setSortBy('accepted')}
              >
                <MaterialIcons 
                  name="thumb-up" 
                  size={16} 
                  color={sortBy === 'accepted' ? '#FFFFFF' : '#64748B'} 
                />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'accepted' && styles.sortButtonTextActive
                ]}>Aceitou</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Ranking List */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>🏆 Ranking Geral</Text>
          <Text style={styles.sectionSubtitle}>{filteredMembers.length} membros</Text>

          {filteredMembers.map((member, index) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={[
                  styles.rankingBadge, 
                  { backgroundColor: getRankingColor(getRankingPosition(index)) }
                ]}>
                  <Text style={styles.rankingText}>{getRankingPosition(index)}º</Text>
                </View>
                
                <View style={[styles.memberAvatar, { backgroundColor: getTeamColor(member.team) }]}>
                  <Text style={styles.memberInitial}>{member.name.charAt(0)}</Text>
                </View>
                
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberTeam}>{member.team}</Text>
                  <Text style={styles.memberSubgroup}>{member.subgroup}</Text>
                </View>
                
                <View style={styles.pointsContainer}>
                  <MaterialIcons name="emoji-events" size={24} color="#F59E0B" />
                  <Text style={styles.pointsValue}>{member.totalPoints}</Text>
                  <Text style={styles.pointsLabel}>pts</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <MaterialIcons name="thumb-up" size={20} color="#10B981" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{member.acceptedScales}</Text>
                    <Text style={styles.statLabel}>Aceitou</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <MaterialIcons name="thumb-down" size={20} color="#EF4444" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{member.declinedScales}</Text>
                    <Text style={styles.statLabel}>Recusou</Text>
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <MaterialIcons name="check-circle" size={20} color="#6366F1" />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{member.checkins}</Text>
                    <Text style={styles.statLabel}>Check-ins</Text>
                  </View>
                </View>
              </View>

              {/* Taxa de Presença */}
              <View style={styles.presenceRate}>
                <Text style={styles.presenceRateLabel}>Taxa de Presença:</Text>
                <View style={styles.presenceBarContainer}>
                  <View 
                    style={[
                      styles.presenceBar, 
                      { 
                        width: `${(member.checkins / member.acceptedScales * 100)}%`,
                        backgroundColor: member.checkins / member.acceptedScales >= 0.9 ? '#10B981' : 
                                       member.checkins / member.acceptedScales >= 0.7 ? '#F59E0B' : '#EF4444'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.presencePercentage}>
                  {Math.round((member.checkins / member.acceptedScales) * 100)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>
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
    backgroundColor: '#F59E0B',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filtersSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  teamFilters: {
    marginBottom: 12,
  },
  teamFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teamFilterButtonActive: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  teamFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  teamFilterTextActive: {
    color: '#FFFFFF',
  },
  sortContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  rankingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankingBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  memberTeam: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  memberSubgroup: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'center',
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#F1F5F9',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 4,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  presenceRate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  presenceRateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  presenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  presenceBar: {
    height: '100%',
    borderRadius: 4,
  },
  presencePercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    minWidth: 40,
    textAlign: 'right',
  },
  emptySpace: {
    height: 40,
  },
});
