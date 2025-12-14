import React from 'react';
// TODO: Migrer toute la logique de Public.tsx ici
type PublicPanelProps = {
  t?: (key: string) => string;
  lang?: string;
};
export default function PublicPanel({ t, lang }: PublicPanelProps) {
  return <div className="text-center text-2xl font-bold">{t ? t('nav.home') : 'Page Public (en cours de migration)'}</div>;
}
