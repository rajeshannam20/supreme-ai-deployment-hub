import axios from 'axios';
import { toast } from 'sonner';

/**
 * Interface for Git repository information
 */
export interface GitRepository {
  id: string;
  name: string;
  url: string;
  branch: string;
  lastSynced?: Date;
  status?: 'synced' | 'modified' | 'conflict';
  accessToken?: string;
}

/**
 * Interface for Git commit information
 */
export interface GitCommit {
  id: string;
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  email: string;
  date: Date;
  branch?: string;
  tags?: string[];
}

/**
 * Interface for Git branch information
 */
export interface GitBranch {
  name: string;
  isActive: boolean;
  lastCommitHash: string;
  lastCommitDate: Date;
  isRemote: boolean;
  upstream?: string;
  ahead?: number;
  behind?: number;
}

/**
 * Interface for Git diff information
 */
export interface GitDiff {
  filePath: string;
  additions: number;
  deletions: number;
  hunks: Array<{
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    content: string;
  }>;
}

/**
 * Interface for Git stash entry
 */
export interface GitStashEntry {
  id: string;
  message: string;
  date: Date;
  hash: string;
  branch: string;
}

/**
 * Interface for Git tag
 */
export interface GitTag {
  name: string;
  commitHash: string;
  date: Date;
  message?: string;
  taggerName: string;
  taggerEmail: string;
}

/**
 * Service for handling Git operations
 */
