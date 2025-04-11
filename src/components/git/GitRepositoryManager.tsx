
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check, GitBranch, GitCommit, GitPullRequest, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { GitRepository, gitService } from '@/services/gitService';
import { getRepositories, saveRepository, deleteRepository } from '@/extension/gitStorage';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  
  const activeRepository = repositories.find(repo => repo.id === activeRepositoryId);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Git Repositories</CardTitle>
            <CardDescription>Manage your Git repositories and sync changes</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Repository</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Git Repository</DialogTitle>
                <DialogDescription>
                  Clone a Git repository to work with
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-url">Repository URL</Label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository.git"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo-branch">Branch</Label>
                  <Input
                    id="repo-branch"
                    placeholder="main"
                    value={newRepoBranch}
                    onChange={(e) => setNewRepoBranch(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token (for private repositories)</Label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="ghp_youraccesstoken"
                    value={newRepoToken}
                    onChange={(e) => setNewRepoToken(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCloneRepository} disabled={loading}>
                  {loading ? 'Cloning...' : 'Clone Repository'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {repositories.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No repositories</AlertTitle>
            <AlertDescription>
              You haven't added any Git repositories yet. Click "Add Repository" to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {repositories.map((repo) => (
              <Card key={repo.id} className={`border-border ${activeRepositoryId === repo.id ? 'border-primary' : ''}`}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="cursor-pointer" onClick={() => handleRepositorySelect(repo.id)}>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        {repo.name}
                      </CardTitle>
                      <CardDescription className="text-xs truncate max-w-64">
                        {repo.url}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => handlePullChanges(repo)} 
                        disabled={loading}
                      >
                        <GitPullRequest className="h-3 w-3 mr-2" />
                        Pull
                      </Button>
                      <Dialog open={isPushDialogOpen && selectedRepo?.id === repo.id} onOpenChange={setIsPushDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3"
                            onClick={() => setSelectedRepo(repo)}
                          >
                            <GitCommit className="h-3 w-3 mr-2" />
                            Push
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleDeleteRepository(repo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center">
                        <GitBranch className="h-3 w-3 mr-1" />
                        {repo.branch}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {repo.status === 'synced' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <RefreshCw className="h-3 w-3 text-amber-500" />
                      )}
                      <span>{repo.status}</span>
                    </div>
                    <div>
                      Last synced: {repo.lastSynced ? new Date(repo.lastSynced).toLocaleString() : 'Never'}
                    </div>
                  </div>
                </CardContent>
                
                {activeRepositoryId === repo.id && (
                  <GitVisualization 
                    repository={repo}
                    onUpdateRepository={handleUpdateRepository}
                  />
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Push Dialog */}
      {selectedRepo && (
        <Dialog open={isPushDialogOpen} onOpenChange={setIsPushDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Push Changes</DialogTitle>
              <DialogDescription>
                Push your changes to {selectedRepo.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="commit-message">Commit Message</Label>
                <Input
                  id="commit-message"
                  placeholder="Enter commit message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPushDialogOpen(false)}>Cancel</Button>
              <Button onClick={handlePushChanges} disabled={loading || !commitMessage}>
                {loading ? 'Pushing...' : 'Push Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default GitRepositoryManager;
