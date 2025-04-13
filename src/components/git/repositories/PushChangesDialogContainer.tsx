import React, { useState } from 'react';
import PushChangesDialog from '../PushChangesDialog';
import { GitRepository } from '@/services/git';

interface PushChangesDialogContainerProps {
  selectedRepo: GitRepository | null;
  loading: boolean;
  onPushChanges: (repo: GitRepository, message: string) => Promise<boolean>;
  onClose: () => void;
  isOpen: boolean;
}

const PushChangesDialogContainer: React.FC<PushChangesDialogContainerProps> = ({ 
  selectedRepo, 
  loading, 
  onPushChanges, 
  onClose, 
  isOpen 
}) => {
  const [commitMessage, setCommitMessage] = useState('');

  const handlePushChanges = async () => {
    if (!selectedRepo) return;
    
    const success = await onPushChanges(selectedRepo, commitMessage);
    if (success) {
      setCommitMessage('');
      onClose();
    }
  };

  return (
    <PushChangesDialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      selectedRepo={selectedRepo}
      loading={loading}
      commitMessage={commitMessage}
      setCommitMessage={setCommitMessage}
      onPushChanges={handlePushChanges}
    />
  );
};

export default PushChangesDialogContainer;
