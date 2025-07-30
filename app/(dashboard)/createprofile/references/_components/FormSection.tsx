"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";

const defaultReference = {
  fullname: "",
  dob: "",
  contactnumber: "",
  email: "",
  relationshiptoyou: "",
};

const FormSection = () => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm({ defaultValues: { references: [] } });
  const { fields, append, remove, update } = useFieldArray({ control, name: "references" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentReference, setCurrentReference] = useState({ ...defaultReference });

  // Handle input changes for the local reference form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentReference((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update reference in the field array
  const handleAddOrUpdate = () => {
    // Prevent adding empty reference
    if (!currentReference.fullname && !currentReference.dob && !currentReference.contactnumber && !currentReference.email && !currentReference.relationshiptoyou) {
      return;
    }
    if (editIndex !== null) {
      update(editIndex, { ...currentReference });
      setEditIndex(null);
    } else {
      append({ ...currentReference });
    }
    setCurrentReference({ ...defaultReference });
  };

  // Load reference into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentReference({ ...fields[index] });
  };

  // Remove reference and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentReference({ ...defaultReference });
    }
  };

  // On submit, you can dispatch all references if needed
  const onSubmit = async () => {
    // Example: send all references to backend
    // for (const reference of fields) { ... }
    router.push("/createprofile/property");
  };

  return (
    <section className="md:py-5 w-4/5">
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="w-full box-border md:px-6">
        {/* Reference List as Table */}
        <div className="mb-6 overflow-x-auto">
          {fields.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Full Name</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">DOB</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Contact</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Email</th>
                  <th className="px-3 py-2 text-base font-bold text-gray-800">Relationship</th>
                  <th className="px-3 py-2 text-center text-base font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.fullname}</td>
                    <td className="px-3 py-2 text-sm">{item.dob}</td>
                    <td className="px-3 py-2 text-sm">{item.contactnumber}</td>
                    <td className="px-3 py-2 text-sm">{item.email}</td>
                    <td className="px-3 py-2 text-sm">{item.relationshiptoyou}</td>
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
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={currentReference.fullname}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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
          </div>
          <div className="flex w-full justify-between">
            <div className="w-[49%] md:mb-4">
              <label className="block text-gray-700 mb-2">Contact Number</label>
              <input
                type="text"
                name="contactnumber"
                value={currentReference.contactnumber}
                onChange={handleInputChange}
                placeholder="Contact Number"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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
          </div>
          <div className="flex w-full justify-between">
            {/* Relationship */}
            <div className="w-full md:mb-4">
              <label className="block text-gray-700 mb-2">Relationship to you</label>
              <select
                name="relationshiptoyou"
                value={currentReference.relationshiptoyou}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Relationship to you</option>
                <option value="Professional">Professional</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
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