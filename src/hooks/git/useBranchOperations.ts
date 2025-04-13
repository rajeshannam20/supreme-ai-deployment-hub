import { useState } from 'react';
import { GitRepository, GitBranch, gitService } from '@/services/git';
import { toast } from 'sonner';

export function useBranchOperations(repository: GitRepository, onUpdateRepository: (repo: GitRepository) => void) {
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [isCreateBranchDialogOpen, setIsCreateBranchDialogOpen] = useState(false);
  const [isMergeBranchDialogOpen, setIsMergeBranchDialogOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [branchToMerge, setBranchToMerge] = useState('');
  
  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const updatedRepo = await gitService.getBranches(repository);
      setBranches(updatedRepo.branches);
      onUpdateRepository(updatedRepo);
    } catch (error) {
      console.error('Error loading branches:', error);
      toast.error(`Failed to load branches: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingBranches(false);
    }
  };
  
  const handleCreateBranch = async () => {
    if (!newBranchName) {
      toast.error('Branch name is required');
      return;
    }
    
    try {
      const updatedRepo = await gitService.createBranch(repository, newBranchName);
      setBranches(updatedRepo.branches);
      onUpdateRepository(updatedRepo);
      setIsCreateBranchDialogOpen(false);
      setNewBranchName('');
      toast.success(`Branch ${newBranchName} created successfully`);
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error(`Failed to create branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleSwitchBranch = async (branchName: string) => {
    try {
      const branch = branches.find(b => b.name === branchName);
      if (!branch) {
        toast.error(`Branch ${branchName} not found`);
        return false;
      }
      
      const updatedRepo = await gitService.switchBranch(repository, branch.name);
      setBranches(updatedRepo.branches);
      onUpdateRepository(updatedRepo);
      toast.success(`Switched to branch ${branch.name}`);
      return true;
    } catch (error) {
      console.error('Error switching branch:', error);
      toast.error(`Failed to switch to branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };
  
  const handleMergeBranch = (branchName: string) => {
    const branch = branches.find(b => b.name === branchName);
    if (!branch) {
      toast.error(`Branch ${branchName} not found`);
      return;
    }
    
    setBranchToMerge(branch.name);
    setIsMergeBranchDialogOpen(true);
  };

  const confirmMergeBranch = async () => {
    try {
      const updatedRepo = await gitService.mergeBranch(repository, branchToMerge);
      setBranches(updatedRepo.branches);
      onUpdateRepository(updatedRepo);
      setIsMergeBranchDialogOpen(false);
      setBranchToMerge('');
      toast.success(`Branch ${branchToMerge} merged successfully`);
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
    loadBranches,
    handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch,
    confirmMergeBranch
  };
}
