
import React, { useState } from 'react';
import AddRepositoryDialog from '../AddRepositoryDialog';

interface AddRepositoryDialogContainerProps {
  loading: boolean;
  onCloneRepository: (url: string, branch: string, token: string) => Promise<boolean>;
}

const AddRepositoryDialogContainer: React.FC<AddRepositoryDialogContainerProps> = ({ 
  loading, 
  onCloneRepository 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoBranch, setNewRepoBranch] = useState('main');
  const [newRepoToken, setNewRepoToken] = useState('');

  const handleCloneRepository = async () => {
    const success = await onCloneRepository(newRepoUrl, newRepoBranch, newRepoToken);
    if (success) {
      setNewRepoUrl('');
      setNewRepoBranch('main');
      setNewRepoToken('');
      setIsAddDialogOpen(false);
    }
  };

  return (
    <AddRepositoryDialog
      isOpen={isAddDialogOpen}
      onOpenChange={setIsAddDialogOpen}
      loading={loading}
      newRepoUrl={newRepoUrl}
      setNewRepoUrl={setNewRepoUrl}
      newRepoBranch={newRepoBranch}
      setNewRepoBranch={setNewRepoBranch}
      newRepoToken={newRepoToken}
      setNewRepoToken={setNewRepoToken}
      onCloneRepository={handleCloneRepository}
    />
  );
};

export default AddRepositoryDialogContainer;
