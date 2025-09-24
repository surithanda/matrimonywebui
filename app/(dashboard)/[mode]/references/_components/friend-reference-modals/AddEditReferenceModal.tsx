"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { IProfileFamilyReference } from "@/app/models/Profile";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";

interface IReferenceFieldValue extends IProfileFamilyReference {
  id?: string;
  _id?: string; // for react-hook-form
}

interface AddEditReferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  referenceData?: IReferenceFieldValue;
  onSave: (reference: IReferenceFieldValue, mode: 'add' | 'edit') => void;
  onCancel: () => void;
}

const defaultReference: IReferenceFieldValue = {
  profile_id: 0,
  reference_type: 0,
  first_name: "",
  last_name: "",
  gender: 0,
  date_of_birth: new Date(),
  religion: 0,
  nationality: 0,
  caste: 0,
  marital_status: 0,
  highest_education: 0,
  address_line1: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  primary_phone: "",
  can_communicate: false,
  account_id: 0,
};

export const AddEditReferenceModal: React.FC<AddEditReferenceModalProps> = ({
  open,
  onOpenChange,
  mode,
  referenceData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IReferenceFieldValue>(defaultReference);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadStates } = useMetaDataLoader();

  // Initialize form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && referenceData) {
        setFormData(referenceData);
        
        // Load states for the selected country in edit mode
        if (referenceData.country) {
          loadStates(String(referenceData.country));
        }
      } else {
        setFormData(defaultReference);
      }
      setIsFormDirty(false);
      setShowExitConfirmation(false);
    }
  }, [open, mode, referenceData, loadStates]);

  // Check if form has meaningful data
  const hasFormData = () => {
    return !!(
      formData.first_name ||
      formData.last_name ||
      formData.primary_phone ||
      formData.address_line1 ||
      formData.city ||
      formData.zip ||
      formData.state ||
      formData.country ||
      formData.reference_type
    );
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof IReferenceFieldValue, value: string | number | Date | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsFormDirty(true);
  };

  // Handle phone number changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsFormDirty(true);
  };

  // Handle country change and load states
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryValue = e.target.value;
    handleFieldChange('country', countryValue);
    handleFieldChange('state', ""); // Reset state when country changes
    loadStates(countryValue);
  };

  // Handle date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChange('date_of_birth', new Date(e.target.value));
  };

  // Validate form
  const isFormValid = () => {
    return !!(
      formData.first_name?.trim() &&
      formData.last_name?.trim() &&
      formData.reference_type
    );
  };

  // Handle save
  const handleSave = async () => {
    if (!isFormValid()) {
      // You can add toast notification here
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData, mode);
      setIsFormDirty(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close attempt
  const handleCloseAttempt = () => {
    if (isFormDirty && hasFormData()) {
      setShowExitConfirmation(true);
    } else {
      handleClose();
    }
  };

  // Handle actual close
  const handleClose = () => {
    setFormData(defaultReference);
    setIsFormDirty(false);
    setShowExitConfirmation(false);
    onOpenChange(false);
  };

  // Handle cancel button
  const handleCancel = () => {
    if (isFormDirty && hasFormData()) {
      setShowExitConfirmation(true);
    } else {
      onCancel();
      handleClose();
    }
  };

  // Handle exit confirmation actions
  const handleSaveAndExit = async () => {
    if (isFormValid()) {
      await handleSave();
      setShowExitConfirmation(false);
    }
  };

  const handleDiscardAndExit = () => {
    setShowExitConfirmation(false);
    handleClose();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  return (
    <>
      <Dialog open={open && !showExitConfirmation} onOpenChange={handleCloseAttempt}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white">
          <DialogHeader className="pb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Reference' : 'Add New Reference'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseAttempt}
                className="h-8 w-8 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleFieldChange('first_name', e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleFieldChange('last_name', e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Reference Type and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reference_type">Reference Type <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="reference"
                  name="reference"
                  bindValue={formData.reference_type || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('reference_type', Number(e.target.value))}
                  className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <MetadataSelectComponent
                  type="gender"
                  bindValue={formData.gender || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('gender', Number(e.target.value))}
                  className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Date of Birth and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth ? new Date(formData.date_of_birth).toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="primary_phone">Phone Number</Label>
                <div className="mt-1">
                  <CustomPhoneComponent
                    type="primary_phone"
                    changeHandler={handlePhoneChange}
                    bindValue={formData.primary_phone}
                    bindValue2=""
                    disabled={false}
                  />
                </div>
              </div>
            </div>

            {/* Religion and Nationality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="religion">Religion</Label>
                <MetadataSelectComponent
                  type="religion"
                  bindValue={formData.religion || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('religion', Number(e.target.value))}
                  className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <MetadataSelectComponent
                  type="nationality"
                  bindValue={formData.nationality || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('nationality', Number(e.target.value))}
                  className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="country"
                  bindValue={formData.country || ""}
                  changeHandler={handleCountryChange}
                  className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="state"
                  bindValue={formData.state || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('state', e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Address and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
                            <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  type="text"
                  value={formData.zip}
                  onChange={(e) => handleFieldChange('zip', e.target.value)}
                  placeholder="Enter ZIP code"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* ZIP Code and Can Communicate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                <Label htmlFor="address_line1">Address</Label>
                <Input
                  id="address_line1"
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) => handleFieldChange('address_line1', e.target.value)}
                  placeholder="Enter address"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="can_communicate"
                  checked={formData.can_communicate}
                  onChange={(e) => handleFieldChange('can_communicate', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor="can_communicate" className="text-sm text-gray-700">
                  Can Communicate
                </Label>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid() || isLoading}
              className="px-6 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'edit' ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                mode === 'edit' ? 'Update Reference' : 'Add Reference'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent className="max-w-md p-6 bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Save Reference Changes?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You have unsaved reference information. Would you like to save this reference before closing?
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={handleSaveAndExit}
                disabled={!isFormValid()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save & Close
              </Button>
              <Button
                onClick={handleDiscardAndExit}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Discard & Close
              </Button>
              <Button
                onClick={handleCancelExit}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
