
import { useState, useEffect } from 'react';
import { GitRepository, GitCommit, GitBranch, GitDiff, gitService } from '@/services/gitService';
import { toast } from 'sonner';

export function useGitVisualization(repository: GitRepository, onUpdateRepository: (repo: GitRepository) => void) {
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
      toast.error('Failed to load commit history');
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
      toast.error('Failed to load branches');
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
      toast.error('Failed to load commit differences');
    } finally {
      setLoadingDiff(false);
    }
  };
  
  // Handle branch creation
  const handleCreateBranch = async () => {
    if (!newBranchName) {
      toast.error('Branch name is required');
      return;
    }
    
    try {
      await gitService.createBranch(repository, newBranchName);
      await loadBranches();
      toast.success(`Branch "${newBranchName}" created successfully`);
      setNewBranchName('');
      setIsCreateBranchDialogOpen(false);
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error(`Failed to create branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle branch switching
  const handleSwitchBranch = async (branch: GitBranch) => {
    try {
      const updatedRepo = await gitService.switchBranch(repository, branch.name);
      onUpdateRepository(updatedRepo);
      toast.success(`Switched to branch "${branch.name}"`);
      await loadCommits();
    } catch (error) {
      console.error('Error switching branch:', error);
      toast.error(`Failed to switch branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle branch merging
  const handleMergeBranch = (branch: GitBranch) => {
    setBranchToMerge(branch);
    setIsMergeBranchDialogOpen(true);
  };
  
  const confirmMergeBranch = async () => {
    if (!branchToMerge) return;
    
    try {
      // In a real implementation, this would call a gitService.mergeBranch method
      // For now, we'll just simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh data after merge
      await loadCommits();
      await loadBranches();
      
      toast.success(`Merged branch "${branchToMerge.name}" into "${repository.branch}"`);
      setIsMergeBranchDialogOpen(false);
      setBranchToMerge(null);
    } catch (error) {
      console.error('Error merging branch:', error);
      toast.error(`Failed to merge branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    // States
    commits,
    branches,
    diffs,
    selectedCommit,
    loadingCommits,
    loadingBranches,
    loadingDiff,
    isCreateBranchDialogOpen,
    isMergeBranchDialogOpen,
    newBranchName,
    branchToMerge,
    
    // Handlers
    setIsCreateBranchDialogOpen,
    setIsMergeBranchDialogOpen,
    setNewBranchName,
    setBranchToMerge,
    
    // Functions
    loadCommits,
    handleLoadMoreCommits,
    loadBranches,
    handleCommitSelect,
    handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch,
    confirmMergeBranch
  };
}
