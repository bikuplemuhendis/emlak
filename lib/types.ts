export type ListingStatus = "satilik" | "kiralik";

export type PropertyType =
  | "daire"
  | "villa"
  | "mustakil"
  | "ofis"
  | "arsa"
  | "ticari";

export type ListingLayout = "grid" | "list";
export type ListingView = "grid" | "list" | "map";
export type HeaderStyle = "transparent" | "solid";

export type FeatureKey =
  | "asansor"
  | "otopark"
  | "guvenlik"
  | "havuz"
  | "spor_salonu"
  | "cocuk_parki"
  | "jenerator"
  | "klima"
  | "ankastre"
  | "esyali"
  | "balkon"
  | "teras"
  | "deniz_manzarasi"
  | "sehir_manzarasi"
  | "fiber"
  | "akilli_ev"
  | "yangin_merdiveni"
  | "site_ici"
  | "jakuzi"
  | "somine"
  | "depo"
  | "yuk_asansoru";

export interface GeoLocation {
  city: string;
  district: string;
  neighborhood?: string;
  address: string;
  lat: number;
  lng: number;
}

export interface ApartmentFields {
  rooms: number;
  livingRooms: number;
  floor: number;
  totalFloors: number;
  buildingAge: number;
  heating: string;
  furnished: boolean;
  balcony: boolean;
  dues: number;
  bathrooms: number;
}

export interface VillaFields {
  gardenM2: number;
  pool: boolean;
  floors: number;
  parking: number;
  view: string;
  exterior: string;
}

export interface LandFields {
  zoning: string;
  m2: number;
  ada: string;
  parsel: string;
  kaks: number;
  tapuStatus: string;
  infrastructure: string;
  roadFrontage: number;
}

export interface CommercialFields {
  netM2: number;
  grossM2: number;
  floor: string;
  building: string;
  suitableFor: string;
  dues: number;
  parking: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  status: ListingStatus;
  price: number;
  currency: "TRY";
  deposit?: number;
  loanEligible?: boolean;
  location: GeoLocation;
  images: string[];
  area: number;
  beds?: number;
  baths?: number;
  featured: boolean;
  isNew: boolean;
  published: boolean;
  yearBuilt?: number;
  energyClass?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  floorPlan?: string;
  features: FeatureKey[];
  apartment?: ApartmentFields;
  villa?: VillaFields;
  land?: LandFields;
  commercial?: CommercialFields;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageSections {
  featured: boolean;
  types: boolean;
  stats: boolean;
  testimonials: boolean;
  cta: boolean;
  latest: boolean;
}

export interface AgentProfile {
  name: string;
  title: string;
  photo: string;
  bio: string;
}

export interface SiteSettings {
  agencyName: string;
  logoText: string;
  logoMark: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  sections: HomepageSections;
  defaultListingLayout: ListingLayout;
  headerStyle: HeaderStyle;
  footerText: string;
  agent: AgentProfile;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertySlug?: string;
  source: "contact" | "property" | "office" | "newsletter";
  createdAt: string;
}

export interface ListingFilters {
  q?: string;
  status?: ListingStatus | "";
  type?: PropertyType | "";
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minArea?: number;
  maxArea?: number;
  features?: FeatureKey[];
  sort?: "newest" | "price-asc" | "price-desc" | "area-desc";
  page?: number;
  view?: ListingView;
}

export type PropertyInput = Omit<Property, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};
