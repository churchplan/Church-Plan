import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  church: string;
  team: string;
  role: string;
  avatarUrl: string;
}

interface Organization {
  id: string;
  name: string;
  type: 'Igreja' | 'Banda' | 'Ministério';
  role: string;
  active: boolean;
}

interface PendingInvite {
  id: string;
  organizationName: string;
  organizationType: 'Igreja' | 'Banda' | 'Ministério';
  role: string;
  invitedBy: string;
  date: string;
}

export default function PerfilScreen() {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showInvitesModal, setShowInvitesModal] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'João Silva',
    email: 'joao.silva@igreja.com',
    phone: '(11) 99999-9999',
    church: 'Igreja Batista Central',
    team: 'Ministério de Louvor',
    role: 'Guitarrista',
    avatarUrl: ''
  });

  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Igreja Batista Central',
      type: 'Igreja',
      role: 'Guitarrista - Ministério de Louvor',
      active: true
    },
    {
      id: '2',
      name: 'Banda Worship Live',
      type: 'Banda',
      role: 'Guitarrista',
      active: false
    },
    {
      id: '3',
      name: 'Ministério Unidos em Cristo',
      type: 'Ministério',
      role: 'Backing Vocal',
      active: false
    }
  ]);

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    {
      id: '1',
      organizationName: 'Igreja Metodista São Paulo',
      organizationType: 'Igreja',
      role: 'Vocal',
      invitedBy: 'Pastor Carlos',
      date: '02/09/2024'
    },
    {
      id: '2',
      organizationName: 'Banda Adoração Eterna',
      organizationType: 'Banda',
      role: 'Guitarra Solo',
      invitedBy: 'Maria Santos',
      date: '01/09/2024'
    }
  ]);

  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [newImageUrl, setNewImageUrl] = useState('');

  const currentOrganization = organizations.find(org => org.active);

  const switchOrganization = (orgId: string) => {
    setOrganizations(orgs => 
      orgs.map(org => ({ ...org, active: org.id === orgId }))
    );
    
    const newActiveOrg = organizations.find(org => org.id === orgId);
    if (newActiveOrg) {
      setProfile(prev => ({
        ...prev,
        church: newActiveOrg.name,
        team: newActiveOrg.type,
        role: newActiveOrg.role
      }));
    }
    
    setShowOrgModal(false);
    
    if (Platform.OS === 'web') {
      console.log('Organização alterada:', newActiveOrg?.name);
    } else {
      Alert.alert('Organização Alterada', `Agora você está vendo: ${newActiveOrg?.name}`);
    }
  };

  const acceptInvite = (inviteId: string) => {
    const invite = pendingInvites.find(inv => inv.id === inviteId);
    if (invite) {
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: invite.organizationName,
        type: invite.organizationType,
        role: invite.role,
        active: false
      };
      
      setOrganizations(prev => [...prev, newOrg]);
      setPendingInvites(prev => prev.filter(inv => inv.id !== inviteId));
      
      if (Platform.OS === 'web') {
        console.log('Convite aceito:', invite.organizationName);
      } else {
        Alert.alert('Convite Aceito!', `Você agora faz parte de: ${invite.organizationName}`);
      }
    }
  };

  const declineInvite = (inviteId: string) => {
    const invite = pendingInvites.find(inv => inv.id === inviteId);
    setPendingInvites(prev => prev.filter(inv => inv.id !== inviteId));
    
    if (Platform.OS === 'web') {
      console.log('Convite recusado:', invite?.organizationName);
    } else {
      Alert.alert('Convite Recusado', `Convite de ${invite?.organizationName} foi recusado.`);
    }
  };

  const saveProfile = () => {
    setProfile(editProfile);
    setShowEditModal(false);
    
    if (Platform.OS === 'web') {
      console.log('Perfil salvo:', editProfile);
    } else {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    }
  };

  const updateAvatar = () => {
    if (newImageUrl.trim()) {
      const updatedProfile = { ...profile, avatarUrl: newImageUrl.trim() };
      setProfile(updatedProfile);
      setEditProfile(updatedProfile);
      setShowImageModal(false);
      setNewImageUrl('');
    }
  };

  const logout = () => {
    if (Platform.OS === 'web') {
      console.log('Logout realizado');
    } else {
      Alert.alert('Logout', 'Você foi desconectado com sucesso!');
    }
    router.replace('/(tabs)');
  };

  const getOrgIcon = (type: string) => {
    switch (type) {
      case 'Igreja': return 'church';
      case 'Banda': return 'library-music';
      case 'Ministério': return 'groups';
      default: return 'business';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerActions}>
          {pendingInvites.length > 0 && (
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={() => setShowInvitesModal(true)}
            >
              <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{pendingInvites.length}</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
            <MaterialIcons name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => setShowImageModal(true)}
          >
            {profile.avatarUrl ? (
              <View style={styles.avatarImage}>
                <Text style={styles.avatarInitial}>JS</Text>
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {profile.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <MaterialIcons name="camera-alt" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileRole}>{profile.role} • {profile.team}</Text>
        </View>

        {/* Current Organization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organização Atual</Text>
          
          <View style={styles.currentOrgCard}>
            <View style={styles.orgInfo}>
              <MaterialIcons 
                name={getOrgIcon(currentOrganization?.type || 'Igreja')} 
                size={24} 
                color="#6366F1" 
              />
              <View style={styles.orgDetails}>
                <Text style={styles.orgName}>{currentOrganization?.name}</Text>
                <Text style={styles.orgType}>{currentOrganization?.type}</Text>
                <Text style={styles.orgRole}>{currentOrganization?.role}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setShowOrgModal(true)}
            >
              <Text style={styles.switchButtonText}>Trocar</Text>
              <MaterialIcons name="swap-horiz" size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <MaterialIcons name="person" size={20} color="#6366F1" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome Completo</Text>
                <Text style={styles.infoValue}>{profile.name}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={20} color="#10B981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={20} color="#F59E0B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="check-circle" size={24} color="#10B981" />
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="emoji-events" size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>285</Text>
              <Text style={styles.statLabel}>Pontos</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialIcons name="calendar-today" size={24} color="#6366F1" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Meses Ativo</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="settings" size={20} color="#64748B" />
            <Text style={styles.actionText}>Configurações</Text>
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="help" size={20} color="#64748B" />
            <Text style={styles.actionText}>Ajuda e Suporte</Text>
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="privacy-tip" size={20} color="#64748B" />
            <Text style={styles.actionText}>Política de Privacidade</Text>
            <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={logout}>
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text style={[styles.actionText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>

      {/* Organization Switcher Modal */}
      <Modal visible={showOrgModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trocar Organização</Text>
              <TouchableOpacity onPress={() => setShowOrgModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Escolha qual organização você deseja visualizar:
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {organizations.map((org) => (
                <TouchableOpacity
                  key={org.id}
                  style={[styles.orgOption, org.active && styles.orgOptionActive]}
                  onPress={() => switchOrganization(org.id)}
                >
                  <MaterialIcons 
                    name={getOrgIcon(org.type)} 
                    size={32} 
                    color={org.active ? "#6366F1" : "#64748B"} 
                  />
                  <View style={styles.orgOptionInfo}>
                    <Text style={[styles.orgOptionName, org.active && styles.orgOptionNameActive]}>
                      {org.name}
                    </Text>
                    <Text style={styles.orgOptionType}>{org.type}</Text>
                    <Text style={styles.orgOptionRole}>{org.role}</Text>
                  </View>
                  {org.active && (
                    <MaterialIcons name="check-circle" size={24} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pending Invites Modal */}
      <Modal visible={showInvitesModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Convites Pendentes</Text>
              <TouchableOpacity onPress={() => setShowInvitesModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Você tem {pendingInvites.length} convite(s) pendente(s):
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {pendingInvites.map((invite) => (
                <View key={invite.id} style={styles.inviteCard}>
                  <View style={styles.inviteHeader}>
                    <MaterialIcons 
                      name={getOrgIcon(invite.organizationType)} 
                      size={24} 
                      color="#6366F1" 
                    />
                    <View style={styles.inviteInfo}>
                      <Text style={styles.inviteOrgName}>{invite.organizationName}</Text>
                      <Text style={styles.inviteType}>{invite.organizationType}</Text>
                      <Text style={styles.inviteRole}>Função: {invite.role}</Text>
                      <Text style={styles.inviteBy}>Convidado por: {invite.invitedBy}</Text>
                      <Text style={styles.inviteDate}>{invite.date}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.inviteActions}>
                    <TouchableOpacity 
                      style={styles.declineButton}
                      onPress={() => declineInvite(invite.id)}
                    >
                      <MaterialIcons name="close" size={16} color="#FFFFFF" />
                      <Text style={styles.declineButtonText}>Recusar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.acceptButton}
                      onPress={() => acceptInvite(invite.id)}
                    >
                      <MaterialIcons name="check" size={16} color="#FFFFFF" />
                      <Text style={styles.acceptButtonText}>Aceitar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.textInput}
                  value={editProfile.name}
                  onChangeText={(text) => setEditProfile(prev => ({ ...prev, name: text }))}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={editProfile.email}
                  onChangeText={(text) => setEditProfile(prev => ({ ...prev, email: text }))}
                  placeholder="Digite seu email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.textInput}
                  value={editProfile.phone}
                  onChangeText={(text) => setEditProfile(prev => ({ ...prev, phone: text }))}
                  placeholder="Digite seu telefone"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Modal */}
      <Modal visible={showImageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Foto</Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>URL da Imagem</Text>
              <TextInput
                style={styles.textInput}
                value={newImageUrl}
                onChangeText={setNewImageUrl}
                placeholder="https://exemplo.com/foto.jpg"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={updateAvatar}>
              <Text style={styles.saveButtonText}>Atualizar Foto</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  currentOrgCard: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orgDetails: {
    marginLeft: 12,
    flex: 1,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  orgType: {
    fontSize: 14,
    color: '#6366F1',
    marginTop: 2,
  },
  orgRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  switchButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginLeft: 12,
  },
  logoutButton: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    color: '#EF4444',
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
    maxHeight: '80%',
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
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  orgOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  orgOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  orgOptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  orgOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  orgOptionNameActive: {
    color: '#6366F1',
  },
  orgOptionType: {
    fontSize: 14,
    color: '#6366F1',
    marginBottom: 2,
  },
  orgOptionRole: {
    fontSize: 12,
    color: '#64748B',
  },
  inviteCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  inviteInfo: {
    marginLeft: 12,
    flex: 1,
  },
  inviteOrgName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  inviteType: {
    fontSize: 14,
    color: '#6366F1',
    marginBottom: 4,
  },
  inviteRole: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  inviteBy: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  inviteDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  declineButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
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
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySpace: {
    height: 100,
  },
});