"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  getReferenceAsync,
  createReferenceAsync,
  updateReferenceAsync,
  deleteReferenceAsync,
} from "@/app/store/features/profileSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { IProfileFamilyReference } from "@/app/models/Profile";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { AddEditReferenceModal } from "./friend-reference-modals/AddEditReferenceModal";

interface IReferenceFieldValue extends IProfileFamilyReference {
  id?: string;
  _id?: string; // for react-hook-form
}

interface IFormValues {
  references: IReferenceFieldValue[];
}

const defaultReference: IReferenceFieldValue = {
  profile_id: 0,
  reference_type: 0,
  first_name: "",
  last_name: "",
  gender: 0,
  date_of_birth: new Date(),
  religion: 0,
  nationality: 0,
  caste: 0,
  marital_status: 0,
  highest_education: 0,
  address_line1: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  primary_phone: "",
  can_communicate: false,
  account_id: 0,
};

const FormSection = () => {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const {
    references: referenceList,
    loading: referenceLoading,
    error: referenceError,
  } = useAppSelector((state) => state.profile);
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { references: [] },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "references",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentReference, setCurrentReference] =
    useState<IReferenceFieldValue>({ ...defaultReference });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { loadStates, findCountryName, findStateName } = useMetaDataLoader();
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: 'add' as 'add' | 'edit',
  });

  // Handle input changes for the local reference form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "reference") {
      setCurrentReference((prev) => ({
        ...prev,
        reference_type: Number(value),
      }));
    } else if (name === "country") {
      setCurrentReference((prev) => ({ ...prev, country: value, state: "" }));
      loadStates(value);
    } else if (name === "date_of_birth") {
      setCurrentReference((prev) => ({
        ...prev,
        date_of_birth: new Date(value),
      }));
    } else if (name === "contactnumber") {
      setCurrentReference((prev) => ({ ...prev, primary_phone: value }));
    } else {
      setCurrentReference((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch references from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getReferenceAsync({ profile_id: selectedProfileID })).then(
      (result: any) => {
        if (result.payload?.data) {
          replace(result.payload.data);
        } else {
          replace([]);
        }
      }
    );
  }, [selectedProfileID, dispatch, replace]);

  // Add or update reference in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    // Validation: require all key fields
    if (
      !currentReference.first_name ||
      !currentReference.last_name ||
      !currentReference.address_line1 ||
      !currentReference.city ||
      !currentReference.state ||
      !currentReference.country ||
      !currentReference.zip ||
      !currentReference.date_of_birth ||
      !currentReference.primary_phone ||
      !currentReference.email ||
      !currentReference.reference_type
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (editIndex !== null) {
      // Update existing reference
      try {
        const result = await dispatch(
          updateReferenceAsync({
            ...currentReference,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(currentReference.id);
        }
      } catch (err: any) {
        setError(err.message || "Error updating reference");
      }
    } else {
      // Add new reference
      try {
        const result = await dispatch(
          createReferenceAsync({
            ...currentReference,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(result.profile_reference_id);
        }
      } catch (err: any) {
        setError(err.message || "Error adding reference");
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentReference, id: updateID }
      : { ...currentReference };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentReference({ ...defaultReference });
  };

  // Load reference into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    const referenceToEdit = fields[index];
    setCurrentReference({
      ...referenceToEdit,
      date_of_birth: new Date(referenceToEdit.date_of_birth), // Ensure it's a Date object
    });
  };

  // Remove reference from backend and local state
  const handleDelete = async (index: number) => {
    const member = fields[index];
    try {
      const result = await dispatch(deleteReferenceAsync(member.id)).unwrap();
      if (result && result.status === "success") {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setError(err.message || "Error deleting reference");
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentReference({ ...defaultReference });
    }
  };

  // On submit, just continue (references are already saved)
  const onSubmit = async () => {
    router.push("/createprofile/property");
  };

  // Check if there are unsaved reference data
  const hasUnsavedReferenceData = () => {
    return (
      currentReference.first_name ||
      currentReference.last_name ||
      currentReference.address_line1 ||
      currentReference.city ||
      currentReference.state ||
      currentReference.country ||
      currentReference.zip ||
      currentReference.primary_phone ||
      currentReference.email ||
      currentReference.reference_type !== 0
    );
  };

  // Handle continue button click with confirmation
  const handleContinue = () => {
    if (hasUnsavedReferenceData()) {
      setShowConfirmation(true);
    } else {
      router.push("/createprofile/property");
    }
  };

  // Handle confirmation actions
  const handleSaveAndContinue = async () => {
    await handleAddOrUpdate();
    setShowConfirmation(false);
    router.push("/createprofile/property");
  };

  const handleDiscardAndContinue = () => {
    setCurrentReference({ ...defaultReference });
    setEditIndex(null);
    setShowConfirmation(false);
    router.push("/createprofile/property");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const closeAddModal = () => {
    setOpenModal({
      open: false,
      mode: 'add',
    });
  };

  const handleModalSave = async (referenceData: IReferenceFieldValue, mode: 'add' | 'edit') => {
    if (!selectedProfileID) {
      setError("Profile ID not found.");
      return;
    }

    try {
      if (mode === 'edit' && editIndex !== null) {
        // Update existing reference
        const result = await dispatch(
          updateReferenceAsync({
            ...referenceData,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          update(editIndex, { ...referenceData, id: fields[editIndex].id });
          setEditIndex(null);
        }
      } else {
        // Add new reference
        const result = await dispatch(
          createReferenceAsync({
            ...referenceData,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          append({ ...referenceData, id: result.profile_reference_id });
        }
      }
      setOpenModal({ open: false, mode: 'add' });
    } catch (err: any) {
      setError(err.message || "Error saving reference");
    }
  };

  const handleModalCancel = () => {
    setOpenModal({ open: false, mode: 'add' });
    if (editIndex !== null) {
      setEditIndex(null);
    }
  };

  return (
    <>
    <section className="px-4 py-5 md:px-0 md:py-2 w-full">
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
            Add Friend & Reference
          </Button>
        </div>
      </div>
              {/* Loading/Error States */}
        {(loading || referenceLoading) && (
          <div className="mb-2 text-blue-600">Loading...</div>
        )}
        {(error || referenceError) && (
          <div className="mb-2 text-red-600">{error || referenceError}</div>
        )}
        {/* Reference List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    First Name
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Last Name
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    DOB
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Contact
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Email
                  </th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">
                    Relationship
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
                    key={item.id || item._id || index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-sm">{item.first_name}</td>
                    <td className="px-3 py-2 text-sm">{item.last_name}</td>
                    <td className="px-3 py-2 text-sm">
                      {new Date(item.date_of_birth).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-sm">{item.primary_phone}</td>
                    <td className="px-3 py-2 text-sm">{item.email}</td>
                    <td className="px-3 py-2 text-sm">{item.reference_type}</td>
                    <td className="px-3 py-2 text-sm">{item.address_line1}</td>
                    <td className="px-3 py-2 text-sm">{item.city}</td>
                    <td className="px-3 py-2 text-sm">{item.state}</td>
                    <td className="px-3 py-2 text-sm">{item.country}</td>
                    <td className="px-3 py-2 text-sm">{item.zip}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          className="gray-btn px-2 py-1 text-xs"
                          onClick={() => {
                            setEditIndex(index);
                            setOpenModal({ open: true, mode: 'edit' });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
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
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={currentReference.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={currentReference.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={
                  currentReference.date_of_birth instanceof Date
                    ? currentReference.date_of_birth.toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">Contact Number</label>
              <CustomPhoneComponent
                type="contactnumber"
                changeHandler={handleInputChange}
                bindValue={currentReference.primary_phone}
                placeholder="Contact Number"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={currentReference.email || ""}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">
                Relationship to you
              </label>
              <MetadataSelectComponent
                type="reference"
                value={String(currentReference.reference_type)}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address_line1"
                value={currentReference.address_line1}
                onChange={handleInputChange}
                placeholder="Address Line"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={currentReference.city}
                onChange={handleInputChange}
                placeholder="City"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">State</label>
              <MetadataSelectComponent
                type="state"
                value={currentReference.state}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">Country</label>
              <MetadataSelectComponent
                type="country"
                value={currentReference.country}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <label className="block text-gray-700 mb-2">Zip</label>
              <input
                type="text"
                name="zip"
                value={currentReference.zip}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
            >
              {editIndex !== null ? "Update Reference" : "Add Reference"}
            </Button>
          </div>
        </div>
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <Button
              type="button"
              className="gray-btn hover:bg-gray-400"
              onClick={() => {
                setCurrentReference({ ...defaultReference });
                setEditIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="gray-btn hover:bg-gray-400"
              onClick={() => router.push("/createprofile/property")}
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
              Unsaved Reference Data
            </h3>
            <p className="text-gray-600 mb-6">
              You have unsaved reference data. Would you like to save it before
              continuing?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscardAndContinue}
                className="px-4 py-2 text-red-600 bg-red-100 rounded hover:bg-red-200"
              >
                Discard & Continue
              </button>
              <button
                onClick={handleSaveAndContinue}
                className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
    <AddEditReferenceModal 
      open={openModal.open} 
      onOpenChange={(open) => setOpenModal({ open, mode: 'add' })}
      mode={openModal.mode}
      onSave={handleModalSave}
      onCancel={handleModalCancel}
      referenceData={openModal.mode === 'edit' && editIndex !== null ? fields[editIndex] : undefined}
    />
    </>
  );
};

export default FormSection;
