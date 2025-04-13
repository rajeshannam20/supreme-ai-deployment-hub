
import { useEffect } from 'react';
import { GitRepository } from '@/services/git';
import { 
  useCommitHistory,
  useBranchOperations,
  useStashOperations,
  useTagOperations,
  useFileOperations
} from './git';

export function useGitVisualization(repository: GitRepository, onUpdateRepository: (repo: GitRepository) => void) {
  // Use smaller, focused hooks
  const commitHistory = useCommitHistory(repository);
  const branchOperations = useBranchOperations(repository, onUpdateRepository);
  const stashOperations = useStashOperations(repository);
  const tagOperations = useTagOperations(repository);
  const fileOperations = useFileOperations(repository);
  
  // Load initial data
  useEffect(() => {
    if (repository) {
      commitHistory.loadCommits();
      branchOperations.loadBranches();
      stashOperations.loadStashes();
      tagOperations.loadTags();
    }
  }, [repository]);

  // Refresh data after branch operations
  const handleSwitchBranch = async (branch: any) => {
    const success = await branchOperations.handleSwitchBranch(branch);
    if (success) {
      commitHistory.loadCommits();
    }
  };

  const confirmMergeBranch = async () => {
    const success = await branchOperations.confirmMergeBranch();
    if (success) {
      commitHistory.loadCommits();
      branchOperations.loadBranches();
    }
  };

  return {
    // Commit history
    commits: commitHistory.commits,
    diffs: commitHistory.diffs,
    selectedCommit: commitHistory.selectedCommit,
    loadingCommits: commitHistory.loadingCommits,
    loadingDiff: commitHistory.loadingDiff,
    handleLoadMoreCommits: commitHistory.handleLoadMoreCommits,
    handleCommitSelect: commitHistory.handleCommitSelect,
    
    // Branch operations
    branches: branchOperations.branches,
    loadingBranches: branchOperations.loadingBranches,
    isCreateBranchDialogOpen: branchOperations.isCreateBranchDialogOpen,
    isMergeBranchDialogOpen: branchOperations.isMergeBranchDialogOpen,
    newBranchName: branchOperations.newBranchName,
    branchToMerge: branchOperations.branchToMerge,
    setIsCreateBranchDialogOpen: branchOperations.setIsCreateBranchDialogOpen,
    setIsMergeBranchDialogOpen: branchOperations.setIsMergeBranchDialogOpen,
    setNewBranchName: branchOperations.setNewBranchName,
    setBranchToMerge: branchOperations.setBranchToMerge,
    handleCreateBranch: branchOperations.handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch: branchOperations.handleMergeBranch,
    confirmMergeBranch,
    
    // Stash operations
    stashes: stashOperations.stashes,
    loadingStashes: stashOperations.loadingStashes,
    isStashDialogOpen: stashOperations.isStashDialogOpen,
    stashMessage: stashOperations.stashMessage,
    setIsStashDialogOpen: stashOperations.setIsStashDialogOpen,
    setStashMessage: stashOperations.setStashMessage,
    handleCreateStash: stashOperations.handleCreateStash,
    handleApplyStash: stashOperations.handleApplyStash,
    handleDropStash: stashOperations.handleDropStash,
    
    // Tag operations
    tags: tagOperations.tags,
    loadingTags: tagOperations.loadingTags,
    isCreateTagDialogOpen: tagOperations.isCreateTagDialogOpen,
    newTagName: tagOperations.newTagName,
    newTagMessage: tagOperations.newTagMessage,
    newTagCommit: tagOperations.newTagCommit,
    setIsCreateTagDialogOpen: tagOperations.setIsCreateTagDialogOpen,
    setNewTagName: tagOperations.setNewTagName,
    setNewTagMessage: tagOperations.setNewTagMessage,
    setNewTagCommit: tagOperations.setNewTagCommit,
    handleCreateTag: tagOperations.handleCreateTag,
    handleDeleteTag: tagOperations.handleDeleteTag,
    
    // File operations
    isDiscardChangesDialogOpen: fileOperations.isDiscardChangesDialogOpen,
    filesToDiscard: fileOperations.filesToDiscard,
    setIsDiscardChangesDialogOpen: fileOperations.setIsDiscardChangesDialogOpen,
    setFilesToDiscard: fileOperations.setFilesToDiscard,
    handleDiscardChanges: fileOperations.handleDiscardChanges
  };
}
