"use client"

import React from "react"
import { NavigationDrawer } from "./index"

// Example navigation items
const navigationItems = [
  { item: "Home", route: "/" },
  { item: "Properties", route: "/property" },
  { item: "Admin", route: "/admin" },
  { item: "About", route: "/about" },
  { item: "Contact", route: "/contact" },
]

export default function NavigationDrawerExample() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Navigation Drawer Example</h2>
      <p className="text-muted-foreground mb-4">
        Click the hamburger menu button to open the navigation drawer
      </p>
      
      <NavigationDrawer 
        items={navigationItems}
        title="Main Menu"
        className="max-w-sm"
      />
      
      <div className="mt-8 p-4 border rounded-lg bg-muted">
        <h3 className="font-semibold mb-2">Usage:</h3>
        <pre className="text-sm overflow-x-auto">
{`import { NavigationDrawer } from "@/components/shared"

const navigationItems = [
  { item: "Home", route: "/" },
  { item: "Properties", route: "/property" },
  { item: "Admin", route: "/admin" },
]

<NavigationDrawer 
  items={navigationItems}
  title="Main Menu"
/>`}
        </pre>
      </div>
    </div>
  )
}
