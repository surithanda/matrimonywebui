"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { getFamilyAsync, createFamilyAsync, updateFamilyAsync, deleteFamilyAsync } from "@/app/store/features/profileSlice";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";

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
  const { family: familyList, loading: familyLoading, error: familyError } = useAppSelector((state) => state.profile);
    const { control, handleSubmit, reset } = useForm<IFormValues>({ defaultValues: { family: [] } });
  const { fields, append, remove, update, replace } = useFieldArray({ control, name: "family" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
    const [currentFamilyMember, setCurrentFamilyMember] = useState<IFamilyMember>({ ...defaultFamilyMember });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadStates, findCountryName, findStateName } = useMetaDataLoader();

  // Handle input changes for the local family member form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "relationshiptoyou") {
      setCurrentFamilyMember((prev) => ({ ...prev, relationshiptoyou: value }));
    } else if (name === "country_id") {
      const countryId = parseInt(value, 10);
      setCurrentFamilyMember((prev) => ({ ...prev, country_id: countryId, state_id: 0 }));
      loadStates(value);
    } else if (name === "state_id") {
      setCurrentFamilyMember((prev) => ({ ...prev, state_id: parseInt(value, 10) }));
    } else {
      setCurrentFamilyMember((prev) => ({ ...prev, [name]: value }));
    }
  };


  // Fetch family members from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
                    dispatch(getFamilyAsync({ profile_id: selectedProfileID, type: category })).then((result: any) => {
      if (result.payload?.success && result.payload.data) {
        const formattedData = result.payload.data.map((item: any) => ({
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

  // Add or update family member in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    console.log(currentFamilyMember)
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
        const result = await dispatch(updateFamilyAsync({ ...currentFamilyMember, id: fields[editIndex].id, profile_id: selectedProfileID })).unwrap();
        if (result && result.status === 'success') {
          proceedwithAddUpdate(currentFamilyMember.id);
        }
      } catch (err: any) {
        setError(err.message || `Error updating ${actionButton_label.toLowerCase()}`);
      }
    } else {
      // Add new family member
      try {
        const result = await dispatch(createFamilyAsync({ ...currentFamilyMember, profile_id: selectedProfileID })).unwrap();
        console.log("Add family result:", result);
        if (result && result.data.status === 'success') {
          proceedwithAddUpdate(result.data.profile_family_reference_id);
        }
      } catch (err: any) {
        setError(err.message || `Error adding ${actionButton_label.toLowerCase()}`);
      }
    }
  };

    const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of record being added/updated
        const updatedData = updateID ? { ...currentFamilyMember, id: String(updateID) } : { ...currentFamilyMember };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentFamilyMember({ ...defaultFamilyMember });
  };

  // Load family member into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentFamilyMember({ ...fields[index] });
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
      if (result && result.status === 'success') {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setError(err.message || `Error deleting ${actionButton_label.toLowerCase()}`);
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentFamilyMember({ ...defaultFamilyMember });
    }
  }


  // On submit, just continue (family members are already saved)
  const onSubmit = async () => {
    router.push(next_url);
  };

  return (
    <section className="md:py-5 w-4/5">
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="w-full box-border md:px-6">
        {/* Loading/Error States */}
        {(loading || familyLoading) && <div className="mb-2 text-blue-600">Loading...</div>}
        {(error || familyError) && <div className="mb-2 text-red-600">{error || familyError}</div>}
        {/* Family List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">First Name</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Last Name</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Relationship</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Address</th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                                    <tr key={item._id || item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.firstname}</td>
                    <td className="px-3 py-2 text-sm">{item.lastname}</td>
                    <td className="px-3 py-2 text-sm">{item.relationshiptoyou}</td>
                    <td className="px-3 py-2 text-sm">{item.address_line}, {item.city}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button disabled type="button" className="gray-btn px-2 py-1 text-xs" onClick={() => handleEdit(index)}>Edit</button>
                        <button disabled type="button" className="red-btn px-2 py-1 text-xs" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Family Member Form */}
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstname"
                value={currentFamilyMember.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
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
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={currentFamilyMember.dob}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Contact Number</label>
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
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={currentFamilyMember.email}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Relationship to you</label>
                            <MetadataSelectComponent
                type={category}
                name="relationshiptoyou"
                value={currentFamilyMember.relationshiptoyou}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
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
          <div className="flex w-full justify-between">
            <div className="w-[32%] md:mb-4">
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={currentFamilyMember.city}
                onChange={handleInputChange}
                placeholder="City"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="w-[32%] md:mb-4">
              <label className="block text-gray-700 mb-2">State</label>
                            <MetadataSelectComponent
                type="state"
                name="state_id"
                value={currentFamilyMember.state_id}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="w-[32%] md:mb-4">
              <label className="block text-gray-700 mb-2">Country</label>
                            <MetadataSelectComponent
                type="country"
                name="country_id"
                value={currentFamilyMember.country_id}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Zip</label>
              <input
                type="text"
                name="zip"
                value={currentFamilyMember.zip}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
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
              {editIndex !== null ? "Update" : "Add"} {actionButton_label}
            </button>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-[100px]">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600" disabled={loading}>Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => { setCurrentFamilyMember({ ...defaultFamilyMember }); setEditIndex(null); }} disabled={loading}>Cancel</button>
          </div>
          <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/references")}>Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
