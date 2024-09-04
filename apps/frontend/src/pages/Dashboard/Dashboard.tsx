import en from '@/locales/en';

function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center mt-32 text-foreground">
        <h1 className="text-2xl font-bold">{en.DASHBOARD_PLACEHOLDER_TITLE}</h1>
      </div>
    </main>
  );
}

export default DashboardPage;
