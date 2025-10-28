import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

interface Escala {
  id: string;
  nome: string;
  evento: string;
  data: string;
  posicoes: Posicao[];
  status: 'rascunho' | 'enviada' | 'confirmada';
  totalMembros: number;
  confirmados: number;
  pendentes: number;
  recusados: number;
}

interface Posicao {
  id: string;
  nome: string;
  membro?: MembroEscalado;
}

interface MembroEscalado {
  id: string;
  nome: string;
  status: 'aceito' | 'recusado' | 'pendente';
}

export default function EscalasScreen() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [novaEscalaNome, setNovaEscalaNome] = useState('');
  const [novaEscalaEvento, setNovaEscalaEvento] = useState('');
  
  // Mock de escalas
  const [escalas, setEscalas] = useState<Escala[]>([
    {
      id: '1',
      nome: 'Escala Setembro 2024',
      evento: 'Cultos Dominicais',
      data: '01/09/2024 - 30/09/2024',
      posicoes: [],
      status: 'enviada',
      totalMembros: 12,
      confirmados: 8,
      pendentes: 3,
      recusados: 1
    },
    {
      id: '2',
      nome: 'Escala Evento Especial',
      evento: 'Conferência 2024',
      data: '15/10/2024',
      posicoes: [],
      status: 'confirmada',
      totalMembros: 15,
      confirmados: 15,
      pendentes: 0,
      recusados: 0
    },
    {
      id: '3',
      nome: 'Escala Outubro 2024',
      evento: 'Cultos Dominicais',
      data: '01/10/2024 - 31/10/2024',
      posicoes: [],
      status: 'rascunho',
      totalMembros: 10,
      confirmados: 0,
      pendentes: 10,
      recusados: 0
    }
  ]);

  const eventos = [
    'Cultos Dominicais',
    'Cultos de Quarta',
    'Conferência 2024',
    'Retiro Espiritual',
    'Evento Especial'
  ];

  const criarNovaEscala = () => {
    if (!novaEscalaNome || !novaEscalaEvento) {
      if (Platform.OS === 'web') {
        console.log('Preencha todos os campos');
      } else {
        Alert.alert('Atenção', 'Preencha o nome e selecione o evento');
      }
      return;
    }

    const novaEscala: Escala = {
      id: Date.now().toString(),
      nome: novaEscalaNome,
      evento: novaEscalaEvento,
      data: 'A definir',
      posicoes: [],
      status: 'rascunho',
      totalMembros: 0,
      confirmados: 0,
      pendentes: 0,
      recusados: 0
    };

    setEscalas([novaEscala, ...escalas]);
    setNovaEscalaNome('');
    setNovaEscalaEvento('');
    setShowCreateModal(false);
    
    // Navegar para edição
    router.push(`/escala/${novaEscala.id}` as any);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return Colors.primary.teal;
      case 'enviada': return Colors.accent.blue;
      case 'rascunho': return Colors.status.warning;
      default: return Colors.ui.disabled;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'enviada': return 'Enviada';
      case 'rascunho': return 'Rascunho';
      default: return 'Indefinido';
    }
  };

  const filteredEscalas = escalas.filter(escala => {
    const matchesSearch = escala.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         escala.evento.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'todas' || escala.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Escalas</Text>
          <Text style={styles.subtitle}>Gerencie escalas de forma inteligente</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <MaterialIcons name="filter-list" size={24} color={Colors.primary.navy} />
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar escalas..."
          placeholderTextColor={Colors.ui.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros Rápidos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilters}>
        {[
          { key: 'todas', label: 'Todas', icon: 'view-list' },
          { key: 'rascunho', label: 'Rascunho', icon: 'edit' },
          { key: 'enviada', label: 'Enviadas', icon: 'send' },
          { key: 'confirmada', label: 'Confirmadas', icon: 'check-circle' }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <MaterialIcons 
              name={filter.icon as any} 
              size={16} 
              color={selectedFilter === filter.key ? Colors.background.primary : Colors.text.secondary} 
            />
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter.key && styles.filterChipTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEscalas.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-note" size={64} color={Colors.ui.disabled} />
            <Text style={styles.emptyTitle}>Nenhuma escala encontrada</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Tente uma busca diferente' : 'Crie sua primeira escala'}
            </Text>
          </View>
        ) : (
          filteredEscalas.map((escala) => (
            <TouchableOpacity
              key={escala.id}
              style={styles.escalaCard}
              onPress={() => router.push(`/escala/${escala.id}` as any)}
            >
              <View style={styles.escalaHeader}>
                <View style={styles.escalaTitle}>
                  <MaterialIcons name="event-note" size={24} color={Colors.primary.teal} />
                  <View style={styles.escalaTitleText}>
                    <Text style={styles.escalaNome}>{escala.nome}</Text>
                    <Text style={styles.escalaEvento}>{escala.evento}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(escala.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(escala.status)}</Text>
                </View>
              </View>

              <View style={styles.escalaInfo}>
                <View style={styles.infoRow}>
                  <MaterialIcons name="calendar-today" size={16} color={Colors.accent.blue} />
                  <Text style={styles.infoText}>{escala.data}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="people" size={16} color={Colors.text.secondary} />
                  <Text style={styles.infoText}>{escala.totalMembros} membros</Text>
                </View>
              </View>

              {escala.status !== 'rascunho' && (
                <View style={styles.statusBar}>
                  <View style={styles.statusItem}>
                    <View style={[styles.statusDot, { backgroundColor: Colors.status.success }]} />
                    <Text style={styles.statusCount}>{escala.confirmados} aceitos</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <View style={[styles.statusDot, { backgroundColor: Colors.status.warning }]} />
                    <Text style={styles.statusCount}>{escala.pendentes} pendentes</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <View style={[styles.statusDot, { backgroundColor: Colors.status.error }]} />
                    <Text style={styles.statusCount}>{escala.recusados} recusados</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}

        <View style={styles.emptySpace} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal Criar Escala */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Escala</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Crie uma nova escala para organizar seu time
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Escala</Text>
              <TextInput
                style={styles.textInput}
                value={novaEscalaNome}
                onChangeText={setNovaEscalaNome}
                placeholder="Ex: Escala Setembro 2024"
                placeholderTextColor={Colors.ui.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Evento/Culto Base</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventosScroll}>
                {eventos.map((evento) => (
                  <TouchableOpacity
                    key={evento}
                    style={[
                      styles.eventoChip,
                      novaEscalaEvento === evento && styles.eventoChipSelected
                    ]}
                    onPress={() => setNovaEscalaEvento(evento)}
                  >
                    <Text style={[
                      styles.eventoChipText,
                      novaEscalaEvento === evento && styles.eventoChipTextSelected
                    ]}>
                      {evento}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity 
              style={[
                styles.createButton,
                (!novaEscalaNome || !novaEscalaEvento) && styles.createButtonDisabled
              ]}
              onPress={criarNovaEscala}
              disabled={!novaEscalaNome || !novaEscalaEvento}
            >
              <Text style={styles.createButtonText}>Criar Escala</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Filtros */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Filtre as escalas por status
            </Text>

            {[
              { key: 'todas', label: 'Todas as Escalas', icon: 'view-list' },
              { key: 'rascunho', label: 'Rascunho', icon: 'edit' },
              { key: 'enviada', label: 'Enviadas', icon: 'send' },
              { key: 'confirmada', label: 'Confirmadas', icon: 'check-circle' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterOption,
                  selectedFilter === filter.key && styles.filterOptionSelected
                ]}
                onPress={() => {
                  setSelectedFilter(filter.key);
                  setShowFilterModal(false);
                }}
              >
                <MaterialIcons 
                  name={filter.icon as any} 
                  size={24} 
                  color={selectedFilter === filter.key ? Colors.primary.teal : Colors.text.secondary} 
                />
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === filter.key && styles.filterOptionTextSelected
                ]}>
                  {filter.label}
                </Text>
                {selectedFilter === filter.key && (
                  <MaterialIcons name="check" size={20} color={Colors.primary.teal} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.tertiary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  quickFilters: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.background.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  escalaCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  escalaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  escalaTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  escalaTitleText: {
    flex: 1,
  },
  escalaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  escalaEvento: {
    fontSize: 14,
    color: Colors.accent.blue,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },
  escalaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.divider,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.ui.placeholder,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary.teal,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
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
    color: Colors.text.primary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  eventosScroll: {
    marginTop: 8,
  },
  eventoChip: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  eventoChipSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  eventoChipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  eventoChipTextSelected: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: Colors.primary.teal,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonDisabled: {
    backgroundColor: Colors.ui.disabled,
  },
  createButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  filterOptionSelected: {
    backgroundColor: Colors.background.primary,
    borderWidth: 2,
    borderColor: Colors.primary.teal,
  },
  filterOptionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  emptySpace: {
    height: 100,
  },
});