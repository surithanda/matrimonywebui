"use client";
import React, { useState, useEffect, useContext, useCallback } from "react";
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
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Home,
} from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { AddEditPropertyModal } from "./property-modals/AddEditPropertyModal";
import Loader from "@/app/(dashboard)/_components/Loader";

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
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { findPropertyTypeName, findOwnershipTypeName } = useMetaDataLoader();
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: 'add' as 'add' | 'edit',
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

    const fetchProfileData = useCallback(async () => {
      const data = {
        profile_id: selectedProfileID,
      };
      try {
        dispatch(getPropertiesAsync({ profile_id: selectedProfileID })).then(
          (result: any) => {
            if (result.payload?.data) {
              reset(result.payload.data);
            }
          }
        );
      } catch (err: any) {
        console.error("Error getting property details:", err);
      }
    }, [dispatch, reset, selectedProfileID]);
  
  // Fetch properties from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    fetchProfileData();
  }, [selectedProfileID, fetchProfileData]);

  const closeAddModal = () => {
    setOpenModal({
      open: false,
      mode: 'add',
    });
  };

  const handleModalSave = async (propertyData: IPropertyFieldValue, mode: 'add' | 'edit') => {
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }

    try {
      if (mode === 'edit' && editIndex !== null) {
        // Update existing property
        const result = await dispatch(
          updatePropertyAsync({
            ...propertyData,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.data.status === "success") {
          update(editIndex, { ...propertyData, id: fields[editIndex].id });
          setEditIndex(null);
          fetchProfileData(); // Refresh the list from server
        }
      } else {
        // Add new property
        const result = await dispatch(
          createPropertyAsync({
            ...propertyData,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.data.status === "success") {
          append({ ...propertyData, id: result.data.profile_property_id });
          fetchProfileData(); // Refresh the list from server
        }
      }
      setOpenModal({ open: false, mode: 'add' });
    } catch (err: any) {
      setLocalError(err.message || "Error saving property");
    }
  };

  const handleModalCancel = () => {
    setOpenModal({ open: false, mode: 'add' });
    if (editIndex !== null) {
      setEditIndex(null);
    }
  };

    if (loading) {
      return (
        <Loader />
      );
    }

  return (
    <>
    <section className="px-2 md:px-0 md:py-2 w-full">
      <div className="mb-6">
        <div className="flex justify-end items-center mb-3 mt-3">
          <Button
            onClick={() =>
              setOpenModal({
                open: true,
                mode: 'add',
              })
            }
            className=" gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-shrink-0"
          >
            <FaPlus />
            Add Property
          </Button>
        </div>
      </div>

      {/* Property List as Cards */}
      <div className="mb-6">
        {fields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fields.map((field, index) => (
              <div
                key={field.id || field._id || index}
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
                          setEditIndex(index);
                          setOpenModal({ open: true, mode: 'edit' });
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
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-800">
                    Property {index + 1}
                    {editIndex === index && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                        Editing...
                      </span>
                    )}
                  </span>
                  <div className="ml-auto flex items-center gap-1 mr-9">
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">
                        Pending
                      </span>
                    </>
                  </div>
                </div>

                {/* Property Content */}
                <div className="space-y-3">
                  {/* Property Type and Ownership */}
                  <div>
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {findPropertyTypeName(field.property_type ?? -1) || 'Unknown Type'}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {findOwnershipTypeName(field.ownership_type ?? -1) || 'Unknown Ownership'}
                    </p>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Area:</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {field.property_value ? `${field.property_value} sq. ft.` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Ownership:</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {findOwnershipTypeName(field.ownership_type ?? -1) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {field.property_description && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Description:</p>
                      <p className="text-sm text-gray-700">
                        {field.property_description}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  {field.property_address && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Address:</p>
                      <p className="text-sm text-gray-700">
                        {field.property_address}
                      </p>
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
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties added yet
            </h3>
            <p className="text-gray-500">
              Add your first property using the form below
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
    <AddEditPropertyModal 
      open={openModal.open} 
      onOpenChange={(open) => setOpenModal({ open, mode: 'add' })}
      mode={openModal.mode}
      onSave={handleModalSave}
      onCancel={handleModalCancel}
      propertyData={openModal.mode === 'edit' && editIndex !== null ? fields[editIndex] : undefined}
    />
    </>
  );
};

export default FormSection;
