"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { getPropertiesAsync, createPropertyAsync, updatePropertyAsync, deletePropertyAsync } from "@/app/store/features/profileSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { ProfileIDContext } from "../../_components/Sidebar";
import { IProfileProperty } from "@/app/models/Profile";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";

const defaultProperty:IProfileProperty = {
  profile_id: null,
  property_type: null,
  ownership_type: null,
  property_value: null,
  property_description: "",
  property_address: "",
};

const FormSection = () => {
  const router = useRouter();
  const { selectedProfileID } = useContext(ProfileIDContext);
  const dispatch = useAppDispatch();
  const { properties, loading, error } = useAppSelector((state) => state.profile);
  const { control, handleSubmit, reset } = useForm({ defaultValues: { properties: [] } });
  const { fields, append, remove, update, replace } = useFieldArray({ control, name: "properties" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProperty, setCurrentProperty] = useState<IProfileProperty>({ ...defaultProperty });
  const [localError, setLocalError] = useState<string | null>(null);
  const {findPropertyTypeName, findOwnershipTypeName} = useMetaDataLoader();

  // Handle input changes for the local property form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log("handleInputChange called with name:", name, "value:", value);
    setCurrentProperty((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update property in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    console.log("handleAddOrUpdate called with currentProperty:", currentProperty);
    // Validation: require all key fields
    if (!currentProperty.property_type || !currentProperty.ownership_type || !currentProperty.property_value || !currentProperty.property_address) {
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
        const result = await dispatch(updatePropertyAsync({ ...currentProperty, id: fields[editIndex].id, profile_id: selectedProfileID })).unwrap();
        if (result && result.status === 'success') {
          proceedWithAddUpdate(currentProperty.id);
        }
      } catch (err: any) {
        setLocalError(err.message || "Error updating property");
      }
    } else {
      // Add new property
      try {
        const result = await dispatch(createPropertyAsync({ ...currentProperty, profile_id: selectedProfileID })).unwrap();
        if (result && result.status === 'success') {
          proceedWithAddUpdate(result.profile_property_id);
        }
      } catch (err: any) {
        setLocalError(err.message || "Error adding property");
      }
    }
  };

  const proceedWithAddUpdate = (updateID?: any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID ? { ...currentProperty, id: updateID } : { ...currentProperty };
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
      if (result && result.status === 'success') {
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

  // Fetch properties from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getPropertiesAsync({ profile_id: selectedProfileID })).then((result: any) => {
      if (result.payload?.data) {
        reset(result.payload.data);
      } 
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfileID, dispatch]);

  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        {/* Loading/Error States */}
        {(loading) && <div className="mb-2 text-blue-600">Loading...</div>}
        {(localError || error) && <div className="mb-2 text-red-600">{localError || error}</div>}
        {/* Property List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Type</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Ownership</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Area</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Description</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Address</th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{findPropertyTypeName(item.property_type)}</td>
                    <td className="px-3 py-2 text-sm">{findOwnershipTypeName(item.ownership_type)}</td>
                    <td className="px-3 py-2 text-sm">{item.property_value}</td>
                    <td className="px-3 py-2 text-sm">{item.property_description}</td>
                    <td className="px-3 py-2 text-sm">{item.property_address}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button type="button" className="gray-btn px-2 py-1 text-xs" onClick={() => handleEdit(index)} disabled>Edit</button>
                        <button type="button" className="red-btn px-2 py-1 text-xs" onClick={() => handleDelete(index)} disabled>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Property Form */}
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Property Type</label>
              <MetadataSelectComponent type='property_type' 
                value={currentProperty.property_type}
                onChange={handleInputChange}
              />
              {/* <select
                name="property"
                value={currentProperty.property}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Property Type</option>
                <option value="Apartment/Flat">Apartment/Flat</option>
                <option value="Independent House/Villa">Independent House/Villa</option>
                <option value="Studio Apartment">Studio Apartment</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Duplex">Duplex</option>
              </select> */}
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Ownership Type</label>
              <MetadataSelectComponent type='ownership_type' 
                value={currentProperty.ownership_type}
                onChange={handleInputChange}
              />
              {/* <select
                name="ownership"
                value={currentProperty.ownership}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Ownership Type</option>
                <option value="Freehold">Freehold</option>
                <option value="Leasehold">Leasehold</option>
                <option value="Joint Ownership">Joint Ownership</option>
              </select> */}
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Complete Address</label>
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
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Size/Area</label>
              <input
                type="text"
                name="property_value"
                value={currentProperty.property_value}
                onChange={handleInputChange}
                placeholder="Area in sq. ft."
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {/* <select
                name="area"
                value={currentProperty.area}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Size/Area</option>
                <option value="500 sq. ft">500 sq. ft</option>
                <option value="1000 sq. ft">1000 sq. ft</option>
                <option value="1500 sq. ft.">1500 sq. ft.</option>
                <option value="2000 sq. ft.">2000 sq. ft.</option>
              </select> */}
            </div>
            {/* Property Status field removed as requested */}
            <div className="w-[49%] md:mb-4">
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
            <button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
              disabled={loading}
            >
              {editIndex !== null ? "Update Property" : "Add Property"}
            </button>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => { setCurrentProperty({ ...defaultProperty }); setEditIndex(null); }}>Cancel</button>
          </div>
          <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/photos")}>Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
