export interface Division { slug: string; title: string; short: string; intro: string; icon: string; services: string[]; path: string; }

export const COMPANY = {
  name: 'ADMISK Investment Limited',
  legal: 'AIL ADMISK Investment Limited',
  tagline: 'Connecting opportunity, strategy, people and growth.',
  email: 'adfaminvestment@gmail.com',
  regions: ['Africa', 'GCC', 'Asia', 'Europe', 'USA'],
};


export const OFFICES = [
  {
    key: 'Saudi Arabia',
    name: 'Headquarters',
    city: 'Riyadh',
    address: 'Qalidiya Tower, Riyadh, Saudi Arabia',
    phone: '+966 55 649 0042',
    alternatePhone: '',
    image: 'https://images.unsplash.com/photo-1757774698963-b23f4b273adc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'Kenya',
    name: 'Nairobi office',
    city: 'Nairobi',
    address: 'Eastleigh, Nairobi, Kenya',
    phone: '+254 710 482488',
    alternatePhone: '',
    image: 'https://images.unsplash.com/photo-1693464550496-8a6b114585b8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'Uganda',
    name: 'Kampala office',
    city: 'Kampala',
    address: 'Kisenyi, Kampala, Uganda',
    phone: '+256 708 506070',
    alternatePhone: '+256 778 166 666',
    image: 'https://images.unsplash.com/photo-1661422111151-42d2f0f061ce?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'Somalia',
    name: 'Somalia office',
    city: 'Mogadishu',
    address: 'Mogadishu, Somalia',
    phone: '',
    alternatePhone: '',
    image: 'https://images.unsplash.com/photo-1775634937590-7d27a59e313e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'Ethiopia',
    name: 'Ethiopia office',
    city: 'Addis Ababa',
    address: 'Addis Ababa, Ethiopia',
    phone: '',
    alternatePhone: '',
    image: 'https://images.unsplash.com/photo-1756723131979-4137c792bf5a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'Tanzania',
    name: 'Tanzania office',
    city: 'Dar es Salaam',
    address: 'Dar es Salaam, Tanzania',
    phone: '',
    alternatePhone: '',
    image: 'https://images.unsplash.com/photo-1790673038505-d47ea2b70daf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'USA',
    name: 'USA office',
    city: 'New York',
    address: 'New York, USA',
    phone: '',
    alternatePhone: '',
    image: 'https://images.unsplash.com/photo-1556538643-1642b85248fd?auto=format&fit=crop&w=1200&q=80'
  }
];

export const LEADERSHIP = [
  {
    initials: 'AM', name: 'Adhan Mohamud Abdi', role: 'Founder and CEO',
    bio: 'Adhan founded ADMISK Investment Limited to bring investment, legal and business advisory together under one accountable mandate. He leads engagements from the first conversation through delivery.',
  },
  {
    initials: 'AE', name: 'Abdallah Omar Elmi', role: 'Managing Partner',
    bio: 'Abdallah works alongside the founder across the group’s advisory practices, helping lead client engagements from planning through close.',
  },
  {
    initials: 'MH', name: 'Mutaib Bin Abdullah Bin Hamadi', role: 'Managing Partner',
    bio: 'Mutaib works alongside the founder across the group’s advisory practices, helping lead client engagements from planning through close.',
  },
];

export const PRACTICES = [
  {
    title: 'Investment Advisory', image: 'investment',
    path:'InvestmentAdvisory.png',
    intro: 'Capital raising, portfolio structuring and transaction support for founders, family offices and institutional allocators.',
    services: ['Equity and debt capital raising', 'Portfolio construction and allocation', 'M&A and exit advisory', 'Valuation and due diligence'],
  },
  {
    title: 'Legal Consultancy', image: 'legal',
    path:'LegalConsultancy.png',
    intro: 'Transaction focused legal coordination that considers regulatory and contractual exposure alongside commercial objectives.',
    services: ['Deal structuring and documentation', 'Regulatory and compliance advisory', 'Contract negotiation', 'Corporate governance'],
  },
  {
    title: 'Business Consultancy', image: 'business',
    path:'BusinessConsultancy.png',
    intro: 'Operating and growth strategy for companies scaling, restructuring or preparing for a transaction.',
    services: ['Growth and market-entry strategy', 'Operational restructuring', 'Financial and risk modeling', 'Board and management advisory'],
  },
];


