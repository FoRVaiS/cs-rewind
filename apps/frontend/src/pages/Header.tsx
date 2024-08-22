import { PropsWithChildren } from 'react';

import en from '@/locales/en.ts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Props extends PropsWithChildren { }

function Header(props: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 p-6">
        <Button asChild className="bg-transparent hover:bg-transparent">
          <Link to="/">
            <h1 className="text-3xl font-bold text-white">{en.APP_NAME}</h1>
          </Link>
        </Button>
      </header>
      {props.children}
    </div>
  );
}

export default Header;
