import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

import en from '@/locales/en';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ERROR_INVALID_CREDENTIALS } from '@rewind/error-codes';

/* ===== Validators ===== */
const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginData = z.infer<typeof loginValidator>;

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const apiLogin = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });


      return {
        httpStatus: response.status,
        ...(await response.json()),
      };
    },
  });

  const login = () => {
    const loginData = { email, password };
    const validation = loginValidator.parse(loginData);

    apiLogin.mutate(validation, {
      onSuccess: data => {
        const { httpStatus, errNo } = data;

        if (errNo === ERROR_INVALID_CREDENTIALS) return console.error(en.ERROR_INVALID_CREDENTIALS);

        if (httpStatus === 200) return navigate('/dashboard');

        return console.warn(`Unsure how to handle a ${httpStatus} response. Not doing anything.`);
      },
    });
  };

  return (
    <main className="flex flex-col items-center">
      <Card className="mx-auto mt-16 min-w-[448px]">
        <CardHeader>
          <CardTitle className="text-xl text-center">{en.LOGIN}</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{en.EMAIL}</Label>
            <Input id="email" type="email" onChange={e => setEmail(e.currentTarget.value)} onKeyDown={({ key }) => key === 'Enter' && login()} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{en.PASSWORD}</Label>
            <Input id="password" type="password" onChange={e => setPassword(e.currentTarget.value)} onKeyDown={({ key }) => key === 'Enter' && login()} required />
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={login}>{en.SIGN_IN}</Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default LoginPage;
