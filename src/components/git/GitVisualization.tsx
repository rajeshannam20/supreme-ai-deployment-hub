
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitRepository, GitCommit, GitBranch, GitDiff, gitService } from '@/services/gitService';
import CommitHistoryView from './CommitHistoryView';
import BranchesView from './BranchesView';
import DiffView from './DiffView';

interface GitVisualizationProps {
  repository: GitRepository;
  onUpdateRepository: (repo: GitRepository) => void;
}

export const GitVisualization = ({ repository, onUpdateRepository }: GitVisualizationProps) => {
  // State for commits, branches, and diffs
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [diffs, setDiffs] = useState<GitDiff[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(null);
  
  // Loading states
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDiff, setLoadingDiff] = useState(false);
  
  // Pagination for commits
  const [commitSkip, setCommitSkip] = useState(0);
  const COMMIT_LIMIT = 10;
  
  // Dialog states
  const [isCreateBranchDialogOpen, setIsCreateBranchDialogOpen] = useState(false);
  const [isMergeBranchDialogOpen, setIsMergeBranchDialogOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [branchToMerge, setBranchToMerge] = useState<GitBranch | null>(null);
  
  // Load initial data
  useEffect(() => {
    if (repository) {
      loadCommits();
      loadBranches();
    }
  }, [repository]);
  
  // Load commit history
  const loadCommits = async (skip = 0) => {
    setLoadingCommits(true);
    try {
      const result = await gitService.getCommitHistory(repository, COMMIT_LIMIT, skip);
      if (skip === 0) {
        setCommits(result);
      } else {
        setCommits(prev => [...prev, ...result]);
      }
      setCommitSkip(skip);
    } catch (error) {
      console.error('Error loading commits:', error);
    } finally {
      setLoadingCommits(false);
    }
  };
  
  // Load more commits
  const handleLoadMoreCommits = () => {
    loadCommits(commitSkip + COMMIT_LIMIT);
  };
  
  // Load branches
  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const result = await gitService.getBranches(repository);
      setBranches(result);
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoadingBranches(false);
    }
  };
  
  // Handle commit selection
  const handleCommitSelect = async (commit: GitCommit) => {
    setSelectedCommit(commit);
    setLoadingDiff(true);
    try {
      // Get diff between this commit and previous
      const previousCommitIndex = commits.findIndex(c => c.id === commit.id) + 1;
      const previousCommit = previousCommitIndex < commits.length ? commits[previousCommitIndex] : null;
      const diffResult = await gitService.getDiff(
        repository, 
        previousCommit?.hash || `${commit.hash}^`, 
        commit.hash
      );
      setDiffs(diffResult);
    } catch (error) {
      console.error('Error loading diff:', error);
    } finally {
      setLoadingDiff(false);
    }
  };
  
  // Handle branch creation
  const handleCreateBranch = async () => {
    if (!newBranchName) return;
    
    try {
      await gitService.createBranch(repository, newBranchName);
      await loadBranches();
      setNewBranchName('');
      setIsCreateBranchDialogOpen(false);
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };
  
  // Handle branch switching
  const handleSwitchBranch = async (branch: GitBranch) => {
    try {
      const updatedRepo = await gitService.switchBranch(repository, branch.name);
      onUpdateRepository(updatedRepo);
      await loadCommits();
    } catch (error) {
      console.error('Error switching branch:', error);
    }
  };
  
  // Handle branch merging
  const handleMergeBranch = (branch: GitBranch) => {
    setBranchToMerge(branch);
    setIsMergeBranchDialogOpen(true);
  };
  
  const confirmMergeBranch = async () => {
    if (!branchToMerge) return;
    
    // In a real implementation, this would call a gitService.mergeBranch method
    // For now, we'll just simulate it with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh data after merge
    await loadCommits();
    await loadBranches();
    
    setIsMergeBranchDialogOpen(false);
    setBranchToMerge(null);
  };
  
  return (
    <div className="mt-6">
      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Commit History</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="diff">Changes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="pt-4">
          <CommitHistoryView
            repository={repository}
            commits={commits}
            loading={loadingCommits}
            onLoadMore={handleLoadMoreCommits}
            onCommitSelect={handleCommitSelect}
          />
        </TabsContent>
        
        <TabsContent value="branches" className="pt-4">
          <BranchesView
            repository={repository}
            branches={branches}
            loading={loadingBranches}
            onCreateBranch={() => setIsCreateBranchDialogOpen(true)}
            onSwitchBranch={handleSwitchBranch}
            onMergeBranch={handleMergeBranch}
          />
        </TabsContent>
        
        <TabsContent value="diff" className="pt-4">
          {selectedCommit ? (
            <DiffView
              commit={selectedCommit}
              diffs={diffs}
              loading={loadingDiff}
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No commit selected</AlertTitle>
              <AlertDescription>
                Select a commit from the history tab to view changes.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Branch Dialog */}
      <Dialog open={isCreateBranchDialogOpen} onOpenChange={setIsCreateBranchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
            <DialogDescription>
              Enter a name for the new branch. It will be created from the current HEAD.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="feature/my-new-feature"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateBranchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBranch}>Create Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Merge Branch Dialog */}
      <Dialog open={isMergeBranchDialogOpen} onOpenChange={setIsMergeBranchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to merge {branchToMerge?.name} into {repository.branch}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMergeBranchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMergeBranch}>Merge Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GitVisualization;
