import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uploadAudioFile, deleteAudioFile, checkAudioFileExists } from '@/lib/audioStorage';
import { Upload, Trash2, Music, LogOut, Loader2, Sparkles } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminKnowledgeManager } from '@/components/admin/AdminKnowledgeManager';

const AdminContent = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { data: fileExists, isLoading } = useQuery({
    queryKey: ['audioFileExists'],
    queryFn: checkAudioFileExists,
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const { error } = await uploadAudioFile(file);
    setIsUploading(false);

    if (error) {
      toast({
        title: "Errore durante l'upload",
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Upload completato!',
        description: 'La musica di background è stata aggiornata',
      });
      queryClient.invalidateQueries({ queryKey: ['audioFileExists'] });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare il file audio?')) return;

    setIsDeleting(true);
    const { error } = await deleteAudioFile();
    setIsDeleting(false);

    if (error) {
      toast({
        title: "Errore durante l'eliminazione",
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'File eliminato',
        description: 'La musica di background è stata rimossa',
      });
      queryClient.invalidateQueries({ queryKey: ['audioFileExists'] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Sanctum editoriale
            </div>
            <div>
              <h1 className="font-serif text-3xl text-foreground">Dashboard Admin</h1>
              <p className="text-sm text-muted-foreground">Accesso riservato via path · {user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Esci
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
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

          <Card className="minimal-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl text-foreground">
                <Music className="h-5 w-5" />
                Musica di sottofondo
              </CardTitle>
              <CardDescription>
                Carica o sostituisci il file audio che viene riprodotto in background sul sito.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Caricamento…
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/20 p-4">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {fileExists ? 'File audio presente: ambient-music.mp3' : 'Nessun file audio caricato'}
                    </span>
                  </div>
                  {fileExists && (
                    <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="mr-2 h-4 w-4" />Elimina</>}
                    </Button>
                  )}
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                }`}
              >
                <Upload className={`mx-auto mb-4 h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="mb-2 text-sm text-muted-foreground">Trascina qui il file MP3 o clicca per selezionare</p>
                <p className="mb-4 text-xs text-muted-foreground">Formato: MP3 • Dimensione massima: 20MB</p>
                <label htmlFor="audio-upload">
                  <Button variant="outline" disabled={isUploading} asChild>
                    <span>
                      {isUploading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Upload in corso...</>
                      ) : (
                        <><Upload className="mr-2 h-4 w-4" />Seleziona File</>
                      )}
                    </span>
                  </Button>
                </label>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/mpeg,.mp3"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
                />
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
