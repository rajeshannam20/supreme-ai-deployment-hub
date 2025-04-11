
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { GitBranch, GitCommit, GitFork, GitMerge, GitPullRequest, GitCompare, GitCommitHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitCommit as Commit, GitRepository } from '@/services/gitService';

interface CommitHistoryViewProps {
  repository: GitRepository;
  commits: Commit[];
  loading: boolean;
  onLoadMore: () => void;
  onCommitSelect: (commit: Commit) => void;
}

export const CommitHistoryView = ({ 
  repository, 
  commits, 
  loading, 
  onLoadMore, 
  onCommitSelect 
}: CommitHistoryViewProps) => {
  return (
    <Card className="w-full h-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitCommitHorizontal className="h-5 w-5" />
              Commit History
            </CardTitle>
            <CardDescription>
              {repository.name} ({repository.branch})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <ScrollArea className="h-[500px] rounded-md">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-border"></div>
            
            <div className="space-y-1 p-1">
              {loading && commits.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <CommitSkeleton key={i} />
                ))
              ) : (
                commits.map((commit) => (
                  <CommitItem 
                    key={commit.id} 
                    commit={commit} 
                    onClick={() => onCommitSelect(commit)} 
                  />
                ))
              )}
              
              {commits.length > 0 && (
                <div className="flex justify-center py-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface CommitItemProps {
  commit: Commit;
  onClick: () => void;
}

const CommitItem = ({ commit, onClick }: CommitItemProps) => {
  const authorInitials = commit.author
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  // Determine if commit is a merge
  const isMerge = commit.message.startsWith('Merge');
  
  return (
    <div 
      className="flex items-start p-3 hover:bg-accent rounded-md transition-colors relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative z-10 mr-4">
        {isMerge ? (
          <div className="bg-blue-500 text-white p-1 rounded-full">
            <GitMerge className="h-4 w-4" />
          </div>
        ) : (
          <div className="bg-primary text-primary-foreground p-1 rounded-full">
            <GitCommit className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{commit.message}</p>
          {commit.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className="font-mono">{commit.shortHash}</span>
          <span>•</span>
          <span>{format(new Date(commit.date), 'MMM d, yyyy HH:mm')}</span>
        </div>
      </div>
      
      <Avatar className="h-6 w-6 ml-2">
        <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
      </Avatar>
    </div>
  );
};

const CommitSkeleton = () => (
  <div className="flex items-start p-3 relative">
    <div className="relative z-10 mr-4">
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
    <div className="flex-1">
      <Skeleton className="h-5 w-full max-w-[250px] mb-2" />
      <Skeleton className="h-3 w-[160px]" />
    </div>
  </div>
);

export default CommitHistoryView;
