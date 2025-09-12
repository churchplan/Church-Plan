import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
}

interface ExternalLink {
  id: string;
  description: string;
  url: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: 'photo' | 'video' | 'audio';
  size: string;
}

export default function AdicionarMusicaScreen() {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams();
  const [currentMode, setCurrentMode] = useState<'add' | 'view' | 'edit'>(
    mode as 'add' | 'view' | 'edit' || 'add'
  );
  
  const [activeSection, setActiveSection] = useState<'youtube' | 'info' | 'musical' | 'lyrics' | 'links' | 'files'>('youtube');
  const [youtubeSearch, setYoutubeSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Mock YouTube results
  const [youtubeResults, setYoutubeResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Music info form
  const [musicInfo, setMusicInfo] = useState({
    title: '',
    artist: '',
    observation: '',
    bpm: '',
    signature: '',
    key: '',
    lyrics: '',
    category: 'Louvor'
  });

  // Load existing song data if editing or viewing
  useEffect(() => {
    if (id && id !== 'new') {
      // Mock song data - in real app, fetch from service
      const mockSong = {
        title: 'Se Aperfeiçoa Em Mim',
        artist: 'Ministério Zoe',
        observation: 'Música de adoração com ritmo moderado',
        bmp: '75',
        signature: '4/4',
        key: 'C',
        lyrics: 'Se aperfeiçoa em mim o Teu amor\nSe aperfeiçoa em mim a Tua paz\nSe aperfeiçoa em mim o Teu perdão\nSe aperfeiçoa em mim a Tua graça',
        category: 'Adoração'
      };
      
      setMusicInfo(mockSong as any);
      
      // Mock external links
      setExternalLinks([
        { id: '1', description: 'Playback no Spotify', url: 'https://spotify.com/track/123' }
      ]);
      
      // Mock uploaded files
      setUploadedFiles([
        { id: '1', name: 'se_aperfeiçoa_em_mim.mp3', type: 'audio', size: '4.2 MB' }
      ]);
    }
  }, [id]);

  const isReadOnly = currentMode === 'view';
  const isEditing = currentMode === 'edit';

  const searchYouTube = async () => {
    if (!youtubeSearch.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockResults: YouTubeVideo[] = [
        {
          id: '1',
          title: youtubeSearch + ' - Versão Original',
          channel: 'Ministério Oficial',
          thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
          duration: '4:32'
        },
        {
          id: '2',
          title: youtubeSearch + ' - Playback',
          channel: 'Playbacks Gospel',
          thumbnail: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&h=200&fit=crop',
          duration: '4:28'
        }
      ];
      
      setYoutubeResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const selectVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setMusicInfo(prev => ({
      ...prev,
      title: video.title.replace(' - Versão Original', '').replace(' - Playback', '').replace(' - Ao Vivo', ''),
    }));
    setActiveSection('info');
  };

  const addExternalLink = () => {
    const newLink: ExternalLink = {
      id: Date.now().toString(),
      description: '',
      url: ''
    };
    setExternalLinks([...externalLinks, newLink]);
  };

  const updateExternalLink = (id: string, field: 'description' | 'url', value: string) => {
    setExternalLinks(links => 
      links.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const removeExternalLink = (id: string) => {
    setExternalLinks(links => links.filter(link => link.id !== id));
  };

  const uploadFiles = () => {
    if (isReadOnly) return;
    
    // Simulate file upload
    const mockFile: UploadedFile = {
      id: Date.now().toString(),
      name: 'exemplo_musica.mp3',
      type: 'audio',
      size: '3.2 MB'
    };
    setUploadedFiles([...uploadedFiles, mockFile]);
    
    if (Platform.OS === 'web') {
      console.log('Arquivo enviado:', mockFile);
    } else {
      Alert.alert('Sucesso', 'Arquivo enviado com sucesso!');
    }
  };

  const removeFile = (id: string) => {
    if (isReadOnly) return;
    setUploadedFiles(files => files.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo': return 'photo';
      case 'video': return 'videocam';
      case 'audio': return 'audiotrack';
      default: return 'attachment';
    }
  };

  const saveSong = () => {
    if (!musicInfo.title || !musicInfo.artist) {
      if (Platform.OS === 'web') {
        console.log('Campos obrigatórios não preenchidos');
      } else {
        Alert.alert('Erro', 'Preencha pelo menos o título e artista da música');
      }
      return;
    }

    const songData = {
      ...musicInfo,
      video: selectedVideo,
      links: externalLinks.filter(link => link.description && link.url),
      files: uploadedFiles
    };

    if (Platform.OS === 'web') {
      console.log('Música salva:', songData);
    } else {
      Alert.alert('Sucesso', isEditing ? 'Música atualizada com sucesso!' : 'Música adicionada à biblioteca!');
    }
    
    router.back();
  };

  const getHeaderTitle = () => {
    switch (currentMode) {
      case 'view': return 'Visualizar Música';
      case 'edit': return 'Editar Música';
      default: return 'Adicionar Música';
    }
  };

  const getMainButtonText = () => {
    switch (currentMode) {
      case 'edit': return 'Salvar Alterações';
      default: return 'Salvar Música';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {getHeaderTitle()}
        </Text>
        {currentMode === 'view' && (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setCurrentMode('edit')}
          >
            <MaterialIcons name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {currentMode !== 'view' && <View style={styles.placeholder} />}
      </View>

      <View style={styles.sectionTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'youtube' && styles.activeSectionTab]}
            onPress={() => setActiveSection('youtube')}
          >
            <MaterialIcons name="video-library" size={16} color={activeSection === 'youtube' ? '#FFFFFF' : '#6366F1'} />
            <Text style={[styles.sectionTabText, activeSection === 'youtube' && styles.activeSectionTabText]}>
              YouTube
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'info' && styles.activeSectionTab]}
            onPress={() => setActiveSection('info')}
          >
            <MaterialIcons name="info" size={16} color={activeSection === 'info' ? '#FFFFFF' : '#6366F1'} />
            <Text style={[styles.sectionTabText, activeSection === 'info' && styles.activeSectionTabText]}>
              Informações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'musical' && styles.activeSectionTab]}
            onPress={() => setActiveSection('musical')}
          >
            <MaterialIcons name="music-note" size={16} color={activeSection === 'musical' ? '#FFFFFF' : '#6366F1'} />
            <Text style={[styles.sectionTabText, activeSection === 'musical' && styles.activeSectionTabText]}>
              Dados Musicais
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'lyrics' && styles.activeSectionTab]}
            onPress={() => setActiveSection('lyrics')}
          >
            <MaterialIcons name="lyrics" size={16} color={activeSection === 'lyrics' ? '#FFFFFF' : '#6366F1'} />
            <Text style={[styles.sectionTabText, activeSection === 'lyrics' && styles.activeSectionTabText]}>
              Letra/Cifra
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'links' && styles.activeSectionTab]}
            onPress={() => setActiveSection('links')}
          >
            <MaterialIcons name="link" size={16} color={activeSection === 'links' ? '#FFFFFF' : '#6366F1'} />
            <Text style={[styles.sectionTabText, activeSection === 'links' && styles.activeSectionTabText]}>
              Links
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'files' && styles.activeSectionTab]}
            onPress={() => setActiveSection('files')}
          >
            <MaterialIcons name="folder" size={16} color={activeSection === 'files' ? '#FFFFFF' : '#6366F1'} />
            <Text style={[styles.sectionTabText, activeSection === 'files' && styles.activeSectionTabText]}>
              Arquivos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'youtube' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Buscar no YouTube</Text>
            <Text style={styles.sectionSubtitle}>
              Digite o nome da música para encontrar vídeos disponíveis
            </Text>
            
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Ex: Como Zaqueu, Reckless Love..."
                placeholderTextColor="#94A3B8"
                value={youtubeSearch}
                onChangeText={setYoutubeSearch}
                onSubmitEditing={searchYouTube}
                editable={!isReadOnly}
              />
              {!isReadOnly && (
                <TouchableOpacity style={styles.searchButton} onPress={searchYouTube}>
                  <MaterialIcons name="search" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>

            {selectedVideo && (
              <View style={styles.selectedVideoContainer}>
                <Text style={styles.selectedVideoTitle}>Vídeo Selecionado:</Text>
                <View style={styles.selectedVideoCard}>
                  <View style={styles.videoThumbnail}>
                    <MaterialIcons name="play-circle-filled" size={32} color="#6366F1" />
                  </View>
                  <View style={styles.selectedVideoInfo}>
                    <Text style={styles.selectedVideoName}>{selectedVideo.title}</Text>
                    <Text style={styles.selectedVideoChannel}>{selectedVideo.channel}</Text>
                    <Text style={styles.selectedVideoDuration}>{selectedVideo.duration}</Text>
                  </View>
                  {!isReadOnly && (
                    <TouchableOpacity onPress={() => setSelectedVideo(null)}>
                      <MaterialIcons name="close" size={20} color="#64748B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {!isReadOnly && (
              <>
                {isSearching ? (
                  <View style={styles.loadingContainer}>
                    <MaterialIcons name="refresh" size={32} color="#6366F1" />
                    <Text style={styles.loadingText}>Buscando vídeos...</Text>
                  </View>
                ) : (
                  <View style={styles.resultsContainer}>
                    {youtubeResults.map((video) => (
                      <TouchableOpacity
                        key={video.id}
                        style={styles.videoCard}
                        onPress={() => selectVideo(video)}
                      >
                        <View style={styles.videoThumbnail}>
                          <MaterialIcons name="play-circle-filled" size={24} color="#EF4444" />
                        </View>
                        <View style={styles.videoInfo}>
                          <Text style={styles.videoTitle}>{video.title}</Text>
                          <Text style={styles.videoChannel}>{video.channel}</Text>
                          <Text style={styles.videoDuration}>{video.duration}</Text>
                        </View>
                        <MaterialIcons name="add-circle" size={24} color="#10B981" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {activeSection === 'info' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da Música</Text>
            <Text style={styles.sectionSubtitle}>
              Dados básicos sobre a música
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título da Música *</Text>
              <TextInput
                style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                value={musicInfo.title}
                onChangeText={(text) => setMusicInfo(prev => ({ ...prev, title: text }))}
                placeholder="Ex: Como Zaqueu, Reckless Love..."
                placeholderTextColor="#94A3B8"
                editable={!isReadOnly}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Artista/Banda *</Text>
              <TextInput
                style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                value={musicInfo.artist}
                onChangeText={(text) => setMusicInfo(prev => ({ ...prev, artist: text }))}
                placeholder="Ex: Thalles Roberto, Hillsong..."
                placeholderTextColor="#94A3B8"
                editable={!isReadOnly}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observação</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, isReadOnly && styles.readOnlyInput]}
                value={musicInfo.observation}
                onChangeText={(text) => setMusicInfo(prev => ({ ...prev, observation: text }))}
                placeholder="Observações gerais sobre a música..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                editable={!isReadOnly}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria</Text>
              {isReadOnly ? (
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={musicInfo.category}
                  editable={false}
                />
              ) : (
                <View style={styles.categoryContainer}>
                  {['Louvor', 'Adoração', 'Comunhão', 'Evangelística'].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        musicInfo.category === category && styles.categoryButtonSelected
                      ]}
                      onPress={() => setMusicInfo(prev => ({ ...prev, category }))}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        musicInfo.category === category && styles.categoryButtonTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {activeSection === 'musical' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados Musicais</Text>
            <Text style={styles.sectionSubtitle}>
              Informações técnicas da música
            </Text>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>BPM</Text>
                <TextInput
                  style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                  value={musicInfo.bpm}
                  onChangeText={(text) => setMusicInfo(prev => ({ ...prev, bpm: text }))}
                  placeholder="Ex: 72, 120..."
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  editable={!isReadOnly}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>Assinatura</Text>
                <TextInput
                  style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                  value={musicInfo.signature}
                  onChangeText={(text) => setMusicInfo(prev => ({ ...prev, signature: text }))}
                  placeholder="Ex: 4/4, 3/4..."
                  placeholderTextColor="#94A3B8"
                  editable={!isReadOnly}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tom</Text>
              <TextInput
                style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                value={musicInfo.key}
                onChangeText={(text) => setMusicInfo(prev => ({ ...prev, key: text }))}
                placeholder="Ex: C, G, D, F#..."
                placeholderTextColor="#94A3B8"
                editable={!isReadOnly}
              />
            </View>
          </View>
        )}

        {activeSection === 'lyrics' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Letra com Cifra</Text>
            <Text style={styles.sectionSubtitle}>
              {isReadOnly ? 'Letra completa da música com cifras' : 'Cole aqui a letra completa da música com cifras'}
            </Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.textInput, styles.lyricsTextArea, isReadOnly && styles.readOnlyInput]}
                value={musicInfo.lyrics}
                onChangeText={(text) => setMusicInfo(prev => ({ ...prev, lyrics: text }))}
                placeholder={isReadOnly ? 'Nenhuma letra cadastrada' : `Exemplo:
Intro: C Am F G

C                    Am
Verso 1: Jesus Cristo é o Senhor
F                    G
Ele me salvou com amor...`}
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={15}
                editable={!isReadOnly}
              />
            </View>
          </View>
        )}

        {activeSection === 'links' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links Externos</Text>
            <Text style={styles.sectionSubtitle}>
              Links úteis relacionados à música
            </Text>

            {externalLinks.map((link) => (
              <View key={link.id} style={styles.linkCard}>
                <View style={styles.linkHeader}>
                  <Text style={styles.linkTitle}>Link #{externalLinks.indexOf(link) + 1}</Text>
                  {!isReadOnly && (
                    <TouchableOpacity onPress={() => removeExternalLink(link.id)}>
                      <MaterialIcons name="delete" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Descrição</Text>
                  <TextInput
                    style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                    value={link.description}
                    onChangeText={(text) => updateExternalLink(link.id, 'description', text)}
                    placeholder="Ex: Playback no Spotify, Cifra completa..."
                    placeholderTextColor="#94A3B8"
                    editable={!isReadOnly}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>URL</Text>
                  <TextInput
                    style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
                    value={link.url}
                    onChangeText={(text) => updateExternalLink(link.id, 'url', text)}
                    placeholder="https://exemplo.com/link"
                    placeholderTextColor="#94A3B8"
                    editable={!isReadOnly}
                  />
                </View>
              </View>
            ))}

            {!isReadOnly && (
              <TouchableOpacity style={styles.addButton} onPress={addExternalLink}>
                <MaterialIcons name="add" size={20} color="#6366F1" />
                <Text style={styles.addButtonText}>Adicionar Link</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {activeSection === 'files' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Arquivos</Text>
            <Text style={styles.sectionSubtitle}>
              Fotos, vídeos ou áudios relacionados à música
            </Text>

            {!isReadOnly && (
              <TouchableOpacity style={styles.uploadButton} onPress={uploadFiles}>
                <MaterialIcons name="cloud-upload" size={32} color="#6366F1" />
                <Text style={styles.uploadButtonTitle}>Enviar Arquivos</Text>
                <Text style={styles.uploadButtonSubtitle}>Fotos, vídeos ou áudios MP3</Text>
              </TouchableOpacity>
            )}

            {uploadedFiles.length > 0 && (
              <View style={styles.filesContainer}>
                <Text style={styles.filesTitle}>Arquivos:</Text>
                {uploadedFiles.map((file) => (
                  <View key={file.id} style={styles.fileCard}>
                    <View style={styles.fileInfo}>
                      <MaterialIcons name={getFileIcon(file.type)} size={24} color="#6366F1" />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName}>{file.name}</Text>
                        <Text style={styles.fileSize}>{file.size}</Text>
                      </View>
                    </View>
                    {!isReadOnly && (
                      <TouchableOpacity onPress={() => removeFile(file.id)}>
                        <MaterialIcons name="delete" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.emptySpace} />
      </ScrollView>

      {!isReadOnly && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!musicInfo.title || !musicInfo.artist) && styles.saveButtonDisabled
            ]}
            onPress={saveSong}
            disabled={!musicInfo.title || !musicInfo.artist}
          >
            <MaterialIcons name="save" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>{getMainButtonText()}</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#6366F1',
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
  editButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  sectionTabs: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    gap: 6,
  },
  activeSectionTab: {
    backgroundColor: '#6366F1',
  },
  sectionTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
  },
  activeSectionTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#6366F1',
    padding: 8,
    borderRadius: 8,
  },
  selectedVideoContainer: {
    marginBottom: 24,
  },
  selectedVideoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  selectedVideoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  selectedVideoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedVideoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  selectedVideoChannel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  selectedVideoDuration: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  resultsContainer: {
    gap: 12,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  videoThumbnail: {
    width: 60,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  videoChannel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  videoDuration: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  readOnlyInput: {
    backgroundColor: '#F8FAFC',
    color: '#64748B',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  lyricsTextArea: {
    minHeight: 300,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  linkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
    marginTop: 12,
  },
  uploadButtonSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  filesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  fileSize: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySpace: {
    height: 40,
  },
});