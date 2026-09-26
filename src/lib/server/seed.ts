import { getSql } from "@/lib/db";

let seedPromise: Promise<void> | null = null;

export function ensureSeeded() {
  if (!seedPromise) seedPromise = seedInner().catch((err) => {
    seedPromise = null;
    throw err;
  });
  return seedPromise;
}

async function seedInner() {
  const sql = await getSql();
  const existing = await sql`select id from site_settings limit 1`;
  if (existing.length) return;

  await sql.query(
    `insert into site_settings (
      id, brand, tagline, hero_h1, hero_sub, hero_video_url, hero_image_url, favicon_url,
      address, phone, whatsapp_number, email, footer_text,
      stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label,
      gtm_container_id, og_image_url, meta_description, notify_email
    ) values (
      'singleton', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
    )`,
    [
      "ROSKYRO",
      "Healthcare concierge",
      "A physician who has time for you.",
      "Membership medicine for families who are done with twelve-minute appointments and unanswered nights. One doctor. Direct access. Care that remembers your name.",
      "https://www.youtube.com/watch?v=LXb3EKWsInQ",
      "/images/hero.jpg",
      "/logo.png",
      "12, Pali Hill, Bandra West, Mumbai 400050",
      "+91 98765 43210",
      "919876543210",
      "care@roskyro.com",
      "ROSKYRO Healthcare Concierge · Private medicine, practised slowly.",
      "12 min",
      "Average wait, not twelve weeks",
      "24/7",
      "Direct line to your physician",
      "1:1",
      "Doctor who knows your history",
      "",
      "/images/hero.jpg",
      "ROSKYRO is a concierge medicine practice in India. Same-day visits, a physician who knows you, and hospital advocacy when it matters.",
      "care@roskyro.com",
    ],
  );

  const doctors = [
    {
      id: "doc_ananya",
      slug: "ananya-mehta",
      name: "Dr. Ananya Mehta",
      specialty: "Internal Medicine",
      city: "Mumbai",
      address_line: "12, Pali Hill, Bandra West, Mumbai 400050",
      latitude: 19.0596,
      longitude: 72.8295,
      phone: "+91 98765 43211",
      photo_url: "/images/doctors/ananya.jpg",
      years: 18,
      languages: "English, Hindi, Marathi",
      education: "MBBS, Seth GS Medical College · MD Medicine, KEM Hospital",
      bio: `Ananya built ROSKYRO after a decade in a Mumbai teaching hospital where the best doctors still ran on eight-minute slots.

She keeps a small panel — families she can actually know. Hypertension that will not settle, a father flying in from London with a suitcase of reports, a teenager who will only talk after school hours: this is the work.

**Panel:** adults and older adolescents. Hospital advocacy at Lilavati, Hinduja, and Breach Candy.`,
    },
    {
      id: "doc_rohan",
      slug: "rohan-iyer",
      name: "Dr. Rohan Iyer",
      specialty: "Cardiology",
      city: "Bengaluru",
      address_line: "14, 12th Main, Indiranagar, Bengaluru 560038",
      latitude: 12.9784,
      longitude: 77.6408,
      phone: "+91 98765 43212",
      photo_url: "/images/doctors/rohan.jpg",
      years: 22,
      languages: "English, Kannada, Tamil",
      education: "MBBS, St. John's · DM Cardiology, Sri Jayadeva Institute",
      bio: `Rohan left a high-volume cath lab so he could see the same patients before they became emergencies.

His ROSKYRO panel is for people who want a cardiologist on the first call, not the third referral. Prevention, post-stent years, and the quiet work of talking a family through a new diagnosis.

**Panel:** adults with heart disease, high risk, or a family history they would rather not inherit.`,
    },
    {
      id: "doc_priya",
      slug: "priya-nair",
      name: "Dr. Priya Nair",
      specialty: "Family Medicine",
      city: "Delhi",
      address_line: "C-12, Vasant Vihar, New Delhi 110057",
      latitude: 28.5572,
      longitude: 77.1571,
      phone: "+91 98765 43213",
      photo_url: "/images/doctors/priya.jpg",
      years: 14,
      languages: "English, Hindi, Malayalam",
      education: "MBBS, Maulana Azad · DNB Family Medicine",
      bio: `Priya treats households, not episodes. Grandparents, parents, and the child who gets every fever in the house — she prefers one chart that holds all of them.

Evenings are reserved for members who work late. She will meet you at the clinic, on a video call from a hotel in Singapore, or at the bedside if a hospital admission starts after midnight.`,
    },
    {
      id: "doc_vikram",
      slug: "vikram-shah",
      name: "Dr. Vikram Shah",
      specialty: "Endocrinology",
      city: "Mumbai",
      address_line: "4, Altamount Road, Mumbai 400026",
      latitude: 18.9696,
      longitude: 72.8095,
      phone: "+91 98765 43214",
      photo_url: "/images/doctors/vikram.jpg",
      years: 16,
      languages: "English, Hindi, Gujarati",
      education: "MBBS, Grant Medical College · DM Endocrinology, AIIMS Delhi",
      bio: `Vikram's clinic is unhurried on purpose. Diabetes, thyroid disease, and the metabolic years after forty do not fit in a queue.

Members get a written plan, a dietitian ROSKYRO trusts, and a doctor who reads the labs before you have to ask. He still admits at Breach Candy when an admission is the honest next step.`,
    },
    {
      id: "doc_sameer",
      slug: "sameer-khan",
      name: "Dr. Sameer Khan",
      specialty: "Geriatric Medicine",
      city: "Hyderabad",
      address_line: "8-2-269, Road No. 2, Banjara Hills, Hyderabad 500034",
      latitude: 17.4142,
      longitude: 78.4483,
      phone: "+91 98765 43215",
      photo_url: "/images/doctors/sameer.jpg",
      years: 28,
      languages: "English, Hindi, Urdu, Telugu",
      education: "MBBS, Osmania · MD Geriatrics, Christian Medical College Vellore",
      bio: `Sameer looks after people whose children live in another city, or another country. The work is medicine plus logistics: medicines that do not fight each other, a fall that should not happen twice, a hospital that will take his call at 2 a.m.

Families join ROSKYRO so someone in the room is theirs.`,
    },
    {
      id: "doc_leela",
      slug: "leela-krishnan",
      name: "Dr. Leela Krishnan",
      specialty: "Women's Health",
      city: "Chennai",
      address_line: "21, TTK Road, Alwarpet, Chennai 600018",
      latitude: 13.0334,
      longitude: 80.2524,
      phone: "+91 98765 43216",
      photo_url: "/images/doctors/leela.jpg",
      years: 20,
      languages: "English, Tamil, Hindi",
      education: "MBBS, Madras Medical College · MD Obstetrics & Gynaecology",
      bio: `Leela's panel is women who want a doctor for the long arc: fertility, pregnancy, perimenopause, and the years after.

She does not outsource the conversation. Members can reach her before a scan, after a scare, and on ordinary Tuesdays when something feels off and should be named.`,
    },
  ];

  for (const d of doctors) {
    await sql.query(
      `insert into doctors (
        id, slug, name, specialty, city, address_line, latitude, longitude,
        phone, whatsapp_number, photo_url, bio, years_experience, languages_spoken, education, status
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'active')`,
      [
        d.id,
        d.slug,
        d.name,
        d.specialty,
        d.city,
        d.address_line,
        d.latitude,
        d.longitude,
        d.phone,
        "",
        d.photo_url,
        d.bio,
        d.years,
        d.languages,
        d.education,
      ],
    );
  }

  const perks = [
    ["Same-day visits", "If you write before noon, you are seen the same day. Evenings exist for people who work."],
    ["A number that answers", "Your physician's phone, not a call centre. Nights and travel included."],
    ["No waiting room theatre", "You arrive to a room that is ready. Appointments start on time because the panel is small."],
    ["Hospital advocacy", "If you are admitted, your doctor is in the room — with the notes, and with the family."],
    ["One chart, years long", "We keep the story: medicines, allergies, what you already tried, what you will not do again."],
    ["Care that travels", "Video from a hotel, a second opinion before surgery, records that follow you to London or Kochi."],
  ];
  for (const [i, [title, text]] of perks.entries()) {
    await sql.query(
      `insert into perks (id, title, text, image_url, ordering, active) values ($1,$2,$3,'', $4, true)`,
      [`perk_${i + 1}`, title, text, i],
    );
  }

  const care = [
    ["Annual deep-dive", "A long first visit, full labs, and a written plan you can actually keep."],
    ["Acute illness", "Fever, injury, a night that went wrong — treated by the doctor who already knows you."],
    ["Chronic disease", "Diabetes, pressure, heart, thyroid: managed without the ping-pong of referrals."],
    ["Medicines, reconciled", "Every pill, every supplement, checked against the others. Quiet work that prevents harm."],
    ["Family care", "Parents, children, the uncle who never books himself. Households, not isolated files."],
    ["Second opinions", "Before a surgery or a scan that does not sit right, another pair of eyes you trust."],
  ];
  for (const [i, [title, text]] of care.entries()) {
    await sql.query(
      `insert into care_items (id, title, text, image_url, ordering, active) values ($1,$2,$3,$4,$5,true)`,
      [`care_${i + 1}`, title, text, i === 0 ? "/images/care.jpg" : "", i],
    );
  }

  const plans = [
    [
      "Individual",
      "One adult. Unlimited visits, 24/7 physician access, same-day appointments, and hospital advocacy. Written annual plan included.",
    ],
    [
      "Couple",
      "Two adults who share a household. Joint records when you want them, private notes when you do not. One number for both.",
    ],
    [
      "Household",
      "Two adults and children under 18, or a parent you look after in another city. Coordinated care, one physician lead.",
    ],
  ];
  for (const [i, [title, text]] of plans.entries()) {
    await sql.query(
      `insert into plans (id, title, text, image_url, ordering, active) values ($1,$2,$3,'',$4,true)`,
      [`plan_${i + 1}`, title, text, i],
    );
  }

  const testimonials = [
    {
      id: "t1",
      name: "Kamala Iyer",
      photo: "/images/members/kamala.jpg",
      rating: 5,
      audience: "patient",
      text: "After my husband's stroke, I stopped collecting visiting cards of doctors who would not call back. Ananya still calls on Sundays.",
      full: "After my husband's stroke, I stopped collecting visiting cards of doctors who would not call back. Ananya still calls on Sundays. When we were admitted at Hinduja she was there before the resident had finished the notes. That is the service. The rest is manners.",
    },
    {
      id: "t2",
      name: "Arjun Menon",
      photo: "/images/members/arjun.jpg",
      rating: 5,
      audience: "patient",
      text: "I travel forty weeks a year. My cardiologist is a WhatsApp message away, and the ECG I took in a Dubai hotel actually got read.",
      full: "I travel forty weeks a year. My cardiologist is a WhatsApp message away, and the ECG I took in a Dubai hotel actually got read. ROSKYRO is the first medical relationship that has survived my calendar.",
    },
    {
      id: "t3",
      name: "Niharika Shah",
      photo: "/images/members/niharika.jpg",
      rating: 5,
      audience: "patient",
      text: "They remembered that I do not want a lecture about weight. They treated the thyroid, and left the rest of me alone.",
      full: null,
    },
    {
      id: "t4",
      name: "Farhan Qureshi",
      photo: "/images/members/farhan.jpg",
      rating: 5,
      audience: "patient",
      text: "My father lives in Hyderabad. I live in Berlin. Sameer is the adult in the room when I cannot be.",
      full: "My father lives in Hyderabad. I live in Berlin. Sameer is the adult in the room when I cannot be. He has never made me feel like a distant son with a credit card.",
    },
    {
      id: "t5",
      name: "Meera Krishnan",
      photo: "/images/members/meera.jpg",
      rating: 5,
      audience: "patient",
      text: "Leela talked me through a miscarriage without rushing the appointment into the next one. I stayed a member for that hour.",
      full: null,
    },
    {
      id: "t6",
      name: "Sanjay Kapoor",
      photo: "/images/members/sanjay.jpg",
      rating: 4,
      audience: "patient",
      text: "The retainer is not small. Neither was the bill from the year I did not have this.",
      full: "The retainer is not small. Neither was the bill from the year I did not have this. Vikram caught the A1C drift six months before anyone else would have booked me.",
    },
    {
      id: "t7",
      name: "Dr. Rhea D'Souza",
      photo: "/images/doctors/priya.jpg",
      rating: 5,
      audience: "physician",
      text: "I affiliated because I wanted my own panel back. ROSKYRO handled the operations I had been pretending to enjoy.",
      full: "I affiliated because I wanted my own panel back. ROSKYRO handled the operations I had been pretending to enjoy. Six months in, I know every member. That used to be a sentence I said at conferences.",
    },
    {
      id: "t8",
      name: "Dr. Kabir Malhotra",
      photo: "/images/doctors/rohan.jpg",
      rating: 5,
      audience: "physician",
      text: "The transition year is real work. They did not sell me a fantasy of 'passive income from medicine'.",
      full: "The transition year is real work. They did not sell me a fantasy of passive income from medicine. They sat with my existing patients and helped me choose who I could still serve well.",
    },
    {
      id: "t9",
      name: "Asha Rao",
      photo: "/images/members/asha.jpg",
      rating: 5,
      audience: "patient",
      text: "Same-day for a child's fever, without performing panic at a reception desk. That is worth the membership.",
      full: null,
    },
    {
      id: "t10",
      name: "Vivek Nanda",
      photo: "/images/members/vivek.jpg",
      rating: 5,
      audience: "patient",
      text: "I came for the access. I stayed because someone finally reconciled the nine medicines three specialists had stacked.",
      full: null,
    },
    {
      id: "t11",
      name: "Radha Joshi",
      photo: "/images/members/kamala.jpg",
      rating: 5,
      audience: "patient",
      text: "Priya treats the household as one chart. My mother, my son, and I no longer carry three sets of notes.",
      full: "Priya treats the household as one chart. My mother, my son, and I no longer carry three sets of notes. When my mother fell in Vasant Vihar, Priya was at the house before the ambulance argument started.",
    },
    {
      id: "t12",
      name: "Harish Patel",
      photo: "/images/members/sanjay.jpg",
      rating: 5,
      audience: "patient",
      text: "I used to collect second opinions like stamps. Now I have one physician who will tell me when I do not need another scan.",
      full: null,
    },
    {
      id: "t13",
      name: "Laila Rahman",
      photo: "/images/members/meera.jpg",
      rating: 5,
      audience: "patient",
      text: "The 1 a.m. call after a febrile seizure was answered by the doctor who already knew my daughter's allergies.",
      full: "The 1 a.m. call after a febrile seizure was answered by the doctor who already knew my daughter's allergies. We still went to hospital. We did not go in a panic of strangers.",
    },
  ];
  for (const t of testimonials) {
    await sql.query(
      `insert into testimonials (id, member_name, photo_url, rating, text, full_text, source, audience, status)
       values ($1,$2,$3,$4,$5,$6,'manual',$7,'published')`,
      [t.id, t.name, t.photo, t.rating, t.text, t.full, t.audience],
    );
  }

  const posts = [
    {
      id: "b1",
      slug: "what-twelve-minutes-costs",
      audience: "patient",
      title: "What twelve minutes actually costs",
      excerpt: "The appointment length is not a vibe. It is why your story never makes it into the notes.",
      cover: "/images/care.jpg",
      body: `Most outpatient medicine in Indian cities is built around a number nobody writes on the board: twelve minutes.

In twelve minutes a doctor can treat a throat. They cannot notice that the throat is the third in a month, that the blood pressure cuff has been climbing since Diwali, that you stopped a medicine because it made you tired and did not tell anyone.

## Membership is not luxury stationery

It is a smaller panel so the visit can run long enough for the second sentence. The one that starts with "also, since last year…"

If you have been leaving clinics with a printout and a feeling you were not finished, that is the design. ROSKYRO is the other design.`,
    },
    {
      id: "b2",
      slug: "a-number-that-answers-at-night",
      audience: "patient",
      title: "A number that answers at night",
      excerpt: "Emergency departments are for emergencies. Most 1 a.m. questions are not — until they wait until morning.",
      cover: "/images/hero.jpg",
      body: `Families do not join concierge medicine because they enjoy retainers. They join because the last time a parent spiked a fever at 1 a.m., the options were guesswork or a fluorescent waiting room.

Your ROSKYRO physician carries a phone. Not a robot, not a "duty doctor" who has never met you. The person who already knows the allergies, the last admission, the fact that codeine makes you vomit.

Use it. That is what the membership is for.`,
    },
    {
      id: "b3",
      slug: "hospital-advocacy-is-the-product",
      audience: "patient",
      title: "Hospital advocacy is the product",
      excerpt: "The clinic is the easy part. The test is who shows up when you are on a trolley.",
      cover: "/images/mission.jpg",
      body: `A private room does not make a hospital stay less frightening. What helps is a doctor who is not employed by that hospital, who can say "not this scan" and "yes, that surgeon", and who will sit with the family while the resident is busy.

ROSKYRO physicians admit with you. They do not "refer and vanish". If that sentence sounds like a low bar, you have not spent a night on a surgical ward with a parent who cannot speak Hindi to the intern.`,
    },
    {
      id: "b4",
      slug: "membership-for-nri-families",
      audience: "patient",
      title: "If you live abroad and they live here",
      excerpt: "Distance is not a medical plan. A named physician in the city is.",
      cover: "/images/mission.jpg",
      body: `The WhatsApp group with cousins is not a care team. When your mother is dizzy in Pune and you are on a call in Frankfurt, you need one doctor who will go, look, and write you the truth.

Household membership exists for this shape of family. One physician lead, records you can see, and a person who will not wait for you to land before starting.`,
    },
    {
      id: "b5",
      slug: "leaving-the-volume-game",
      audience: "physician",
      title: "Leaving the volume game",
      excerpt: "You were trained to think. The OPD trained you to finish.",
      cover: "/images/care.jpg",
      body: `Most specialists we speak to are not tired of medicine. They are tired of a calendar that punishes thoroughness.

Concierge practice is not a personality transplant. It is a smaller panel, a retainer that pays for the hours insurance never did, and operations someone else runs.

If you still like the work and hate the queue, you are the physician this model was built for.`,
    },
    {
      id: "b6",
      slug: "how-a-panel-is-chosen",
      audience: "physician",
      title: "How a panel is chosen",
      excerpt: "The first ethical act in concierge medicine is deciding whom you can still serve well.",
      cover: "/images/hero.jpg",
      body: `You cannot take everyone. That is the point.

ROSKYRO sits with affiliating physicians and looks at the actual list: who needs this model, who is better served in the existing hospital OPD, who will not be a fit. The transition is slower than a landing page. It is also how you sleep.`,
    },
    {
      id: "b7",
      slug: "the-first-hundred-days",
      audience: "physician",
      title: "The first hundred days",
      excerpt: "Affiliation is not a logo on your door. It is a change in how Tuesdays work.",
      cover: "/images/mission.jpg",
      body: `Weeks one to four are operations: records, phones, the membership conversation you have never had to have.

Weeks five to twelve are the strange quiet of a calendar with empty space. Use it. See people properly. The model fails when physicians fill the space with the old volume, just at a higher price.`,
    },
  ];
  for (const p of posts) {
    await sql.query(
      `insert into blog_posts (
        id, slug, audience, title, excerpt, body, cover_image_url, status, published_at, meta_title, meta_description
      ) values ($1,$2,$3,$4,$5,$6,$7,'published', now(), $4, $8)`,
      [p.id, p.slug, p.audience, p.title, p.excerpt, p.body, p.cover, p.excerpt],
    );
  }

  const videos = [
    ["A quieter kind of clinic", "https://www.youtube.com/watch?v=LXb3EKWsInQ"],
    ["What concierge medicine is", "https://www.youtube.com/watch?v=aqz-KE-bpKQ"],
    ["Hospital advocacy, explained", "https://www.youtube.com/watch?v=jNQXAC9IVRw"],
  ];
  for (const [i, [title, url]] of videos.entries()) {
    await sql.query(
      `insert into videos (id, title, embed_url, thumbnail_url, ordering, active) values ($1,$2,$3,'',$4,true)`,
      [`vid_${i + 1}`, title, url, i],
    );
  }

  const pages: { slug: string; title: string; image: string; body: string; meta: string }[] = [
    {
      slug: "about-concierge-care",
      title: "About concierge care",
      image: "/images/hero.jpg",
      meta: "What concierge medicine means at ROSKYRO: a small panel, direct access, and a physician who has time.",
      body: `Concierge medicine is a simple trade. You pay a membership. Your physician keeps a small panel and gives you time, access, and continuity that a volume clinic cannot.

It is not a VIP queue at the same factory. The factory is the problem.

## What you are actually buying

- A named physician, not a rota
- Same-day visits when you are unwell
- A number that answers
- Hospital presence when you are admitted
- A chart that is allowed to be long

ROSKYRO practises this in Indian cities, with Indian hospitals, for families who live here and families who live elsewhere and still need someone in the room.`,
    },
    {
      slug: "what-is-concierge-medicine",
      title: "What is concierge medicine?",
      image: "/images/care.jpg",
      meta: "A plain-language briefing on concierge medicine for physicians considering a smaller panel.",
      body: `Concierge medicine (also called retainer or membership medicine) replaces the twelve-minute OPD with a panel small enough to know.

Patients pay an annual fee. The physician stops running volume. Visits lengthen. Phone access becomes real. Hospital work is part of the job again, not an unpaid extra.

It is not insurance. Members still use their existing cover for admissions and diagnostics. The membership pays for the physician's time.`,
    },
    {
      slug: "why-concierge-medicine",
      title: "Why concierge medicine",
      image: "/images/mission.jpg",
      meta: "Why physicians leave volume practice for a membership panel — and who should not.",
      body: `Because the current bargain is dishonest. Patients pretend a twelve-minute visit was enough. Physicians pretend they remember the last visit. Hospitals pretend a duty doctor is continuity.

Concierge practice is for physicians who want the medical relationship back, and who can tolerate a smaller income in exchange for a life that is still a profession.

It is not for anyone chasing a lifestyle brand. The work is still medicine. It is just allowed to take the time it takes.`,
    },
    {
      slug: "affiliate-benefits",
      title: "Affiliate benefits",
      image: "/images/care.jpg",
      meta: "What ROSKYRO runs for affiliating physicians: operations, membership, and a panel you can stand behind.",
      body: `ROSKYRO is the operations layer so you can practise.

- Membership billing and patient communication
- A public profile and appointment intake
- On-call patterns that do not burn you out in month three
- Hospital relationships already in motion
- A colleague group that has already made this change

You keep clinical independence. We keep the spreadsheet.`,
    },
    {
      slug: "our-mission",
      title: "Our mission",
      image: "/images/mission.jpg",
      meta: "ROSKYRO exists so a handful of families can have a physician who is actually theirs.",
      body: `We are not trying to "fix healthcare". We are trying to practise it.

ROSKYRO exists so a limited number of families in Indian cities can have a physician who knows them, answers them, and shows up in hospital. That is the whole mission. Scale is the enemy of the product.

If that sounds small, good. Medicine that works is usually small.`,
    },
    {
      slug: "careers",
      title: "Careers",
      image: "/images/hero.jpg",
      meta: "Work at ROSKYRO — physicians, coordinators, and people who like operations to be invisible.",
      body: `We hire slowly.

**Physicians.** If you want a smaller panel and still love the work, write to us with a letter, not a CV dump.

**Care coordinators.** The job is logistics with manners: records, admissions, the 6 a.m. driver, the lab that lost a sample.

**No growth-hacking roles.** We are a clinic with a website.

Email [careers@roskyro.com](mailto:careers@roskyro.com).`,
    },
    {
      slug: "privacy",
      title: "Privacy policy",
      image: "",
      meta: "How ROSKYRO collects, stores, and uses personal information.",
      body: `ROSKYRO Healthcare Concierge ("we") collects only what we need to practise medicine and run memberships.

## What we collect

Names, phone numbers, emails, appointment details, and the clinical information you or your physician enter. Form submissions are stored in our database and may be sent to our clinic WhatsApp and notify email.

## What we do not do

We do not sell personal information. We do not run a marketplace of your data. Marketing cookies, if any, are controlled via Google Tag Manager only when a container ID is configured.

## Access

Write to care@roskyro.com to see, correct, or delete personal data we hold, subject to medical-record retention required by law.`,
    },
    {
      slug: "terms",
      title: "Terms of use",
      image: "",
      meta: "Terms of use for the ROSKYRO website and membership enquiries.",
      body: `This website describes a medical membership practice. Submitting a form is a request, not a doctor–patient relationship.

Membership begins only after a conversation with the physician and a written agreement. Fees are quoted individually.

Do not use the public forms for emergencies. Call local emergency services.

The site is provided as-is. Indian law governs. Courts in Mumbai have jurisdiction.`,
    },
    {
      slug: "non-discrimination",
      title: "Non-discrimination",
      image: "",
      meta: "ROSKYRO does not discriminate in membership or care.",
      body: `ROSKYRO does not refuse membership or care on the basis of religion, caste, gender, sexual orientation, disability, nationality, or language.

Panel size is limited. A closed panel is not a judgement on the person who asked. It is a limit on how many people one physician can know.`,
    },
  ];
  for (const p of pages) {
    await sql.query(
      `insert into pages (id, slug, title, body, image_url, meta_title, meta_description)
       values ($1,$2,$3,$4,$5,$3,$6)`,
      [`page_${p.slug}`, p.slug, p.title, p.body, p.image, p.meta],
    );
  }

  const team = [
    ["Maya Fernandes", "Practice director", "/images/team/maya.jpg", "Maya ran hospital administration for a decade, then decided the interesting work was a small clinic that answered the phone."],
    ["Kabir Seth", "Care coordinator", "/images/team/kabir.jpg", "Kabir is who you meet first. Admissions, labs, the car to the hospital, the file that has to be there before you are."],
    ["Dr. Ananya Mehta", "Founding physician", "/images/doctors/ananya.jpg", "Ananya still sees patients on Pali Hill. The rest of ROSKYRO exists so she can keep doing that."],
  ];
  for (const [i, [name, role, photo, bio]] of team.entries()) {
    await sql.query(
      `insert into team_members (id, name, role, photo_url, bio, ordering) values ($1,$2,$3,$4,$5,$6)`,
      [`team_${i + 1}`, name, role, photo, bio, i],
    );
  }

  const faqs: [string, string, string][] = [
    ["patient", "Is this insurance?", "No. Membership pays for your physician's time and access. Use your existing health insurance for admissions, scans, and hospital bills."],
    ["patient", "How quickly can I be seen?", "Same day if you write before noon. Urgent concerns at night go to your physician's phone, not a call centre."],
    ["patient", "What if I am travelling?", "Video visits and WhatsApp. If you are admitted in another city, we help coordinate from the record we already hold."],
    ["patient", "Do you take children?", "Household membership covers children under 18 with a family physician. Paediatric emergencies still go to the nearest children's hospital — with us on the call."],
    ["patient", "Can I keep my other specialists?", "Yes. We coordinate them. The point is a quarterback, not a monopoly."],
    ["patient", "How do I leave?", "Write to us. Membership is annual; unused months are not typically refunded. We transfer records wherever you go next."],
    ["physician", "Do I have to give up my hospital attachment?", "No. Most affiliating physicians keep admitting rights. The OPD volume is what changes."],
    ["physician", "How small is a panel?", "Often 50–150 families, depending on specialty and how you like to work. We will not let a panel grow past what you can know."],
    ["physician", "Who owns the patient relationship?", "You do. ROSKYRO is the operations and membership layer."],
    ["physician", "Is there a buy-in?", "Discussed individually. We do not publish a number that pretends every city and specialty is the same."],
    ["physician", "What happens to patients I cannot take?", "They remain in your existing practice or are referred honestly. Closed panels are part of the ethics."],
    ["physician", "How long is the transition?", "Plan for a hundred days. Faster is usually a sign we skipped the hard conversations."],
  ];
  for (const [i, [audience, q, a]] of faqs.entries()) {
    await sql.query(
      `insert into faqs (id, question, answer, audience, ordering) values ($1,$2,$3,$4,$5)`,
      [`faq_${i + 1}`, q, a, audience, i],
    );
  }

  const steps = [
    ["Conversation", "We talk about your current practice, your city, and whether a smaller panel would still support your life."],
    ["The list", "You look at who you actually see. We help you choose a first panel you can stand behind."],
    ["Operations", "Phones, records, membership language, the public profile, the hospital list."],
    ["The quiet calendar", "Volume drops. You re-learn how long a visit should be. We stay on the line."],
    ["A practice, not a queue", "A hundred days in, you should know every member. If you do not, we shrink the panel."],
  ];
  for (const [i, [title, text]] of steps.entries()) {
    await sql.query(
      `insert into steps (id, title, text, ordering) values ($1,$2,$3,$4)`,
      [`step_${i + 1}`, title, text, i],
    );
  }

  await sql.query(
    `insert into appointments (
      id, doctor_id, patient_name, patient_phone, patient_email, preferred_date,
      preferred_time_slot, reason, source, status, whatsapp_opened, notified
    ) values
      ('appt_demo_1', 'doc_ananya', 'Ramesh Kumar', '9876543210', 'ramesh@example.com', '2026-10-02',
       'Morning', 'Fever for three days, wants a same-day visit', 'find_doctor', 'new', true, false),
      ('appt_demo_2', 'doc_rohan', 'Sneha Patel', '9988776655', 'sneha@example.com', '2026-10-04',
       'Evening', 'Post-stent follow-up while travelling from Dubai', 'find_doctor', 'contacted', true, false)`,
  );
  await sql.query(
    `insert into leads (id, type, name, phone, email, status, whatsapp_opened, notified, payload)
     values (
       'lead_demo_1',
       'become_affiliate',
       'Dr. Rhea D''Souza',
       '9123456780',
       'rhea@example.com',
       'new',
       true,
       false,
       '{"specialty":"Internal Medicine","city":"Pune","clinic_name":"KEM OPD","message":"Want a smaller panel in 2026."}'::jsonb
     )`,
  );
}
