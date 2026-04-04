import BoilerplatePage from './PageClient';

export function generateStaticParams() {
  return [{ slug: ['home'] }, { slug: ['dashboard'] }];
}

export default function Page() {
  return <BoilerplatePage />;
}
