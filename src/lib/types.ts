export type StaffRole = "super_admin" | "admin" | "editor";
export type DoctorStatus = "active" | "on_leave" | "inactive";
export type LeadType = "contact" | "become_affiliate" | "sell_practice" | "do_not_sell";
export type InboxStatus = "new" | "contacted" | "confirmed" | "cancelled" | "completed";
export type AppointmentSource =
  | "find_doctor"
  | "contact"
  | "become_affiliate"
  | "sell_practice"
  | "do_not_sell"
  | "other";
export type Audience = "patient" | "physician";

export type SiteSettings = {
  id: string;
  brand: string;
  tagline: string;
  hero_h1: string;
  hero_sub: string;
  hero_video_url: string;
  hero_image_url: string;
  favicon_url: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  footer_text: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  gtm_container_id: string;
  og_image_url: string;
  meta_description: string;
  notify_email?: string;
};

export type Doctor = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  city: string;
  address_line: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  whatsapp_number: string;
  photo_url: string;
  bio: string;
  years_experience: number | null;
  languages_spoken: string;
  education: string;
  status: DoctorStatus;
  created_at: string;
  updated_at: string;
  distance_km?: number | null;
};

export type CardItem = {
  id: string;
  title: string;
  text: string;
  image_url: string;
  ordering: number;
  active: boolean;
};

export type Testimonial = {
  id: string;
  member_name: string;
  photo_url: string;
  rating: number | null;
  text: string;
  full_text: string | null;
  source: "manual" | "google";
  audience: Audience;
  external_url: string | null;
  status: "published" | "hidden";
  created_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  audience: Audience;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  author_id: string | null;
  status: "draft" | "published";
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  embed_url: string;
  thumbnail_url: string;
  ordering: number;
  active: boolean;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  body: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  bio: string;
  ordering: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  audience: Audience;
  ordering: number;
};

export type Step = {
  id: string;
  title: string;
  text: string;
  ordering: number;
};

export type Staff = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

export type Appointment = {
  id: string;
  doctor_id: string | null;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  preferred_date: string | null;
  preferred_time_slot: string | null;
  reason: string;
  source: AppointmentSource;
  status: InboxStatus;
  whatsapp_opened: boolean;
  notified: boolean;
  created_at: string;
  notes: string;
  assigned_to: string | null;
  doctor_name?: string | null;
};

export type Lead = {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  email: string;
  status: InboxStatus;
  whatsapp_opened: boolean;
  notified: boolean;
  payload: Record<string, string>;
  created_at: string;
  notes: string;
  assigned_to: string | null;
};

export type InboxItem = {
  kind: "appointment" | "lead";
  id: string;
  title: string;
  subtitle: string;
  status: InboxStatus;
  created_at: string;
  whatsapp_opened: boolean;
  notified: boolean;
  type: string;
};
