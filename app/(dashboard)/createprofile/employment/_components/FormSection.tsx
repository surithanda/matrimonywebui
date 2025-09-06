"use client";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createEmploymentAsync,
  getEmploymentAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IEmployment {
  id: string | number;
  institution_name: string;
  address_line1: string;
  city: string;
  state_id: number;
  country_id: number;
  zip: string;
  start_year: string;
  end_year: string;
  job_title_id: number;
  last_salary_drawn: string;
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
  end_year: "",
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
  const { loadStates, findCountryName, findStateName, findJobTitleName } =
    useMetaDataLoader();
  const { selectedProfileID } = useProfileContext();

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
  };

  // Load employment into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentEmployment(fields[index] as IEmployment);
  };

  // Remove employment and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentEmployment({ ...defaultEmployment });
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

  return (
    <section className="px-4 py-5 md:px-0 md:py-2 w-full">
      <form
        className="w-full px-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Employment List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Company
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Job Title
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Start
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    End
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Salary
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Address
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    City
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Zip
                  </th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-sm">
                      {item.institution_name}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {findJobTitleName(Number(item?.job_title_id || 0))}
                    </td>
                    <td className="px-3 py-2 text-sm">{item.start_year}</td>
                    <td className="px-3 py-2 text-sm">{item.end_year}</td>
                    <td className="px-3 py-2 text-sm">
                      {item.last_salary_drawn}
                    </td>
                    <td className="px-3 py-2 text-sm">{item.address_line1}</td>
                    <td className="px-3 py-2 text-sm">{item.city}</td>
                    <td className="px-3 py-2 text-sm">{item.zip}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          disabled
                          className="gray-btn px-2 py-1 text-xs"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled
                          className="red-btn px-2 py-1 text-xs"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Employment Form */}
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

        {/* Action Buttons */}
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
      </form>

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
  );
};

export default FormSection;
