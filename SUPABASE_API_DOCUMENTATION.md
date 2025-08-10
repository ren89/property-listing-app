# Supabase JavaScript Client API Documentation

This documentation covers the existing operations in the Property Listing App using the Supabase JavaScript client.

## Table of Contents

1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Users Table](#users-table)
4. [Property Listings Table](#property-listings-table)
5. [File Storage](#file-storage)

## Setup

### Client-Side Setup (Browser)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Usage
const supabase = createClient();
```

### Server-Side Setup (Next.js)
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  );
}
```

## Authentication

### Sign Up
```typescript
export async function signup(name: string, email: string, password: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw new Error(error.message || "Signup failed");
  }

  return { success: true };
}
```

### Sign In
```typescript
export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Login failed");
  }

  return { success: true };
}
```

### Sign Out
```typescript
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || "Logout failed");
  }

  return { success: true };
}
```

### Get Current User
```typescript
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  // Get user data from users table
  return await getUserById(authUser.id);
}
```

## Users Table

**Table Name:** `users`

**Schema:**
```typescript
interface User {
  id: string;           // UUID, Primary Key
  email: string;        // Email address
  full_name: string;    // User's full name
  avatar_url?: string;  // Profile picture URL (optional)
  created_at: string;   // ISO timestamp
  updated_at: string;   // ISO timestamp
}
```

### Read Operations

#### Get User by ID
```typescript
export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data as User;
}
```

**Parameters:**
- `userId` (string): The unique identifier of the user

**Response:**
- Success: Returns `User` object or `null` if not found
- Error: Returns `null` and logs error



### Create Operations

#### Create User
```typescript
interface CreateUserData {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export async function createUser(userData: CreateUserData): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data as User;
}
```

**Parameters:**
- `userData` (CreateUserData): User information object

**Response:**
- Success: Returns created `User` object
- Error: Throws error with descriptive message

## Property Listings Table

**Table Name:** `property_listings`

**Schema:**
```typescript
interface PropertyListing {
  id: string;                    // UUID, Primary Key
  created_at: string;           // ISO timestamp
  title: string;                // Property title
  description: string;          // Property description
  location: string;             // Property location
  price: number;                // Property price
  property_type: PropertyType;  // Enum: "Apartment" | "House" | "Commercial"
  status: PropertyStatus;       // Enum: "ForRent" | "ForSale"
  image?: string[] | null;      // Array of image URLs (optional)
  updated_at: string;           // ISO timestamp
}

enum PropertyType {
  Apartment = "Apartment",
  House = "House",
  Commercial = "Commercial",
}

enum PropertyStatus {
  ForRent = "ForRent",
  ForSale = "ForSale",
}
```

### Read Operations

#### Get All Properties
```typescript
export async function getProperties(): Promise<PropertyListing[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}
```

**Parameters:** None

**Response:**
- Success: Returns array of `PropertyListing` objects
- Error: Returns empty array and logs error

#### Get Property by ID
```typescript
export async function getPropertyById(id: string): Promise<PropertyListing | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data as PropertyListing;
}
```

**Parameters:**
- `id` (string): Property UUID

**Response:**
- Success: Returns `PropertyListing` object or `null`
- Error: Returns `null` and logs error



### Create Operations

#### Create Property Listing
```typescript
interface CreatePropertyListingData {
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: PropertyType;
  status: PropertyStatus;
  image?: string[];
}

export async function createPropertyListing(
  data: CreatePropertyListingData
): Promise<{ data: PropertyListing | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: property, error } = await supabase
      .from("property_listings")
      .insert(data)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: property, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
```

**Parameters:**
- `data` (CreatePropertyListingData): Property information object

**Response:**
```typescript
{
  data: PropertyListing | null;
  error: string | null;
}
```



### Update Operations

#### Update Property Listing
```typescript
interface UpdatePropertyListingData {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  property_type?: PropertyType;
  status?: PropertyStatus;
  image?: string[];
}

export async function updatePropertyListing(
  id: string,
  data: UpdatePropertyListingData
): Promise<{ data: PropertyListing | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data: property, error } = await supabase
      .from("property_listings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: property, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
```

**Parameters:**
- `id` (string): Property UUID to update
- `data` (UpdatePropertyListingData): Partial property data to update

**Response:**
```typescript
{
  data: PropertyListing | null;
  error: string | null;
}
```

### Delete Operations

#### Delete Property Listing
```typescript
export async function deletePropertyListing(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get property images before deletion
    const { data: property } = await supabase
      .from("property_listings")
      .select("image")
      .eq("id", id)
      .single();

    // Delete the property
    const { error } = await supabase
      .from("property_listings")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Delete associated images from storage
    if (property?.image && property.image.length > 0) {
      await deletePropertyImages(property.image);
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
```

**Parameters:**
- `id` (string): Property UUID to delete

**Response:**
```typescript
{
  success: boolean;
  error: string | null;
}
```

## File Storage

**Storage Bucket:** `pla-prod`

### Upload Property Images
```typescript
export async function uploadPropertyImages(
  files: File[]
): Promise<{ urls: string[] | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { urls: null, error: "User not authenticated" };
    }

    const uploadPromises = files.map(async (file) => {
      // Generate unique filename
      const timestamp = new Date().getTime();
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { data, error } = await supabase.storage
        .from("pla-prod")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("pla-prod").getPublicUrl(filePath);

      return publicUrl;
    });

    const urls = await Promise.all(uploadPromises);
    return { urls, error: null };
  } catch (error) {
    return {
      urls: null,
      error: error instanceof Error ? error.message : "Failed to upload images",
    };
  }
}
```

**Parameters:**
- `files` (File[]): Array of File objects to upload

**Response:**
```typescript
{
  urls: string[] | null;
  error: string | null;
}
```

**File Constraints:**
- Maximum file size: 5MB
- Allowed types: Image files only (`image/*`)
- Storage path: `properties/{timestamp}-{randomString}.{extension}`

### Delete Property Images
```typescript
export async function deletePropertyImages(
  imageUrls: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Extract file paths from URLs
    const filePaths = imageUrls
      .map((url) => {
        const urlParts = url.split("/");
        const bucketIndex = urlParts.findIndex((part) => part === "pla-prod");
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          return urlParts.slice(bucketIndex + 1).join("/");
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length === 0) {
      return { success: false, error: "No valid file paths found" };
    }

    const { error } = await supabase.storage.from("pla-prod").remove(filePaths);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete images",
    };
  }
}
```

**Parameters:**
- `imageUrls` (string[]): Array of image URLs to delete

**Response:**
```typescript
{
  success: boolean;
  error: string | null;
}
```

### Get Public URL for File
```typescript
export function getPublicUrl(filePath: string): string {
  const supabase = createClient();
  
  const {
    data: { publicUrl },
  } = supabase.storage.from("pla-prod").getPublicUrl(filePath);

  return publicUrl;
}
```

---

This documentation covers the core operations available in your Property Listing App using Supabase JavaScript client.
