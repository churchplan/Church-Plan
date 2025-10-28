import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Song } from '../../types/worship';

interface SongCardProps {
  song: Song;
  onPress: () => void;
}

export default function SongCard({ song, onPress }: SongCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <MaterialIcons name="music-note" size={24} color="#00D4AA" />
        <View style={styles.songInfo}>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#CBD5E1" />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Tom</Text>
          <Text style={styles.detailValue}>{song.key}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Tempo</Text>
          <Text style={styles.detailValue}>{song.tempo}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duração</Text>
          <Text style={styles.detailValue}>{song.duration}</Text>
        </View>
        <View style={styles.editIndicator}>
          <MaterialIcons name="edit" size={12} color="#94A3B8" />
        </View>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    color: '#64748B',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  editIndicator: {
    alignItems: 'center',
    opacity: 0.6,
  },
});