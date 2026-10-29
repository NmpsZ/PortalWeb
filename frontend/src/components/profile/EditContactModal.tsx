import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { UpdateContactRequest } from '../../types';

export interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UpdateContactRequest;
  onChange: (form: UpdateContactRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  serverError?: string | null;
  isSubmitting?: boolean;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
  serverError,
  isSubmitting = false,
}) => {
  const [errors, setErrors] = useState<{ phone_number?: string; email?: string; address?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (serverError) {
      const lower = serverError.toLowerCase();
      if (lower.includes('email')) {
        setErrors((prev) => ({ ...prev, email: serverError }));
      } else if (lower.includes('phone')) {
        setErrors((prev) => ({ ...prev, phone_number: serverError }));
      } else if (lower.includes('address')) {
        setErrors((prev) => ({ ...prev, address: serverError }));
      }
    }
  }, [serverError]);

  const handleFieldChange = (field: keyof UpdateContactRequest, value: string) => {
    onChange({ ...form, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: { phone_number?: string; email?: string; address?: string } = {};

    const trimmedPhone = (form.phone_number || '').trim();
    if (!trimmedPhone || trimmedPhone === '-') {
      newErrors.phone_number = 'Mobile phone number is required';
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(trimmedPhone)) {
      newErrors.phone_number = 'Invalid phone number format (must be 8-20 digits)';
    }

    const trimmedEmail = (form.email || '').trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Invalid email address format (e.g. name@domain.com)';
    }

    const trimmedAddress = (form.address || '').trim();
    if (!trimmedAddress) {
      newErrors.address = 'Address is required';
    } else if (trimmedAddress.length > 500) {
      newErrors.address = 'Address must not exceed 500 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose} title="Edit Contact Information">
      <form onSubmit={handleFormSubmit} className="flex flex-col" noValidate>
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {serverError}
          </div>
        )}

        <Input
          label="Mobile Phone Number"
          id="phone_number"
          value={form.phone_number}
          onChange={(e) => handleFieldChange('phone_number', e.target.value)}
          placeholder="e.g. 081-234-5678"
          required
          disabled={isSubmitting}
          error={errors.phone_number}
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          placeholder="e.g. john@example.com"
          required
          disabled={isSubmitting}
          error={errors.email}
        />

        <Input
          label="Address"
          id="address"
          value={form.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          placeholder="e.g. Bangkok, Thailand"
          required
          disabled={isSubmitting}
          error={errors.address}
        />

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Saving...' : 'Save Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditContactModal;
