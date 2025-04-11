
import React from 'react';
import { format } from 'date-fns';
import { GitBranch, GitMerge, Check, Cloud, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch as Branch, GitRepository } from '@/services/gitService';

interface BranchesViewProps {
  repository: GitRepository;
  branches: Branch[];
  loading: boolean;
  onCreateBranch: () => void;
  onSwitchBranch: (branch: Branch) => void;
  onMergeBranch: (branch: Branch) => void;
}

export const BranchesView = ({ 
  repository, 
  branches, 
  loading, 
  onCreateBranch,
  onSwitchBranch,
  onMergeBranch
}: BranchesViewProps) => {
  // Split branches into local and remote
  const localBranches = branches.filter(branch => !branch.isRemote);
  const remoteBranches = branches.filter(branch => branch.isRemote);
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Branches
            </CardTitle>
            <CardDescription>
              {repository.name} ({branches.length} branches)
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={onCreateBranch}
          >
            New Branch
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <ScrollArea className="h-[300px] rounded-md">
          <div className="p-3 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BranchSkeleton key={i} />
              ))
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2 px-2">Local Branches</h3>
                  <div className="space-y-1">
                    {localBranches.map((branch) => (
                      <BranchItem 
                        key={branch.name} 
                        branch={branch} 
                        onSwitch={() => onSwitchBranch(branch)}
                        onMerge={() => onMergeBranch(branch)}
                        isCurrentBranch={branch.name === repository.branch}
                      />
                    ))}
                  </div>
                </div>
                
                {remoteBranches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 px-2">Remote Branches</h3>
                    <div className="space-y-1">
                      {remoteBranches.map((branch) => (
                        <BranchItem 
                          key={branch.name} 
                          branch={branch} 
                          onSwitch={() => onSwitchBranch(branch)}
                          onMerge={() => onMergeBranch(branch)}
                          isCurrentBranch={false}
                          isRemote
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface BranchItemProps {
  branch: Branch;
  onSwitch: () => void;
  onMerge: () => void;
  isCurrentBranch: boolean;
  isRemote?: boolean;
}

const BranchItem = ({ branch, onSwitch, onMerge, isCurrentBranch, isRemote }: BranchItemProps) => {
  return (
    <div className="flex items-center p-2 hover:bg-accent rounded-md transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isRemote ? (
            <Cloud className="h-4 w-4 text-muted-foreground" />
          ) : (
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          )}
          <p className="font-medium truncate">{branch.name}</p>
          {isCurrentBranch && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Check className="h-3 w-3 mr-1" /> current
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 ml-6">
          <span className="font-mono">{branch.lastCommitHash}</span>
          <span>•</span>
          <span>{format(new Date(branch.lastCommitDate), 'MMM d, yyyy')}</span>
          
          {(branch.ahead !== undefined || branch.behind !== undefined) && (
            <>
              <span>•</span>
              <span className="flex items-center">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                {branch.ahead && `${branch.ahead} ahead`}
                {branch.ahead && branch.behind && ", "}
                {branch.behind && `${branch.behind} behind`}
              </span>
            </>
          )}
        </div>
      </div>
      
      {!isCurrentBranch && !isRemote && (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onSwitch}>
            Switch
          </Button>
          <Button variant="ghost" size="sm" onClick={onMerge}>
            Merge
          </Button>
        </div>
      )}
    </div>
  );
};

const BranchSkeleton = () => (
  <div className="flex items-center p-2">
    <div className="flex-1">
      <Skeleton className="h-5 w-[200px] mb-2" />
      <Skeleton className="h-3 w-[160px]" />
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export default BranchesView;
