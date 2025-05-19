import { StyleDetailPage } from '@/app/components/citation-styles/StyleDetailPage';
import { getStyleMetadata } from '@/lib/citation/style-service';
import type { Metadata } from 'next';

interface StyleDetailProps {
  params: {
    styleId: string;
  };
}

export async function generateMetadata({ params }: StyleDetailProps): Promise<Metadata> {
  const style = await getStyleMetadata(params.styleId);
  return {
    title: style ? `${style.title} - Citation Style` : 'Style Details',
    description: style?.description || 'View details about this citation style'
  };
}

export default async function StyleDetail({ params }: StyleDetailProps) {
  const style = await getStyleMetadata(params.styleId);
  
  if (!style) {
    return <div>Style not found</div>;
  }

  return <StyleDetailPage styleId={params.styleId} style={style} />;
}