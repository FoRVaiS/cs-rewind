import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import z, { ZodError } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ERROR_ACCOUNT_ALREADY_EXISTS, ERROR_INVALID_EMAIL_FORMAT, ERROR_INVALID_PASSWORD_FORMAT } from '@rewind/error-codes';
import en from '@/locales/en.ts';
import { raise } from '@/lib/utils';

/* ===== Validators ===== */
const formValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirm: z.string().min(8),
});

type FormData = z.infer<typeof formValidator>;

function RegistrationPage() {
  const navigate = useNavigate();
  const [alertMsg, setAlert] = useState<string>('');

  // Form Data
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const alertAccountExists = setAlert.bind(null, en.ERROR_ACCOUNT_ALREADY_EXISTS);
  const alertInvalidEmailFormat = setAlert.bind(null, en.ERROR_INVALID_EMAIL_FORMAT);
  const alertInvalidPasswordFormat = setAlert.bind(null, en.ERROR_INVALID_PASSWORD_FORMAT);
  const alertFailedPasswordConfirmation = setAlert.bind(null, en.ERROR_MISMATCHED_PASSWORDS);

  const apiRegisterAccount = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/user/register', {
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

  const submit = () => {
    const formData: FormData = { email, password, passwordConfirm };
    let validation: Parameters<typeof apiRegisterAccount['mutate']>[0];

    setAlert('');

    try {
      validation = formValidator.parse(formData);
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

    if (password !== passwordConfirm) return alertFailedPasswordConfirmation();

    return apiRegisterAccount.mutate((validation! ?? raise('Could not get form data.')), {
      onSuccess: data => {
        const { httpStatus, errNo } = data;

        if (errNo === ERROR_ACCOUNT_ALREADY_EXISTS) return alertAccountExists();
        if (errNo === ERROR_INVALID_EMAIL_FORMAT) return alertInvalidEmailFormat();
        if (errNo === ERROR_INVALID_PASSWORD_FORMAT) return alertInvalidPasswordFormat();

        if (httpStatus === 200) return navigate('/login');

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
    <main className="flex flex-col justify-center">
      <Card className="mx-auto mt-16 w-[448px]">

        <CardHeader className="gap-4">
          <CardTitle className="text-xl text-center">{en.REGISTRATION_FORM_SIGN_UP_TITLE}</CardTitle>

          {alertMsg && <Alert msg={alertMsg} />}
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">{en.EMAIL}</Label>
              <Input id="email" type="email" onChange={v => setEmail(v.currentTarget.value)} value={email} required />
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <Label htmlFor="password">{en.PASSWORD}</Label>
              <Input id="password" type="password" onChange={v => setPassword(v.currentTarget.value)} value={password} required />
            </div>

            {/* Password Confirm Field */}
            <div className="grid gap-2">
              <Label htmlFor="password-confirm">{en.PASSWORD_CONFIRM}</Label>
              <Input id="password-confirm" type="password" onChange={v => setPasswordConfirm(v.currentTarget.value)} value={passwordConfirm} required />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-5 text-sm justify-center">
          <Button className="w-full" onClick={submit}>{en.FINISH}</Button>
          <Link className="underline" to="/login">{en.REGISTRATION_FORM_HAVE_EXISTING_ACCOUNT}</Link>
        </CardFooter>

      </Card>
    </main>
  );
}

export default RegistrationPage;
