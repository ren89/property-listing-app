import { PropertyType, PropertyStatus } from "@/types/property";

export interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  price: string;
  property_type: PropertyType;
  status: PropertyStatus;
}
