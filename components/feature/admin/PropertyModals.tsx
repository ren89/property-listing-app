import Modal from "@/components/shared/Modal";
import { PropertyForm } from "./PropertyForm";
import { PropertyFormData } from "@/types/forms";
import { PropertyListing } from "@/types/property";
import { Dispatch, SetStateAction } from "react";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: PropertyListing | null;
  formData: PropertyFormData;
  setFormData: Dispatch<SetStateAction<PropertyFormData>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export function PropertyModal({
  isOpen,
  onClose,
  property,
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onCancel,
}: PropertyModalProps) {
  const isEdit = Boolean(property);
  const title = isEdit ? "Edit Property" : "Create New Property";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <PropertyForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isEdit={isEdit}
      />
    </Modal>
  );
}