export const gitService = {
  /**
   * Clone a repository
   * @param repoUrl URL of the repository to clone
   * @param branch Branch to clone (default: main)
   * @param accessToken Optional access token for private repositories
   */
  cloneRepository: async (repoUrl: string, branch = 'main', accessToken?: string): Promise<GitRepository> => {
    try {
      // In a real implementation, this would use a backend API
      // For now, we'll simulate the operation
      console.log(`Cloning repository: ${repoUrl}, branch: ${branch}`);
      
      // Generate a unique ID for the repository
      const repoId = `repo_${Date.now()}`;
      
      // Parse the repository name from the URL
      const urlParts = repoUrl.split('/');
      const repoName = urlParts[urlParts.length - 1].replace('.git', '');
      
      // Simulate API call to clone repository
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create repository object
      const repository: GitRepository = {
        id: repoId,
        name: repoName,
        url: repoUrl,
        branch,
        lastSynced: new Date(),
        status: 'synced',
        accessToken
      };
      
      toast.success(`Repository ${repoName} cloned successfully`);
      return repository;
    } catch (error) {
      console.error('Error cloning repository:', error);
      toast.error(`Failed to clone repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Pull latest changes from a repository
   * @param repository Repository to pull changes from
   */
  pullChanges: async (repository: GitRepository): Promise<GitRepository> => {
    try {
      // Simulate API call to pull changes
      console.log(`Pulling changes for repository: ${repository.name}, branch: ${repository.branch}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update repository object
      const updatedRepo: GitRepository = {
        ...repository,
        lastSynced: new Date(),
        status: 'synced'
      };
      
      toast.success(`Latest changes pulled for ${repository.name}`);
      return updatedRepo;
    } catch (error) {
      console.error('Error pulling changes:', error);
      toast.error(`Failed to pull changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Push changes to a repository
   * @param repository Repository to push changes to
   * @param message Commit message
   */
  pushChanges: async (repository: GitRepository, message: string): Promise<GitRepository> => {
    try {
      // Simulate API call to push changes
      console.log(`Pushing changes for repository: ${repository.name}, branch: ${repository.branch}`);
      console.log(`Commit message: ${message}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Update repository object
      const updatedRepo: GitRepository = {
        ...repository,
        lastSynced: new Date(),
        status: 'synced'
      };
      
      toast.success(`Changes pushed to ${repository.name}`);
      return updatedRepo;
    } catch (error) {
      console.error('Error pushing changes:', error);
      toast.error(`Failed to push changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Check status of a repository
   * @param repository Repository to check status of
   */
  checkStatus: async (repository: GitRepository): Promise<{ status: string; changes?: string[] }> => {
    try {
      // Simulate API call to check status
      console.log(`Checking status for repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate status check result
      const status = Math.random() > 0.3 ? 'synced' : 'modified';
      
      const result = {
        status,
        changes: status === 'modified' ? ['src/App.tsx', 'src/components/NewFeature.tsx'] : undefined
      };
      
      return result;
    } catch (error) {
      console.error('Error checking repository status:', error);
      throw error;
    }
  },

  /**
   * Get commit history for a repository
   * @param repository Repository to get commit history for
   * @param limit Maximum number of commits to return (default: 30)
   * @param skip Number of commits to skip for pagination (default: 0)
   */
  getCommitHistory: async (repository: GitRepository, limit = 30, skip = 0): Promise<GitCommit[]> => {
    try {
      // Simulate API call to get commit history
      console.log(`Getting commit history for repository: ${repository.name}, branch: ${repository.branch}`);
      console.log(`Limit: ${limit}, Skip: ${skip}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate commit history data
      const commits: GitCommit[] = Array.from({ length: Math.min(limit, 30) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i - skip);
        
        const hash = generateRandomHash(40);
        
        return {
          id: `commit_${i + skip + 1}`,
          hash,
          shortHash: hash.substring(0, 7),
          message: i === 0 && skip === 0 
            ? 'Initial commit' 
            : `Update ${['component', 'service', 'feature', 'documentation'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 20) + 1}`,
          author: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'][Math.floor(Math.random() * 4)],
          email: ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com'][Math.floor(Math.random() * 4)],
          date,
          branch: repository.branch,
          tags: i === 0 ? ['latest'] : undefined
        };
      });
      
      return commits;
    } catch (error) {
      console.error('Error getting commit history:', error);
      toast.error(`Failed to get commit history: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  /**
   * Get branches for a repository
   * @param repository Repository to get branches for
   */
  getBranches: async (repository: GitRepository): Promise<GitBranch[]> => {
    try {
      // Simulate API call to get branches
      console.log(`Getting branches for repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate branches data
      const branches: GitBranch[] = [
        {
          name: repository.branch,
          isActive: true,
          lastCommitHash: generateRandomHash(7),
          lastCommitDate: new Date(),
          isRemote: false,
          upstream: `origin/${repository.branch}`,
          ahead: 0,
          behind: 0
        },
        {
          name: 'develop',
          isActive: false,
          lastCommitHash: generateRandomHash(7),
          lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRemote: false,
          upstream: 'origin/develop',
          ahead: 2,
          behind: 1
        },
        {
          name: 'feature/new-feature',
          isActive: false,
          lastCommitHash: generateRandomHash(7),
          lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          isRemote: false,
          upstream: 'origin/feature/new-feature',
          ahead: 5,
          behind: 0
        },
        {
          name: 'origin/main',
          isActive: false,
          lastCommitHash: generateRandomHash(7),
          lastCommitDate: new Date(),
          isRemote: true
        },
        {
          name: 'origin/develop',
          isActive: false,
          lastCommitHash: generateRandomHash(7),
          lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRemote: true
        }
      ];
      
      return branches;
    } catch (error) {
      console.error('Error getting branches:', error);
      toast.error(`Failed to get branches: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  /**
   * Get diff between two commits
   * @param repository Repository to get diff for
   * @param oldHash Old commit hash
   * @param newHash New commit hash (default: HEAD)
   */
  getDiff: async (repository: GitRepository, oldHash: string, newHash = 'HEAD'): Promise<GitDiff[]> => {
    try {
      // Simulate API call to get diff
      console.log(`Getting diff for repository: ${repository.name}, old: ${oldHash}, new: ${newHash}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simulate diff data
      const diffs: GitDiff[] = [
        {
          filePath: 'src/components/Example.tsx',
          additions: 15,
          deletions: 7,
          hunks: [
            {
              oldStart: 10,
              oldLines: 5,
              newStart: 10,
              newLines: 8,
              content: `@@ -10,5 +10,8 @@\n import React from 'react';\n-const Example = () => {\n-  return <div>Example</div>;\n+const Example = ({ title }) => {\n+  return (\n+    <div className="example">\n+      <h2>{title}</h2>\n+      <p>Example component content</p>\n+    </div>\n+  );\n };\n export default Example;`
            }
          ]
        },
        {
          filePath: 'src/styles/global.css',
          additions: 5,
          deletions: 0,
          hunks: [
            {
              oldStart: 25,
              oldLines: 0,
              newStart: 25,
              newLines: 5,
              content: `@@ -25,0 +25,5 @@\n+.example {\n+  padding: 1rem;\n+  border: 1px solid #ddd;\n+  border-radius: 4px;\n+}`
            }
          ]
        }
      ];
      
      return diffs;
    } catch (error) {
      console.error('Error getting diff:', error);
      toast.error(`Failed to get diff: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  /**
   * Create a new branch in a repository
   * @param repository Repository to create branch in
   * @param branchName Name of new branch
   * @param startPoint Starting point for branch (default: HEAD)
   */
  createBranch: async (repository: GitRepository, branchName: string, startPoint = 'HEAD'): Promise<GitBranch> => {
    try {
      // Simulate API call to create branch
      console.log(`Creating branch ${branchName} in repository: ${repository.name}, from: ${startPoint}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate created branch
      const newBranch: GitBranch = {
        name: branchName,
        isActive: true,
        lastCommitHash: generateRandomHash(7),
        lastCommitDate: new Date(),
        isRemote: false
      };
      
      toast.success(`Branch ${branchName} created successfully`);
      return newBranch;
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error(`Failed to create branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  /**
   * Switch to a branch in a repository
   * @param repository Repository to switch branch in
   * @param branchName Name of branch to switch to
   */
  switchBranch: async (repository: GitRepository, branchName: string): Promise<GitRepository> => {
    try {
      // Simulate API call to switch branch
      console.log(`Switching to branch ${branchName} in repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update repository object
      const updatedRepo: GitRepository = {
        ...repository,
        branch: branchName,
        lastSynced: new Date(),
        status: 'synced'
      };
      
      toast.success(`Switched to branch ${branchName}`);
      return updatedRepo;
    } catch (error) {
      console.error('Error switching branch:', error);
      toast.error(`Failed to switch branch: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Create a stash in a repository
   * @param repository Repository to create stash in
   * @param message Stash message
   */
  createStash: async (repository: GitRepository, message: string): Promise<GitStashEntry> => {
    try {
      // Simulate API call to create stash
      console.log(`Creating stash in repository: ${repository.name}, message: ${message}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate created stash
      const stash: GitStashEntry = {
        id: `stash_${Date.now()}`,
        message: message || `WIP on ${repository.branch}`,
        date: new Date(),
        hash: generateRandomHash(7),
        branch: repository.branch,
      };
      
      toast.success(`Stash created successfully`);
      return stash;
    } catch (error) {
      console.error('Error creating stash:', error);
      toast.error(`Failed to create stash: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Get stashes for a repository
   * @param repository Repository to get stashes for
   */
  getStashes: async (repository: GitRepository): Promise<GitStashEntry[]> => {
    try {
      // Simulate API call to get stashes
      console.log(`Getting stashes for repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate stashes data
      const stashes: GitStashEntry[] = [
        {
          id: 'stash_1',
          message: `WIP on ${repository.branch}: Latest feature`,
          date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          hash: generateRandomHash(7),
          branch: repository.branch,
        },
        {
          id: 'stash_2',
          message: 'Bugfix in progress',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          hash: generateRandomHash(7),
          branch: 'develop',
        }
      ];
      
      return stashes;
    } catch (error) {
      console.error('Error getting stashes:', error);
      toast.error(`Failed to get stashes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Apply stash in a repository
   * @param repository Repository to apply stash in
   * @param stashId ID of stash to apply
   * @param drop Whether to drop the stash after applying (default: true)
   */
  applyStash: async (repository: GitRepository, stashId: string, drop = true): Promise<void> => {
    try {
      // Simulate API call to apply stash
      console.log(`Applying stash ${stashId} in repository: ${repository.name}, drop: ${drop}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast.success(`Stash applied ${drop ? 'and dropped ' : ''}successfully`);
    } catch (error) {
      console.error('Error applying stash:', error);
      toast.error(`Failed to apply stash: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Drop stash in a repository
   * @param repository Repository to drop stash in
   * @param stashId ID of stash to drop
   */
  dropStash: async (repository: GitRepository, stashId: string): Promise<void> => {
    try {
      // Simulate API call to drop stash
      console.log(`Dropping stash ${stashId} in repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success(`Stash dropped successfully`);
    } catch (error) {
      console.error('Error dropping stash:', error);
      toast.error(`Failed to drop stash: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Discard changes in a repository
   * @param repository Repository to discard changes in
   * @param paths Paths to discard changes for (if empty, discard all changes)
   */
  discardChanges: async (repository: GitRepository, paths?: string[]): Promise<void> => {
    try {
      // Simulate API call to discard changes
      console.log(`Discarding changes in repository: ${repository.name}, paths: ${paths?.join(', ') || 'all'}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Changes discarded successfully`);
    } catch (error) {
      console.error('Error discarding changes:', error);
      toast.error(`Failed to discard changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Create tag in a repository
   * @param repository Repository to create tag in
   * @param name Tag name
   * @param commitHash Commit hash to tag (default: HEAD)
   * @param message Tag message
   */
  createTag: async (repository: GitRepository, name: string, commitHash = 'HEAD', message?: string): Promise<GitTag> => {
    try {
      // Simulate API call to create tag
      console.log(`Creating tag ${name} in repository: ${repository.name}, commit: ${commitHash}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate created tag
      const tag: GitTag = {
        name,
        commitHash: commitHash === 'HEAD' ? generateRandomHash(40) : commitHash,
        date: new Date(),
        message,
        taggerName: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'][Math.floor(Math.random() * 4)],
        taggerEmail: ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com'][Math.floor(Math.random() * 4)],
      };
      
      toast.success(`Tag ${name} created successfully`);
      return tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Get tags for a repository
   * @param repository Repository to get tags for
   */
  getTags: async (repository: GitRepository): Promise<GitTag[]> => {
    try {
      // Simulate API call to get tags
      console.log(`Getting tags for repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate tags data
      const tags: GitTag[] = [
        {
          name: 'v1.0.0',
          commitHash: generateRandomHash(40),
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          message: 'Initial release',
          taggerName: 'John Doe',
          taggerEmail: 'john@example.com',
        },
        {
          name: 'v1.1.0',
          commitHash: generateRandomHash(40),
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
          message: 'Feature release',
          taggerName: 'Jane Smith',
          taggerEmail: 'jane@example.com',
        },
        {
          name: 'v1.1.1',
          commitHash: generateRandomHash(40),
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
          message: 'Bugfix release',
          taggerName: 'Bob Johnson',
          taggerEmail: 'bob@example.com',
        }
      ];
      
      return tags;
    } catch (error) {
      console.error('Error getting tags:', error);
      toast.error(`Failed to get tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  /**
   * Delete tag in a repository
   * @param repository Repository to delete tag in
   * @param tagName Name of tag to delete
   */
  deleteTag: async (repository: GitRepository, tagName: string): Promise<void> => {
    try {
      // Simulate API call to delete tag
      console.log(`Deleting tag ${tagName} in repository: ${repository.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success(`Tag ${tagName} deleted successfully`);
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error(`Failed to delete tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};

/**
 * Helper function to generate random hash
 */
function generateRandomHash(length: number): string {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
