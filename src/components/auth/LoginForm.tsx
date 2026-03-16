import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email non valida').trim(),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSignUpClick?: () => void;
}

export const LoginForm = ({ onSuccess, onSignUpClick }: LoginFormProps) => {
  const { signIn, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (!error && onSuccess) {
      onSuccess();
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) return;

    setIsResetLoading(true);
    await resetPassword(parsed.data);
    setIsResetLoading(false);
  };

  const canResetPassword = z.string().email().safeParse(getValues('email')).success;

  return (
    <Card className="w-full max-w-md minimal-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-serif">Accedi</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Entra nel regno dei Tarocchi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="la-tua-email@example.com"
              {...register('email')}
              disabled={isLoading || isResetLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={!canResetPassword || isLoading || isResetLoading}
                className="text-xs text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResetLoading ? 'Invio in corso…' : 'Hai dimenticato la password?'}
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading || isResetLoading}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition hover:text-foreground"
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isResetLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accesso in corso...
              </>
            ) : (
              'Accedi'
            )}
          </Button>
        </form>

        {onSignUpClick && (
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Non hai un account? </span>
            <button
              onClick={onSignUpClick}
              className="text-primary hover:underline"
              type="button"
            >
              Registrati
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
