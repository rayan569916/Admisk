export interface Division { slug: string; title: string; short: string; intro: string; icon: string; services: string[]; }

export const COMPANY = {
  name: 'ADMISK Investment Limited',
  legal: 'AIL ADMISK Investment Limited',
  tagline: 'Connecting opportunity, strategy, people and growth.',
  email: 'adfaminvestment@gmail.com',
  regions: ['Africa', 'GCC', 'Asia', 'Europe', 'USA'],
};

export const OFFICES = [
  { key: 'riyadh', name: 'Headquarters', city: 'Riyadh', address: 'Qalidiya Tower, Riyadh, Saudi Arabia', phone: '+966 55 649 0042' },
  { key: 'nairobi', name: 'Nairobi office', city: 'Nairobi', address: 'Eastleigh, Nairobi, Kenya', phone: '+254 710 482488' },
  { key: 'kampala', name: 'Kampala office', city: 'Kampala', address: 'Kisenyi, Kampala, Uganda', phone: '+256 708 506070' },
];

export const ICONS: Record<string, string> = {
  invest: 'M3 20l7-8 4 4 10-10M17 6h7v7',
  consult: 'M4 14a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M9.5 14a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0',
  hr: 'M14 9a4 4 0 1 1-8 0a4 4 0 1 1 8 0M3 24c0-5 3-8 7-8s7 3 7 8M23 11a3 3 0 1 1-6 0a3 3 0 1 1 6 0M17 24c0-3 1.5-5 4-5s4 2 4 5',
  train: 'M2 10l12-6 12 6-12 6zM7 13v6c0 2 3.5 4 7 4s7-2 7-4v-6',
  hosp: 'M5 9h15v8a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6zM20 11h2a3 3 0 0 1 0 6h-2',
  trade: 'M14 3l10 5v12l-10 5-10-5V8zM4 8l10 5 10-5M14 13v12',
};

export const DIVISIONS: Division[] = [
  { slug: 'investment-advisory', title: 'Investment & Advisory', icon: 'invest',
    short: 'Opportunity assessment, investor materials and transaction support.',
    intro: 'Business and investment-oriented advisory for entrepreneurs, investors and companies.',
    services: ['Opportunity assessment', 'Business plans & investor materials', 'Financial & risk modeling', 'Valuation & due diligence support', 'Capital-raising support where permitted', 'M&A and transaction support'] },
  { slug: 'business-consultancy', title: 'Business Consultancy', icon: 'consult',
    short: 'Market entry, growth strategy and operational improvement.',
    intro: 'Practical strategy and operational support for companies entering, scaling or restructuring.',
    services: ['Market-entry strategy', 'Operational improvement', 'Sales & business development strategy', 'Specialist project consultants', 'Growth strategy', 'Market research', 'Management advisory', 'Training & capacity-building advisory'] },
  { slug: 'hr-staffing', title: 'HR & Staffing', icon: 'hr',
    short: 'Recruitment and workforce solutions for reliable talent.',
    intro: 'Recruitment and workforce solutions for companies seeking reliable talent.',
    services: ['Hospitality recruitment', 'Restaurant & hotel recruitment', 'Café/barista recruitment', 'Sales & customer-service recruitment', 'Drivers & logistics recruitment', 'Professional & administrative recruitment'] },
  { slug: 'skills-training', title: 'Skills Training Center', icon: 'train',
    short: 'Job-focused training that builds capable, work-ready teams.',
    intro: 'Practical, job-focused training that equips people with the skills employers need, linked directly to our staffing and hospitality divisions.',
    services: ['Barista & café operations training', 'Sales & business development training', 'Corporate staff upskilling programs', 'Hospitality & customer-service training', 'Driver & logistics skills training', 'Training needs assessment for employers'] },
  { slug: 'hospitality', title: 'Hospitality Solutions', icon: 'hosp',
    short: 'Staffing, training and operations support for cafés and hotels.',
    intro: 'Specialized support for cafés, restaurants, hotels and hospitality operators.',
    services: ['Barista and hospitality recruitment', 'Restaurant staffing solutions', 'Operations consulting', 'Café opening support', 'Hospitality training coordination', 'Event staffing'] },
  { slug: 'import-export-trading', title: 'Import, Export & Trading', icon: 'trade',
    short: 'Sourcing, import/export and logistics across five regions.',
    intro: 'Import and export, commercial sourcing and supply-chain coordination connecting businesses with products, suppliers and markets across Africa, the GCC, Asia, Europe and the USA.',
    services: ['Import & export coordination', 'Procurement coordination', 'Café/restaurant equipment sourcing', 'Supplier sourcing', 'Glass & commercial products', 'Logistics and distribution support'] },
];

export const STATS = [
  { n: '6', label: 'specialized divisions', text: 'Investment, consultancy, staffing, training, hospitality and trading under one parent company.', tag: 'Group structure', bg: 'from-[#2a4a9a] to-[#101a3a]', path: "SpecializedDivisions.png" },
  { n: '3', label: 'offices in 3 countries', text: 'Riyadh, Nairobi and Kampala, with central governance and compliance oversight.', tag: 'Offices', bg: 'from-[#4a4a4a] to-[#111]', path: "OfficeTeamwork.png" },
  { n: '5', label: 'regions connected', text: 'Africa, the GCC, Asia, Europe and the USA, reached through one coordinated group.', tag: 'Reach', bg: 'from-[#6a4a2a] to-[#1a110a]', path: "RegionsConnected.png" },
  { n: '1', label: 'point of contact', text: 'One accountable team coordinating delivery across borders.', tag: 'Client promise', bg: 'from-[#146ef5] to-[#0a2250]', path: "PointOfContact.png" },
];

export const VALUES = ['Integrity', 'Professionalism', 'Accountability', 'Partnership', 'Long-term relationships', 'Clear communication', 'Commercial discipline', 'Responsible growth'];

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
  { goal: 'Attracting investment and global partnerships', who: 'Cross-border advisory', text: 'Market-entry support for international companies and investors coming into Saudi Arabia, and for Saudi businesses expanding abroad.' },
  { goal: 'Developing national skills and human capital', who: 'Skills Training Center · HR & Staffing', text: 'Job-focused training and recruitment that connect capable people with the employers who need them.' },
  { goal: 'Growing tourism, hospitality and services', who: 'Hospitality Solutions', text: 'Staffing, training and operations support for cafés, restaurants, hotels and hospitality operators.' },
  { goal: 'Strengthening trade, exports and logistics', who: 'Import, Export & Trading', text: 'Import and export coordination, supplier sourcing and logistics that link Saudi businesses with markets across Africa, the GCC, Asia, Europe and the USA.' },
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
