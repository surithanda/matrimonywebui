"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import dp from "/public/images/dashboard/dp.png";
import { api } from "../../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../../../store/features/registerSlice";
import { useRouter } from "next/navigation";
import { getGenderLabel } from "@/utils/utils";
import { IAccount } from "@/app/models/IAccount";
import { useAppSelector } from "@/app/store/store";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useFetchUser } from "@/app/utils/useFetchUser";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { toAbsoluteUrl } from "@/app/lib/env";

const AccountSettings = () => {
  const dispatch = useDispatch();
  const [photoLoading, setPhotoLoading] = useState(false);
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const loading = useSelector((state: any) => state.register.loading);
  const error = useSelector((state: any) => state.register.error);
  //@ts-ignore
  // const { user } = useAppSelector((state) => state.auth.userData);
  const userData = useSelector((state) => state.auth.userData);
  const { countryList, stateList, genderList } = useAppSelector((state) => state.metaData);
  console.log(countryList, userData)
  // gender === 'Male' ? 1 : formData.gender === 'Female' ? 2 : 3
  const [formData, setFormData] = useState<IAccount>(userData);
  const [imageError, setImageError] = useState(false);
  const {loadMetaData, loadStates} = useMetaDataLoader();

  const fetchProfilePhoto = useCallback(async () => {
    try {
      const response = await api.get('/account/photo');
      if (response.data?.success && response.data?.data?.photo_url) {
        const photoPath = response.data.data.photo_url;
        // The photo_url will be like /uploads/photos/account/<filename>
        const photoUrl = toAbsoluteUrl(photoPath);
        setProfilePhoto(photoUrl);
        setImageError(false);
      } else {
        setProfilePhoto(null);
        setImageError(true);
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      setProfilePhoto(null);
      setImageError(true);
    }
  }, []);

  useEffect(() => {
    fetchProfilePhoto();
    loadMetaData(); //not required but issues with redux state, thus added
  }, [fetchProfilePhoto, loadMetaData]);

  useEffect(() => {
    if(userData.country) loadStates(userData.country)
  }, [userData?.country, loadStates]);

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
    if (name === 'country') {
      loadStates(value);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    setPhotoLoading(true);
    dispatch(setError(null));
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/account/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success && response.data?.data?.photo_url) {
        const photoPath = response.data.data.photo_url;
        const photoUrl = toAbsoluteUrl(photoPath);
        setProfilePhoto(photoUrl);
        setImageError(false);
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      dispatch(setError(error.response?.data?.message || 'Failed to upload photo'));
      setImageError(true);
    } finally {
      setPhotoLoading(false);
    }
  };

  const {fetchAccountDetls} = useFetchUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    // let accData:IAccount = {
    //   first_name: formData.firstName,
    //   middle_name: formData.middleName,
    //   last_name: formData.lastName,
    //   email: formData.email,
    //   primary_phone: formData.primaryPhone,
    //   primary_phone_country: "US",
    //   primary_phone_type: "MOBILE",
    //   birth_date: formData.birthDate,
    //   address_line1: formData.address,
    //   city: formData.city,
    //   state: formData.state,
    //   zip: formData.zipcode,
    //   gender: formData.gender,
    //   country: formData.country,
    //   photo : undefined, //formData.photo || null,
    //   secondary_phone: formData.secondaryPhone,
    //   secondary_phone_country: "US", 
    //   secondary_phone_type: "MOBILE",
    // }
    // console.log(formData)
    // return;
    
    try {
      const response = await api.put('/account/update', formData);
      
      if (response.data?.success) {
        console.log('Account updated successfully');
        fetchAccountDetls();
        // router.push("/login");
        router.push("/dashboard");
      }
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update account');
      }
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
          {imageError ? (
            <Image 
              src={dp} 
              alt="Profile" 
              width={96}
              height={96}
              className="md:h-24 md:w-24 object-cover rounded-full"
            />
          ) : (
            <Image 
              src={profilePhoto || dp} 
              alt="Profile" 
              width={96}
              height={96}
              className="md:h-24 md:w-24 object-cover rounded-full"
              unoptimized
              onError={() => setImageError(true)}
            />
          )}
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
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Gender</label>
            {/* <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              {genderList && genderList?.map((item: any) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select> */}
            <MetadataSelectComponent type='gender' bindValue={formData?.gender} changeHandler={handleChange} custSelectValue={true}/>
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="w-[48%]">
            <label className="block text-gray-700 mb-2">Primary Phone</label>
            <CustomPhoneComponent type="primary_phone" changeHandler={handleChange} 
                bindValue={formData.primary_phone} bindValue2={formData.primary_phone_country}/>
            {/* <div className="flex w-full gap-2">
            <select
                    name="primary_phone_country"
                    value={formData.primary_phone_country || "+91"}
                    onChange={handleChange}
                    className="account-input-field w-35 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Country Code</option>
                    {countryList && countryList?.map((country: any) => (
                      <option key={country.country_id} value={country.country_code_2}>
                        {country.flag_emoji} {country.country_calling_code}
                      </option>
                    ))}
                  </select>
            <input
              type="text"
              name="primary_phone"
              value={formData.primary_phone}
              onChange={handleChange}
              maxLength={11}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            </div> */}
          </div>
          
          <div className="w-[48%]">
            <label className="block text-gray-700 mb-2">Secondary Phone</label>
            <CustomPhoneComponent type="secondary_phone" changeHandler={handleChange} 
                bindValue={formData.secondary_phone} bindValue2={formData.secondary_phone_country}/>
            {/* <div className="flex w-full gap-2">
            <select
                    name="secondary_phone_country"
                    value={formData.secondary_phone_country || "+91"}
                    onChange={handleChange}
                    className="account-input-field w-35 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    // required
                  >
                    <option value="">Select Country Code</option>
                    {countryList && countryList?.map((country: any) => (
                      <option key={country.country_id} value={country.country_code_2}>
                        {country.flag_emoji} {country.country_calling_code}
                      </option>
                    ))}
                  </select>
            <input
              type="text"
              name="secondary_phone"
              value={formData.secondary_phone}
              onChange={handleChange}
              maxLength={11}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            </div> */}
          </div>
          <div className="w-[48%]">
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          {/* <div className="w-[48%]">
            <label className="block text-gray-700 mb-2">Address Line 2</label>
            <textarea
              name="address2"
              value={formData.address_line2}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div> */}
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
            {/* <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            /> */}
            
                {/* <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select State</option>
                  {stateList && stateList?.map((state: any) => (
                    <option key={state.state_id} value={state.state_name}>
                      {state.state_name}
                    </option>
                  ))}
                </select> */}
                <MetadataSelectComponent type='state' bindValue={formData?.state} changeHandler={handleChange} />
          </div>
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Country</label>
            {/* <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            /> */}
            
                {/* <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Country</option>
                  {countryList && countryList?.map((country: any) => (
                    <option key={country.country_id} value={country.country_name}>
                      {country.country_name}
                    </option>
                  ))}
                </select> */}
                <MetadataSelectComponent type='country' bindValue={formData?.country} changeHandler={handleChange} />
          </div>
          
          <div className="w-[24%]">
            <label className="block text-gray-700 mb-2">Zipcode</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              maxLength={7}
              className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
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