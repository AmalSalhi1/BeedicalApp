'use client';

import dynamic from 'next/dynamic';

const SearchPageDynamicComponentWithNoSSR = dynamic(
  () => import('@/components/SearchPage'),
  { ssr: false }
);

export default function Page() {
  return <SearchPageDynamicComponentWithNoSSR />;
}
