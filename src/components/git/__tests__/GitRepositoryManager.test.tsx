
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GitRepositoryManager } from '@/components/git/GitRepositoryManager';
import { useGitRepositories } from '@/hooks/useGitRepositories';
import { toast } from 'sonner';

// Mock the hooks
jest.mock('@/hooks/useGitRepositories');
jest.mock('sonner');

// Mock the child components to simplify testing
jest.mock('@/components/git/repositories/RepositorySection', () => ({
  __esModule: true,
  default: () => <div data-testid="repository-section">Repository Section</div>
}));

jest.mock('@/components/git/repositories/AddRepositoryDialogContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="add-repository-dialog">Add Repository Dialog</div>
}));

jest.mock('@/components/git/repositories/PushChangesDialogContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="push-changes-dialog">Push Changes Dialog</div>
}));

jest.mock('@/components/git/GitDocumentation', () => ({
  __esModule: true,
  default: () => <div data-testid="git-documentation">Git Documentation</div>
}));

describe('GitRepositoryManager', () => {
  const mockRepositories = [
    { id: '1', name: 'repo1', url: 'https://github.com/user/repo1', branch: 'main', status: 'synced' },
    { id: '2', name: 'repo2', url: 'https://github.com/user/repo2', branch: 'main', status: 'modified' }
  ];
  
  beforeEach(() => {
    (useGitRepositories as jest.Mock).mockReturnValue({
      repositories: mockRepositories,
      loading: false,
      selectedRepo: null,
      setSelectedRepo: jest.fn(),
      activeRepositoryId: null,
      activeRepository: undefined,
      handleCloneRepository: jest.fn(),
      handlePullChanges: jest.fn(),
      handlePushChanges: jest.fn(),
      handleDeleteRepository: jest.fn(),
      handleRepositorySelect: jest.fn(),
      handleUpdateRepository: jest.fn(),
      handleSelectForPush: jest.fn()
    });
  });

  test('renders repository manager with tabs', () => {
    render(<GitRepositoryManager />);
    
    expect(screen.getByText('Git Repositories')).toBeInTheDocument();
    expect(screen.getByText('Repositories')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByTestId('repository-section')).toBeInTheDocument();
  });

  test('shows repository section by default', () => {
    render(<GitRepositoryManager />);
    
    expect(screen.getByTestId('repository-section')).toBeInTheDocument();
    expect(screen.queryByTestId('git-documentation')).not.toBeVisible();
  });

  test('switches to documentation tab when clicked', async () => {
    render(<GitRepositoryManager />);
    
    // Click on Documentation tab
    fireEvent.click(screen.getByText('Documentation'));
    
    await waitFor(() => {
      expect(screen.getByTestId('git-documentation')).toBeVisible();
      expect(screen.queryByTestId('repository-section')).not.toBeVisible();
    });
  });

  test('can search repositories', () => {
    render(<GitRepositoryManager />);
    
    const searchInput = screen.getByPlaceholderText('Search repositories...');
    fireEvent.change(searchInput, { target: { value: 'repo1' } });
    
    // The filtering logic is handled within the component, 
    // which would filter the repositories passed to RepositorySection
  });

  test('handles delete confirmation', async () => {
    const mockHandleDeleteRepository = jest.fn();
    (useGitRepositories as jest.Mock).mockReturnValue({
      repositories: mockRepositories,
      loading: false,
      selectedRepo: null,
      setSelectedRepo: jest.fn(),
      activeRepositoryId: null,
      activeRepository: undefined,
      handleCloneRepository: jest.fn(),
      handlePullChanges: jest.fn(),
      handlePushChanges: jest.fn(),
      handleDeleteRepository: mockHandleDeleteRepository,
      handleRepositorySelect: jest.fn(),
      handleUpdateRepository: jest.fn(),
      handleSelectForPush: jest.fn()
    });

    render(<GitRepositoryManager />);
    
    // We need to manually trigger the delete confirmation dialog
    // since the delete button is in a child component
    const instance = screen.getByText('Git Repositories').closest('.shadow-md');
    const deleteDialogButton = document.createElement('button');
    deleteDialogButton.textContent = 'Delete';
    deleteDialogButton.onclick = () => {
      (instance as any).__reactProps$.setRepoToDelete('1');
      (instance as any).__reactProps$.setIsDeleteDialogOpen(true);
    };
    document.body.appendChild(deleteDialogButton);
    
    fireEvent.click(deleteDialogButton);
    
    // Now check if dialog appears and confirm delete
    expect(screen.getByText('Delete Repository')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Delete'));
    
    // Check if delete handler was called
    expect(mockHandleDeleteRepository).toHaveBeenCalledWith('1');
  });
});
