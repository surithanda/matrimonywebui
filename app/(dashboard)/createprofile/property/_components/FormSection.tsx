"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  getPropertiesAsync,
  createPropertyAsync,
  updatePropertyAsync,
  deletePropertyAsync,
} from "@/app/store/features/profileSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { IProfileProperty } from "@/app/models/Profile";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { AddPropertyModal } from "./property-modals/AddPropertyModal";

interface IPropertyFieldValue extends IProfileProperty {
  id?: string;
  _id?: string; // for react-hook-form
}

interface IFormValues {
  properties: IPropertyFieldValue[];
}

const defaultProperty: IPropertyFieldValue = {
  profile_id: null,
  property_type: -1,
  ownership_type: -1,
  property_value: null,
  property_description: "",
  property_address: "",
};

const FormSection = () => {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const { properties, loading, error } = useAppSelector(
    (state) => state.profile
  );
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { properties: [] },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "properties",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProperty, setCurrentProperty] = useState<IPropertyFieldValue>({
    ...defaultProperty,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { findPropertyTypeName, findOwnershipTypeName } = useMetaDataLoader();
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
  });

  // Handle input changes for the local property form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // console.log("handleInputChange called with name:", name, "value:", value);
    setCurrentProperty((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update property in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    console.log(
      "handleAddOrUpdate called with currentProperty:",
      currentProperty
    );
    // Validation: require all key fields
    if (
      !currentProperty.property_type ||
      !currentProperty.ownership_type ||
      !currentProperty.property_value ||
      !currentProperty.property_address
    ) {
      setLocalError("All fields except description are required.");
      return;
    }
    setLocalError(null);
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }
    if (editIndex !== null) {
      // Update existing property
      try {
        const result = await dispatch(
          updatePropertyAsync({
            ...currentProperty,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedWithAddUpdate(currentProperty.id);
        }
      } catch (err: any) {
        setLocalError(err.message || "Error updating property");
      }
    } else {
      // Add new property
      try {
        const result = await dispatch(
          createPropertyAsync({
            ...currentProperty,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.data.status === "success") {
          proceedWithAddUpdate(result.data.profile_property_id);
        }
      } catch (err: any) {
        setLocalError(err.message || "Error adding property");
      }
    }
  };

  const proceedWithAddUpdate = (updateID?: any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentProperty, id: updateID }
      : { ...currentProperty };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentProperty({ ...defaultProperty });
  };

  // Load property into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentProperty({ ...fields[index] });
  };

  // Remove property from backend and local state
  const handleDelete = async (index: number) => {
    const item = fields[index];
    if (!item || !item.id) {
      // fallback: just remove locally if no backend id
      remove(index);
      if (editIndex === index) {
        setEditIndex(null);
        setCurrentProperty({ ...defaultProperty });
      }
      return;
    }
    try {
      const result = await dispatch(deletePropertyAsync(item.id)).unwrap();
      if (result && result.status === "success") {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setLocalError(err.message || "Error deleting property");
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentProperty({ ...defaultProperty });
    }
  };

  // On submit, just continue (properties are already saved)
  const onSubmit = async () => {
    router.push("/createprofile/photos");
  };

  // Check if there are unsaved property data
  const hasUnsavedPropertyData = () => {
    return (
      currentProperty.property_type !== -1 ||
      currentProperty.ownership_type !== -1 ||
      currentProperty.property_value ||
      currentProperty.property_description ||
      currentProperty.property_address
    );
  };

  // Handle continue button click with confirmation
  const handleContinue = () => {
    if (hasUnsavedPropertyData()) {
      setShowConfirmation(true);
    } else {
      router.push("/createprofile/photos");
    }
  };

  // Handle confirmation actions
  const handleSaveAndContinue = async () => {
    await handleAddOrUpdate();
    setShowConfirmation(false);
    router.push("/createprofile/photos");
  };

  const handleDiscardAndContinue = () => {
    setCurrentProperty({ ...defaultProperty });
    setEditIndex(null);
    setShowConfirmation(false);
    router.push("/createprofile/photos");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Fetch properties from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getPropertiesAsync({ profile_id: selectedProfileID })).then(
      (result: any) => {
        if (result.payload?.data) {
          reset(result.payload.data);
        }
      }
    );
  }, [selectedProfileID, dispatch, reset]);

  const closeAddModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      add: false,
    }));
  };

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
            Add Property
          </Button>
        </div>
      </div>

              {/* Property List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">
                    Ownership
                  </th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">
                    Area
                  </th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">
                    Description
                  </th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">
                    Address
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
                      {findPropertyTypeName(item.property_type ?? -1)}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {findOwnershipTypeName(item.ownership_type ?? -1)}
                    </td>
                    <td className="px-3 py-2 text-sm">{item.property_value}</td>
                    <td className="px-3 py-2 text-sm">
                      {item.property_description}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {item.property_address}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          className="gray-btn px-2 py-1 text-xs"
                          onClick={() => handleEdit(index)}
                          disabled
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="red-btn px-2 py-1 text-xs"
                          onClick={() => handleDelete(index)}
                          disabled
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

      {/* <form
        className="w-full px-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {loading && <div className="mb-2 text-blue-600">Loading...</div>}
        {(localError || error) && (
          <div className="mb-2 text-red-600">{localError || error}</div>
        )}

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block text-gray-700 mb-2">Property Type</label>
              <MetadataSelectComponent
                type="property_type"
                value={currentProperty.property_type ?? -1}
                onChange={handleInputChange}
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">Ownership Type</label>
              <MetadataSelectComponent
                type="ownership_type"
                value={currentProperty.ownership_type ?? -1}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">
                Complete Address
              </label>
              <textarea
                name="property_address"
                placeholder="Complete Address"
                value={currentProperty.property_address}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={1}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block text-gray-700 mb-2">Size/Area</label>
              <input
                type="text"
                name="property_value"
                value={currentProperty.property_value ?? ""}
                onChange={handleInputChange}
                placeholder="Area in sq. ft."
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">Description</label>
              <input
                type="text"
                name="property_description"
                value={currentProperty.property_description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
              disabled={loading}
            >
              {editIndex !== null ? "Update Property" : "Add Property"}
            </Button>
          </div>
        </div>
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <Button
              type="button"
              className="gray-btn hover:bg-gray-400"
              onClick={() => {
                setCurrentProperty({ ...defaultProperty });
                setEditIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gray-btn hover:bg-gray-400"
              onClick={() => router.push("/createprofile/photos")}
            >
              Skip
            </Button>
          </div>
          <Button
            type="button"
            className="yellow-btn hover:bg-orange-600"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </form> */}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Unsaved Property Data
            </h3>
            <p className="text-gray-600 mb-6">
              You have unsaved property data. Would you like to save it before
              continuing?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDiscardAndContinue}
                className="px-4 py-2 text-red-600 bg-red-100 rounded hover:bg-red-200"
              >
                Discard & Continue
              </Button>
              <Button
                onClick={handleSaveAndContinue}
                className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
    <AddPropertyModal open={openModal.add} onOpenChange={closeAddModal} />
    </>
  );
};

export default FormSection;
