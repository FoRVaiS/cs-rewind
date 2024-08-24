import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

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
    mutationFn: (data: LoginData) => fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  });

  const login = () => {
    const loginData = { email, password };
    const validation = loginValidator.parse(loginData);

    apiLogin.mutate(validation, {
      onSuccess: data => {
        const { status } = data;

        if (status === 200) return navigate('/dashboard');

        return console.warn(`Unsure how to handle a ${status} response. Not doing anything.`);
      },
    });
  };

  return (
    <main className="flex flex-col items-center">
      <Card className="w-full mt-16 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" onChange={e => setEmail(e.currentTarget.value)} onKeyDown={({ key }) => key === 'Enter' && login()} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={e => setPassword(e.currentTarget.value)} onKeyDown={({ key }) => key === 'Enter' && login()} required />
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={login}>Sign in</Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default LoginPage;
