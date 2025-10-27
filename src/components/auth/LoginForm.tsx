import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

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
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
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
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
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
