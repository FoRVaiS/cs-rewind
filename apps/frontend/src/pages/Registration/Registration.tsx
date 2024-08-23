import { Dispatch, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { clamp } from '@/lib/utils';
import en from '@/locales/en.ts';

interface RegistrationFormProps {
  setEmail: Dispatch<string>,
  setPassword: Dispatch<string>,
  setPasswordConfirm: Dispatch<string>,

  email: string,
  password: string,
  passwordConfirm: string,
}

interface CsIntegrationFormProps {
  setAuthCode: Dispatch<string>,
  setMatchCode: Dispatch<string>,

  authCode?: string,
  matchCode?: string,
}

function RegistrationForm(props: RegistrationFormProps) {
  return (
    <div className="grid gap-4">
      {/* Email Field */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" onChange={v => props.setEmail(v.currentTarget.value)} value={props.email} required />
      </div>

      {/* Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" onChange={v => props.setPassword(v.currentTarget.value)} value={props.password} required />
      </div>

      {/* Password Confirm Field */}
      <div className="grid gap-2">
        <Label htmlFor="password-confirm">Password Confirm</Label>
        <Input id="password-confirm" type="password" onChange={v => props.setPasswordConfirm(v.currentTarget.value)} value={props.passwordConfirm} required />
      </div>
    </div>
  );
}

function CsIntegrationForm(props: CsIntegrationFormProps) {
  return (
    <div className="grid gap-4">
      {/* Authentication Code Field */}
      <div className="grid gap-2">
        <Label htmlFor="cs2-auth-code">Match Authentication Code</Label>
        <Input id="cs2-auth-code" type="text" onChange={v => props.setAuthCode(v.currentTarget.value)} value={props.authCode} placeholder="13G1-46UJ4-R9BW" />
      </div>

      {/* Match Code Field */}
      <div className="grid gap-2">
        <Label htmlFor="cs2-match-code">Latest Match Code</Label>
        <Input id="c2-match-code" type="text" onChange={v => props.setMatchCode(v.currentTarget.value)} value={props.matchCode} placeholder="CSGO-4A9xL-b8N7M-Q2VdJ-W3s1k-Z0RfT" />
      </div>
    </div>
  );
}

/* ===== Validators ===== */
const authCodeValidator = z.string().regex(/[0-9A-Z]{4}-[0-9A-Z]{5}-[0-9A-Z]{4}/g).length(15);
const matchCodeValidator = z.string().regex(/CSGO-[0-9A-Za-z]{5}-[0-9A-Za-z]{5}-[0-9A-Za-z]{5}-[0-9A-Za-z]{5}-[0-9A-Za-z]{5}/g).length(34);

const formValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirm: z.string().min(8),

  authCode: authCodeValidator.optional(),
  matchCode: matchCodeValidator.optional(),
});

type FormData = z.infer<typeof formValidator>;

function RegistrationPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Form Data
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [authCode, setAuthCode] = useState<string>();
  const [matchCode, setMatchCode] = useState<string>();

  const apiRegisterAccount = useMutation({
    mutationFn: (data: FormData) => fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  });

  /* eslint-disable object-property-newline -- Reason: In-lining alike properties saves space and cognitive overhead */
  const registrationFormProps: RegistrationFormProps = {
    email, setEmail,
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
  };

  const csIntegrationProps: CsIntegrationFormProps = {
    authCode, setAuthCode,
    matchCode, setMatchCode,
  };
  /* eslint-enable object-property-newline */

  const forms: [React.ReactNode, title: string, isSkippable?: boolean][] = [
    [<RegistrationForm key="registration-form-1" {...registrationFormProps} />, en.REGISTRATION_FORM_SIGN_UP_TITLE],
    [<CsIntegrationForm key="registration-form-2" {...csIntegrationProps} />, en.REGISTRATION_FORM_CS_INTEGRATION_TITLE, true],
  ];

  const submit = () => {
    const data: FormData = { email, password, passwordConfirm, authCode, matchCode };
    const validation = formValidator.parse(data);

    if (password !== passwordConfirm) throw new Error(en.ERROR_MISMATCHED_PASSWORDS);

    apiRegisterAccount.mutate(validation, {
      onSuccess: data => {
        const { status } = data;

        if (status === 200) return navigate('/login');

        console.warn(`Unsure how to handle a ${status} response. Not doing anything.`);
      },
    });
  };

  const next = () => setPage(clamp(page + 1, 1, forms.length));
  const prev = () => setPage(clamp(page - 1, 1, forms.length));
  const skip = () => (page === forms.length ? submit() : next());

  const [form, title, isSkippable] = forms[page - 1];

  const isLastForm = page === forms.length;
  const prevFormExists = page > 1;
  const nextFormExists = page < forms.length;

  const submitBtn = isLastForm && <Button onClick={submit}>{en.FINISH}</Button>;
  const prevBtn = prevFormExists && <ChevronLeft className="mt-2 cursor-pointer" onClick={prev} />;
  const nextBtn = nextFormExists && <Button onClick={next}>{en.NEXT}</Button>;
  const skipBtn = <Button variant="secondary" onClick={skip} disabled={!isSkippable}>{en.SKIP}</Button>;

  return (
    <main className="flex flex-col justify-center">
      <Card className="mx-auto mt-16 min-w-[448px]">

        <CardHeader className="grid grid-cols-[1fr_max-content_1fr] items-center">
          {prevBtn || <span />} {/* An empty span is included so the title in the correct grid partition. */}
          <CardTitle className="text-xl text-center">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          {form}
        </CardContent>

        <CardFooter className="flex flex-col gap-5 text-sm justify-center">
          <div className="grid grid-cols-2 w-full gap-4">
            {skipBtn}
            {submitBtn || nextBtn}
          </div>
          <Link className="underline" to="/login">Already have an account?</Link>
        </CardFooter>

      </Card>
    </main>
  );
}

export default RegistrationPage;
