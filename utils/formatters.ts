import { PropertyStatus } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatPriceCompact(price: number): string {
  if (price >= 1000000) {
    return `₱${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `₱${(price / 1000).toFixed(0)}K`;
  }
  return `₱${price.toLocaleString()}`;
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
