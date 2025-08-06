
"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { getReferenceAsync, createReferenceAsync, updateReferenceAsync, deleteReferenceAsync } from "@/app/store/features/profileSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { ProfileIDContext } from "../../_components/Sidebar";

const defaultReference = {
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
  state_id: "",
  country_id: "",
  zip: "",
};


const FormSection = () => {
  const router = useRouter();
  const { selectedProfileID } = useContext(ProfileIDContext);
  const dispatch = useAppDispatch();
  const { reference: referenceList, loading: referenceLoading, error: referenceError } = useAppSelector((state) => state.profile);
  const { control, handleSubmit, reset } = useForm({ defaultValues: { references: [] } });
  const { fields, append, remove, update, replace } = useFieldArray({ control, name: "references" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentReference, setCurrentReference] = useState({ ...defaultReference });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadStates, findCountryName, findStateName } = useMetaDataLoader();

  // Handle input changes for the local reference form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "reference") setCurrentReference((prev) => ({ ...prev, relationshiptoyou: value }));
    else if (name === "country") {
      setCurrentReference((prev) => ({ ...prev, country_id: value, state_id: "" }));
      loadStates(value);
    } else {
      setCurrentReference((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch references from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getReferenceAsync({ profile_id: selectedProfileID })).then((result: any) => {
      if (result.payload?.data) {
        replace(result.payload.data);
      } else {
        replace([]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfileID, dispatch]);

  // Add or update reference in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    // Validation: require all key fields
    if (
      !currentReference.firstname ||
      !currentReference.lastname ||
      !currentReference.address_line ||
      !currentReference.city ||
      !currentReference.state_id ||
      !currentReference.country_id ||
      !currentReference.zip ||
      !currentReference.dob ||
      !currentReference.contactnumber ||
      !currentReference.email ||
      !currentReference.relationshiptoyou
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (editIndex !== null) {
      // Update existing reference
      try {
        const result = await dispatch(updateReferenceAsync({ ...currentReference, id: fields[editIndex].id, profile_id: selectedProfileID })).unwrap();
        if (result && result.status === 'success') {
          proceedwithAddUpdate(currentReference.id);
        }
      } catch (err: any) {
        setError(err.message || "Error updating reference");
      }
    } else {
      // Add new reference
      try {
        const result = await dispatch(createReferenceAsync({ ...currentReference, profile_id: selectedProfileID })).unwrap();
        if (result && result.status === 'success') {
          proceedwithAddUpdate(result.profile_reference_id);
        }
      } catch (err: any) {
        setError(err.message || "Error adding reference");
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID ? { ...currentReference, id: updateID } : { ...currentReference };
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
    setCurrentReference({ ...fields[index] });
  };

  // Remove reference from backend and local state
  const handleDelete = async (index: number) => {
    const member = fields[index];
    try {
      const result = await dispatch(deleteReferenceAsync(member.id)).unwrap();
      if (result && result.status === 'success') {
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

  return (
    <section className="md:py-5 w-4/5">
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="w-full box-border md:px-6">
        {/* Loading/Error States */}
        {(loading || referenceLoading) && <div className="mb-2 text-blue-600">Loading...</div>}
        {(error || referenceError) && <div className="mb-2 text-red-600">{error || referenceError}</div>}
        {/* Reference List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">First Name</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Last Name</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">DOB</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Contact</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Email</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Relationship</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Address</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">City</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">State</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Country</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Zip</th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id || item._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.firstname}</td>
                    <td className="px-3 py-2 text-sm">{item.lastname}</td>
                    <td className="px-3 py-2 text-sm">{item.dob}</td>
                    <td className="px-3 py-2 text-sm">{item.contactnumber}</td>
                    <td className="px-3 py-2 text-sm">{item.email}</td>
                    <td className="px-3 py-2 text-sm">{item.relationshiptoyou}</td>
                    <td className="px-3 py-2 text-sm">{item.address_line}</td>
                    <td className="px-3 py-2 text-sm">{item.city}</td>
                    <td className="px-3 py-2 text-sm">{item.state_id}</td>
                    <td className="px-3 py-2 text-sm">{item.country_id}</td>
                    <td className="px-3 py-2 text-sm">{item.zip}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button type="button" className="gray-btn px-2 py-1 text-xs" onClick={() => handleEdit(index)}>Edit</button>
                        <button type="button" className="red-btn px-2 py-1 text-xs" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Reference Form */}
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstname"
                value={currentReference.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={currentReference.lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={currentReference.dob}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Contact Number</label>
              <CustomPhoneComponent
                type="contactnumber"
                changeHandler={handleInputChange}
                bindValue={currentReference.contactnumber}
                bindValue2={currentReference.contactnumber_country}
                placeholder="Contact Number"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={currentReference.email}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Relationship to you</label>
              <MetadataSelectComponent type='reference' 
                value={currentReference.relationshiptoyou}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address_line"
                value={currentReference.address_line}
                onChange={handleInputChange}
                placeholder="Address Line"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[32%] md:mb-4">
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
            <div className="w-[32%] md:mb-4">
              <label className="block text-gray-700 mb-2">State</label>
              <MetadataSelectComponent
                type="state"
                value={currentReference.state_id}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-[32%] md:mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
              <MetadataSelectComponent
                type="country"
                value={currentReference.country_id}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
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
            <button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
            >
              {editIndex !== null ? "Update Reference" : "Add Reference"}
            </button>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => { setCurrentReference({ ...defaultReference }); setEditIndex(null); }}>Cancel</button>
          </div>
          <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/property")}>Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;