import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import en from '@/locales/en.ts';

function LandingPage() {
  return (
    <main className="flex flex-col px-4">
      <div className="max-w-3xl mx-auto mt-48 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
          {en.LANDING_PAGE_SLOGAN}
        </h2>
        <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
          {en.LANDING_PAGE_DESCRIPTION}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link className="select-none" to="/login">{en.LOGIN}</Link>
          </Button>
          <Button asChild size="lg">
            <Link className="select-none" to="/register">{en.REGISTER}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
