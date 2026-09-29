/**
 * ELSIM Engineering – Official Company Data
 * Source: Company profile (verified fields only)
 */

export const company = {
  name: 'ELSIM Engineering Firm',
  legalName: 'ELSIM Engineering Firm',
  tagline: 'Engineering Precision. Industrial Strength. Safe Execution.',
  description:
    'ELSIM Engineering delivers electrical, energy, industrial and technical solutions designed around safety, reliability and professional execution across Ghana and West Africa.',

  address: {
    line1: 'Oyarifa Teiman, Inside 3T Plaza',
    city: 'Accra',
    country: 'Ghana',
    full: 'Oyarifa Teiman, Inside 3T Plaza, Accra, Ghana',
  },

  /**
   * Primary contact numbers.
   * - +233 538 578 943 — voice calls and WhatsApp
   * - +233 256 065 605 — voice calls
   */
  phones: [
    {
      display: '+233 538 578 943',
      tel: '+233538578943',
      whatsapp: true,
      label: 'Call / WhatsApp',
    },
    {
      display: '+233 256 065 605',
      tel: '+233256065605',
      whatsapp: false,
      label: 'Call',
    },
  ],

  /** Public contact address. Mailbox forwarding is configured at the domain host. */
  email: 'support@elsimengineeringlimited.com',

  socials: {
    tiktok: 'https://www.tiktok.com/@elsimengineeringfirm03',
    linkedin: 'https://www.linkedin.com/in/elsim-engineering-firm-ltd-6942a13b2/',
    facebook: 'https://www.facebook.com/profile.php?id=61591729583119',
  },

  vision:
    'To be the leading provider of electrical engineering solutions in West Africa—recognized for excellence, integrity, and our commitment to innovation, sustainability, and community advancement.',

  mission:
    'To deliver reliable, safe, and innovative engineering solutions that not only exceed client expectations but also contribute to sustainable development and long-term success.',

  philosophy:
    "At ELSIM Engineering, we believe that quality engineering is not just about wires and systems—it's about people, purpose, and progress. Our philosophy is rooted in the belief that every project deserves integrity, precision, and care. We approach each task with a deep sense of responsibility, aiming to build solutions that are safe, sustainable, and forward-thinking. We do not just complete projects—we build trust, foster innovation, and empower growth for our clients and communities.",

  values: [
    {
      id: 'excellence',
      title: 'Excellence',
      description:
        'We uphold the highest standards in service delivery, craftsmanship, and client satisfaction.',
    },
    {
      id: 'integrity',
      title: 'Integrity',
      description: 'We conduct all business with honesty, transparency, and accountability.',
    },
    {
      id: 'safety',
      title: 'Safety',
      description:
        'We prioritize the safety of our team, clients, and communities in every project we undertake.',
    },
    {
      id: 'innovation',
      title: 'Innovation',
      description:
        'We embrace forward-thinking technologies and creative approaches to solve complex challenges.',
    },
    {
      id: 'sustainability',
      title: 'Sustainability',
      description:
        'We are committed to energy-efficient, eco-conscious solutions that promote long-term environmental stewardship.',
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      description:
        'We believe in strong partnerships—with our clients, communities, and within our team—to achieve shared success.',
    },
  ],

  leadership: [
    {
      id: 'ceo',
      name: 'Ing. Simon Sandy Kununya',
      role: 'Chief Executive Officer',
      bio: null as string | null,
      photo: null as string | null,
      message:
        'At ELSIM Engineering, our commitment goes beyond delivering electrical solutions—we are passionate about powering progress, reliability, and sustainability across Ghana and beyond. From the beginning, our vision has been to build a company that leads with integrity, delivers excellence, and leaves a lasting impact on every client and community we serve. We understand that engineering is the backbone of development, and we are proud to contribute to that growth through innovation, expert craftsmanship, and a team-first approach. As we look ahead, we remain dedicated to setting new standards and exceeding expectations—project by project, partnership by partnership. Thank you for trusting ELSIM Engineering.',
    },
    {
      id: 'md',
      name: 'Ella Ankah',
      role: 'Managing Director',
      bio: null as string | null,
      photo: null as string | null,
      message: null as string | null,
    },
    {
      id: 'engineer',
      name: 'Ing. Teye Amos Agudey',
      role: 'Engineer / Project Manager',
      bio: null as string | null,
      photo: null as string | null,
      message: null as string | null,
    },
    {
      id: 'accounts',
      name: 'Stephen Doe Agbo',
      role: 'Chief Accounts Officer',
      bio: null as string | null,
      photo: null as string | null,
      message: null as string | null,
    },
  ],

  regions: ['Ghana', 'Togo', "Côte d'Ivoire", 'Burkina Faso', 'Senegal', 'Niger'],

  stats: {
    projectsOnRecord: 30,
    countriesDelivered: 6,
    serviceLines: 5,
  },

  certifications: [
    {
      name: 'Certificate of Incorporation',
      issuingBody: "Registrar General's Department, Republic of Ghana",
      detail:
        'ELSIM Engineering Firm Ltd, incorporated under the Companies Act, 2019 (Act 992). Reg. No. CS193211124 · TIN C0064839885. Issued at Accra, 26 November 2024.',
      image: '/assets/elsim/certificates/certificate-of-incorporation.jpg',
      imageAlt:
        "Certificate of Incorporation for ELSIM Engineering Firm Ltd issued by the Registrar General's Department, Republic of Ghana. Registration number CS193211124.",
    },
    {
      name: 'Certificate of Classification — Electrical & Plumbing Works',
      issuingBody: 'Ministry of Works and Housing, Republic of Ghana',
      detail:
        'Category E, Electrical Works, Financial Class 2 ($75,000–$200,000). Certificate No. MWH/E/2/00066/24. Valid from 1 October 2024 to 30 September 2025.',
      image: '/assets/elsim/certificates/mwh-classification.jpg',
      imageAlt:
        'Ministry of Works and Housing Certificate of Classification for ELSIM Engineering Firm Ltd — Category E Electrical Works, Financial Class 2.',
    },
    {
      name: 'ECG Classification — Class B Electrical Installation Contractor',
      issuingBody: 'Electricity Company of Ghana Ltd.',
      detail:
        'Classified as Class B electrical installation contractor. Reference ECG/DIST/2024.',
      image: '/assets/elsim/certificates/ecg-classification-class-b.jpg',
      imageAlt:
        'Electricity Company of Ghana Class B Electrical Installation Contractor classification certificate for ELSIM Engineering Firm Ltd.',
      relatedImage: '/assets/elsim/certificates/ecg-category-of-works.jpg',
      relatedImageAlt:
        'Electricity Company of Ghana category of works schedule accompanying the Class B contractor classification for ELSIM Engineering Firm Ltd.',
    },
    {
      name: 'PPA Supplier Registration',
      issuingBody: 'Public Procurement Authority, Republic of Ghana',
      detail: 'Registered supplier under the Public Procurement Authority supplier database.',
      image: '/assets/elsim/certificates/ppa-supplier-registration.jpg',
      imageAlt:
        'Public Procurement Authority supplier registration certificate for ELSIM Engineering Firm Ltd.',
    },
    {
      name: "Electrical Contractors' Licence (External Installation)",
      issuingBody: 'Electricity Company of Ghana Ltd.',
      detail:
        'Licensed to carry out external installation under the Electricity Supply and Distribution (Technical and Operational) Rules, 2005 (LI 1816). Licence No. 23236, held by Kununya Sandy Simon. Issued 21 October 2024, valid until 31 December 2026.',
      image: '/assets/elsim/certificates/ecg-contractors-licence.jpg',
      imageAlt:
        "Electricity Company of Ghana Electrical Contractors' Licence (External Installation) No. 23236 for ELSIM Engineering Firm Ltd, held by Kununya Sandy Simon. Valid until 31 December 2026.",
    },
    {
      name: 'Certificate of Corporate Membership',
      issuingBody: 'Ghana Electrical Contractors Association (established 1948)',
      detail:
        'Duly enrolled corporate member. Membership No. GECA/CM/097. Issued 8 August 2025, valid until 8 August 2027.',
      image: '/assets/elsim/certificates/geca-corporate-membership.jpg',
      imageAlt:
        'Ghana Electrical Contractors Association Certificate of Corporate Membership for ELSIM Engineering Firm Limited. Membership No. GECA/CM/097. Valid until 8 August 2027.',
    },
  ] as {
    name: string;
    issuingBody: string;
    detail?: string;
    logo?: string;
    image?: string;
    imageAlt?: string;
    relatedImage?: string;
    relatedImageAlt?: string;
  }[],

  partners: [
    {
      name: 'Zhejiang Qiankai Electrical Power Equipment Company Limited',
      logo: '/assets/elsim/partners/zhejiang-qiankai.jpg',
      logoAlt:
        'Logo of Zhejiang Qiankai Electrical Power Equipment Company Limited (FCQK)',
    },
    {
      name: 'MAM for Engineering Industries',
      logo: '/assets/elsim/partners/mam-engineering.jpg',
      logoAlt: 'Logo of MAM for Engineering Industries (Youssef El Sherif)',
    },
    {
      name: 'Variable Frequency Drive Company Ltd (Mingch)',
      logo: '/assets/elsim/partners/mingch-vfd.jpg',
      logoAlt: 'Logo of Mingch Variable Frequency Drive Company Ltd',
    },
    {
      name: 'CCTv Cameras and Accessories Limited (Hivideo)',
      logo: '/assets/elsim/partners/hivideo.jpg',
      logoAlt: 'Logo of Hivideo — CCTV Cameras and Accessories Limited',
    },
    {
      name: 'Star Trans Transformers Technology',
      logo: '/assets/elsim/partners/star-trans.jpg',
      logoAlt: 'Logo of Star Trans Transformers Technology',
    },
  ] as {
    name: string;
    logo?: string;
    logoAlt?: string;
  }[],
};

export type Company = typeof company;
