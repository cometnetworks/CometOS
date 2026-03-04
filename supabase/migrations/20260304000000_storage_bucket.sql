-- Create storage bucket for checklist evidence
insert into storage.buckets (id, name, public)
values ('checklist-evidence', 'checklist-evidence', true);

-- Allows any user to view public checklist evidence
create policy "Public Evidence is viewable by everyone." on storage.objects
  for select using (bucket_id = 'checklist-evidence');

-- Allows authenticated users to upload checklist evidence
create policy "Authenticated users can upload evidence." on storage.objects
  for insert with check (
    bucket_id = 'checklist-evidence' and auth.role() = 'authenticated'
  );

-- Allows users to update their own uploads (optional, but good practice)
create policy "Users can update their own evidence." on storage.objects
  for update using (
    bucket_id = 'checklist-evidence' and auth.uid() = owner
  );

-- Allows users to delete their own uploads (optional)
create policy "Users can delete their own evidence." on storage.objects
  for delete using (
    bucket_id = 'checklist-evidence' and auth.uid() = owner
  );
