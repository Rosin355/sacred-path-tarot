import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uploadAudioFile, deleteAudioFile, checkAudioFileExists } from '@/lib/audioStorage';
import { Upload, Trash2, Music, LogOut, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
    queryFn: checkAudioFileExists
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
        variant: "destructive"
      });
    } else {
      toast({
        title: "Upload completato!",
        description: "La musica di background è stata aggiornata"
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
        variant: "destructive"
      });
    } else {
      toast({
        title: "File eliminato",
        description: "La musica di background è stata rimossa"
      });
      queryClient.invalidateQueries({ queryKey: ['audioFileExists'] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b minimal-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Esci
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Audio Management Card */}
          <Card className="minimal-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Gestione Musica di Sottofondo
              </CardTitle>
              <CardDescription>
                Carica o sostituisci il file audio che viene riprodotto in background sul sito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Status */}
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Caricamento...
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/20 minimal-border">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {fileExists ? 'File audio presente: ambient-music.mp3' : 'Nessun file audio caricato'}
                    </span>
                  </div>
                  {fileExists && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Elimina
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-sm text-muted-foreground mb-2">
                  Trascina qui il file MP3 o clicca per selezionare
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Formato: MP3 • Dimensione massima: 20MB
                </p>
                <label htmlFor="audio-upload">
                  <Button variant="outline" disabled={isUploading} asChild>
                    <span>
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Upload in corso...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Seleziona File
                        </>
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

          {/* Future sections placeholders */}
          {/* <Card className="minimal-border bg-card/80 backdrop-blur-sm opacity-50">
            <CardHeader>
              <CardTitle>Gestione Utenti</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
          </Card> */}
        </div>
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
