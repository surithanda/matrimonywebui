"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import dp from "/public/images/dashboard/dp.png";
import { api } from "../../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../../../store/features/registerSlice";

const AccountSettings = () => {
  const dispatch = useDispatch();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const loading = useSelector((state: any) => state.register.loading);
  const error = useSelector((state: any) => state.register.error);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const fetchProfilePhoto = async () => {
    try {
      const response = await api.get('/account/photo');
      if (response.data?.success && response.data?.data?.photo_url) {
        // Combine the base URL with the photo path
        const fullPhotoUrl = `${process.env.NEXT_PUBLIC_API_URL}${response.data.data.photo_url}`;
        setProfilePhoto(fullPhotoUrl);
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      setProfilePhoto(null);
    }
  };

  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    setPhotoLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/account/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data) throw new Error('Failed to upload photo');
      dispatch(setError(null));
      // Fetch updated photo after successful upload
      await fetchProfilePhoto();
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      dispatch(setError(error.response?.data?.message || 'Failed to upload photo'));
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const response = await api.put('/account/update', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        primary_phone: formData.primaryPhone,
        primary_phone_country: "US",
        primary_phone_type: "MOBILE",
        address_line1: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zipcode,
        country: formData.country,
      });

      if (!response.data) throw new Error('Failed to update account');
      dispatch(setError(null));
    } catch (error: any) {
      console.error('Error updating account:', error);
      dispatch(setError(error.response?.data?.message || 'Failed to update account'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <section className="account-details-box w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex justify-between items-end w-full">
        <div className="flex items-end gap-4">
          <Image 
            src={profilePhoto || dp} 
            alt="Profile" 
            width={96}
            height={96}
            className="md:h-24 md:w-24 object-cover rounded-full"
            unoptimized={!!profilePhoto} // Bypass Next.js image optimization for external URLs
          />
          <div>
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <label 
              htmlFor="photo-upload" 
              className="white-btn hover:bg-gray-200 cursor-pointer"
            >
              {photoLoading ? 'Uploading...' : 'Change Photo'}
            </label>
          </div>
        </div>
        <button className="red-btn hover:bg-red-600">Deactivate Account</button>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex justify-between flex-wrap gap-y-4">
          {/* First Name, Middle Name, Last Name */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Gender */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Primary and Secondary Phone */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Primary Phone</label>
            <input
              type="text"
              name="primaryPhone"
              value={formData.primaryPhone}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Secondary Phone</label>
            <input
              type="text"
              name="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Address */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
            />
          </div>

          {/* City, State, Zipcode, Country */}
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Zipcode</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button 
            type="submit" 
            className="yellow-btn hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="white-btn hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default AccountSettings;
