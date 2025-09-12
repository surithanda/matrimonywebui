"use client";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createEducationAsync,
  getEducationAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { AddEducationModal } from "./education-modals/AddEducationModal";
import { AlertCircle, Edit2, MapPin, MoreVertical, Trash2 } from "lucide-react";
import { findValueType } from "framer-motion";

interface IEducation {
  id: string | number;
  education_level: number;
  year_completed: string | number;
  institution_name: string;
  address_line1: string;
  city: string;
  zip: string;
  field_of_study: number;
  state_id?: number;
  country_id?: number;
}

interface IFormValues {
  educations: IEducation[];
}

const defaultEducation = {
  id: "",
  education_level: 1,
  year_completed: "",
  institution_name: "",
  address_line1: "",
  city: "",
  state_id: 0,
  country_id: 0,
  zip: "",
  field_of_study: 1,
};

const FormSection = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { educations: [] },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "educations",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentEducation, setCurrentEducation] = useState<IEducation>({
    ...defaultEducation,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { loadStates, formatWithMetaData, findCountryName, findStateName } =
    useMetaDataLoader();
  const { selectedProfileID } = useProfileContext();
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
  });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Check if currentEducation has any meaningful data
  const hasUnsavedEducationData = () => {
    return !!(
      currentEducation.institution_name ||
      currentEducation.year_completed ||
      currentEducation.education_level !== 1 ||
      currentEducation.field_of_study !== 1 ||
      currentEducation.address_line1 ||
      currentEducation.city ||
      currentEducation.zip ||
      currentEducation.state_id ||
      currentEducation.country_id
    );
  };

  const fetchProfileData = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getEducationAsync(data)).unwrap();

      console.log("fetch data", result);

      if (result?.success && result.data) {
        reset({ educations: result.data?.educations });
      }
    } catch (err: any) {
      console.error("Error getting profile address details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      loadStates();
      fetchProfileData();
    }
  }, [selectedProfileID, fetchProfileData, loadStates]);

  // Handle input changes for the local education form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(e.target.value, 10);
    setCurrentEducation((prev) => ({
      ...prev,
      country_id: countryId,
      state_id: 0,
    })); // Reset state when country changes
    loadStates(countryId.toString());
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentEducation((prev) => ({
      ...prev,
      state_id: parseInt(e.target.value, 10),
    }));
  };

  // Add or update education in the field array
  const handleAddOrUpdate = async () => {
    // Prevent adding empty education
    if (
      !currentEducation.institution_name &&
      !currentEducation.year_completed
    ) {
      return;
    }

    //update db and on positive response proceed ahead
    const sectionData = {
      profile_id: selectedProfileID,
      ...currentEducation,
    };
    console.log(sectionData);

    if (editIndex !== null) {
      //update
      // try {
      //   const result = await dispatch(updateAddressAsync(addressData)).unwrap();
      //   if (result && result.status === 'success') {
      //     // toast.success("Address updated successfully!");
      //     proceedwithAddUpdate();
      //   }
      // } catch (err: any) {
      //   // toast.error(err.message || "Failed to update address.");
      //   console.error("Error submitting form:", err);
      // }
    } else {
      //add
      try {
        const result = await dispatch(
          createEducationAsync(sectionData)
        ).unwrap();
        console.log("result", result);
        if (result && result.status === "success") {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_education_id);
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to add address.");
        console.error("Error submitting form:", err);
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentEducation, id: String(updateID) }
      : { ...currentEducation };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }

    setCurrentEducation({ ...defaultEducation });
  };

  // Load education into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentEducation({ ...fields[index] });
  };

  // Remove education and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentEducation({ ...defaultEducation });
    }
  };

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async () => {
    if (hasUnsavedEducationData()) {
      setShowConfirmation(true);
    } else {
      moveToNext();
    }
  };

  // Handle confirmation - save education and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the education to be saved, then move to next
      setTimeout(() => {
        moveToNext();
      }, 500);
    } catch (error) {
      console.error("Error saving education:", error);
      // Still move to next even if save fails
      moveToNext();
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentEducation({ ...defaultEducation });
    moveToNext();
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/education");
    router.push(nextRoute);
  };

  const closeAddModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      add: false,
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setActiveDropdown(null);
    };

    if (activeDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);
  

  return (
    <>
      <section className="px-4 py-5 md:px-0 md:py-2 w-full">
        <div className="mb-6">
          <div className="flex justify-end items-center mb-3 mt-3">
            <Button
              onClick={() =>
                setOpenModal((prev) => ({
                  ...prev,
                  add: true,
                }))
              }
              className=" gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0"
            >
              <FaPlus />
              Add Education
            </Button>
          </div>
        </div>
        {/* Education List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`bg-white mx-w-md border rounded-xl shadow-md p-6 relative transition-all duration-300 transform hover:scale-[1] hover:shadow-xl ${
                    editIndex === index
                      ? "border-orange-500 border-2 shadow-orange-100 bg-orange-50/30"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {/* Three-dots menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === index ? null : index
                        )
                      }
                      className="p-2 hover:bg-gray-100 hover:scale-110 rounded-full transition-all duration-200 hover:shadow-md"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === index && (
                      <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                        <button
                          disabled
                          type="button"
                          onClick={() => {
                            handleEdit(index);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          disabled
                          type="button"
                          onClick={() => {
                            handleDelete(index);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Verification Status */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {field.institution_name} ({field.year_completed})
                      {editIndex === index && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                          Editing...
                        </span>
                      )}
                    </span>
                    <div className="ml-auto flex items-center gap-1 mr-9">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Address Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {field.address_line1}
                      </p>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Filed of Study:
                        </span>
                        <span className="text-sm text-gray-800 font-medium">
                  
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">City:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.city || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">State:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findStateName(
                            field.state_id ?? field.state_id ?? 0
                          ) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Country:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findCountryName(
                            field.country_id ?? field.country_id ?? 0
                          ) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">ZIP:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.zip || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          className="w-full px-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <Label>Institution Name</Label>
                <Input
                  type="text"
                  name="institution_name"
                  value={currentEducation.institution_name}
                  onChange={handleInputChange}
                  placeholder="Institution Name"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="w-full">
                <Label>Year Completed</Label>
                <Input
                  type="number"
                  name="year_completed"
                  value={currentEducation.year_completed}
                  onChange={handleInputChange}
                  placeholder="Year of completion"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address_line1"
                  value={currentEducation.address_line1}
                  onChange={handleInputChange}
                  placeholder="Institution Address"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="w-full">
                <Label>Field of Study</Label>
                <MetadataSelectComponent
                  type="field_of_study"
                  value={currentEducation.field_of_study}
                  onChange={handleInputChange}
                  className="account-input-field w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Country</Label>
                <MetadataSelectComponent
                  type="country"
                  value={currentEducation.country_id || ""}
                  onChange={handleCountryChange}
                  className="account-input-field w-full "
                />
              </div>
              <div>
                <Label>State</Label>
                <MetadataSelectComponent
                  type="state"
                  value={currentEducation.state_id || ""}
                  onChange={handleStateChange}
                  className="account-input-field w-full "
                />
              </div>

              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={currentEducation.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="account-input-field w-full"
                />
              </div>
              <div>
                <Label>Zipcode</Label>
                <Input
                  type="text"
                  name="zip"
                  value={currentEducation.zip}
                  onChange={handleInputChange}
                  placeholder="ZIP"
                  className="account-input-field w-full"
                />
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button
                type="button"
                className="gray-btn mt-[20px] hover:bg-gray-400"
                onClick={handleAddOrUpdate}
              >
                {editIndex !== null ? "Update Education" : "Add Education"}
              </Button>
            </div>
          </div>
          <Button type="submit" className="yellow-btn hover:bg-orange-600">
            Continue
          </Button>
        </form>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Save Education Changes?
              </h3>
              <p className="text-gray-600 mb-6">
                You have unsaved education information. Would you like to save
                this education record before continuing to the next step?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmSaveAndContinue}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
                >
                  Save & Continue
                </Button>
                <Button
                  onClick={handleDiscardAndContinue}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Discard & Continue
                </Button>
                <Button
                  onClick={handleCancelConfirmation}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
      <AddEducationModal open={openModal.add} onOpenChange={closeAddModal} />
    </>
  );
};

export default FormSection;