export const SECTORS = [
  'Financial services',
  'Real estate and construction',
  'Energy and infrastructure',
  'Technology',
  'Healthcare',
  'Manufacturing',
  'Trade and logistics',
  'Agribusiness',
];

export const SECTOR_IMAGES = [
  // Financial services
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',

  // Real estate and construction
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=700&q=75',

  // Energy and infrastructure
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=700&q=75',

  // Technology
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=75',

  // Healthcare
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=75',

  // Manufacturing
  'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=700&q=75',

  // Trade and logistics
  'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=700&q=75',

  // Agribusiness
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=75',
];

export const ABOUT_FAQ = [
  { question: 'How is work coordinated across the three practices?', answer: 'Clients can engage one practice or a broader mandate. Investment, legal and business advisory are coordinated around the client’s objectives, with clear responsibilities across the team.' },
  { question: 'Who works on a mandate?', answer: 'The source profile describes partner-led engagement. The senior team remains involved through the work, with specialists and appropriately licensed partners involved where required.' },
  { question: 'How is confidentiality handled?', answer: 'Client information should be handled confidentially throughout an engagement, subject to applicable law and agreed terms.' },
  { question: 'What happens after an inquiry?', answer: 'The source profile says inquiries are reviewed and answered within one business day. Response timing may vary by local office hours.' },
];

export const ADVISORY_STATS = [
  { number: '3', label: 'integrated advisory practices' },
  { number: '120+', label: 'transactions structured and closed' },
  { number: '14', label: 'sectors covered' },
  { number: '1', label: 'point of accountability' },
];

export const ICONS: Record<string, string> = {
  invest: 'M3 20l7-8 4 4 10-10M17 6h7v7',
  consult: 'M4 14a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M9.5 14a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0',
  hr: 'M14 9a4 4 0 1 1-8 0a4 4 0 1 1 8 0M3 24c0-5 3-8 7-8s7 3 7 8M23 11a3 3 0 1 1-6 0a3 3 0 1 1 6 0M17 24c0-3 1.5-5 4-5s4 2 4 5',
  train: 'M2 10l12-6 12 6-12 6zM7 13v6c0 2 3.5 4 7 4s7-2 7-4v-6',
  hosp: 'M5 9h15v8a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6zM20 11h2a3 3 0 0 1 0 6h-2',
  trade: 'M14 3l10 5v12l-10 5-10-5V8zM4 8l10 5 10-5M14 13v12',
  foundation: 'M3 24h22M6 24V11l8-7 8 7v13M11 24v-7h6v7',
  globe: 'M4 14a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M4 14h20M14 4c-4 3-4 17 0 20M14 4c4 3 4 17 0 20',
};

export const DIVISIONS: Division[] = [
  { slug: 'investment-advisory', title: 'Investment & Advisory', icon: 'invest',
    path:'CrossBorderAdvisory.png',
    short: 'Opportunity assessment, investor materials and transaction support.',
    intro: 'Business and investment-oriented advisory for entrepreneurs, investors and companies.',
    services: ['Opportunity assessment', 'Business plans & investor materials', 'Financial & risk modeling', 'Valuation & due diligence support', 'Capital-raising support where permitted', 'M&A and transaction support'] },
  { slug: 'business-consultancy', title: 'Business Consultancy', icon: 'consult',
    path:'BusinessConsultancy.png',
    short: 'Market entry, growth strategy and operational improvement.',
    intro: 'Practical strategy and operational support for companies entering, scaling or restructuring.',
    services: ['Market-entry strategy', 'Operational improvement', 'Sales & business development strategy', 'Specialist project consultants', 'Growth strategy', 'Market research', 'Management advisory', 'Training & capacity-building advisory'] },
  { slug: 'hr-staffing', title: 'HR & Staffing', icon: 'hr',
    path:'GovernanceCompliance.png',
    short: 'Recruitment and workforce solutions for reliable talent.',
    intro: 'Recruitment and workforce solutions for companies seeking reliable talent.',
    services: ['Hospitality recruitment', 'Restaurant & hotel recruitment', 'Café/barista recruitment', 'Sales & customer-service recruitment', 'Drivers & logistics recruitment', 'Professional & administrative recruitment'] },
  { slug: 'skills-training', title: 'Skills Training Center', icon: 'train',
    path:'SkillsTraining.png',
    short: 'Job-focused training that builds capable, work-ready teams.',
    intro: 'Practical, job-focused training that equips people with the skills employers need, linked directly to our staffing and hospitality divisions.',
    services: ['Barista & café operations training', 'Sales & business development training', 'Corporate staff upskilling programs', 'Hospitality & customer-service training', 'Driver & logistics skills training', 'Training needs assessment for employers'] },
  { slug: 'hospitality', title: 'Hospitality Solutions', icon: 'hosp',
    path:'HospitalitySolutions.png',
    short: 'Staffing, training and operations support for cafés and hotels.',
    intro: 'Specialized support for cafés, restaurants, hotels and hospitality operators.',
    services: ['Barista and hospitality recruitment', 'Restaurant staffing solutions', 'Operations consulting', 'Café opening support', 'Hospitality training coordination', 'Event staffing'] },
  { slug: 'import-export-trading', title: 'Import, Export & Trading', icon: 'trade',
    path:'ImportExportTrading.png',
    short: 'Sourcing, import/export and logistics across five regions.',
    intro: 'Import and export, commercial sourcing and supply-chain coordination connecting businesses with products, suppliers and markets across Africa, the GCC, Asia, Europe and the USA.',
    services: ['Import & export coordination', 'Procurement coordination', 'Café/restaurant equipment sourcing', 'Supplier sourcing', 'Glass & commercial products', 'Logistics and distribution support'] },
];

