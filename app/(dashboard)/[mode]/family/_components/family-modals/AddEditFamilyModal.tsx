"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";

interface IFamilyMember {
  id: string;
  firstname: string;
  lastname: string;
  dob: string;
  contactnumber: string;
  contactnumber_country: string;
  email: string;
  relationshiptoyou: string;
  address_line: string;
  city: string;
  state_id: number;
  country_id: number;
  zip: string;
  _id?: string; // for react-hook-form
}

interface AddEditFamilyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  familyData?: IFamilyMember;
  onSave: (family: IFamilyMember, mode: "add" | "edit") => void;
  onCancel: () => void;
  category?: string;
}

const defaultFamilyMember: IFamilyMember = {
  id: "",
  firstname: "",
  lastname: "",
  dob: "",
  contactnumber: "",
  contactnumber_country: "",
  email: "",
  relationshiptoyou: "",
  address_line: "",
  city: "",
  state_id: 0,
  country_id: 0,
  zip: "",
};

export const AddEditFamilyModal: React.FC<AddEditFamilyModalProps> = ({
  open,
  onOpenChange,
  mode,
  familyData,
  onSave,
  onCancel,
  category = "family",
}) => {
  const [formData, setFormData] = useState<IFamilyMember>(defaultFamilyMember);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadStates } = useMetaDataLoader();

  // Initialize form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === "edit" && familyData) {
        setFormData(familyData);

        // Load states for the selected country in edit mode
        if (familyData.country_id && familyData.country_id !== 0) {
          loadStates(String(familyData.country_id));
        }
      } else {
        setFormData(defaultFamilyMember);
      }
      setIsFormDirty(false);
      setShowExitConfirmation(false);
    }
  }, [open, mode, familyData, loadStates]);

  // Check if form has meaningful data
  const hasFormData = () => {
    return !!(
      formData.firstname ||
      formData.lastname ||
      formData.dob ||
      formData.contactnumber ||
      formData.email ||
      formData.relationshiptoyou ||
      formData.address_line ||
      formData.city ||
      formData.zip ||
      formData.state_id ||
      formData.country_id
    );
  };

  // Handle form field changes
  const handleFieldChange = (
    field: keyof IFamilyMember,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsFormDirty(true);
  };

  // Handle phone number changes
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormDirty(true);
  };

  // Handle country change and load states
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryValue = Number(e.target.value);
    handleFieldChange("country_id", countryValue);
    handleFieldChange("state_id", 0); // Reset state when country changes
    loadStates(e.target.value);
  };

  // Validate form
  const isFormValid = () => {
    return !!(
      formData.firstname.trim() &&
      formData.lastname.trim() &&
      formData.relationshiptoyou
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
      console.error("Error saving family member:", error);
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
    setFormData(defaultFamilyMember);
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
      <Dialog
        open={open && !showExitConfirmation}
        onOpenChange={handleCloseAttempt}
      >
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                {mode === "edit"
                  ? `Edit ${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    }`
                  : `Add ${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    }`}{" "}
                {category.toLowerCase() === "family" ? "Member" : ""}
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
          {/* <DialogHeader className="pb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? `Edit ${category.charAt(0).toUpperCase() + category.slice(1)}` : `Add ${category.charAt(0).toUpperCase() + category.slice(1)}`} {category.toLowerCase() === 'family' ? 'Member' : ''}
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
          </DialogHeader> */}

          <div className="space-y-4 py-4 p-6">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={(e) =>
                    handleFieldChange("firstname", e.target.value)
                  }
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="lastname">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={(e) =>
                    handleFieldChange("lastname", e.target.value)
                  }
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Date of Birth and Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleFieldChange("dob", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="contactnumber">Contact Number</Label>
                <div className="mt-1">
                  <CustomPhoneComponent
                    type="contactnumber"
                    changeHandler={handlePhoneChange}
                    bindValue={formData.contactnumber}
                    bindValue2={formData.contactnumber_country}
                    disabled={false}
                  />
                </div>
              </div>
            </div>

            {/* Email and Relationship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="relationshiptoyou" className="mb-2">
                  Relationship to You <span className="text-red-500">*</span>
                </Label>
                <MetadataSelectComponent
                  type={category}
                  name="relationshiptoyou"
                  bindValue={formData.relationshiptoyou || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleFieldChange("relationshiptoyou", e.target.value)
                  }
                  //   className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    className="bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)] px-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 flex gap-10 align-self-stretch py-3 border rounded-lg mt-1"
                />
              </div>
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <MetadataSelectComponent
                  type="country"
                  bindValue={formData.country_id || ""}
                  changeHandler={handleCountryChange}
                  //   className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <MetadataSelectComponent
                  type="state"
                  bindValue={formData.state_id || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleFieldChange("state_id", Number(e.target.value))
                  }
                  //   className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Address and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  type="text"
                  value={formData.zip}
                  onChange={(e) => handleFieldChange("zip", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* ZIP Code */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address_line">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address_line"
                  type="text"
                  value={formData.address_line}
                  onChange={(e) =>
                    handleFieldChange("address_line", e.target.value)
                  }
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
                'Save'
              )}
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
      >
        <DialogContent className="max-w-md p-6 bg-white">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Save Family Member Changes?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">
              You have unsaved family member information. Would you like to save
              this family member before closing?
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
