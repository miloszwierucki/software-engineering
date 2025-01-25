import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from "react-i18next";

export const Route = createFileRoute('/_auth/unauthorized')({
  component: UnauthorizedComponent,
});

function UnauthorizedComponent() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">
        {t('unauthorized.title')}
      </h1>
      <p className="text-gray-600">
        {t('unauthorized.message')}
      </p>
    </div>
  );
} 