import { PropertyStatus } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPriceWithSuffix(
  price: number,
  status: PropertyStatus
): string {
  const formattedPrice = formatPrice(price);
  return status === PropertyStatus.ForRent
    ? `${formattedPrice}/mo`
    : formattedPrice;
}
