
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGitRepositories } from '@/hooks/useGitRepositories';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, HelpCircle } from 'lucide-react';
import AddRepositoryDialogContainer from './repositories/AddRepositoryDialogContainer';
import PushChangesDialogContainer from './repositories/PushChangesDialogContainer';
import RepositorySection from './repositories/RepositorySection';
import { GitRepository } from '@/services/git';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GitDocumentation from './GitDocumentation';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleOpenPushDialog = (repo: GitRepository) => {
    handleSelectForPush(repo);
    setIsPushDialogOpen(true);
  };
  
  const handleClosePushDialog = () => {
    setIsPushDialogOpen(false);
    setSelectedRepo(null);
  };
  
  const handleConfirmDelete = (repoId: string) => {
    setRepoToDelete(repoId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (repoToDelete) {
      await handleDeleteRepository(repoToDelete);
      setIsDeleteDialogOpen(false);
      setRepoToDelete(null);
    }
  };

  // Filter repositories based on search query
  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    repo.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Git Repositories</CardTitle>
            <CardDescription>Manage your Git repositories and sync changes</CardDescription>
          </div>
          <div className="flex gap-2">
            <AddRepositoryDialogContainer
              loading={loading}
              onCloneRepository={handleCloneRepository}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="repositories">
          <TabsList className="mb-4">
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repositories">
            <div className="mb-4 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <RepositorySection
              repositories={filteredRepositories}
              activeRepositoryId={activeRepositoryId}
              loading={loading}
              activeRepository={activeRepository}
              onRepositorySelect={handleRepositorySelect}
              onPullChanges={handlePullChanges}
              onSelectForPush={handleOpenPushDialog}
              onDeleteRepository={handleConfirmDelete}
              onUpdateRepository={handleUpdateRepository}
            />
          </TabsContent>
          
          <TabsContent value="documentation">
            <GitDocumentation />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <PushChangesDialogContainer
        isOpen={isPushDialogOpen}
        onClose={handleClosePushDialog}
        selectedRepo={selectedRepo}
        loading={loading}
        onPushChanges={handlePushChanges}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Repository</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the repository from your list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default GitRepositoryManager;
