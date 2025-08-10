"use client";

import { useState } from "react";
import { usePropertyListings } from "@/hooks/usePropertyListings";
import { useAuth, useNavigation } from "@/hooks";
import {
  PropertyListing,
  PropertyType,
  PropertyStatus,
} from "@/types/property";
import { PropertyFormData } from "@/types/forms";
import {
  createPropertyListing,
  updatePropertyListing,
  deletePropertyListing,
} from "@/app/actions/properties";
import { PropertyModal, AdminPropertyTable } from "@/components/feature/admin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { NavigationDrawer } from "@/components/shared";

export default function AdminPage() {
  const { userRole } = useAuth();
  const { navigationItems } = useNavigation(userRole);
  const {
    properties,
    loading,
    refetch,
    addPropertyOptimistically,
    updatePropertyOptimistically,
    removePropertyOptimistically,
  } = usePropertyListings();
  //Optimistic UI state for instant updates

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyListing | null>(null);

  // Form state
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    location: "",
    price: "",
    property_type: PropertyType.Apartment,
    status: PropertyStatus.ForRent,
    image: [],
  });

  // Form helpers
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      price: "",
      property_type: PropertyType.Apartment,
      status: PropertyStatus.ForRent,
      image: [],
    });
  };

  const populateForm = (property: PropertyListing) => {
    setFormData({
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price.toString(),
      property_type: property.property_type,
      status: property.status,
      image: property.image || [],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleEdit = (property: PropertyListing) => {
    populateForm(property);
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (property: PropertyListing) => {
    removePropertyOptimistically(property.id);

    try {
      const { error } = await deletePropertyListing(property.id);

      if (error) {
        toast.error(error);
        // If deletion failed, refetch to restore the property
        refetch();
      } else {
        toast.success("Property deleted successfully!");
        // Property already removed optimistically, no need to do anything
      }
    } catch (error) {
      toast.error("Failed to delete property");
      refetch();
    }
  };

  const onCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await createPropertyListing({
        ...formData,
        price: parseFloat(formData.price),
        image: formData.image,
      });

      if (error) {
        toast.error(error);
      } else {
        toast.success("Property created successfully!");
        setIsModalOpen(false);
        resetForm();

        if (data) {
          addPropertyOptimistically(data);
        } else {
          // Fallback to refetch if no data returned
          refetch();
        }
      }
    } catch (error) {
      toast.error("Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setIsSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        image: formData.image,
      };

      const { error } = await updatePropertyListing(
        selectedProperty.id,
        updatedData
      );

      if (error) {
        toast.error(error);
      } else {
        toast.success("Property updated successfully!");
        closeModal();
        resetForm();

        updatePropertyOptimistically(selectedProperty.id, {
          ...updatedData,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      toast.error("Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unified submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    if (selectedProperty) {
      await onEditSubmit(e);
    } else {
      await onCreateSubmit(e);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    closeModal();
    resetForm();
  };


  return (

    <div className="p-6 max-w-7xl mx-auto">
      <NavigationDrawer
        items={navigationItems}
        title="Main Menu"
      />
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Property Management
            </h1>
            <p className="text-gray-600 mt-2">Manage your property listings</p>
          </div>
        </div>
      </div>

      <AdminPropertyTable
        properties={properties}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddProperty={handleAdd}
      />

      <PropertyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        property={selectedProperty}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
