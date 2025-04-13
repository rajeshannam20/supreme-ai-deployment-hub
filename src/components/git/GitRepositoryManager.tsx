
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGitRepositories } from '@/hooks/useGitRepositories';
import AddRepositoryDialogContainer from './repositories/AddRepositoryDialogContainer';
import PushChangesDialogContainer from './repositories/PushChangesDialogContainer';
import RepositorySection from './repositories/RepositorySection';

export const GitRepositoryManager = () => {
  const {
    repositories,
    loading,
    selectedRepo,
    setSelectedRepo,
    activeRepositoryId,
    activeRepository,
    handleCloneRepository,
    handlePullChanges,
    handlePushChanges,
    handleDeleteRepository,
    handleRepositorySelect,
    handleUpdateRepository,
    handleSelectForPush
  } = useGitRepositories();
  
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  
  const handleOpenPushDialog = (repo: GitRepository) => {
    handleSelectForPush(repo);
    setIsPushDialogOpen(true);
  };
  
  const handleClosePushDialog = () => {
    setIsPushDialogOpen(false);
    setSelectedRepo(null);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Git Repositories</CardTitle>
            <CardDescription>Manage your Git repositories and sync changes</CardDescription>
          </div>
          <AddRepositoryDialogContainer
            loading={loading}
            onCloneRepository={handleCloneRepository}
          />
        </div>
      </CardHeader>
      <CardContent>
        <RepositorySection
          repositories={repositories}
          activeRepositoryId={activeRepositoryId}
          loading={loading}
          activeRepository={activeRepository}
          onRepositorySelect={handleRepositorySelect}
          onPullChanges={handlePullChanges}
          onSelectForPush={handleOpenPushDialog}
          onDeleteRepository={handleDeleteRepository}
          onUpdateRepository={handleUpdateRepository}
        />
      </CardContent>
      
      <PushChangesDialogContainer
        isOpen={isPushDialogOpen}
        onClose={handleClosePushDialog}
        selectedRepo={selectedRepo}
        loading={loading}
        onPushChanges={handlePushChanges}
      />
    </Card>
  );
};

export default GitRepositoryManager;
