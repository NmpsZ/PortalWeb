import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import Button from '../components/common/Button';
import CenterToast from '../components/common/CenterToast';
import ConfirmModal from '../components/common/ConfirmModal';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';
import OfflineBanner from '../components/profile/OfflineBanner';
import ProfileCard from '../components/profile/ProfileCard';
import ContactCard from '../components/profile/ContactCard';
import SkillsCard from '../components/profile/SkillsCard';
import EditContactModal from '../components/profile/EditContactModal';
import EditSkillsModal from '../components/profile/EditSkillsModal';
import ChangeHistoryModal from '../components/profile/ChangeHistoryModal';
import { UserProfile, ProfileHistory, AlertMessage, UpdateContactRequest } from '../types';
import { MOCK_PROFILE, MOCK_SKILLS, MOCK_HISTORIES } from '../mocks/profile.mock';

const minDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [history, setHistory] = useState<ProfileHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<AlertMessage | null>(null);

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes, Update',
    onConfirm: async () => {},
  });
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  // Form states and loading spinners
  const [contactForm, setContactForm] = useState<UpdateContactRequest>({ phone_number: '', email: '', address: '' });
  const [contactError, setContactError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState<boolean>(false);
  const [isSubmittingSkills, setIsSubmittingSkills] = useState<boolean>(false);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ message, type });
    setTimeout(() => setAlertMsg(null), 2200);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, skillsData, historyData] = await Promise.all([
        apiService.getProfile(),
        apiService.getSkills(),
        apiService.getHistory(7),
        minDelay(400),
      ]);
      setProfile(profileData);
      setAvailableSkills(skillsData || []);
      setHistory(historyData || []);
      setIsOfflineMode(false);

      if (profileData) {
        setContactForm({
          phone_number: (profileData.phone_number === '-' ? '' : profileData.phone_number) || '',
          email: profileData.email || '',
          address: profileData.address || '',
        });
        setSelectedSkills(profileData.skills || []);
      }
    } catch (err) {
      console.warn('Backend offline or not reachable. Activating demo fallback mode:', err);
      setIsOfflineMode(true);
      setProfile(MOCK_PROFILE);
      setAvailableSkills(MOCK_SKILLS);
      setContactForm({
        phone_number: MOCK_PROFILE.phone_number || '',
        email: MOCK_PROFILE.email || '',
        address: MOCK_PROFILE.address || '',
      });
      setSelectedSkills(MOCK_PROFILE.skills || []);
      setHistory(MOCK_HISTORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Execute Contact Update after confirmation
  const executeContactUpdate = async () => {
    setIsConfirming(true);
    setIsSubmittingContact(true);

    if (isOfflineMode && profile) {
      await minDelay(500);
      setProfile({ ...profile, ...contactForm });
      setIsContactModalOpen(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      setIsConfirming(false);
      setIsSubmittingContact(false);
      showAlert('Contact information updated (Demo Mode)');
      return;
    }

    try {
      const [updated] = await Promise.all([
        apiService.updateContact(contactForm),
        minDelay(600),
      ]);
      setProfile(updated);
      setIsContactModalOpen(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      const newHistory = await apiService.getHistory(7);
      setHistory(newHistory);
      showAlert('Contact information updated successfully!');
    } catch (err: any) {
      setContactError(err.message || 'Failed to update contact');
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setIsConfirming(false);
      setIsSubmittingContact(false);
    }
  };

  // Open confirmation prompt before saving contact
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Contact Update',
      message: 'Are you sure you want to update your contact information?',
      confirmText: 'Yes, Update',
      onConfirm: executeContactUpdate,
    });
  };

  // Execute Skills Update after confirmation
  const executeSkillsUpdate = async () => {
    setIsConfirming(true);
    setIsSubmittingSkills(true);

    if (isOfflineMode && profile) {
      await minDelay(500);
      setProfile({ ...profile, skills: selectedSkills });
      setIsSkillsModalOpen(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      setIsConfirming(false);
      setIsSubmittingSkills(false);
      showAlert('Skills updated (Demo Mode)');
      return;
    }

    try {
      const [updated] = await Promise.all([
        apiService.updateSkills(selectedSkills),
        minDelay(600),
      ]);
      setProfile(updated);
      setIsSkillsModalOpen(false);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      const newHistory = await apiService.getHistory(7);
      setHistory(newHistory);
      showAlert('Skills updated successfully!');
    } catch (err: any) {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      showAlert('Failed to update skills: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsConfirming(false);
      setIsSubmittingSkills(false);
    }
  };

  // Open confirmation prompt before saving skills
  const handleSkillsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Skills Update',
      message: 'Are you sure you want to update your skills and proficiencies?',
      confirmText: 'Yes, Update',
      onConfirm: executeSkillsUpdate,
    });
  };

  // Execute Photo Upload after confirmation
  const executePhotoUpload = async (file: File) => {
    setIsConfirming(true);
    setUploading(true);

    if (isOfflineMode && profile) {
      const reader = new FileReader();
      reader.onload = async () => {
        await minDelay(600);
        setProfile({ ...profile, photo_url: reader.result as string });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setIsConfirming(false);
        setUploading(false);
        showAlert('Photo updated (Demo Mode)');
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      const [updated] = await Promise.all([
        apiService.uploadPhoto(file),
        minDelay(700),
      ]);
      setProfile(updated);
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      const newHistory = await apiService.getHistory(7);
      setHistory(newHistory);
      showAlert('Profile photo updated successfully!');
    } catch (err: any) {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      showAlert('Failed to upload photo: ' + (err.message || 'Error'), 'error');
    } finally {
      setIsConfirming(false);
      setUploading(false);
    }
  };

  // Open confirmation prompt before uploading selected photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so selecting the same file triggers again
    e.target.value = '';

    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Photo Upload',
      message: `Are you sure you want to set "${file.name}" as your new profile photo?`,
      confirmText: 'Yes, Upload',
      onConfirm: () => executePhotoUpload(file),
    });
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  if (loading && !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Centered Feedback Toast with Checkmark */}
      <CenterToast
        isOpen={!!alertMsg}
        message={alertMsg?.message || ''}
        type={alertMsg?.type || 'success'}
        onClose={() => setAlertMsg(null)}
      />

      {/* Confirmation Modal before saving changes */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isLoading={isConfirming}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Offline Mode Banner */}
      {isOfflineMode && <OfflineBanner onRetry={loadData} />}

      {/* Header bar */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Employee Profile
          </h1>
          <span className="hidden xs:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Personal Space
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal profile, contact information, and skill sets.
        </p>
      </div>

      {profile && (
        <div className="flex flex-col gap-6">
          {/* Top Full-width Profile Hero Banner */}
          <ProfileCard
            profile={profile}
            uploading={uploading}
            onUploadPhoto={handlePhotoUpload}
            onViewHistory={() => setIsHistoryModalOpen(true)}
          />

          {/* Bottom Balanced 2-Column Grid: Contact Info & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
            <ContactCard
              profile={profile}
              onEdit={() => {
                setContactError(null);
                setIsContactModalOpen(true);
              }}
            />
            <SkillsCard
              profile={profile}
              onEdit={() => setIsSkillsModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <EditContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setContactError(null);
          setIsContactModalOpen(false);
        }}
        form={contactForm}
        onChange={setContactForm}
        onSubmit={handleContactSubmit}
        serverError={contactError}
        isSubmitting={isSubmittingContact}
      />

      <EditSkillsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        onToggleSkill={toggleSkill}
        onSubmit={handleSkillsSubmit}
        isSubmitting={isSubmittingSkills}
      />

      <ChangeHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />
    </div>
  );
};

export default Home;
