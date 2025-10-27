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

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Il nome deve contenere almeno 2 caratteri').max(100, 'Nome troppo lungo'),
  email: z.string().email('Email non valida').trim().max(255, 'Email troppo lunga'),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri').max(100, 'Password troppo lunga'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export const SignUpForm = ({ onSuccess, onLoginClick }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsLoading(false);

    if (!error && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full max-w-md minimal-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-serif">Registrati</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Inizia il tuo viaggio mistico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Il tuo nome"
              {...register('fullName')}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
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
                Registrazione in corso...
              </>
            ) : (
              'Registrati'
            )}
          </Button>
        </form>

        {onLoginClick && (
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Hai già un account? </span>
            <button
              onClick={onLoginClick}
              className="text-primary hover:underline"
              type="button"
            >
              Accedi
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
