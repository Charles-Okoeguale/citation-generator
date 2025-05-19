import toast from 'react-hot-toast';

// Authentication toasts
export const authToasts = {
  loginSuccess: () => toast.success('Welcome back! You\'re now signed in'),
  loginFailed: () => toast.error('We couldn\'t log you in. Please check your email and password'),
  signupSuccess: () => toast.success('Your account has been created! Welcome aboard'),
  signupFailed: (message?: string) => toast.error(message || 'We couldn\'t create your account. Please try again'),
  emailExists: () => toast.error('This email is already registered. Please log in instead'),
  passwordRequirements: () => toast.error('Your password needs to be stronger. Please try again'),
  logout: () => toast.success('You\'ve been successfully logged out. See you soon!'),
};

// Citation toasts
export const citationToasts = {
  generating: () => toast.loading('Creating your citation...', { id: 'citationToast' }),
  generateSuccess: () => toast.success('Your citation is ready to use', { id: 'citationToast' }),
  generateFailed: () => toast.error('We couldn\'t create your citation. Please try again', { id: 'citationToast' }),
  copied: () => toast.success('Citation copied to clipboard'),
  copyFailed: () => toast.error('We couldn\'t copy your citation. Please try again'),
  saved: () => toast.success('Citation saved to your library'),
  saveFailed: () => toast.error('We couldn\'t save your citation. Please try again'),
  deleted: () => toast.success('Citation removed from your library', { id: 'deleteToast' }),
  deleteFailed: () => toast.error('We couldn\'t delete this citation. Please try again', { id: 'deleteToast' }),
  updated: () => toast.success('Your citation has been updated'),
  updateFailed: () => toast.error('We couldn\'t update your citation. Please try again'),
  missingFields: () => toast.error('Please fill in all the required fields'),
};

// Export toasts
export const exportToasts = {
  starting: () => toast.loading('Preparing your export...', { id: 'exportToast' }),
  success: () => toast.success('Your citations have been exported successfully', { id: 'exportToast' }),
  failed: (message?: string) => toast.error(message || 'We couldn\'t export your citations. Please try again', { id: 'exportToast' }),
  noCitations: () => toast.error('You don\'t have any citations to export'),
};

// Style toasts
export const styleToasts = {
  loadFailed: () => toast.error('We couldn\'t load the citation styles. Please try again'),
  defaultSet: (style: string) => toast.success(`${style} is now your default citation style`),
  defaultSetFailed: () => toast.error('We couldn\'t set your default style. Please try again'),
};

// General toasts
export const generalToasts = {
  error: (message: string) => toast.error(message),
  success: (message: string) => toast.success(message),
  info: (message: string) => toast.success(message),
  loading: (message: string, id?: string) => toast.loading(message, id ? { id } : undefined),
}; 