/* ============================================
   expertiseData — the ten areas of experience
   --------------------------------------------
   Copy is verbatim from `mockup/expertise.html` (the accordion) and
   `mockup/index.html` (the home-page index rows). Shared by the home
   page's expertise index, the /expertise accordion, and the enquiry
   form's "what do you need support with?" options.

   Field notes:
   - `id`      — the accordion's DOM id; home rows link to /expertise#<id>.
   - `tagline` — the accordion's tagline.
   - `homeTagline` — present only where the home row's tagline is shorter
     than the accordion's (e05 / e06 / e10). Read it via `homeTagline ??
     tagline` so both pages stay verbatim to their own mockup.
   ============================================ */

export const expertiseAreas = [
  {
    id: 'e01',
    num: '01',
    title: 'HR & People Management',
    tagline: 'Building organizations through people',
    description:
      'People are at the centre of every successful organization. We bring practical experience in helping organizations establish structured, professional, and effective people practices that support performance, accountability, and organizational growth.',
    note:
      'Our HR experience extends across organizational environments — from pharmaceutical and healthcare businesses to corporates, startups, SMEs, marketing organizations, educational institutions, and professional service organizations.',
    closing: 'Because strong organizations are built on strong people practices.',
    tags: [
      'HR Management',
      'HR Policies & Procedures',
      'Employee Lifecycle Management',
      'Employment & Employee Documentation',
      'Performance Management',
      'Employee Engagement',
      'Organizational Culture',
      'HR Process Development',
      'HR Administration',
      'Workplace Practices',
      'HR Documentation',
    ],
  },
  {
    id: 'e02',
    num: '02',
    title: 'Administration & Business Operations',
    tagline: 'Structure that enables performance',
    description:
      'Behind every well-run organization is a disciplined operating structure. We bring experience in helping businesses create greater clarity, coordination, and control across their administrative and operational functions.',
    note:
      'Our focus is to bring greater structure to operations and create systems that support better execution.',
    closing: 'Better structure. Better visibility. Better control.',
    tags: [
      'Business Administration',
      'Operational Coordination',
      'Process Management',
      'Documentation Management',
      'Management Support',
      'Business Meetings',
      'Business Reporting',
      'Business Process Development',
      'Administrative Systems',
    ],
  },
  {
    id: 'e03',
    num: '03',
    title: 'Business Analytics & Intelligence',
    tagline: 'Seeing beyond the numbers',
    description:
      'Data is valuable only when it leads to better understanding and better decisions. We look beyond surface-level reporting to identify patterns, inconsistencies, performance deviations, process gaps, and areas that may require management attention.',
    note:
      'Our analytical experience is particularly relevant to pharmaceutical marketing and field operations, where industry understanding enables us to interpret business information within its operational context.',
    closing: 'Observe. Analyse. Identify. Strengthen.',
    tags: [
      'Business Analytics',
      'Performance Analysis',
      'KPI Development',
      'Business Reporting',
      'Data Interpretation',
      'Sales Analytics',
      'Operational Analysis',
      'Performance Tracking',
      'Gap Analysis',
      'Anomaly Identification',
    ],
  },
  {
    id: 'e04',
    num: '04',
    title: 'Pharmaceutical Business & Healthcare',
    tagline: 'Specialized industry expertise',
    description:
      'Pharmaceutical and healthcare business is a specialized area of our experience. We understand the interconnected nature of people, field operations, sales and marketing, product knowledge, business analytics, performance management, administration, and operational discipline.',
    note:
      'We work with pharmaceutical entrepreneurs, investors, startups, and growing businesses — looking beyond routine operations to identify performance gaps, unusual patterns, inconsistencies, and areas requiring closer review.',
    closing: 'Specialized where experience matters. Flexible where business needs evolve.',
    tags: [
      'Pharmaceutical Business Management',
      'Pharma Sales & Marketing Support',
      'Field Operations',
      'Business Analytics',
      'Performance Management',
      'Pharma Therapy Training',
      'HR & Administration',
      'Operational Monitoring',
      'Business Process Support',
    ],
  },
  {
    id: 'e05',
    num: '05',
    title: 'Corporate, Legal & Intellectual Property',
    tagline: 'Protecting what you build. Securing how you operate',
    homeTagline: 'Protecting what you build',
    description:
      'A successful business is built on more than vision — it is built on a strong legal foundation. We help businesses establish the right corporate structure, safeguard intellectual property, and implement legally sound documentation that protects both the organisation and its people.',
    note:
      'From business registrations and trademark protection to employment contracts, HR policies, compliance documentation, and corporate governance — designed to minimise risk, strengthen operational integrity, and support sustainable growth.',
    closing: 'Building businesses on a foundation of trust, protection & compliance.',
    tags: [
      'Corporate Documentation & Governance',
      'Trademark & IP Protection',
      'Employment Contracts & HR Legal Documentation',
      'HR Policies & Statutory Compliance',
      'Business Agreements',
      'Founder & Partner Agreements',
      'NDA & Confidentiality Documentation',
      'Company Incorporation Support',
      'Regulatory Document Preparation',
      'Risk Mitigation & Organisational Protection',
    ],
  },
  {
    id: 'e06',
    num: '06',
    title: 'Leadership & Organizational Development',
    tagline: 'Developing leaders. Elevating organizations',
    homeTagline: 'Developing leaders, elevating organizations',
    description:
      'Leadership capability is a strategic organizational asset. We design customized leadership and organizational development programs for businesses and institutions seeking to strengthen managerial effectiveness, accountability, and performance.',
    note:
      'Our programs — from leadership development to HR workshops — are tailored to the organization’s context, people, objectives, and professional environment.',
    closing: 'Developing leaders. Elevating organizations.',
    tags: [
      'Leadership Effectiveness',
      'Decision-Making',
      'Accountability',
      'Delegation',
      'Team Management',
      'Conflict Management',
      'Performance Leadership',
      'Strategic Thinking',
      'HR Fundamentals',
      'Employee Engagement',
      'Workplace Communication',
      'Building a Performance Culture',
    ],
  },
  {
    id: 'e07',
    num: '07',
    title: 'Soft Skills & Professional Development',
    tagline: 'Capability that translates into performance',
    description:
      'Professional excellence is shaped not only by technical knowledge, but by the ability to communicate, collaborate, lead, and adapt.',
    note:
      'These programs can be tailored for corporates, hospitals, business schools, colleges, marketing organizations, and other professional environments.',
    closing: 'Capability that translates into performance.',
    tags: [
      'Communication Skills',
      'Business Communication',
      'Presentation Skills',
      'Teamwork & Collaboration',
      'Time Management',
      'Problem-Solving',
      'Emotional Intelligence',
      'Workplace Etiquette',
      'Professional Behaviour',
      'Customer Interaction',
      'Corporate Readiness',
    ],
  },
  {
    id: 'e08',
    num: '08',
    title: 'Academic & Institutional Engagement',
    tagline: 'Connecting knowledge with the real world',
    description:
      'The transition from education to professional life requires more than academic knowledge. It requires perspective, confidence, communication, and an understanding of how organizations actually work.',
    note:
      'We engage with business schools, colleges, and educational institutions through customized learning sessions — including guest-speaking and knowledge-sharing engagements — bringing practical perspectives closer to emerging professionals.',
    closing: 'Bridging academic learning and professional reality.',
    tags: [
      'Leadership',
      'Business Management',
      'Entrepreneurship',
      'Business Communication',
      'Soft Skills',
      'Professional Readiness',
      'Career Development',
      'Sales & Marketing',
      'Corporate Expectations',
      'Industry Awareness',
      'Presentation Skills',
    ],
  },
  {
    id: 'e09',
    num: '09',
    title: 'Business Management & Coaching',
    tagline: 'Clarity for the journey ahead',
    description:
      'Every business journey presents different questions. How should the business be structured? Where are the gaps? What needs attention? What should happen next?',
    note:
      'Our role is to bring perspective, structure, and practical direction to important business decisions — supporting entrepreneurs and business leaders end to end.',
    closing: 'Perspective. Structure. Practical direction.',
    tags: [
      'Business Management',
      'Business Coaching',
      'Strategic Business Support',
      'Business Planning',
      'Management Advisory',
      'Performance Support',
      'Business Meetings',
      'Business Presentations',
    ],
  },
  {
    id: 'e10',
    num: '10',
    title: 'Corporate Branding & Graphics',
    tagline: 'Communicating with clarity. Presenting with confidence',
    homeTagline: 'Communicating with clarity',
    description:
      'Your business identity is expressed through every interaction. We help businesses communicate their identity, ideas, capabilities, and vision with greater clarity, consistency, and professionalism.',
    note:
      'From corporate presentations and profiles to training materials and marketing collateral — professional business communication and visual materials.',
    closing: 'Communicating with clarity. Presenting with confidence.',
    tags: [
      'Corporate Graphics',
      'Corporate Presentations',
      'Business Presentations',
      'Corporate Profiles',
      'Product Communication',
      'Training Materials',
      'Marketing Collateral',
      'Business Communication',
    ],
  },
];

/** The ten area titles, in mockup order — used for enquiry-form options. */
export const expertiseTitles = expertiseAreas.map((area) => area.title);

/** The tagline the home-page index row shows for an area. */
export const homeTaglineFor = (area) => area.homeTagline || area.tagline;

export default expertiseAreas;
