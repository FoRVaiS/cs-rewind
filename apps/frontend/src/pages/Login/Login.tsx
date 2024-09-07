import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import z, { ZodError } from 'zod';

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
import { raise } from '@/lib/utils';

/* ===== Validators ===== */
const loginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginData = z.infer<typeof loginValidator>;

function LoginPage() {
  const navigate = useNavigate();
  const [alertMsg, setAlert] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const alertInvalidEmailFormat = setAlert.bind(null, en.ERROR_INVALID_EMAIL_FORMAT);
  const alertInvalidPasswordFormat = setAlert.bind(null, en.ERROR_INVALID_PASSWORD_FORMAT);
  const alertInvalidCredentials = setAlert.bind(null, en.ERROR_INVALID_CREDENTIALS);

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
    let validation: Parameters<typeof apiLogin['mutate']>[0];

    setAlert('');

    try {
      validation = loginValidator.parse(loginData);
    } catch (e) {
      if (e instanceof ZodError) {
        const error = e.issues[0] ?? raise('ZodError was raised but could find the first ZodIssue');

        const { code } = error;
        const path = error.path[0] ?? raise('Could not find offending key');

        if (path === 'email' && code === 'invalid_type') return alertInvalidEmailFormat(); // Missing entry in email field
        if (path === 'email' && code === 'invalid_string') return alertInvalidEmailFormat(); // Bad email format
        if (path === 'password' && code === 'invalid_type') return alertInvalidPasswordFormat(); // Missing entry in password field
        if (path === 'password' && code === 'too_small') return alertInvalidPasswordFormat(); // Password does not meet min length requirement
      }
    }

    return apiLogin.mutate(validation! ?? raise('Could not get form data.'), {
      onSuccess: data => {
        const { httpStatus, errNo } = data;

        if (errNo === ERROR_INVALID_CREDENTIALS) return alertInvalidCredentials();

        if (httpStatus === 200) return navigate('/dashboard');

        return console.warn(`Unsure how to handle a ${httpStatus} response. Not doing anything.`);
      },
    });
  };

  const Alert = ({ msg }: { msg: string }) => (
    <div className="w-full">
      <p className="text-wrap text-center text-red-500">{msg}</p>
    </div>
  );

  return (
    <main className="flex flex-col items-center">
      <Card className="mx-auto mt-16 w-[448px]">
        <CardHeader className="gap-4">
          <CardTitle className="text-xl text-center">{en.LOGIN}</CardTitle>

          {alertMsg && <Alert msg={alertMsg} />}
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
