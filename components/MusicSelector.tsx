
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: string;
}

interface MusicSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectSong: (song: Song) => void;
  songs: Song[];
}

export default function MusicSelector({ visible, onClose, onSelectSong, songs }: MusicSelectorProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Música</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Escolha uma música da biblioteca de mídia:
          </Text>
          
          <ScrollView style={styles.songsList} showsVerticalScrollIndicator={false}>
            {songs.map((song) => (
              <TouchableOpacity 
                key={song.id}
                style={styles.songItem}
                onPress={() => {
                  onSelectSong(song);
                  onClose();
                }}
              >
                <View style={styles.songIcon}>
                  <MaterialIcons name="music-note" size={24} color="#F59E0B" />
                </View>
                
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                  <View style={styles.songDetails}>
                    <Text style={styles.songDetail}>Tom: {song.key}</Text>
                    <Text style={styles.songDetail}>•</Text>
                    <Text style={styles.songDetail}>{song.tempo}</Text>
                  </View>
                </View>
                
                <MaterialIcons name="add-circle" size={24} color="#10B981" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxWidth: 500,
    maxHeight: '80%',
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
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  songsList: {
    flex: 1,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  songIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  songDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  songDetail: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
