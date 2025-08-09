import { PropertyStatus } from "@/types";
import { Badge } from "../ui/badge";

export default function StatusBadge({
  status,
  className,
}: {
  status: PropertyStatus;
  className?: string;
}) {
  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.ForRent:
        return "bg-green-600 text-white shadow-md";
      case PropertyStatus.ForSale:
        return "bg-blue-600 text-white shadow-md";
      default:
        return "bg-gray-600 text-white shadow-md";
    }
  };

  return (
    <Badge
      className={`border-0 font-medium ${getStatusColor(status)} ${
        className || ""
      }`}
    >
      {status}
    </Badge>
  );
}
