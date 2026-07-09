import dynamic from 'next/dynamic';

const AboutPageClient = dynamic(() => import('./AboutPageClient'), {
  ssr: false,
});

export default function AboutPage() {
  return <AboutPageClient />;
}
