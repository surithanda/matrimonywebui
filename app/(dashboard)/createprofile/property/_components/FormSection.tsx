"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";

const defaultProperty = {
  property: "",
  ownership: "",
  area: "",
  propertystatus: "",
  address: "",
};

const FormSection = () => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm({ defaultValues: { properties: [] } });
  const { fields, append, remove, update } = useFieldArray({ control, name: "properties" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProperty, setCurrentProperty] = useState({ ...defaultProperty });

  // Handle input changes for the local property form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProperty((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update property in the field array
  const handleAddOrUpdate = () => {
    // Prevent adding empty property
    if (!currentProperty.property && !currentProperty.ownership && !currentProperty.area && !currentProperty.propertystatus && !currentProperty.address) {
      return;
    }
    if (editIndex !== null) {
      update(editIndex, { ...currentProperty });
      setEditIndex(null);
    } else {
      append({ ...currentProperty });
    }
    setCurrentProperty({ ...defaultProperty });
  };

  // Load property into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentProperty({ ...fields[index] });
  };

  // Remove property and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentProperty({ ...defaultProperty });
    }
  };

  // On submit, you can dispatch all properties if needed
  const onSubmit = async () => {
    // Example: send all properties to backend
    // for (const property of fields) { ... }
    router.push("/createprofile/photos");
  };
  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        {/* Property List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Type</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Ownership</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Area</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Status</th>
                  <th className="px-3 py-2 text-left text-base font-bold text-gray-800">Address</th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.property}</td>
                    <td className="px-3 py-2 text-sm">{item.ownership}</td>
                    <td className="px-3 py-2 text-sm">{item.area}</td>
                    <td className="px-3 py-2 text-sm">{item.propertystatus}</td>
                    <td className="px-3 py-2 text-sm">{item.address}</td>
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
        {/* Property Form */}
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Property Type</label>
              <select
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
              </select>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Ownership Type</label>
              <select
                name="ownership"
                value={currentProperty.ownership}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Ownership Type</option>
                <option value="Freehold">Freehold</option>
                <option value="Leasehold">Leasehold</option>
                <option value="Joint Ownership">Joint Ownership</option>
              </select>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Complete Address</label>
              <textarea
                name="address"
                placeholder="Complete Address"
                value={currentProperty.address}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={1}
              />
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Size/Area</label>
              <select
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
              </select>
            </div>
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Property Status</label>
              <select
                name="propertystatus"
                value={currentProperty.propertystatus}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Property Status</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="New Launch">New Launch</option>
              </select>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              className="gray-btn mt-[20px] hover:bg-gray-400"
              onClick={handleAddOrUpdate}
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
