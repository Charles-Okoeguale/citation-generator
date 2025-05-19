import { toast } from 'react-hot-toast';

const fetchStyles = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/styles');
    
    if (!response.ok) {
      throw new Error('Failed to fetch citation styles');
    }
    
    const data = await response.json();
    setStyles(data);
  } catch (error) {
    console.error('Error fetching styles:', error);
    toast.error('Failed to load citation styles. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleStyleSelect = async (style: string) => {
  try {
    const response = await fetch('/api/settings/style', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ style }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to set default style');
    }
    
    setSelectedStyle(style);
    toast.success(`Set ${style} as your default citation style`);
  } catch (error) {
    console.error('Error setting default style:', error);
    toast.error('Failed to set default style. Please try again.');
  }
}; 