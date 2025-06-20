"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { registerUserAsync } from '../../../store/features/registerSlice';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; 

const Register = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.register);
  const router = useRouter(); 

  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    primaryPhone: "",
    photo: null,
    secret_question: null,
    secret_answer: null,
    secondary_phone: null,
    secondary_phone_country: null,
    secondary_phone_type: null,
    address_line2: null,
  });

  function formatDataForAPI(formData: any) {
    return {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      birth_date: formData.birthDate,
      gender: formData.gender,
      complete_address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: formData.zipCode,
      contact_email: formData.email, // Using email as contact_email
      primary_phone: formData.primaryPhone,
    };
  }
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const apiPayload = formatDataForAPI(formData);
  
    try {
      const result = await dispatch(registerUserAsync(apiPayload)).unwrap();
      toast.success('Registration successful!', {
        autoClose: 3000
      });
      setTimeout(() => {
        router.push('/login'); 
      }, 2000); 
    } catch (error: any) {
      toast.error(error || 'Registration failed!', {
        autoClose: 5000
      });
    }
  };

  return (
    <>
      <section className="account-details-box w-full text-left">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 text-left"
        >
          {/* Login Information */}
          <h3 className="BRCobane18700 opacity-30 md:mb-4">LOGIN INFORMATION</h3>
          <div className="w-full flex md:gap-4 text-left md:pb-6 border-b">
            <div className="grow">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email"
                required
              />
            </div>
            <div className="grow">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Password"
                required
              />
            </div>
            <div className="grow">
              <label className="block text-gray-700 mb-2">
                Re-enter Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Re-enter Password"
                required
              />
            </div>
          </div>
  
          {/* Personal Information */}
          <div className="md:pb-6 border-b">
            <h3 className="BRCobane18700 opacity-30 mb-4">
              PERSONAL INFORMATION
            </h3>
            <div className="flex md:gap-4 md:mb-4">
              <div className="grow text-left flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-left">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="grow  flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Middle Name"
                />
              </div>
              <div className="grow  flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            <div className="flex md:gap-4">
              <div className="grow flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="grow flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-4 w-full">
              <div className="flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">
                  Complete Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Complete Address"
                  required
                />
              </div>
            </div>
  
            {/* City, State, Country, Zip Code */}
            <div className="flex md:gap-4 md:mt-4">
              <div className="flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="City"
                  required
                />
              </div>
              <div className="flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="State"
                  required
                />
              </div>
              <div className="flex flex-col items-start">
                <label className="block  BRCobane18600 mb-2.5">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Country"
                  required
                />
              </div>
              <div className="flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5">Zip Code</label>
                <input
                  type="number"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Zip Code"
                  maxLength={7}
                  required
                />
              </div>
            </div>
          </div>
  
          {/* Contact Information */}
          <div className="">
            <h3 className="BRCobane18700 opacity-30 mb-4">CONTACT INFORMATION</h3>
            <div className="flex md:gap-4">
              <div className="mb-4 grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.email}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-4 grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5">
                  Primary Phone
                </label>
                <input
                  type="text"
                  name="primaryPhone"
                  value={formData.primaryPhone}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Primary Phone"
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>
  
          {/* Buttons */}
          <div className="flex justify-start gap-4">
            <button type="submit" className="yellow-btn hover:bg-orange-600">
              Register
            </button>
            <button
              type="button"
              className="white-btn hover:bg-gray-400"
              onClick={() =>
                setFormData({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  birthDate: "",
                  gender: "",
                  address: "",
                  city: "",
                  state: "",
                  country: "",
                  zipCode: "",
                  primaryPhone: "",
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default Register;
