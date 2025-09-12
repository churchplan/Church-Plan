import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { WorshipService } from '../../types/worship';

interface ServiceCardProps {
  service: WorshipService;
  onPress: () => void;
}

export default function ServiceCard({ service, onPress }: ServiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejado': return '#F59E0B';
      case 'Em Andamento': return '#10B981';
      case 'Concluído': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Domingo': return 'church';
      case 'Quarta': return 'group';
      case 'Especial': return 'star';
      default: return 'event';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialIcons 
            name={getTypeIcon(service.type)} 
            size={24} 
            color="#6366F1" 
          />
          <Text style={styles.title}>{service.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) }]}>
          <Text style={styles.statusText}>{service.status}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialIcons name="today" size={16} color="#64748B" />
          <Text style={styles.detailText}>{formatDate(service.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={16} color="#64748B" />
          <Text style={styles.detailText}>{service.time}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.songsCount}>{service.songs.length} músicas</Text>
        <Text style={styles.teamCount}>{service.team.length} membros</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
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
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  songsCount: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  teamCount: {
    fontSize: 14,
    color: '#64748B',
  },
});