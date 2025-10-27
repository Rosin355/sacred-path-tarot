import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    
    if (user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  const handleSuccess = () => {
    // Navigation handled by useEffect above
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-accent/5">
      <div className="w-full max-w-md">
        {showSignUp ? (
          <SignUpForm
            onSuccess={handleSuccess}
            onLoginClick={() => setShowSignUp(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleSuccess}
            onSignUpClick={() => setShowSignUp(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
