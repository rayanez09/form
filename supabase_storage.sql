-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Enable public access to these buckets
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('documents', 'videos') );

-- Enable anonymous uploads to these buckets
create policy "Anyone can upload"
  on storage.objects for insert
  with check ( bucket_id in ('documents', 'videos') );