export const STATS = [
  { n: '6', label: 'specialized divisions', text: 'Investment, consultancy, staffing, training, hospitality and trading under one parent company.', tag: 'Group structure', bg: 'from-[#2a4a9a] to-[#101a3a]', path: "SpecializedDivisions.png" },
  { n: '7', label: 'offices in 7 countries', text: 'Saudi Arabia, USA, Ethiopia, Tanzania, Somalia, Kenya and Uganda with central governance and compliance oversight.', tag: 'Offices', bg: 'from-[#4a4a4a] to-[#111]', path: "OfficeTeamwork.png" },
  { n: '5', label: 'regions connected', text: 'Africa, the GCC, Asia, Europe and the USA, reached through one coordinated group.', tag: 'Reach', bg: 'from-[#6a4a2a] to-[#1a110a]', path: "RegionsConnected.png" },
  { n: '1', label: 'point of contact', text: 'One accountable team coordinating delivery across borders.', tag: 'Client promise', bg: 'from-[#146ef5] to-[#0a2250]', path: "PointOfContact.png" },
];

export const VALUES = [
  'Integrity',
  'Professionalism',
  'Accountability',
  'Partnership',
  'Long-term relationships',
  'Clear communication',
  'Commercial discipline',
  'Responsible growth',
];

export const VALUE_IMAGES = [
  // Integrity — architecture and structure
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=70',

  // Professionalism — modern office
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=70',

  // Accountability — business planning
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=70',

  // Partnership — collaboration
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=500&q=70',

  // Long-term relationships — team collaboration
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=70',

  // Clear communication — meeting
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&q=70',

  // Commercial discipline — finance and analysis
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=70',

  // Responsible growth — sustainable development
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&q=70',
];

export const SERVE = ['Entrepreneurs & SMEs', 'Companies entering new markets', 'Cafés & restaurants', 'Hotels & hospitality operators', 'Logistics & commercial companies', 'Investors & business owners', 'Retail & service businesses', 'Corporate employers & HR departments', 'International suppliers', 'Individuals seeking career skills', 'Employers upskilling their teams', 'Organizations needing expert consultants'];

export const JOURNEY = [
  { t: 'Discover', d: "Understand the client's business, objective and constraints." },
  { t: 'Assess', d: 'Identify commercial, operational and regulatory needs.' },
  { t: 'Plan', d: 'Build a practical strategy, scope and implementation plan.' },
  { t: 'Deliver', d: 'Coordinate the service through the responsible division.' },
  { t: 'Grow', d: 'Maintain the relationship and identify further opportunities.' },
];

export const HUB = [
  { t: 'Business Consultancy', k: 'Strategy' }, { t: 'HR & Staffing', k: 'People' }, { t: 'Skills Training', k: 'Capability' },
  { t: 'Hospitality', k: 'Operations' }, { t: 'Import & Export', k: 'Trade' }, { t: 'Investment & Advisory', k: 'Growth' },
];

