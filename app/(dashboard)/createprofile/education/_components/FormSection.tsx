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
        console.log(result);
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

  return (
    <section className="px-4 py-5 md:px-0 md:py-2 w-full">
      <form
        className="w-full px-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Education List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Institution
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Year
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Address
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    City
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    State
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Country
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
                    <td className="px-3 py-2 text-sm">{item.year_completed}</td>
                    <td className="px-3 py-2 text-sm">{item.address_line1}</td>
                    <td className="px-3 py-2 text-sm">{item.city}</td>
                    <td className="px-3 py-2 text-sm">
                      {findStateName(Number(item?.state_id || 0))}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {findCountryName(Number(item?.country_id || 0))}
                    </td>
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

        {/* Education Form */}
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

          {/* Address Fields */}
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

            {/* field of study */}
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

          {/* City, State, Country, Zip */}
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
        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex justify-start gap-4">
            <Button
              type="button"
              className="gray-btn hover:bg-gray-400"
              onClick={() => {
                setCurrentEducation({ ...defaultEducation });
                setEditIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={moveToNext}
              className="gray-btn hover:bg-gray-400"
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
  );
};

export default FormSection;
