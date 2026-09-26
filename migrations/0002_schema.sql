-- ROSKYRO concierge CMS schema (text PKs — PGLite has no pgcrypto)

create table if not exists admin_staff (
  id text primary key,
  user_id text unique,
  name text not null,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists site_settings (
  id text primary key,
  brand text not null,
  tagline text not null default '',
  hero_h1 text not null default '',
  hero_sub text not null default '',
  hero_video_url text not null default '',
  hero_image_url text not null default '',
  favicon_url text not null default '',
  address text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  footer_text text not null default '',
  stat_1_value text not null default '',
  stat_1_label text not null default '',
  stat_2_value text not null default '',
  stat_2_label text not null default '',
  stat_3_value text not null default '',
  stat_3_label text not null default '',
  gtm_container_id text not null default '',
  og_image_url text not null default '',
  meta_description text not null default '',
  notify_email text not null default ''
);

create table if not exists doctors (
  id text primary key,
  slug text not null unique,
  name text not null,
  specialty text not null,
  city text not null,
  address_line text not null default '',
  latitude double precision,
  longitude double precision,
  phone text not null default '',
  whatsapp_number text not null default '',
  photo_url text not null default '',
  bio text not null default '',
  years_experience integer,
  languages_spoken text not null default '',
  education text not null default '',
  status text not null default 'active' check (status in ('active', 'on_leave', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists doctors_city_idx on doctors (city);
create index if not exists doctors_specialty_idx on doctors (specialty);

create table if not exists appointments (
  id text primary key,
  doctor_id text references doctors(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  preferred_date date,
  preferred_time_slot text,
  reason text not null default '',
  source text not null default 'other' check (source in ('find_doctor', 'contact', 'become_affiliate', 'sell_practice', 'do_not_sell', 'other')),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled', 'completed')),
  whatsapp_opened boolean not null default false,
  notified boolean not null default false,
  created_at timestamptz not null default now(),
  notes text not null default '',
  assigned_to text references admin_staff(id) on delete set null
);
create index if not exists appointments_status_idx on appointments (status);

create table if not exists leads (
  id text primary key,
  type text not null check (type in ('contact', 'become_affiliate', 'sell_practice', 'do_not_sell')),
  name text not null,
  phone text not null default '',
  email text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled', 'completed')),
  whatsapp_opened boolean not null default false,
  notified boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  notes text not null default '',
  assigned_to text references admin_staff(id) on delete set null
);
create index if not exists leads_type_idx on leads (type);
create index if not exists leads_status_idx on leads (status);

create table if not exists testimonials (
  id text primary key,
  member_name text not null,
  photo_url text not null default '',
  rating integer check (rating is null or (rating >= 1 and rating <= 5)),
  text text not null,
  full_text text,
  source text not null default 'manual' check (source in ('manual', 'google')),
  audience text not null default 'patient' check (audience in ('patient', 'physician')),
  external_url text,
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id text primary key,
  slug text not null unique,
  audience text not null check (audience in ('patient', 'physician')),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_image_url text not null default '',
  author_id text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  meta_title text not null default '',
  meta_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blog_posts_slug_idx on blog_posts (slug);
create index if not exists blog_posts_status_idx on blog_posts (status);

create table if not exists perks (
  id text primary key,
  title text not null,
  text text not null default '',
  image_url text not null default '',
  ordering integer not null default 0,
  active boolean not null default true
);

create table if not exists care_items (
  id text primary key,
  title text not null,
  text text not null default '',
  image_url text not null default '',
  ordering integer not null default 0,
  active boolean not null default true
);

create table if not exists plans (
  id text primary key,
  title text not null,
  text text not null default '',
  image_url text not null default '',
  ordering integer not null default 0,
  active boolean not null default true
);

create table if not exists activity_log (
  id text primary key,
  user_id text,
  action text not null,
  entity_type text not null,
  entity_id text,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id text primary key,
  title text not null,
  embed_url text not null,
  thumbnail_url text not null default '',
  ordering integer not null default 0,
  active boolean not null default true
);

create table if not exists pages (
  id text primary key,
  slug text not null unique,
  title text not null,
  body text not null default '',
  image_url text not null default '',
  meta_title text not null default '',
  meta_description text not null default ''
);

create table if not exists team_members (
  id text primary key,
  name text not null,
  role text not null default '',
  photo_url text not null default '',
  bio text not null default '',
  ordering integer not null default 0
);

create table if not exists faqs (
  id text primary key,
  question text not null,
  answer text not null default '',
  audience text not null check (audience in ('patient', 'physician')),
  ordering integer not null default 0
);

create table if not exists steps (
  id text primary key,
  title text not null,
  text text not null default '',
  ordering integer not null default 0
);
