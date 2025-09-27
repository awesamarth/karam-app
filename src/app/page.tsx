import { Page } from '@/components/PageLayout';
import { KarmaDashboard } from '../components/KarmaDashboard';

export default function Home() {
  return (
    <Page>
      <Page.Main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <KarmaDashboard />
      </Page.Main>
    </Page>
  );
}
