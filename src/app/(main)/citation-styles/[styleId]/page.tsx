import { StyleDetailPage } from '@/app/components/citation-styles/StyleDetailPage';
import { getStyleMetadata } from '@/lib/citation/style-service';

export default async function StyleDetail({ params }: { params: { styleId: string } }) {
  const style = await getStyleMetadata(params.styleId);
  
  if (!style) {
    return <div>Style not found</div>;
  }

  return <StyleDetailPage styleId={params.styleId} style={style} />;
}