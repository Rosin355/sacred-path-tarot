-- Create audio bucket for background music
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for public read access to audio files
CREATE POLICY "Public Access to Audio Files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');