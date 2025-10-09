"use client";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createEducationAsync,
  getEducationAsync,
  updateEducationAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BadgeCheckIcon,
} from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { AddEditEducationModal } from "./education-modals/AddEditEducationModal";
import Loader from "@/app/(dashboard)/_components/Loader";
import { Badge } from "@/components/ui/badge";

interface IEducation {
  id: string | number;
  profile_education_id?: string | number;
  education_level: number;
  year_completed: string | number;
  institution_name: string;
  address_line1: string;
  city: string;
  zip: string;
  field_of_study: number;
  state_id?: number;
  country_id?: number;
  isverified?: boolean;
}

interface IFormValues {
  educations: IEducation[];
}

const defaultEducation = {
  id: "",
  profile_education_id: "",
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
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: "add" as "add" | "edit",
  });
  const { loading } = useAppSelector((state) => state.profile);

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

      // console.log("fetch data", result);

      if (result?.success && result.data) {
        reset({ educations: result.data?.educations });
      }
    } catch (err: any) {
      console.error("Error getting profile education details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      fetchProfileData();
    }
  }, [selectedProfileID, fetchProfileData]);

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
    fetchProfileData(); // Refresh the list from server
  };

  // When editing, load the education into local state
  const handleEdit = (index: number) => {
    setEditIndex(index);
    const educationToEdit = fields[index] as IEducation;
    setCurrentEducation(educationToEdit);
    setOpenModal({
      open: true,
      mode: "edit",
    });
  };

  // Delete education
  const handleDelete = (index: number) => {
    remove(index);
    setEditIndex(null);
    setCurrentEducation({ ...defaultEducation });
  };

  // Cancel edit operation
  const handleCancelEdit = () => {
    setEditIndex(null);
    setCurrentEducation({ ...defaultEducation });
    setOpenModal({ open: false, mode: "add" });
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
    setOpenModal({ open: false, mode: "add" });
  };

  // Handle modal save
  const handleModalSave = async (
    educationData: IEducation,
    mode: "add" | "edit"
  ) => {
    setCurrentEducation(educationData);

    // Use existing handleAddOrUpdate logic
    const educationPayload = {
      profile_id: selectedProfileID,
      ...educationData,
    };

    if (mode === "edit" && editIndex !== null) {
      // Update existing education
      // Uncomment when update API is ready
      try {
        const result = await dispatch(
          updateEducationAsync(educationPayload)
        ).unwrap();
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result?.data?.profile_education_id);
        }
      } catch (err: any) {
        console.error("Error updating education:", err);
        throw err;
      }

      // For now, update locally
      // proceedwithAddUpdate(educationData.id);
    } else {
      // Add new education
      try {
        const result = await dispatch(
          createEducationAsync(educationPayload)
        ).unwrap();
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result?.data?.profile_education_id);
        }
      } catch (err: any) {
        console.error("Error adding education:", err);
        throw err;
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  console.log("fields", fields);

  return (
    <>
      <section className="px-4 py-5 md:px-0 md:py-2 w-full">
        {/* Education List as Cards */}
        <div className="mb-6">
          <div className="flex justify-end items-center mb-3 mt-3">
            <Button
              onClick={() =>
                setOpenModal({
                  open: true,
                  mode: "add",
                })
              }
              className=" gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0"
            >
              <FaPlus />
              Add Education
            </Button>
          </div>
          {fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          type="button"
                          onClick={() => {
                            if (!field?.isverified) {
                              handleEdit(index);
                              setActiveDropdown(null);
                            }
                          }}
                          disabled={field?.isverified}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-left transition-colors ${
                            field?.isverified
                              ? "cursor-not-allowed text-gray-400 bg-gray-50"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
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
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-gray-800">
                      Education {index + 1}
                      {editIndex === index && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                          Editing...
                        </span>
                      )}
                    </span>

                    <div className="ml-auto flex items-center gap-2 mr-9">
                      {/* Status */}
                      {field?.isverified ? (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500 text-white dark:bg-blue-600"
                        >
                          <BadgeCheckIcon size={14} />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-500 text-white dark:bg-red-600 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Education Content */}
                  <div className="space-y-3">
                    {/* Institution Name */}
                    <div>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {field?.institution_name}
                      </p>
                      {field.address_line1 && (
                        <p className="text-gray-700 text-sm">
                          {field?.address_line1}
                        </p>
                      )}
                    </div>

                    {/* Education Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Year:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field?.year_completed || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">City:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field?.city || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">State:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findStateName(Number(field?.state_id || 0)) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Country:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findCountryName(Number(field?.country_id || 0)) ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">ZIP:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field?.zip || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {fields.length === 0 && (
            <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-300">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No education records added yet
              </h3>
              <p className="text-gray-500">
                Add your first education record using the button above
              </p>
            </div>
          )}
        </div>
        {/* 
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
        </form> */}

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
      <AddEditEducationModal
        open={openModal.open}
        onOpenChange={(open) => {
          if (!open) {
            // Reset editing state when modal is closed
            setEditIndex(null);
            setCurrentEducation({ ...defaultEducation });
          }
          setOpenModal((prev) => ({ ...prev, open }));
        }}
        mode={openModal.mode}
        educationData={openModal.mode === "edit" ? currentEducation : undefined}
        onSave={handleModalSave}
        onCancel={handleCancelEdit}
      />
    </>
  );
};

export default FormSection;
