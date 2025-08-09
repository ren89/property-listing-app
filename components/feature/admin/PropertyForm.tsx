"use client";

import { Button, Input, Select } from "@/components/shared";
import { PropertyType, PropertyStatus } from "@/types/property";
import { PropertyFormData } from "@/types/forms";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyFormProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export function PropertyForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit = false,
}: PropertyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        name="title"
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter property title"
        required
      />

      <div>
        <Label className="block text-sm font-medium mb-1">
          Description
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter property description"
          className="w-full p-2 border border-gray-300 rounded-md resize-none h-20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <Input
        name="location"
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Enter property location"
        required
      />

      <Input
        name="price"
        label="Price ($)"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Enter price"
        required
      />

      <Select
        name="property_type"
        label="Property Type"
        value={formData.property_type}
        onValueChange={(value) =>
          setFormData({
            ...formData,
            property_type: value as PropertyType,
          })
        }
        options={Object.values(PropertyType).map((type) => ({
          value: type,
          label: type,
        }))}
      />

      <Select
        name="status"
        label="Status"
        value={formData.status}
        onValueChange={(value) =>
          setFormData({
            ...formData,
            status: value as PropertyStatus,
          })
        }
        options={Object.values(PropertyStatus).map((status) => ({
          value: status,
          label: status === PropertyStatus.ForRent ? "For Rent" : "For Sale",
        }))}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Property"
            : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
