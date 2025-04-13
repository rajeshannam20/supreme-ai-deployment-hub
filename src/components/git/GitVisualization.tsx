import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { GitRepository } from '@/services/git';
import CommitHistoryView from './CommitHistoryView';
import BranchesView from './BranchesView';
import DiffView from './DiffView';
import ComparisonView from './ComparisonView';
import StashesView from './StashesView';
import TagsView from './TagsView';
import CreateBranchDialog from './dialogs/CreateBranchDialog';
import MergeBranchDialog from './dialogs/MergeBranchDialog';
import StashDialog from './dialogs/StashDialog';
import DiscardChangesDialog from './dialogs/DiscardChangesDialog';
import CreateTagDialog from './dialogs/CreateTagDialog';
import CompareBranchesDialog from './dialogs/CompareBranchesDialog';
import { useGitVisualization } from '@/hooks/useGitVisualization';

interface GitVisualizationProps {
  repository: GitRepository;
  onUpdateRepository: (repo: GitRepository) => void;
}

export const GitVisualization = ({ repository, onUpdateRepository }: GitVisualizationProps) => {
  const {
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
    isCompareDialogOpen,
    newBranchName,
    branchToMerge,
    stashMessage,
    newTagName,
    newTagMessage,
    newTagCommit,
    filesToDiscard,
    comparisonDiffs,
    sourceBranchName,
    targetBranchName,
    showComparison,
    isComparing,
    setIsCreateBranchDialogOpen,
    setIsMergeBranchDialogOpen,
    setIsCreateTagDialogOpen,
    setIsStashDialogOpen,
    setIsDiscardChangesDialogOpen,
    setIsCompareDialogOpen,
    setNewBranchName,
    setStashMessage,
    setNewTagName,
    setNewTagMessage,
    setNewTagCommit,
    setFilesToDiscard,
    handleLoadMoreCommits,
    handleCommitSelect,
    handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch,
    handleCreateStash,
    handleApplyStash,
    handleDropStash,
    handleCreateTag,
    handleDeleteTag,
    handleDiscardChanges,
    handleCompareBranches,
    closeComparison,
    confirmMergeBranch
  } = useGitVisualization(repository, onUpdateRepository);
  
  // Mock modified files for discard changes dialog
  const modifiedFiles = ['src/App.tsx', 'src/components/NewFeature.tsx', 'src/styles/main.css'];
  
  return (
    <div className="mt-6">
      {showComparison && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Branch Comparison Results</h3>
            <Button size="sm" variant="ghost" onClick={closeComparison}>Close</Button>
          </div>
          <ComparisonView
            sourceBranch={sourceBranchName}
            targetBranch={targetBranchName}
            diffs={comparisonDiffs}
            loading={isComparing}
          />
        </div>
      )}
      
      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="history">Commit History</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="stashes">Stashes</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="diff">Changes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="pt-4">
          <CommitHistoryView
            repository={repository}
            commits={commits}
            branches={branches}
            loading={loadingCommits}
            onLoadMore={handleLoadMoreCommits}
            onCommitSelect={handleCommitSelect}
            selectedCommitHash={selectedCommit?.hash}
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
            onCompareBranches={() => setIsCompareDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="stashes" className="pt-4">
          <StashesView
            repository={repository}
            stashes={stashes}
            loading={loadingStashes}
            onCreateStash={() => setIsStashDialogOpen(true)}
            onApplyStash={handleApplyStash}
            onDropStash={handleDropStash}
          />
        </TabsContent>
        
        <TabsContent value="tags" className="pt-4">
          <TagsView
            repository={repository}
            tags={tags}
            loading={loadingTags}
            onCreateTag={() => setIsCreateTagDialogOpen(true)}
            onDeleteTag={handleDeleteTag}
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
      <CreateBranchDialog
        isOpen={isCreateBranchDialogOpen}
        onOpenChange={setIsCreateBranchDialogOpen}
        newBranchName={newBranchName}
        setNewBranchName={setNewBranchName}
        onCreateBranch={handleCreateBranch}
      />
      
      {/* Merge Branch Dialog */}
      <MergeBranchDialog
        isOpen={isMergeBranchDialogOpen}
        onOpenChange={setIsMergeBranchDialogOpen}
        branchToMerge={branchToMerge}
        repository={repository}
        onConfirmMerge={confirmMergeBranch}
      />
      
      {/* Compare Branches Dialog */}
      <CompareBranchesDialog
        isOpen={isCompareDialogOpen}
        onOpenChange={setIsCompareDialogOpen}
        repository={repository}
        branches={branches}
        currentBranch={repository.branch}
        loading={isComparing}
        onCompareBranches={handleCompareBranches}
      />
      
      {/* Stash Dialog */}
      <StashDialog
        isOpen={isStashDialogOpen}
        onOpenChange={setIsStashDialogOpen}
        stashMessage={stashMessage}
        setStashMessage={setStashMessage}
        onCreateStash={handleCreateStash}
      />
      
      {/* Discard Changes Dialog */}
      <DiscardChangesDialog
        isOpen={isDiscardChangesDialogOpen}
        onOpenChange={setIsDiscardChangesDialogOpen}
        modifiedFiles={modifiedFiles}
        selectedFiles={filesToDiscard}
        setSelectedFiles={setFilesToDiscard}
        onDiscardChanges={handleDiscardChanges}
      />
      
      {/* Create Tag Dialog */}
      <CreateTagDialog
        isOpen={isCreateTagDialogOpen}
        onOpenChange={setIsCreateTagDialogOpen}
        tagName={newTagName}
        tagMessage={newTagMessage}
        selectedCommit={newTagCommit}
        setTagName={setNewTagName}
        setTagMessage={setNewTagMessage}
        setSelectedCommit={setNewTagCommit}
        commits={commits}
        onCreateTag={handleCreateTag}
      />
    </div>
  );
};

export default GitVisualization;
