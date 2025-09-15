"use client";
import {
  createAddressAsync,
  createPersonalProfileAsync,
  getAddressAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useProfileContext } from "@/app/utils/useProfileContext";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { AddEditAddressModal } from "@/app/(dashboard)/createprofile/primarycontact/_components/address-modals/AddEditAddressModal";

interface IAddress {
  id: string;
  city: string;
  state: number;
  country: number;
  zip: string;
  address_line1: string;
  address_line2: string;
  landmark1: string;
  landmark2: string;
  phone?: string;
  state_id?: number;
  country_id?: number;
}

interface IFormData {
  addresses: IAddress[];
}

const defaultAddress = {
  id: "",
  city: "",
  state: 0,
  country: 0,
  zip: "",
  address_line1: "",
  address_line2: "",
  // phone: "",
  landmark1: "",
  landmark2: "",
};

const FormSection = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const { selectedProfileID } = useProfileContext();
  const { control, handleSubmit, reset, register, watch } = useForm<IFormData>({
    defaultValues: { addresses: [] },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "addresses",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<IAddress>({
    ...defaultAddress,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { loadStates, formatWithMetaData, findCountryName, findStateName } =
    useMetaDataLoader();
  const { countryList } = useAppSelector((state) => state.metaData);
  const [openModal, setOpenModal] = useState({
    open: false,
    mode: 'add' as 'add' | 'edit',
  });

  // Check if currentAddress has any meaningful data
  const hasUnsavedAddressData = () => {
    return !!(
      currentAddress.city ||
      currentAddress.state ||
      currentAddress.country ||
      currentAddress.zip ||
      currentAddress.address_line1 ||
      currentAddress.address_line2 ||
      currentAddress.landmark1 ||
      currentAddress.landmark2
    );
  };

  const fetchProfileAddress = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getAddressAsync(data)).unwrap();

      if (result?.success && result.data) {
        reset({ addresses: result.data?.addresses });
      }
    } catch (err: any) {
      console.error("Error getting profile address details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      // loadStates();
      // if (countryList) {
      fetchProfileAddress();
      // }
    }
  }, [selectedProfileID, loadStates, fetchProfileAddress]);

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

  // When editing, load the address into local state
  const handleEdit = (index: number) => {
    setEditIndex(index);
    const addressToEdit = fields[index] as IAddress;
    // Ensure proper field mapping
    const mappedAddress = {
      ...addressToEdit,
      country: addressToEdit.country_id || addressToEdit.country || 0,
      state: addressToEdit.state_id || addressToEdit.state || 0,
    };
    setCurrentAddress(mappedAddress);
    setOpenModal({
      open: true,
      mode: 'edit',
    });
  };

  // Delete address
  const handleDelete = (index: number) => {
    remove(index);
    setEditIndex(null);
    setCurrentAddress({ ...defaultAddress });
  };

  // Cancel edit operation
  const handleCancelEdit = () => {
    setEditIndex(null);
    setCurrentAddress({ ...defaultAddress });
    setOpenModal({ open: false, mode: 'add' });
  };
  const handleAddOrUpdate = async () => {
    if (
      !currentAddress.city &&
      !currentAddress.state &&
      !currentAddress.country &&
      !currentAddress.zip &&
      !currentAddress.address_line1 &&
      !currentAddress.address_line2 &&
      // !currentAddress.phone &&
      !currentAddress.landmark1 &&
      !currentAddress.landmark2
    ) {
      // Prevent adding empty address
      return;
    }

    // proceedwithAddUpdate();
    // return;

    //update db and on positive response proceed ahead
    const addressData = {
      profile_id: selectedProfileID,
      address_type: 1,
      ...currentAddress,
    };
    console.log(addressData);
    // return;

    if (editIndex !== null) {
      console.log("I need to update data")
      return;
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
        const result = await dispatch(createAddressAsync(addressData)).unwrap();
        console.log(result);
        if (result && result.status === "success") {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_address_id);
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to add address.");
        console.error("Error submitting form:", err);
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of the address being added/updated
    const updatedAddress = updateID
      ? { ...currentAddress, id: String(updateID) }
      : { ...currentAddress };
    if (editIndex !== null) {
      update(editIndex, updatedAddress);
      setEditIndex(null);
    } else {
      append(updatedAddress);
    }
    setCurrentAddress({ ...defaultAddress });
    setOpenModal({ open: false, mode: 'add' });
  };

  // On submit, check for unsaved data and show confirmation if needed
const onSubmit = useCallback(
  async (data: IFormData) => {
    console.log("Form submitted:", data, hasUnsavedAddressData());
    if (hasUnsavedAddressData()) {
      setShowConfirmation(true);
    } else {
      moveToNext();
    }
  },
  [hasUnsavedAddressData] // ✅ dependencies
);

useEffect(() => {
  console.log("Effect triggered because onSubmit changed");
}, [onSubmit]);

  // Handle confirmation - save address and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the address to be saved, then move to next
      setTimeout(() => {
        moveToNext();
      }, 500);
    } catch (error) {
      console.error("Error saving address:", error);
      // Still move to next even if save fails
      moveToNext();
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentAddress({ ...defaultAddress });
    moveToNext();
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/primarycontact");
    router.push(nextRoute);
  };

  // Listen for continue event from top navigation
  useEffect(() => {
    const handleContinueEvent = () => {
      // Trigger form submission
      handleSubmit(onSubmit)();
    };

    window.addEventListener("profile-continue", handleContinueEvent);
    return () =>
      window.removeEventListener("profile-continue", handleContinueEvent);
  }, [handleSubmit, onSubmit]);

  const closeAddModal = () => {
    setOpenModal({ open: false, mode: 'add' });
  };

  // Handle modal save
  const handleModalSave = async (addressData: IAddress, mode: 'add' | 'edit') => {
    setCurrentAddress(addressData);
    
    // Use existing handleAddOrUpdate logic
    const addressPayload = {
      profile_id: selectedProfileID,
      address_type: 1,
      ...addressData,
    };

    if (mode === 'edit' && editIndex !== null) {
      // Update existing address
      // Uncomment when update API is ready
      // try {
      //   const result = await dispatch(updateAddressAsync(addressPayload)).unwrap();
      //   if (result && result.status === 'success') {
      //     proceedwithAddUpdate(result?.profile_address_id);
      //   }
      // } catch (err: any) {
      //   console.error("Error updating address:", err);
      //   throw err;
      // }
      
      // For now, update locally
      proceedwithAddUpdate(addressData.id);
    } else {
      // Add new address
      try {
        const result = await dispatch(createAddressAsync(addressPayload)).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(result?.profile_address_id);
        }
      } catch (err: any) {
        console.error("Error adding address:", err);
        throw err;
      }
    }
  };

  return (
    <>
      <section className="px-2 md:px-0 md:py-2 w-full">
        {/* Address List as Cards */}
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
              Add Address
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
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-gray-800">
                      Address {index + 1}
                      {editIndex === index && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                          Editing...
                        </span>
                      )}
                    </span>
                    <div className="ml-auto flex items-center gap-1 mr-9">
                      {/* {Math.random() > 0.5 ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        </>
                      ) : ( */}
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">
                          Pending
                        </span>
                      </>
                      {/* )} */}
                    </div>
                  </div>

                  {/* Address Content */}
                  <div className="space-y-3">
                    {/* Primary Address */}
                    <div>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {field.address_line1}
                      </p>
                      {field.address_line2 && (
                        <p className="text-gray-700 text-sm">
                          {field.address_line2}
                        </p>
                      )}
                    </div>

                    {/* Location Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">City:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {field.city || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">State:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findStateName(field.state_id ?? field.state ?? 0) ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Country:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findCountryName(
                            field.country_id ?? field.country ?? 0
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

                    {/* Landmarks */}
                    {(field.landmark1 || field.landmark2) && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Landmarks:</p>
                        {field.landmark1 && (
                          <p className="text-sm text-gray-700">
                            • {field.landmark1}
                          </p>
                        )}
                        {field.landmark2 && (
                          <p className="text-sm text-gray-700">
                            • {field.landmark2}
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
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No addresses added yet
              </h3>
              <p className="text-gray-500">
                Add your first address using the form below
              </p>
            </div>
          )}
        </div>
          {/* Address Form */}
        {/* <form className="w-full px-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Country</Label>
                <MetadataSelectComponent
                  type="country"
                  value={currentAddress.country}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      country: Number(e.target.value),
                    });
                    loadStates(e.target.value);
                  }}
                  dontUseID={true}
                 className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label>State</Label>
                <MetadataSelectComponent
                  type="state"
                  value={currentAddress?.state}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      state: Number(e.target.value),
                    });
                  }}
                 className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 mb-2">City</Label>
                <Input
                  type="text"
                  value={currentAddress.city}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      city: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label>Zip Code</Label>
                <Input
                  type="text"
                  value={currentAddress.zip}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      zip: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Complete Address</Label>
                <Input
                  value={currentAddress.address_line1}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      address_line1: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="block text-gray-700 mb-2">
                  Address Line 2
                </Label>
                <Input
                  type="text"
                  value={currentAddress.address_line2}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      address_line2: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 mb-2">Landmark 1</Label>
                <Input
                  type="text"
                  value={currentAddress.landmark1}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      landmark1: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="block text-gray-700 mb-2">Landmark 2</Label>
                <Input
                  type="text"
                  value={currentAddress.landmark2}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      landmark2: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>
            <div className="w-full flex justify-end gap-3">
              <Button
                type="button"
                className="gray-btn mt-[20px] hover:bg-gray-400"
                onClick={handleAddOrUpdate}
              >
                {editIndex !== null ? "Update Address" : "Add Address"}
              </Button>
              {(editIndex !== null ||
                currentAddress.city ||
                currentAddress.state ||
                currentAddress.country ||
                currentAddress.zip ||
                currentAddress.address_line1 ||
                currentAddress.address_line2 ||
                currentAddress.landmark1 ||
                currentAddress.landmark2) && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-[20px] border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </form>
        {/* Buttons */}
        {/* <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <Button
              type="button"
              className="gray-btn hover:bg-gray-400"
              onClick={() => reset({ addresses: [defaultAddress] })}
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
        </div> */}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Save Address Changes?
              </h3>
              <p className="text-gray-600 mb-6">
                You have unsaved address information. Would you like to save
                this address before continuing to the next step?
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
      <AddEditAddressModal 
        open={openModal.open} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset editing state when modal is closed
            setEditIndex(null);
            setCurrentAddress({ ...defaultAddress });
          }
          setOpenModal(prev => ({ ...prev, open }));
        }}
        mode={openModal.mode}
        addressData={openModal.mode === 'edit' ? currentAddress : undefined}
        onSave={handleModalSave}
        onCancel={handleCancelEdit}
      />
    </>
  );
};

export default FormSection;
