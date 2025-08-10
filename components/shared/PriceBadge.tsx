import { PropertyStatus } from "@/types";
import { Badge } from "../ui/badge";
import { formatPriceWithSuffix } from "@/utils/formatters";

export default function PriceBadge({
  price,
  status,
  className,
}: {
  price: number;
  status: PropertyStatus;
  className?: string;
}) {
  return (
    <Badge
      className={`bg-white/90 text-gray-900 border-0 font-bold backdrop-blur-sm ${
        className || ""
      }`}
    >
      {formatPriceWithSuffix(price, status)}
    </Badge>
  );
}
