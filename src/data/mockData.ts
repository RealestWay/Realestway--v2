import type { Property, Agent } from '../types';

export const mockAgents: Agent[] = [];

export const propertyImages = {
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&q=80',
  ],
  duplex: [
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&q=80',
  ],
};

export const mockProperties: Property[] = [];

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export const NIGERIAN_LOCATIONS: Record<string, string[]> = {
  'Abia': ['Aba', 'Umuahia', 'Ohafia'],
  'Adamawa': ['Yola', 'Mubi', 'Jimeta'],
  'Akwa Ibom': ['Uyo', 'Eket', 'Ikot Ekpene'],
  'Anambra': ['Awka', 'Onitsha', 'Nnewi'],
  'Bauchi': ['Bauchi', 'Azare', 'Misau'],
  'Bayelsa': ['Yenagoa', 'Sagbama', 'Ogbia'],
  'Benue': ['Makurdi', 'Gboko', 'Otukpo'],
  'Borno': ['Maiduguri', 'Biu', 'Dikwa'],
  'Cross River': ['Calabar', 'Ikom', 'Ogoja'],
  'Delta': ['Asaba', 'Warri', 'Sapele', 'Agbor'],
  'Ebonyi': ['Abakaliki', 'Afikpo', 'Onueke'],
  'Edo': ['Benin City', 'Auchi', 'Uromi'],
  'Ekiti': ['Ado Ekiti', 'Ikere', 'Otun'],
  'Enugu': ['Enugu', 'Nsukka', 'Oji River'],
  'FCT (Abuja)': ['Abuja Central', 'Wuse 2', 'Maitama', 'Asokoro', 'Garki', 'Gwarinpa', 'Jabi', 'Kubwa', 'Lugbe', 'Kuje'],
  'Gombe': ['Gombe', 'Kumo', 'Billiri'],
  'Imo': ['Owerri', 'Orlu', 'Okigwe'],
  'Jigawa': ['Dutse', 'Hadejia', 'Birnin Kudu'],
  'Kaduna': ['Kaduna City', 'Zaria', 'Kafanchan'],
  'Kano': ['Kano City', 'Sabon Gari', 'Nassarawa', 'Gwale'],
  'Katsina': ['Katsina City', 'Daura', 'Funtua'],
  'Kebbi': ['Birnin Kebbi', 'Argungu', 'Yauri'],
  'Kogi': ['Lokoja', 'Okene', 'Idah'],
  'Kwara': ['Ilorin', 'Offa', 'Omu Aran'],
  'Lagos': ['Lekki', 'Victoria Island', 'Ikoyi', 'Ajah', 'Lagos Island', 'Surulere', 'Yaba', 'Ikeja', 'Maryland', 'Gbagada', 'Magodo', 'Ojodu', 'Ikorodu', 'Badagry', 'Epe'],
  'Nasarawa': ['Lafia', 'Keffi', 'Akwanga'],
  'Niger': ['Minna', 'Bida', 'Suleja'],
  'Ogun': ['Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ota'],
  'Ondo': ['Akure', 'Ondo City', 'Owo'],
  'Osun': ['Osogbo', 'Ilesa', 'Ife'],
  'Oyo': ['Ibadan', 'Ogbomosho', 'Oyo City'],
  'Plateau': ['Jos', 'Bukuru', 'Pankshin'],
  'Rivers': ['Port Harcourt', 'GRA Port Harcourt', 'Rumuola', 'Trans Amadi', 'Obio-Akpor', 'Eleme', 'Bonny'],
  'Sokoto': ['Sokoto City', 'Gwadabawa', 'Tambuwal'],
  'Taraba': ['Jalingo', 'Wukari', 'Bali'],
  'Yobe': ['Damaturu', 'Potiskum', 'Gashua'],
  'Zamfara': ['Gusau', 'Kaura Namoda', 'Talata Mafara'],
};

export const NIGERIAN_CITIES = Object.values(NIGERIAN_LOCATIONS).flat();

export const PROPERTY_TYPES = [
  'Apartment', 'Duplex', 'Bungalow', 'Penthouse',
  'Studio', 'Self Contain', 'Terrace', 'Mansion', 'Office Space', 'Shop', 'Warehouse', 'Land',
];

export const PRICE_RANGES = [
  { label: 'Under ₦500k', min: 0, max: 500000 },
  { label: '₦500k - ₦1M', min: 500000, max: 1000000 },
  { label: '₦1M - ₦3M', min: 1000000, max: 3000000 },
  { label: '₦3M - ₦5M', min: 3000000, max: 5000000 },
  { label: '₦5M - ₦10M', min: 5000000, max: 10000000 },
  { label: '₦10M - ₦50M', min: 10000000, max: 50000000 },
  { label: '₦50M - ₦100M', min: 50000000, max: 100000000 },
  { label: 'Above ₦100M', min: 100000000, max: Infinity },
];

export function formatPrice(price: number): string {
  if (price === undefined || price === null || isNaN(price)) return '₦0';
  if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B`;
  if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `₦${(price / 1000).toFixed(0)}k`;
  return `₦${price.toLocaleString()}`;
}

export function getFeatureValue(features: any[] | undefined, tag: string): string | number | boolean | null {
  if (!features || !Array.isArray(features) || !tag) return null;
  const feature = features.find(f => {
    if (typeof f === 'string') return f.toLowerCase() === tag.toLowerCase();
    return f && f.tag && f.tag.toLowerCase() === tag.toLowerCase();
  });
  if (!feature) return null;
  return typeof feature === 'string' ? true : feature.value;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Locations to Buy Land in Lagos (2026)',
    excerpt: 'Looking for high ROI? Discover the fastest growing areas in Lagos for land investment this year.',
    category: 'Real Estate Strategy',
    date: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  },
  {
    id: '2',
    title: 'How to Spot Red Flags When Renting in Nigeria',
    excerpt: 'Don’t get scammed. Learn the essential checklist for inspecting properties and verifying agent claims.',
    category: 'Renters Guide',
    date: 'May 10, 2026',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
  {
    id: '3',
    title: 'Understanding Legal Fees and Agency Percentages',
    excerpt: 'Confused by the "Total Package"? We break down the standard legal and agency fees in the Nigerian market.',
    category: 'Market Insights',
    date: 'May 8, 2026',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
  {
    id: '4',
    title: 'Modern Interior Design Trends for Small Apartments',
    excerpt: 'Make your studio feel like a mansion with these space-saving interior design tips.',
    category: 'Lifestyle',
    date: 'May 5, 2026',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  },
];

