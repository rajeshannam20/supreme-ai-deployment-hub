
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGitRepositories } from '@/hooks/useGitRepositories';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, HelpCircle, RefreshCw, GitBranch, Settings, Info } from 'lucide-react';
import AddRepositoryDialogContainer from './repositories/AddRepositoryDialogContainer';
import PushChangesDialogContainer from './repositories/PushChangesDialogContainer';
import RepositorySection from './repositories/RepositorySection';
import { GitRepository } from '@/services/git';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
  
  const refreshAllRepositories = async () => {
    setIsRefreshing(true);
    try {
      // Refresh each repository sequentially
      for (const repo of repositories) {
        await handlePullChanges(repo);
      }
    } finally {
      setIsRefreshing(false);
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={refreshAllRepositories} 
                    disabled={loading || isRefreshing || repositories.length === 0}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh All Repositories</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={refreshAllRepositories} disabled={repositories.length === 0}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Manage Remote Sources
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="h-4 w-4 mr-2" />
                  Show Git Configuration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
            
            {filteredRepositories.length === 0 && repositories.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No repositories match your search criteria
              </div>
            )}
            
            {repositories.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">No repositories added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first Git repository to start managing your code.
                </p>
              </div>
            )}
            
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
