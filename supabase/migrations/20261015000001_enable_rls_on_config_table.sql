-- La tabla config (numero de WhatsApp y mensajes prellenados usados por la
-- edge function whatsapp-link) estaba expuesta via PostgREST sin RLS:
-- cualquiera con la anon key publica podia leer Y escribir sus filas.
-- Se habilita RLS replicando el mismo patron que ya usa app_config:
-- lectura publica, escritura solo para admins.

alter table public.config enable row level security;

create policy "cualquiera puede leer la configuracion publica"
  on public.config
  for select
  using (true);

create policy "solo admin edita config"
  on public.config
  for all
  using (is_admin())
  with check (is_admin());
