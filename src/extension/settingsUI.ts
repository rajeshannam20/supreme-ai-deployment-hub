
/**
 * UI helper functions for the settings page
 */

/**
 * Show connection status
 */
export function showConnectionStatus(message: string, isSuccess: boolean, connectionStatusElement: HTMLDivElement): void {
  connectionStatusElement.textContent = message;
  if (isSuccess) {
    connectionStatusElement.classList.add('success');
    connectionStatusElement.classList.remove('error');
  } else {
    connectionStatusElement.classList.add('error');
    connectionStatusElement.classList.remove('success');
  }
}

/**
 * Show error message
 */
export function showErrorMessage(message: string, parentElement: Element): void {
  const errorMessage = document.createElement('div');
  errorMessage.textContent = message;
  errorMessage.style.backgroundColor = '#fee2e2';
  errorMessage.style.color = '#b91c1c';
  errorMessage.style.padding = '10px';
  errorMessage.style.borderRadius = '4px';
  errorMessage.style.marginTop = '16px';
  
  parentElement.appendChild(errorMessage);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
}

/**
 * Show success message
 */
export function showSuccessMessage(message: string, parentElement: Element): void {
  const successMessage = document.createElement('div');
  successMessage.textContent = message;
  successMessage.style.backgroundColor = '#d1fae5';
  successMessage.style.color = '#065f46';
  successMessage.style.padding = '10px';
  successMessage.style.borderRadius = '4px';
  successMessage.style.marginTop = '16px';
  
  parentElement.appendChild(successMessage);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 3000);
}
