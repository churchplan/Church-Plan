import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScheduleItem as ScheduleItemType } from '../../types/worship';

interface ScheduleItemProps {
  item: ScheduleItemType;
  isLast?: boolean;
}

export default function ScheduleItem({ item, isLast }: ScheduleItemProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Setup': return '#F59E0B';
      case 'Passagem Som': return '#8B5CF6';
      case 'Ensaio': return '#06B6D4';
      case 'Culto': return '#10B981';
      case 'Limpeza': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Setup': return 'build';
      case 'Passagem Som': return 'volume-up';
      case 'Ensaio': return 'music-note';
      case 'Culto': return 'church';
      case 'Limpeza': return 'cleaning-services';
      default: return 'event';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: getTypeColor(item.type) }]}>
          <MaterialIcons 
            name={getTypeIcon(item.type)} 
            size={16} 
            color="#FFFFFF" 
          />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.time}>{item.time}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
        
        <Text style={styles.activity}>{item.activity}</Text>
        <Text style={styles.responsible}>Responsável: {item.responsible}</Text>
        
        {item.notes && (
          <Text style={styles.notes}>{item.notes}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  activity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  responsible: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  notes: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});