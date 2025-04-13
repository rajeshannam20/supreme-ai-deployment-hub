
import { useState, useEffect } from 'react';
import { 
  GitRepository, 
  GitCommit, 
  GitBranch, 
  GitDiff, 
  GitStashEntry, 
  GitTag, 
  gitService 
} from '@/services/git';
import { toast } from 'sonner';

export function useGitVisualization(repository: GitRepository, onUpdateRepository: (repo: GitRepository) => void) {
  // State for commits, branches, and diffs
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [diffs, setDiffs] = useState<GitDiff[]>([]);
  const [stashes, setStashes] = useState<GitStashEntry[]>([]);
  const [tags, setTags] = useState<GitTag[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(null);
  
  // Loading states
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDiff, setLoadingDiff] = useState(false);
  const [loadingStashes, setLoadingStashes] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  
  // Pagination for commits
  const [commitSkip, setCommitSkip] = useState(0);
  const COMMIT_LIMIT = 10;
  
  // Dialog states
  const [isCreateBranchDialogOpen, setIsCreateBranchDialogOpen] = useState(false);
  const [isMergeBranchDialogOpen, setIsMergeBranchDialogOpen] = useState(false);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [isStashDialogOpen, setIsStashDialogOpen] = useState(false);
  const [isDiscardChangesDialogOpen, setIsDiscardChangesDialogOpen] = useState(false);
  
  // Form states
  const [newBranchName, setNewBranchName] = useState('');
  const [branchToMerge, setBranchToMerge] = useState<GitBranch | null>(null);
  const [stashMessage, setStashMessage] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagMessage, setNewTagMessage] = useState('');
  const [newTagCommit, setNewTagCommit] = useState('HEAD');
  const [filesToDiscard, setFilesToDiscard] = useState<string[]>([]);
  
  // Load initial data
  useEffect(() => {
    if (repository) {
      loadCommits();
      loadBranches();
      loadStashes();
      loadTags();
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
  
  // Load stashes
  const loadStashes = async () => {
    setLoadingStashes(true);
    try {
      const result = await gitService.getStashes(repository);
      setStashes(result);
    } catch (error) {
      console.error('Error loading stashes:', error);
      toast.error('Failed to load stashes');
    } finally {
      setLoadingStashes(false);
    }
  };
  
  // Load tags
  const loadTags = async () => {
    setLoadingTags(true);
    try {
      const result = await gitService.getTags(repository);
      setTags(result);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast.error('Failed to load tags');
    } finally {
      setLoadingTags(false);
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
  
  // Handle stash creation
  const handleCreateStash = async () => {
    try {
      await gitService.createStash(repository, stashMessage);
      await loadStashes();
      setStashMessage('');
      setIsStashDialogOpen(false);
    } catch (error) {
      console.error('Error creating stash:', error);
      toast.error(`Failed to create stash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle stash application
  const handleApplyStash = async (stashId: string, drop = true) => {
    try {
      await gitService.applyStash(repository, stashId, drop);
      await loadStashes();
    } catch (error) {
      console.error('Error applying stash:', error);
      toast.error(`Failed to apply stash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle stash dropping
  const handleDropStash = async (stashId: string) => {
    try {
      await gitService.dropStash(repository, stashId);
      await loadStashes();
    } catch (error) {
      console.error('Error dropping stash:', error);
      toast.error(`Failed to drop stash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle discarding changes
  const handleDiscardChanges = async () => {
    try {
      await gitService.discardChanges(repository, filesToDiscard.length > 0 ? filesToDiscard : undefined);
      setFilesToDiscard([]);
      setIsDiscardChangesDialogOpen(false);
    } catch (error) {
      console.error('Error discarding changes:', error);
      toast.error(`Failed to discard changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle tag creation
  const handleCreateTag = async () => {
    if (!newTagName) {
      toast.error('Tag name is required');
      return;
    }
    
    try {
      await gitService.createTag(repository, newTagName, newTagCommit, newTagMessage);
      await loadTags();
      setNewTagName('');
      setNewTagMessage('');
      setNewTagCommit('HEAD');
      setIsCreateTagDialogOpen(false);
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Handle tag deletion
  const handleDeleteTag = async (tagName: string) => {
    try {
      await gitService.deleteTag(repository, tagName);
      await loadTags();
      toast.success(`Tag "${tagName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error(`Failed to delete tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    // States
    commits,
    branches,
    diffs,
    stashes,
    tags,
    selectedCommit,
    loadingCommits,
    loadingBranches,
    loadingDiff,
    loadingStashes,
    loadingTags,
    isCreateBranchDialogOpen,
    isMergeBranchDialogOpen,
    isCreateTagDialogOpen,
    isStashDialogOpen,
    isDiscardChangesDialogOpen,
    newBranchName,
    branchToMerge,
    stashMessage,
    newTagName,
    newTagMessage,
    newTagCommit,
    filesToDiscard,
    
    // Setters
    setIsCreateBranchDialogOpen,
    setIsMergeBranchDialogOpen,
    setIsCreateTagDialogOpen,
    setIsStashDialogOpen,
    setIsDiscardChangesDialogOpen,
    setNewBranchName,
    setBranchToMerge,
    setStashMessage,
    setNewTagName,
    setNewTagMessage,
    setNewTagCommit,
    setFilesToDiscard,
    
    // Functions
    loadCommits,
    handleLoadMoreCommits,
    loadBranches,
    loadStashes,
    loadTags,
    handleCommitSelect,
    handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch,
    confirmMergeBranch,
    handleCreateStash,
    handleApplyStash,
    handleDropStash,
    handleDiscardChanges,
    handleCreateTag,
    handleDeleteTag
  };
}
