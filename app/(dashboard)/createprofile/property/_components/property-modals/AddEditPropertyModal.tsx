"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { IProfileProperty } from "@/app/models/Profile";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";

interface IPropertyFieldValue extends IProfileProperty {
  id?: string;
  _id?: string; // for react-hook-form
}

interface AddEditPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  propertyData?: IPropertyFieldValue;
  onSave: (property: IPropertyFieldValue, mode: 'add' | 'edit') => void;
  onCancel: () => void;
}

const defaultProperty: IPropertyFieldValue = {
  profile_id: null,
  property_type: -1,
  ownership_type: -1,
  property_value: null,
  property_description: "",
  property_address: "",
};

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  open,
  onOpenChange,
  mode,
  propertyData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IPropertyFieldValue>(defaultProperty);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && propertyData) {
        setFormData(propertyData);
      } else {
        setFormData(defaultProperty);
      }
      setIsFormDirty(false);
      setShowExitConfirmation(false);
    }
  }, [open, mode, propertyData]);

  // Check if form has meaningful data
  const hasFormData = () => {
    return !!(
      formData.property_type !== -1 ||
      formData.ownership_type !== -1 ||
      formData.property_value ||
      formData.property_description ||
      formData.property_address
    );
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof IPropertyFieldValue, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsFormDirty(true);
  };

  // Validate form
  const isFormValid = () => {
    return !!(
      formData.property_type !== -1 &&
      formData.ownership_type !== -1 &&
      formData.property_value &&
      formData.property_address
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
      console.error('Error saving property:', error);
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
    setFormData(defaultProperty);
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
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                {mode === 'edit' ? 'Edit Property' : 'Add Property'}
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-3">
                <Button
                    className="px-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 gap-2 rounded-md shadow-md transition-colors"
               variant={"default"}
                  size={"sm"}
                  onClick={handleSave}
                >
                  <IoIosSave size={20} />
                  Save
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="border-0 p-0 bg-transparent text-white hover:bg-transparent  hover:text-red-500"
                    variant="outline"
                  >
                    <IoMdCloseCircle size={20} />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 p-6">
            {/* Property Type and Ownership Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Property Type <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="property_type"
                  bindValue={formData.property_type?.toString() || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('property_type', Number(e.target.value))}
                  // className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="ownership_type">Ownership Type <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="ownership_type"
                  bindValue={formData.ownership_type?.toString() || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('ownership_type', Number(e.target.value))}
                  // className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Property Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_value">Property Value <span className="text-red-500">*</span></Label>
                <Input
                  id="property_value"
                  type="number"
                  value={formData.property_value || ""}
                  onChange={(e) => handleFieldChange('property_value', Number(e.target.value))}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            {/* Property Address */}
            <div>
              <Label htmlFor="property_address">Property Address <span className="text-red-500">*</span></Label>
              <Input
                id="property_address"
                type="text"
                value={formData.property_address}
                onChange={(e) => handleFieldChange('property_address', e.target.value)}
                className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            </div>


            {/* Property Description */}
            <div>
              <Label htmlFor="property_description">Property Description</Label>
              <Textarea
                id="property_description"
                value={formData.property_description}
                onChange={(e) => handleFieldChange('property_description', e.target.value)}
                rows={4}
                className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border border-gray-100 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent className="max-w-md p-6 bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Save Property Changes?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You have unsaved property information. Would you like to save this property before closing?
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
