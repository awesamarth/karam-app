import { Page } from '@/components/PageLayout';
import { Transaction } from '../components/Transaction';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center">
        <Transaction />
      </Page.Main>
    </Page>
  );
}
