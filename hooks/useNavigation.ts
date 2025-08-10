import { useMemo } from "react";

export interface NavigationItem {
  item: string;
  route: string;
}

export interface UseNavigationReturn {
  navigationItems: NavigationItem[];
}

export function useNavigation(userRole: string | null): UseNavigationReturn {
  const navigationItems = useMemo(() => {
    const items: NavigationItem[] = [
      { item: "Properties", route: "/property" }
    ];

    // Add admin-specific items for Admin users
    if (userRole === "Admin") {
      items.push({ item: "Admin", route: "/admin" });
    }

    return items;
  }, [userRole]);

  return {
    navigationItems,
  };
}
