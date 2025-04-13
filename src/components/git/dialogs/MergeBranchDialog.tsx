
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranch, GitRepository } from '@/services/gitService';

interface MergeBranchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  branchToMerge: GitBranch | null;
  repository: GitRepository;
  onConfirmMerge: () => void;
}

export const MergeBranchDialog = ({
  isOpen,
  onOpenChange,
  branchToMerge,
  repository,
  onConfirmMerge
}: MergeBranchDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge Branch</DialogTitle>
          <DialogDescription>
            Are you sure you want to merge {branchToMerge?.name} into {repository.branch}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirmMerge}>Merge Branch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MergeBranchDialog;
