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
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case PropertyStatus.ForSale:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Badge
      className={`border-0 font-bold backdrop-blur-sm ${getStatusColor(
        status
      )} ${className || ""}`}
    >
      {status}
    </Badge>
  );
}
