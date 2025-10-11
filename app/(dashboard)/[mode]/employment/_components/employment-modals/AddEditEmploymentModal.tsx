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
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";

interface IEmployment {
  id: string | number;
  institution_name: string;
  address_line1: string;
  city: string;
  state_id: number;
  country_id: number;
  zip: string;
  start_year: string;
  end_year: string | null;
  job_title_id: number;
  last_salary_drawn: string;
}

interface AddEditEmploymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  employmentData?: IEmployment;
  onSave: (employment: IEmployment, mode: "add" | "edit") => Promise<void>;
  onCancel: () => void;
}

const defaultEmployment: IEmployment = {
  id: "",
  institution_name: "",
  address_line1: "",
  city: "",
  state_id: 0,
  country_id: 0,
  zip: "",
  start_year: "",
  end_year: null,
  job_title_id: 0,
  last_salary_drawn: "",
};

export const AddEditEmploymentModal: React.FC<AddEditEmploymentModalProps> = ({
  open,
  onOpenChange,
  mode,
  employmentData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IEmployment>(defaultEmployment);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadStates } = useMetaDataLoader();

  // Initialize form data when modal opens
  useEffect(() => {
    if (open) {
      if (mode === "edit" && employmentData) {
        setFormData(employmentData);

        // Load states for the selected country in edit mode
        if (employmentData.country_id && employmentData.country_id !== 0) {
          loadStates(String(employmentData.country_id));
        }
      } else {
        setFormData(defaultEmployment);
      }
      setIsFormDirty(false);
      setShowExitConfirmation(false);
    }
  }, [open, mode, employmentData, loadStates]);

  // Check if form has meaningful data
  const hasFormData = () => {
    return !!(
      formData.institution_name ||
      formData.address_line1 ||
      formData.city ||
      formData.zip ||
      formData.start_year ||
      formData.end_year ||
      formData.job_title_id ||
      formData.last_salary_drawn ||
      formData.state_id ||
      formData.country_id
    );
  };

  // Handle form field changes
  const handleFieldChange = (
    field: keyof IEmployment,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      formData.institution_name.trim() &&
      formData.job_title_id &&
      formData.start_year &&
      formData.city.trim() &&
      formData.country_id &&
      formData.state_id
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
      console.error("Error saving employment:", error);
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
    setFormData(defaultEmployment);
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
                {mode === "edit" ? "Edit Employment" : "Add Employment"}
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
            {/* Company Name and Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institution_name">Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="institution_name"
                  type="text"
                  value={formData.institution_name}
                  onChange={(e) =>
                    handleFieldChange("institution_name", e.target.value)
                  }
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="job_title">Job Title <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="job_title"
                  bindValue={formData.job_title_id || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleFieldChange("job_title_id", Number(e.target.value))
                  }
                  // className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Start Year and End Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_year">Start Year <span className="text-red-500">*</span></Label>
                <Input
                  id="start_year"
                  type="number"
                  value={formData.start_year}
                  onChange={(e) =>
                    handleFieldChange("start_year", e.target.value)
                  }
                  min="1900"
                  max="2030"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="end_year">End Year</Label>
                <Input
                  id="end_year"
                  type="number"
                  value={formData.end_year ?? ""}
                  onChange={(e) =>
                    handleFieldChange("end_year", e.target.value)
                  }
                  min="1900"
                  max="2030"
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Last Salary */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="last_salary_drawn">Annual Salary</Label>
                <Input
                  id="last_salary_drawn"
                  type="text"
                  value={formData.last_salary_drawn}
                  onChange={(e) =>
                    handleFieldChange("last_salary_drawn", e.target.value)
                  }
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="country"
                  bindValue={formData.country_id || ""}
                  changeHandler={handleCountryChange}
                  // className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <MetadataSelectComponent
                  type="state"
                  bindValue={formData.state_id || ""}
                  changeHandler={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleFieldChange("state_id", Number(e.target.value))
                  }
                  // className="w-full mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* City and ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP / PIN Code</Label>
                <Input
                  id="zip"
                  type="text"
                  value={formData.zip}
                  onChange={(e) => handleFieldChange("zip", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address_line1">Company Address</Label>
                <Input
                  id="address_line1"
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) =>
                    handleFieldChange("address_line1", e.target.value)
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
                mode === 'edit' ? 'Update Employment' : 'Add Employment'
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
              Save Employment Changes?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">
              You have unsaved employment information. Would you like to save
              this employment before closing?
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
