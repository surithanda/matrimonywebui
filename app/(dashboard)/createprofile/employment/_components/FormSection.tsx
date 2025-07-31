
"use client";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { createEmploymentAsync, getEmploymentAsync } from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { ProfileIDContext } from "../../_components/Sidebar";
import { formatWithMetaData } from "@/app/utils/utility";


const defaultEmployment = {
  id:"",
  institution_name: "",
  address_line1: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  start_year: "",
  end_year: "",
  job_title: "",
  last_salary_drawn: "",
};

const FormSection = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm({ defaultValues: { employments: [] } });
  const { fields, append, remove, update } = useFieldArray({ control, name: "employments" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentEmployment, setCurrentEmployment] = useState({ ...defaultEmployment });
const {loadStates, formatWithMetaData, findJobTitleName} = useMetaDataLoader();
const { selectedProfileID } = useContext(ProfileIDContext);


  useEffect(() => {
    if(selectedProfileID && selectedProfileID !== 0) {
      loadStates();
      fetchProfileData();
    }
  }, [selectedProfileID])

  const fetchProfileData = async() => {
      const data = {
        profile_id: selectedProfileID
      }
      try {
        const result = await dispatch(getEmploymentAsync(data)).unwrap();
        
        if (result?.success) {
          // const employments = formatWithMetaData(result?.data?.employments);
          // const formattedData = {
          //   ...result?.data,
          //   employments
          // }
          reset(result?.data);
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to fetch profile address");
        console.error("Error getting profile employment details:", err);
      }
    }


  // Handle input changes for the local employment form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEmployment((prev) => ({ ...prev, [name]: value }));
    if(name === 'country') loadStates(e.target.value);
  };

  // Add or update employment in the field array
  const handleAddOrUpdate = async() => {
    // Prevent adding empty employment
    if (!currentEmployment.institution_name && !currentEmployment.job_title && !currentEmployment.start_year && !currentEmployment.end_year) {
      return;
    }

    //update db and on positive response proceed ahead
    const sectionData = {
      profile_id: selectedProfileID, 
      ...currentEmployment
    };
    console.log(sectionData)

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
        const result = await dispatch(createEmploymentAsync(sectionData)).unwrap();
        console.log(result)
        if (result && result.status === 'success') {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_employment_id);
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to add address.");
        console.error("Error submitting form:", err);
      }
    }
  };
  
  const proceedwithAddUpdate = (updateID?:any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID ? { ...currentEmployment, id: updateID } : { ...currentEmployment };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    
    setCurrentEmployment({ ...defaultEmployment });
  }

  // Load employment into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentEmployment({ ...fields[index] });
  };

  // Remove employment and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentEmployment({ ...defaultEmployment });
    }
  };

  // On submit, dispatch all employments
  const onSubmit = async () => {
    // for (const employment of fields) {
    //   const employmentData = {
    //     profile_id: 51, // Replace with dynamic value if needed
    //     ...employment,
    //     start_year: parseInt(employment.start_year),
    //     end_year: parseInt(employment.end_year),
    //   };
    //   try {
    //     await dispatch(createEmploymentAsync(employmentData)).unwrap();
    //   } catch (error: any) {
    //     toast.error(error.message || "Failed to save employment details");
    //   }
    // }
    // toast.success("Employment details saved successfully!");
    router.push("/createprofile/hobbies");
  };

  return (
    <section className="md:py-5">
      <form className="flex flex-col justify-between h-full w-full box-border md:px-6" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        {/* Employment List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Company</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Job Title</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Start</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">End</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Salary</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Address</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">City</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Zip</th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.institution_name}</td>
                    <td className="px-3 py-2 text-sm">{findJobTitleName(item?.job_title || item?.job_title_id)}</td>
                    <td className="px-3 py-2 text-sm">{item.start_year}</td>
                    <td className="px-3 py-2 text-sm">{item.end_year}</td>
                    <td className="px-3 py-2 text-sm">{item.last_salary_drawn}</td>
                    <td className="px-3 py-2 text-sm">{item.address_line1}</td>
                    <td className="px-3 py-2 text-sm">{item.city}</td>
                    <td className="px-3 py-2 text-sm">{item.zip}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button type="button" disabled className="gray-btn px-2 py-1 text-xs" onClick={() => handleEdit(index)}>Edit</button>
                        <button type="button" disabled className="red-btn px-2 py-1 text-xs" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Employment Form */}
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                name="institution_name"
                value={currentEmployment.institution_name}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="account-input-field stretch w-full"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Job Title</label>
              <MetadataSelectComponent type='job_title' 
                value={currentEmployment.job_title}
                onChange={handleInputChange}
                className="account-input-field w-full stretch"
              />
              {/* <input
                type="text"
                name="job_title"
                value={currentEmployment.job_title}
                onChange={handleInputChange}
                placeholder="Job Title"
                className="account-input-field stretch w-full"
              /> */}
            </div>
          </div>
          <div className="flex w-full justify-between mt-4">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Start Year</label>
              <input
                type="number"
                name="start_year"
                value={currentEmployment.start_year}
                onChange={handleInputChange}
                placeholder="Start Year"
                className="account-input-field stretch w-full"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">End Year</label>
              <input
                type="number"
                name="end_year"
                value={currentEmployment.end_year}
                onChange={handleInputChange}
                placeholder="End Year"
                className="account-input-field stretch w-full"
              />
            </div>
          </div>
          <div className="flex w-full justify-between mt-4">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Last Salary Drawn</label>
              <input
                type="text"
                name="last_salary_drawn"
                value={currentEmployment.last_salary_drawn}
                onChange={handleInputChange}
                placeholder="Last Salary"
                className="account-input-field stretch w-full"
              />
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address_line1"
                value={currentEmployment.address_line1}
                onChange={handleInputChange}
                placeholder="Company Address"
                className="account-input-field stretch w-full"
              />
            </div>
          </div>
          <div className="flex w-full justify-between mt-4 gap-4">
            <input
              type="text"
              name="city"
              value={currentEmployment.city}
              onChange={handleInputChange}
              placeholder="City"
              className="account-input-field w-1/4"
            />
            
            <MetadataSelectComponent type='state' 
              value={currentEmployment.state}
              onChange={handleInputChange}
              className="account-input-field w-1/4 "
            />
            {/* <input
              type="text"
              name="state"
              value={currentEmployment.state}
              onChange={handleInputChange}
              placeholder="State"
              className="account-input-field w-1/4"
            /> */}
            {/* <input
              type="text"
              name="country"
              value={currentEmployment.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="account-input-field w-1/4"
            /> */}
            <MetadataSelectComponent type='country' 
              value={currentEmployment.country}
              onChange={handleInputChange}
              className="account-input-field w-1/4 "
            />
            <input
              type="text"
              name="zip"
              value={currentEmployment.zip}
              onChange={handleInputChange}
              placeholder="ZIP"
              className="account-input-field w-1/4"
            />
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
            >
              {editIndex !== null ? "Update Employment" : "Add Employment"}
            </button>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">Continue</button>
            <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => { setCurrentEmployment({ ...defaultEmployment }); setEditIndex(null); }}>Cancel</button>
          </div>
          <button type="button" className="gray-btn hover:bg-gray-400" onClick={() => router.push("/createprofile/hobbies")}>Skip</button>
        </div>
      </form>
    </section>
  );
};

export default FormSection;
