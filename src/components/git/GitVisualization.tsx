
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitRepository } from '@/services/gitService';
import CommitHistoryView from './CommitHistoryView';
import BranchesView from './BranchesView';
import DiffView from './DiffView';
import CreateBranchDialog from './dialogs/CreateBranchDialog';
import MergeBranchDialog from './dialogs/MergeBranchDialog';
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
    selectedCommit,
    loadingCommits,
    loadingBranches,
    loadingDiff,
    isCreateBranchDialogOpen,
    isMergeBranchDialogOpen,
    newBranchName,
    branchToMerge,
    setIsCreateBranchDialogOpen,
    setIsMergeBranchDialogOpen,
    setNewBranchName,
    handleLoadMoreCommits,
    handleCommitSelect,
    handleCreateBranch,
    handleSwitchBranch,
    handleMergeBranch,
    confirmMergeBranch
  } = useGitVisualization(repository, onUpdateRepository);
  
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
    </div>
  );
};

export default GitVisualization;
