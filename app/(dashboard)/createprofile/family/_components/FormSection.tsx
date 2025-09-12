"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  getFamilyAsync,
  createFamilyAsync,
  updateFamilyAsync,
  deleteFamilyAsync,
} from "@/app/store/features/profileSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { AddEditFamilyModal } from "./family-modals/AddEditFamilyModal";

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

interface IFormValues {
  family: IFamilyMember[];
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

type familyReferenceProps = {
  category: string;
  next_url: string;
  actionButton_label: string;
};

const FormSection = ({
  category = "family",
  next_url = "/createprofile/references",
  actionButton_label = "Member",
}) => {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const {
    family: familyList,
    loading: familyLoading,
    error: familyError,
  } = useAppSelector((state) => state.profile);
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { family: [] },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "family",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentFamilyMember, setCurrentFamilyMember] = useState<IFamilyMember>(
    { ...defaultFamilyMember }
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { loadStates, findCountryName, findStateName } = useMetaDataLoader();
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: 'add' as 'add' | 'edit',
  });

  console.log("Current Family Member:", fields);

  // Check if currentFamilyMember has any meaningful data
  const hasUnsavedFamilyData = () => {
    return !!(
      currentFamilyMember.firstname ||
      currentFamilyMember.lastname ||
      currentFamilyMember.dob ||
      currentFamilyMember.contactnumber ||
      currentFamilyMember.email ||
      currentFamilyMember.relationshiptoyou ||
      currentFamilyMember.address_line ||
      currentFamilyMember.city ||
      currentFamilyMember.zip ||
      currentFamilyMember.state_id ||
      currentFamilyMember.country_id
    );
  };

  // Handle input changes for the local family member form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "relationshiptoyou") {
      setCurrentFamilyMember((prev) => ({ ...prev, relationshiptoyou: value }));
    } else if (name === "country_id") {
      const countryId = parseInt(value, 10);
      setCurrentFamilyMember((prev) => ({
        ...prev,
        country_id: countryId,
        state_id: 0,
      }));
      loadStates(value);
    } else if (name === "state_id") {
      setCurrentFamilyMember((prev) => ({
        ...prev,
        state_id: parseInt(value, 10),
      }));
    } else {
      setCurrentFamilyMember((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch family members from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(
      getFamilyAsync({ profile_id: selectedProfileID, type: category })
    ).then((result: any) => {
      if (result.payload?.success && result.payload.data) {
        const formattedData = result.payload.data?.family?.map((item: any) => ({
          id: item.profile_family_reference_id,
          firstname: item.first_name,
          lastname: item.last_name,
          dob: item.date_of_birth,
          contactnumber: item.primary_phone,
          contactnumber_country: item.contactnumber_country, // Assuming this field exists
          email: item.email,
          relationshiptoyou: item.reference_type,
          address_line: item.address_line1,
          city: item.city,
          state_id: item.state_id,
          country_id: item.country_id,
          zip: item.zip,
        }));
        reset({ family: formattedData || [] });
      }
    });
  }, [selectedProfileID, dispatch, category, reset]);

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

  // Add or update family member in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    console.log(currentFamilyMember);
    // Validation: require all key fields
    if (
      !currentFamilyMember.firstname ||
      !currentFamilyMember.lastname ||
      !currentFamilyMember.address_line ||
      !currentFamilyMember.city ||
      !currentFamilyMember.state_id ||
      !currentFamilyMember.country_id ||
      !currentFamilyMember.zip ||
      !currentFamilyMember.dob ||
      !currentFamilyMember.contactnumber ||
      !currentFamilyMember.email ||
      !currentFamilyMember.relationshiptoyou
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (editIndex !== null) {
      // Update existing family member
      try {
        const result = await dispatch(
          updateFamilyAsync({
            ...currentFamilyMember,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(currentFamilyMember.id);
        }
      } catch (err: any) {
        setError(
          err.message || `Error updating ${actionButton_label.toLowerCase()}`
        );
      }
    } else {
      // Add new family member
      try {
        const result = await dispatch(
          createFamilyAsync({
            ...currentFamilyMember,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        console.log("Add family result:", result);
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result.data.profile_family_reference_id);
        }
      } catch (err: any) {
        setError(
          err.message || `Error adding ${actionButton_label.toLowerCase()}`
        );
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentFamilyMember, id: String(updateID) }
      : { ...currentFamilyMember };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentFamilyMember({ ...defaultFamilyMember });
  };

  // When editing, load the family member into local state
  const handleEdit = (index: number) => {
    setEditIndex(index);
    const familyToEdit = fields[index] as IFamilyMember;
    setCurrentFamilyMember(familyToEdit);
    setOpenModal({
      open: true,
      mode: 'edit',
    });
  };

  // Cancel edit operation
  const handleCancelEdit = () => {
    setEditIndex(null);
    setCurrentFamilyMember({ ...defaultFamilyMember });
    setOpenModal({ open: false, mode: 'add' });
  };

  // Remove family member from backend and local state
  const handleDelete = async (index: number) => {
    const member = fields[index];
    // if (!member || !member.id) {
    //   // fallback: just remove locally if no backend id
    //   remove(index);
    //   if (editIndex === index) {
    //     setEditIndex(null);
    //     setCurrentFamilyMember({ ...defaultFamilyMember });
    //   }
    //   return;
    // }
    try {
      const result = await dispatch(deleteFamilyAsync(member.id)).unwrap();
      if (result && result.status === "success") {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setError(
        err.message || `Error deleting ${actionButton_label.toLowerCase()}`
      );
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentFamilyMember({ ...defaultFamilyMember });
    }
  };

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async () => {
    if (hasUnsavedFamilyData()) {
      setShowConfirmation(true);
    } else {
      router.push(next_url);
    }
  };

  // Handle confirmation - save family member and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the family member to be saved, then move to next
      setTimeout(() => {
        router.push(next_url);
      }, 500);
    } catch (error) {
      console.error(`Error saving ${actionButton_label.toLowerCase()}:`, error);
      // Still move to next even if save fails
      router.push(next_url);
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentFamilyMember({ ...defaultFamilyMember });
    router.push(next_url);
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const closeAddModal = () => {
    setOpenModal({ open: false, mode: 'add' });
  };

  // Handle modal save
  const handleModalSave = async (familyData: IFamilyMember, mode: 'add' | 'edit') => {
    setCurrentFamilyMember(familyData);
    
    // Use existing handleAddOrUpdate logic
    const familyPayload = {
      profile_id: selectedProfileID,
      type: category,
      ...familyData,
    };

    if (mode === 'edit' && editIndex !== null) {
      // Update existing family member
      // Uncomment when update API is ready
      // try {
      //   const result = await dispatch(updateFamilyAsync(familyPayload)).unwrap();
      //   if (result && result.data.status === 'success') {
      //     proceedwithAddUpdate(result.data.profile_family_reference_id);
      //   }
      // } catch (err: any) {
      //   console.error("Error updating family member:", err);
      //   throw err;
      // }
      
      // For now, update locally
      proceedwithAddUpdate(familyData.id);
    } else {
      // Add new family member
      try {
        const result = await dispatch(createFamilyAsync(familyPayload)).unwrap();
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result.data.profile_family_reference_id);
        }
      } catch (err: any) {
        console.error("Error adding family member:", err);
        throw err;
      }
    }
  };

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
              Add {actionButton_label}
            </Button>
          </div>
        </div>
        {/* Loading/Error States */}
        {(loading || familyLoading) && (
          <div className="mb-2 text-blue-600">Loading...</div>
        )}
        {(error || familyError) && (
          <div className="mb-2 text-red-600">{error || familyError}</div>
        )}
        {/* Family List as Cards */}
        <div className="mb-6">
          {fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fields.map((field, index) => (
                <div
                  key={field._id || field.id || index}
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
                            handleEdit(index);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
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
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-gray-800">
                      {category === "family" ? "Member" : "Reference"} {index + 1}
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

                  {/* Family Member Content */}
                  <div>
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {/* {findPropertyTypeName(field.relationshiptoyou ?? -1) || 'Unknown'} */}
                      {field.relationshiptoyou}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Name */}
                    <div>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {field.firstname} {field.lastname}
                      </p>
                      {field.dob && (
                        <p className="text-gray-700 text-sm">
                          DOB: {field.dob}
                        </p>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-sm text-gray-800 font-medium truncate">
                          {field.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Phone:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.contactnumber || "N/A"}
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
                          {findStateName(field.state_id) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Country:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findCountryName(field.country_id) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">ZIP:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.zip || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    {field.address_line && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Address:</p>
                        <p className="text-sm text-gray-700">
                          {field.address_line}
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
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {actionButton_label.toLowerCase()}s added yet
              </h3>
              <p className="text-gray-500">
                Add your first {actionButton_label.toLowerCase()} using the form below
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
                <Label className="block text-gray-700 mb-2">First Name</Label>
                <Input
                  type="text"
                  name="firstname"
                  value={currentFamilyMember.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">Last Name</Label>
                <Input
                  type="text"
                  name="lastname"
                  value={currentFamilyMember.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="">
                <Label className="block text-gray-700 mb-2">
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  name="dob"
                  value={currentFamilyMember.dob}
                  onChange={handleInputChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">
                  Contact Number
                </Label>
                <CustomPhoneComponent
                  type="contactnumber"
                  changeHandler={handleInputChange}
                  bindValue={currentFamilyMember.contactnumber}
                  bindValue2={currentFamilyMember.contactnumber_country}
                  placeholder="Contact Number"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="">
                <Label className="block text-gray-700 mb-2">Email</Label>
                <Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={currentFamilyMember.email}
                  onChange={handleInputChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">
                  Relationship to you
                </Label>
                <MetadataSelectComponent
                  type={category}
                  name="relationshiptoyou"
                  value={currentFamilyMember.relationshiptoyou}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full md:mb-4">
                <Label className="block text-gray-700 mb-2">Address</Label>
                <Input
                  type="text"
                  name="address_line"
                  value={currentFamilyMember.address_line}
                  onChange={handleInputChange}
                  placeholder="Address Line"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="">
                <Label className="block text-gray-700 mb-2">Country</Label>
                <MetadataSelectComponent
                  type="country"
                  name="country_id"
                  value={currentFamilyMember.country_id}
                  onChange={handleInputChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">State</Label>
                <MetadataSelectComponent
                  type="state"
                  name="state_id"
                  value={currentFamilyMember.state_id}
                  onChange={handleInputChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">Zip</Label>
                <Input
                  type="text"
                  name="zip"
                  value={currentFamilyMember.zip}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">City</Label>
                <Input
                  type="text"
                  name="city"
                  value={currentFamilyMember.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"></div>
            <div className="w-full flex justify-end">
              <Button
                type="button"
                className="gray-btn mt-[20px] hover:bg-gray-400"
                onClick={handleAddOrUpdate}
                disabled={loading}
              >
                {editIndex !== null ? "Update" : "Add"} {actionButton_label}
              </Button>
            </div>
          </div>
          <div className="flex justify-between mt-[100px]">
            <div className="flex justify-start gap-4">
              <Button
                type="button"
                className="gray-btn hover:bg-gray-400"
                onClick={() => {
                  setCurrentFamilyMember({ ...defaultFamilyMember });
                  setEditIndex(null);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="gray-btn hover:bg-gray-400"
                onClick={() => router.push("/createprofile/references")}
              >
                Skip
              </Button>
            </div>

            <Button
              type="submit"
              className="yellow-btn hover:bg-orange-600"
              disabled={loading}
            >
              Continue
            </Button>
          </div>
        </form> */}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Save {actionButton_label} Changes?
              </h3>
              <p className="text-gray-600 mb-6">
                You have unsaved {actionButton_label.toLowerCase()} information.
                Would you like to save this family member before continuing to
                the next step?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmSaveAndContinue}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
                >
                  Save & Continue
                </button>
                <button
                  onClick={handleDiscardAndContinue}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  Discard & Continue
                </button>
                <button
                  onClick={handleCancelConfirmation}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <AddEditFamilyModal 
        open={openModal.open} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset editing state when modal is closed
            setEditIndex(null);
            setCurrentFamilyMember({ ...defaultFamilyMember });
          }
          setOpenModal(prev => ({ ...prev, open }));
        }}
        mode={openModal.mode}
        familyData={openModal.mode === 'edit' ? currentFamilyMember : undefined}
        onSave={handleModalSave}
        onCancel={handleCancelEdit}
        category={category}
      />
    </>
  );
};

export default FormSection;
