import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import { AdminKnowledgeManager } from '@/components/admin/AdminKnowledgeManager';

const AdminContent = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Sanctum editoriale
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-3xl text-foreground">Dashboard Admin</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>Accesso riservato via path · {user?.email}</span>
                <Badge variant="outline" className="border-accent/40 bg-accent/10 text-foreground">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  {isAdmin ? 'Ruolo verificato: Admin' : 'Account autenticato'}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Esci
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <Card className="minimal-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="font-serif text-2xl text-foreground">Cabina di regia della Guida AI</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Qui affini il sapere interno del Tempio e definisci come la guida deve orientare il visitatore prima di ogni eventuale verifica esterna.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-background/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Accesso</p>
                <p className="mt-3 text-sm leading-6 text-foreground">Nessun bottone pubblico: la dashboard resta raggiungibile solo dal path dedicato.</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Priorità</p>
                <p className="mt-3 text-sm leading-6 text-foreground">La knowledge base interna resta la prima fonte per ogni risposta della guida.</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Fallback</p>
                <p className="mt-3 text-sm leading-6 text-foreground">Le fonti esterne entrano solo come verifica controllata e approvata.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <AdminKnowledgeManager />
      </main>
    </div>
  );
};

const Admin = () => {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  );
};

export default Admin;

