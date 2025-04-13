
import { useState } from 'react';
import { GitRepository, GitBranch, gitService } from '@/services/git';
import { toast } from 'sonner';

export function useBranchOperations(
  repository: GitRepository, 
  onUpdateRepository: (repo: GitRepository) => void
) {
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [isCreateBranchDialogOpen, setIsCreateBranchDialogOpen] = useState(false);
  const [isMergeBranchDialogOpen, setIsMergeBranchDialogOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [branchToMerge, setBranchToMerge] = useState<GitBranch | null>(null);

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
      // Return true to indicate success - this allows callers to refresh data if needed
      return true;
    } catch (error) {
      console.error('Error switching branch:', error);
      toast.error(`Failed to switch branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
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
      
      toast.success(`Merged branch "${branchToMerge.name}" into "${repository.branch}"`);
      setIsMergeBranchDialogOpen(false);
      setBranchToMerge(null);
      return true;
    } catch (error) {
      console.error('Error merging branch:', error);
      toast.error(`Failed to merge branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  return {
    branches,
    loadingBranches,
    isCreateBranchDialogOpen,
    isMergeBranchDialogOpen,
    newBranchName,
    branchToMerge,
    setIsCreateBranchDialogOpen,
    setIsMergeBranchDialogOpen,
    setNewBranchName,
    setBranchToMerge,
    loadBranches,
    handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch,
    confirmMergeBranch
  };
}
