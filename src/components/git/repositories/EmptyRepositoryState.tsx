
import React from 'react';
import { GitBranch } from 'lucide-react';

const EmptyRepositoryState: React.FC = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <GitBranch className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium mb-2">No repositories added yet</h3>
      <p className="text-muted-foreground mb-4">
        Add your first Git repository to start managing your code.
      </p>
    </div>
  );
};

export default EmptyRepositoryState;
