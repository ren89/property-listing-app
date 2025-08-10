export enum PropertyType {
  Apartment = "Apartment",
  House = "House",
  Commercial = "Commercial",
}

export enum PropertyStatus {
  ForRent = "ForRent",
  ForSale = "ForSale",
}

export interface PropertyListing {
  id: string;
  created_at: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: PropertyType;
  status: PropertyStatus;
  image?: string[] | null;
  updated_at: string;
}

export interface CreatePropertyListingData {
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: PropertyType;
  status: PropertyStatus;
  image?: string[];
}

export interface UpdatePropertyListingData {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  property_type?: PropertyType;
  status?: PropertyStatus;
  image?: string[];
}