export const VISION = [
  { goal: 'Diversifying the economy and growing the private sector', who: 'Investment & Advisory · Business Consultancy', text: 'We help entrepreneurs, SMEs and investors assess opportunities, plan, raise capital where permitted and scale their businesses.' },
  { goal: 'Attracting investment and global partnerships', who: 'Cross-border advisory',text: 'Market-entry support for international companies and investors coming into Saudi Arabia, and for Saudi businesses expanding abroad.' },
  { goal: 'Developing national skills and human capital', who: 'Skills Training Center · HR & Staffing', text: 'Job-focused training and recruitment that connect capable people with the employers who need them.' },
  { goal: 'Growing tourism, hospitality and services', who: 'Hospitality Solutions', text: 'Staffing, training and operations support for cafés, restaurants, hotels and hospitality operators.' },
  { goal: 'Strengthening trade, exports and logistics', who: 'Import, Export & Trading',text: 'Import and export coordination, supplier sourcing and logistics that link Saudi businesses with markets across Africa, the GCC, Asia, Europe and the USA.' },
  { goal: 'Building a trusted business environment', who: 'Governance & compliance', text: 'We operate within applicable laws and licensing requirements and work with licensed partners for regulated services.' },
];

export const WHY = [
  { t: 'One accountable group', d: 'Six divisions coordinated under a single parent company with central governance and compliance oversight.' },
  { t: 'Cross-border reach', d: 'Offices in Riyadh, Nairobi and Kampala help clients connect with opportunities across Africa, the GCC, Asia, Europe and the USA.' },
  { t: 'Integrated services', d: 'Enter through one division and access advisory, workforce, training, hospitality and sourcing support as needs grow.' },
  { t: 'Licensed partner network', d: 'Regulated services are delivered with appropriately licensed legal and financial professionals.' },
  { t: 'Long-term focus', d: 'We build lasting relationships rather than one-off transactions.' },
  { t: 'Clear, disciplined delivery', d: 'Defined responsibilities, transparent commercial terms and documented approvals.' },
];

export const PRINCIPLES = ['Clear responsibilities and measurable targets', 'Defined decision-making authority', 'Financial discipline and documented approvals', 'Transparent commercial terms', 'Professional client communication', 'Long-term relationship building'];

export const ROADMAP = [
  { t: 'Foundation', s: 'Build the platform', d: 'Corporate profile, website, CRM, pricing and partner agreements.' },
  { t: 'Client Acquisition', s: 'Win corporate clients', d: 'Target SMEs, hospitality, logistics, retail and international businesses.' },
  { t: 'Contract Growth', s: 'Build recurring revenue', d: 'Corporate recruitment, training programs, consulting retainers, hospitality and procurement contracts.' },
  { t: 'Expansion', s: 'Scale strongest divisions', d: 'Invest more in divisions with the strongest margins, demand and recurring revenue.' },
];

export const AUDIENCES = [
  { label: 'growing businesses', tag: 'Growth', intro: 'Assess opportunities, plan your market entry and scale with one accountable group.', items: ['Assess opportunities with advisory support', 'Plan market entry and growth strategy', 'Build investor materials and business plans', 'Source suppliers and products abroad', 'Cut delays with one point of contact'] },
  { label: 'employers', tag: 'Talent', intro: 'Recruit reliable people and upskill the teams you already have.', items: ['Hospitality, sales and logistics recruitment', 'Professional and administrative hiring', 'Drivers and logistics recruitment', 'Corporate staff upskilling programs', 'Training needs assessment for employers'] },
  { label: 'hospitality teams', tag: 'Hospitality', intro: 'Staff, train and open cafés, restaurants and hotels with practical support.', items: ['Barista and hospitality recruitment', 'Café opening support', 'Restaurant staffing solutions', 'Hospitality training coordination', 'Event staffing'] },
  { label: 'importers & traders', tag: 'Trade', intro: 'Source, import and distribute across Africa, the GCC, Asia, Europe and the USA.', items: ['Import and export coordination', 'Supplier sourcing', 'Procurement coordination', 'Café and restaurant equipment sourcing', 'Logistics and distribution support'] },
];
