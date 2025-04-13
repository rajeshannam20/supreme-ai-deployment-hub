import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GitRepository } from '@/services/git';

interface PushChangesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRepo: GitRepository | null;
  loading: boolean;
  commitMessage: string;
  setCommitMessage: (message: string) => void;
  onPushChanges: () => void;
}

const PushChangesDialog = ({
  isOpen,
  onOpenChange,
  selectedRepo,
  loading,
  commitMessage,
  setCommitMessage,
  onPushChanges,
}: PushChangesDialogProps) => {
  if (!selectedRepo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onPushChanges} disabled={loading || !commitMessage}>
            {loading ? 'Pushing...' : 'Push Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PushChangesDialog;
