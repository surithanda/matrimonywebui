"use client";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createEmploymentAsync,
  getEmploymentAsync,
  updateEmploymentAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  BadgeCheckIcon,
} from "lucide-react";
import { AddEditEmploymentModal } from "./employment-modals/AddEditEmploymentModal";
import { AddEmploymentModal } from "./employment-modals/AddEmploymentModal";
import Loader from "@/app/(dashboard)/_components/Loader";
import { Badge } from "@/components/ui/badge";

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
  isverified?: boolean;
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

const FormSection = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<{
    employments: IEmployment[];
  }>({ defaultValues: { employments: [] } });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "employments",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentEmployment, setCurrentEmployment] = useState<IEmployment>({
    ...defaultEmployment,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { loadStates, findCountryName, findStateName, findJobTitleName } =
    useMetaDataLoader();
  const { selectedProfileID } = useProfileContext();
  const { loading } = useAppSelector((state) => state.profile);
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: "add" as "add" | "edit",
  });

  // Check if currentEmployment has any meaningful data
  const hasUnsavedEmploymentData = () => {
    return !!(
      currentEmployment.institution_name ||
      currentEmployment.address_line1 ||
      currentEmployment.city ||
      currentEmployment.zip ||
      currentEmployment.start_year ||
      currentEmployment.end_year ||
      currentEmployment.job_title_id ||
      currentEmployment.last_salary_drawn ||
      currentEmployment.state_id ||
      currentEmployment.country_id
    );
  };

  const fetchProfileData = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getEmploymentAsync(data)).unwrap();

      if (result?.success && result.data) {
        reset({ employments: result.data?.employments });
      }
    } catch (err: any) {
      console.error("Error getting profile employment details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      loadStates();
      fetchProfileData();
    }
  }, [selectedProfileID, fetchProfileData, loadStates]);

  // Handle input changes for the local employment form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentEmployment((prev) => ({ ...prev, [name]: value }));
    if (name === "country") loadStates(e.target.value);
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentEmployment((prev) => ({
      ...prev,
      job_title_id: Number(e.target.value),
    }));
  };

  // Add or update employment in the field array
  const handleAddOrUpdate = async () => {
    // Prevent adding empty employment
    if (
      !currentEmployment.institution_name &&
      !currentEmployment.job_title_id &&
      !currentEmployment.start_year &&
      !currentEmployment.end_year
    ) {
      return;
    }

    //update db and on positive response proceed ahead
    const sectionData = {
      profile_id: selectedProfileID,
      ...currentEmployment,
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
          createEmploymentAsync(sectionData)
        ).unwrap();
        console.log(result);
        if (result && result.status === "success") {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_employment_id);
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
      ? { ...currentEmployment, id: String(updateID) }
      : { ...currentEmployment };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }

    setCurrentEmployment({ ...defaultEmployment });
    fetchProfileData(); // Refresh the list from server
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

  // When editing, load the employment into local state
  const handleEdit = (index: number) => {
    setEditIndex(index);
    const employmentToEdit = fields[index] as IEmployment;
    setCurrentEmployment(employmentToEdit);
    setOpenModal({
      open: true,
      mode: "edit",
    });
  };

  // Remove employment and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentEmployment({ ...defaultEmployment });
    }
  };

  // Cancel edit operation
  const handleCancelEdit = () => {
    setEditIndex(null);
    setCurrentEmployment({ ...defaultEmployment });
    setOpenModal({ open: false, mode: "add" });
  };

  // Handle modal save
  const handleModalSave = async (
    employmentData: IEmployment,
    mode: "add" | "edit"
  ) => {
    setCurrentEmployment(employmentData);

    // Use existing handleAddOrUpdate logic
    const sectionData = {
      profile_id: selectedProfileID,
      ...employmentData,
    };

    if (mode === "edit" && editIndex !== null) {
      // Update existing employment
      try {
        const result = await dispatch(
          updateEmploymentAsync(sectionData)
        ).unwrap();
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result?.data?.profile_employment_id);
        }
      } catch (err: any) {
        console.error("Error updating employment:", err);
        throw err;
      }

      // For now, update locally
      // proceedwithAddUpdate(employmentData.id);
    } else {
      // Add new employment
      try {
        const result = await dispatch(
          createEmploymentAsync(sectionData)
        ).unwrap();
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result?.data?.profile_employment_id);
        }
      } catch (err: any) {
        console.error("Error adding employment:", err);
        throw err;
      }
    }
  };

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async () => {
    if (hasUnsavedEmploymentData()) {
      setShowConfirmation(true);
    } else {
      router.push("/createprofile/hobbies");
    }
  };

  // Handle confirmation - save employment and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the employment to be saved, then move to next
      setTimeout(() => {
        router.push("/createprofile/hobbies");
      }, 500);
    } catch (error) {
      console.error("Error saving employment:", error);
      // Still move to next even if save fails
      router.push("/createprofile/hobbies");
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentEmployment({ ...defaultEmployment });
    router.push("/createprofile/hobbies");
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="px-4 py-5 md:px-0 md:py-2 w-full">
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
              Add Employment
            </Button>
          </div>
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

                  {/* Employment Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-gray-800">
                      Employment {index + 1}
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
                          className="bg-yellow-500 text-white dark:bg-yellow-600 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Employment Content */}
                  <div className="space-y-3">
                    {/* Company Name */}
                    <div>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {field.institution_name || "N/A"}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {findJobTitleName(Number(field?.job_title_id || 0)) ||
                          "N/A"}
                      </p>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Duration:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.start_year || "N/A"} -{" "}
                          {field.end_year || "Present"}
                        </span>
                      </div>
                      {field.last_salary_drawn && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Last Salary:
                          </span>
                          <span className="text-sm text-gray-800 font-medium">
                            {field.last_salary_drawn}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">City:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.city || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">State:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findStateName(field.state_id || 0) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Country:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findCountryName(field.country_id || 0) || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    {field.address_line1 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Address:</p>
                        <p className="text-sm text-gray-700">
                          {field.address_line1}
                        </p>
                        {field.zip && (
                          <p className="text-sm text-gray-700">
                            ZIP: {field.zip}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {fields.length === 0 && (
            <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-300">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No employment records added yet
              </h3>
              <p className="text-gray-500">
                Add your first employment record using the button above
              </p>
            </div>
          )}
        </div>

        {/* <form
          className="w-full px-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="">
                <Label>Company Name</Label>
                <Input
                  type="text"
                  name="institution_name"
                  value={currentEmployment.institution_name}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="account-input-field stretch w-full"
                />
              </div>
              <div className="">
                <Label>Job Title</Label>
                <MetadataSelectComponent
                  type="job_title"
                  value={currentEmployment.job_title_id}
                  onChange={handleJobTitleChange}
                  name="job_title_id"
                  className="account-input-field w-full stretch"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
              <div className="">
                <Label>Start Year</Label>
                <Input
                  type="number"
                  name="start_year"
                  value={currentEmployment.start_year}
                  onChange={handleInputChange}
                  placeholder="Start Year"
                  className="account-input-field stretch w-full"
                />
              </div>
              <div className="">
                <Label>End Year</Label>
                <Input
                  type="number"
                  name="end_year"
                  value={currentEmployment.end_year}
                  onChange={handleInputChange}
                  placeholder="End Year"
                  className="account-input-field stretch w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
              <div className="">
                <Label>Last Salary Drawn</Label>
                <Input
                  type="text"
                  name="last_salary_drawn"
                  value={currentEmployment.last_salary_drawn}
                  onChange={handleInputChange}
                  placeholder="Last Salary"
                  className="account-input-field stretch w-full"
                />
              </div>
              <div className="">
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address_line1"
                  value={currentEmployment.address_line1}
                  onChange={handleInputChange}
                  placeholder="Company Address"
                  className="account-input-field stretch w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Country</Label>
                <MetadataSelectComponent
                  type="country"
                  name="country_id"
                  value={currentEmployment.country_id || ""}
                  onChange={handleInputChange}
                  className="account-input-field w-full "
                />
              </div>

              <div>
                <Label>State</Label>
                <MetadataSelectComponent
                  type="state"
                  name="state_id"
                  value={currentEmployment.state_id || ""}
                  onChange={handleInputChange}
                  className="account-input-field w-full "
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={currentEmployment.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="account-input-field w-full"
                />
              </div>

              <div>
                <Label>Zipcode</Label>
                <input
                  type="text"
                  name="zip"
                  value={currentEmployment.zip}
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
                {editIndex !== null ? "Update Employment" : "Add Employment"}
              </Button>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <div className="flex justify-start gap-4">
              <Button
                type="button"
                className="gray-btn hover:bg-gray-400"
                onClick={() => {
                  setCurrentEmployment({ ...defaultEmployment });
                  setEditIndex(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="gray-btn hover:bg-gray-400"
                onClick={() => router.push("/createprofile/hobbies")}
              >
                Skip
              </Button>
            </div>
            <Button type="submit" className="yellow-btn hover:bg-orange-600">
              Continue
            </Button>
          </div>
        </form> */}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Save Employment Changes?
              </h3>
              <p className="text-gray-600 mb-6">
                You have unsaved employment information. Would you like to save
                this employment record before continuing to the next step?
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
      <AddEditEmploymentModal
        open={openModal.open}
        onOpenChange={(open) => {
          if (!open) {
            // Reset editing state when modal is closed
            setEditIndex(null);
            setCurrentEmployment({ ...defaultEmployment });
          }
          setOpenModal((prev) => ({ ...prev, open }));
        }}
        mode={openModal.mode}
        employmentData={
          openModal.mode === "edit" ? currentEmployment : undefined
        }
        onSave={handleModalSave}
        onCancel={handleCancelEdit}
      />
    </>
  );
};

export default FormSection;
