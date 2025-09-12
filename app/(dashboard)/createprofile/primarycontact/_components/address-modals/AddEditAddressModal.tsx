"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { IoIosClose, IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";

interface IAddress {
  id: string;
  city: string;
  state: number;
  country: number;
  zip: string;
  address_line1: string;
  address_line2: string;
  landmark1: string;
  landmark2: string;
  phone?: string;
  state_id?: number;
  country_id?: number;
}

interface AddEditAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  addressData?: IAddress;
  onSave: (address: IAddress, mode: 'add' | 'edit') => void;
  onCancel: () => void;
}

const defaultAddress: IAddress = {
  id: "",
  city: "",
  state: 0,
  country: 0,
  zip: "",
  address_line1: "",
  address_line2: "",
  landmark1: "",
  landmark2: "",
};

export const AddEditAddressModal: React.FC<AddEditAddressModalProps> = ({
  open,
  onOpenChange,
  mode,
  addressData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IAddress>(defaultAddress);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadStates } = useMetaDataLoader();

  // Initialize form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && addressData) {
        // Map the address data properly, ensuring we use the correct field names
        const mappedData = {
          ...addressData,
          country: addressData.country_id || addressData.country || 0,
          state: addressData.state_id || addressData.state || 0,
        };
        setFormData(mappedData);
        
        // Load states for the selected country in edit mode
        if (mappedData.country && mappedData.country !== 0) {
          loadStates(String(mappedData.country));
        }
      } else {
        setFormData(defaultAddress);
      }
      setIsFormDirty(false);
      setShowExitConfirmation(false);
    }
  }, [open, mode, addressData, loadStates]);

  // Check if form has meaningful data
  const hasFormData = () => {
    return !!(
      formData.city ||
      formData.state ||
      formData.country ||
      formData.zip ||
      formData.address_line1 ||
      formData.address_line2 ||
      formData.landmark1 ||
      formData.landmark2
    );
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof IAddress, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsFormDirty(true);
  };

  // Handle country change and load states
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryValue = Number(e.target.value);
    handleFieldChange('country', countryValue);
    handleFieldChange('state', 0); // Reset state when country changes
    loadStates(e.target.value);
  };

  // Validate form
  const isFormValid = () => {
    return !!(
      formData.address_line1.trim() &&
      formData.city.trim() &&
      formData.country &&
      formData.state &&
      formData.zip.trim()
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
      // Ensure we return the data with proper field mapping for both add and edit
      const dataToSave = {
        ...formData,
        country_id: formData.country,
        state_id: formData.state,
      };
      
      await onSave(dataToSave, mode);
      setIsFormDirty(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving address:', error);
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
    setFormData(defaultAddress);
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
                {mode === 'edit' ? 'Edit Address' : 'Add Address'}
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-3">
                {/* <Button
                  className="border-0 px-2 bg-white text-black hover:bg-transparent hover:text-orange-400 gap-1"
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  size={"sm"}
                >
                  <IoIosClose size={20} />
                  Cancel
                </Button> */}

                <Button
                  className="border-0 px-2 bg-white text-black hover:bg-transparent hover:text-orange-400 gap-1"
                  variant={"outline"}
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
            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <MetadataSelectComponent
                  type="country"
                  bindValue={formData.country || ""}
                  changeHandler={handleCountryChange}
                //   className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <MetadataSelectComponent
                  type="state"
                  bindValue={formData.state || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('state', Number(e.target.value))}
                //   className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* City and ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
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
                <Label htmlFor="zip">ZIP Code *</Label>
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

            {/* Address Lines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address1">Complete Address *</Label>
                <Input
                  id="address1"
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) => handleFieldChange('address_line1', e.target.value)}
                  placeholder="Enter complete address"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => handleFieldChange('address_line2', e.target.value)}
                  placeholder="Address line 2 (optional)"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Landmarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landmark1">Landmark 1</Label>
                <Input
                  id="landmark1"
                  type="text"
                  value={formData.landmark1}
                  onChange={(e) => handleFieldChange('landmark1', e.target.value)}
                  placeholder="Enter landmark"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="landmark2">Landmark 2</Label>
                <Input
                  id="landmark2"
                  type="text"
                  value={formData.landmark2}
                  onChange={(e) => handleFieldChange('landmark2', e.target.value)}
                  placeholder="Enter landmark"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          {/* <div className="flex justify-end gap-3 pt-4 border-t">
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
                mode === 'edit' ? 'Update Address' : 'Add Address'
              )}
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent className="max-w-md p-6 bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Save Address Changes?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You have unsaved address information. Would you like to save this address before closing?
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
