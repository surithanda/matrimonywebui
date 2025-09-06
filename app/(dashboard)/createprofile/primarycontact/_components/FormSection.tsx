"use client";
import { createAddressAsync, createPersonalProfileAsync, getAddressAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useProfileContext } from "@/app/utils/useProfileContext";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { MoreVertical, Edit2, Trash2, CheckCircle, AlertCircle, MapPin } from "lucide-react";

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
  id:"",
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
    defaultValues: { addresses: [] }
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "addresses"
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<IAddress>({ ...defaultAddress });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const {loadStates, formatWithMetaData, findCountryName, findStateName} = useMetaDataLoader();
  const {countryList} = useAppSelector((state) => state.metaData);

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
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // When editing, load the address into local state
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentAddress(fields[index] as IAddress);
  };

  // Delete address
  const handleDelete = (index: number) => {
    remove(index);
    setEditIndex(null);
    setCurrentAddress({ ...defaultAddress });
  };
  const handleAddOrUpdate = async() => {
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
      ...currentAddress
    };
    console.log(addressData)
    // return;
    
    if (editIndex !== null) { //update
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
    } else { //add
      try {
        const result = await dispatch(createAddressAsync(addressData)).unwrap();
        console.log(result)
        if (result && result.status === 'success') {
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
        const updatedAddress = updateID ? { ...currentAddress, id: String(updateID) } : { ...currentAddress };
    if (editIndex !== null) {
      update(editIndex, updatedAddress);
      setEditIndex(null);
    } else {
      append(updatedAddress);
    }
    setCurrentAddress({ ...defaultAddress });
  }

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async (data: IFormData) => {
    console.log("Form submitted:", data, hasUnsavedAddressData());
    if (hasUnsavedAddressData()) {
      setShowConfirmation(true);
    } else {
      moveToNext();
    }
  };

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
      console.error('Error saving address:', error);
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

  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Address List as Cards */}
        <div className="mb-6">
          {fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((item, index) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative">
                  {/* Three-dots menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                    <span className="font-semibold text-gray-800">Address {index + 1}</span>
                    <div className="ml-auto flex items-center gap-1">
                      {Math.random() > 0.5 ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">Pending</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Address Content */}
                  <div className="space-y-3">
                    {/* Primary Address */}
                    <div>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {item.address_line1}
                      </p>
                      {item.address_line2 && (
                        <p className="text-gray-700 text-sm">
                          {item.address_line2}
                        </p>
                      )}
                    </div>

                    {/* Location Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">City:</span>
                        <span className="text-sm text-gray-800 font-medium">{item.city || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">State:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findStateName(item.state_id ?? item.state ?? 0) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Country:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {findCountryName(item.country_id ?? item.country ?? 0) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">ZIP:</span>
                        <span className="text-sm text-gray-800 font-medium">{item.zip || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Landmarks */}
                    {(item.landmark1 || item.landmark2) && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Landmarks:</p>
                        {item.landmark1 && (
                          <p className="text-sm text-gray-700">• {item.landmark1}</p>
                        )}
                        {item.landmark2 && (
                          <p className="text-sm text-gray-700">• {item.landmark2}</p>
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
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses added yet</h3>
              <p className="text-gray-500">Add your first address using the form below</p>
            </div>
          )}
        </div>
        {/* Address Form */}
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={currentAddress.city}
                onChange={e => setCurrentAddress({ ...currentAddress, city: e.target.value })}
                placeholder="Enter city"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">State</label>
              <MetadataSelectComponent type='state' 
                value={currentAddress.state}
                onChange={e => {
                  setCurrentAddress({ ...currentAddress, state: Number(e.target.value) })
                }}
                className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {/* <input
                type="text"
                value={currentAddress.state}
                onChange={e => setCurrentAddress({ ...currentAddress, state: e.target.value })}
                placeholder="Enter state"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              /> */}
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
              <MetadataSelectComponent type='country' 
                value={currentAddress.country}
                onChange={e => {
                  setCurrentAddress({ ...currentAddress, country: Number(e.target.value) })
                  loadStates(e.target.value);
                }}
                // dontUseID={true}
                className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {/* <select
                value={currentAddress.country}
                onChange={e => setCurrentAddress({ ...currentAddress, country: e.target.value })}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select> */}
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Zip Code</label>
              <input
                type="text"
                value={currentAddress.zip}
                onChange={e => setCurrentAddress({ ...currentAddress, zip: e.target.value })}
                placeholder="Enter zip code"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Complete Address</label>
              <textarea
                value={currentAddress.address_line1}
                onChange={e => setCurrentAddress({ ...currentAddress, address_line1: e.target.value })}
                placeholder="Complete Address"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={1}
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                value={currentAddress.address_line2}
                onChange={e => setCurrentAddress({ ...currentAddress, address_line2: e.target.value })}
                placeholder="Address Line 2"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {/* <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                value={currentAddress.phone}
                onChange={e => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                placeholder="Phone"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div> */}
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Landmark 1</label>
              <input
                type="text"
                value={currentAddress.landmark1}
                onChange={e => setCurrentAddress({ ...currentAddress, landmark1: e.target.value })}
                placeholder="Landmark 1"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Landmark 2</label>
              <input
                type="text"
                value={currentAddress.landmark2}
                onChange={e => setCurrentAddress({ ...currentAddress, landmark2: e.target.value })}
                placeholder="Landmark 2"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
            >
              {editIndex !== null ? "Update Address" : "Add Address"}
            </button>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => reset({ addresses: [defaultAddress] })}>Cancel</button>
          </div>
          <button
            type="button"
            onClick={moveToNext}
            className="gray-btn hover:bg-gray-400"
          >
            Skip
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Save Address Changes?
            </h3>
            <p className="text-gray-600 mb-6">
              You have unsaved address information. Would you like to save this address before continuing to the next step?
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
  );
};

export default FormSection;