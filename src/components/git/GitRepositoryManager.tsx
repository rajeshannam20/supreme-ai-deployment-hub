
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GitRepository, gitService } from '@/services/gitService';
import { getRepositories, saveRepository, deleteRepository } from '@/extension/gitStorage';
import AddRepositoryDialog from './AddRepositoryDialog';
import PushChangesDialog from './PushChangesDialog';
import RepositoryList from './RepositoryList';
import GitVisualization from './GitVisualization';

export const GitRepositoryManager = () => {
  const [repositories, setRepositories] = useState<GitRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitRepository | null>(null);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoBranch, setNewRepoBranch] = useState('main');
  const [newRepoToken, setNewRepoToken] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [activeRepositoryId, setActiveRepositoryId] = useState<string | null>(null);
  
  // Load repositories on component mount
  useEffect(() => {
    loadRepositories();
  }, []);
  
  const loadRepositories = async () => {
    try {
      const repos = await getRepositories();
      setRepositories(repos);
    } catch (error) {
      console.error('Error loading repositories:', error);
      toast.error('Failed to load repositories');
    }
  };
  
  const handleCloneRepository = async () => {
    if (!newRepoUrl) {
      toast.error('Repository URL is required');
      return;
    }
    
    setLoading(true);
    try {
      const repository = await gitService.cloneRepository(newRepoUrl, newRepoBranch, newRepoToken);
      await saveRepository(repository);
      await loadRepositories();
      setNewRepoUrl('');
      setNewRepoBranch('main');
      setNewRepoToken('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error cloning repository:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePullChanges = async (repository: GitRepository) => {
    setLoading(true);
    try {
      const updatedRepo = await gitService.pullChanges(repository);
      await saveRepository(updatedRepo);
      await loadRepositories();
    } catch (error) {
      console.error('Error pulling changes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePushChanges = async () => {
    if (!selectedRepo) return;
    if (!commitMessage) {
      toast.error('Commit message is required');
      return;
    }
    
    setLoading(true);
    try {
      const updatedRepo = await gitService.pushChanges(selectedRepo, commitMessage);
      await saveRepository(updatedRepo);
      await loadRepositories();
      setCommitMessage('');
      setIsPushDialogOpen(false);
    } catch (error) {
      console.error('Error pushing changes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRepository = async (repositoryId: string) => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      try {
        await deleteRepository(repositoryId);
        await loadRepositories();
        if (activeRepositoryId === repositoryId) {
          setActiveRepositoryId(null);
        }
        toast.success('Repository removed successfully');
      } catch (error) {
        console.error('Error deleting repository:', error);
        toast.error('Failed to delete repository');
      }
    }
  };
  
  const handleRepositorySelect = (repoId: string) => {
    setActiveRepositoryId(repoId === activeRepositoryId ? null : repoId);
  };
  
  const handleUpdateRepository = async (updatedRepo: GitRepository) => {
    try {
      await saveRepository(updatedRepo);
      await loadRepositories();
    } catch (error) {
      console.error('Error updating repository:', error);
    }
  };
  
  const handleSelectForPush = (repo: GitRepository) => {
    setSelectedRepo(repo);
    setIsPushDialogOpen(true);
  };
  
  const activeRepository = repositories.find(repo => repo.id === activeRepositoryId);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Git Repositories</CardTitle>
            <CardDescription>Manage your Git repositories and sync changes</CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <RepositoryList
          repositories={repositories}
          activeRepositoryId={activeRepositoryId}
          loading={loading}
          onRepositorySelect={handleRepositorySelect}
          onPullChanges={handlePullChanges}
          onSelectForPush={handleSelectForPush}
          onDeleteRepository={handleDeleteRepository}
        />
        
        {activeRepository && (
          <GitVisualization
            repository={activeRepository}
            onUpdateRepository={handleUpdateRepository}
          />
        )}
      </CardContent>
      
      <PushChangesDialog
        isOpen={isPushDialogOpen}
        onOpenChange={setIsPushDialogOpen}
        selectedRepo={selectedRepo}
        loading={loading}
        commitMessage={commitMessage}
        setCommitMessage={setCommitMessage}
        onPushChanges={handlePushChanges}
      />
    </Card>
  );
};

export default GitRepositoryManager;
