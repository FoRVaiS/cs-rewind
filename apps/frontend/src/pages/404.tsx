import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import en from '@/locales/en';

function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center mt-32 text-foreground">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{en.ERROR_404_TITLE}</h2>
        <p className="text-muted-foreground mb-8">{en.ERROR_404_DESCRIPTION}</p>
        <Button asChild>
          <Link to="/">{en.HOME}</Link>
        </Button>
      </div>
    </main>
  );
}

export default NotFound;
