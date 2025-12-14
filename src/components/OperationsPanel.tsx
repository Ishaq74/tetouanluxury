import React from 'react';
// TODO: Migrer toute la logique de Operations.tsx ici
type OperationsPanelProps = {
  t?: (key: string) => string;
  lang?: string;
  staff?: any;
  todaysTasks?: any[];
  villaStatus?: any[];
};
export default function OperationsPanel({ t, lang, staff, todaysTasks, villaStatus }: OperationsPanelProps) {
  return <div className="text-center text-2xl font-bold">{t ? t('nav.home') : 'Page Operations (en cours de migration)'}</div>;
}
