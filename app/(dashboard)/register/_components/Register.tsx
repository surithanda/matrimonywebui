"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { registerUserAsync } from '../../../store/features/registerSlice';
import { ToastContainer, toast } from 'react-toastify';
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

  function mapRequestToStoredProcedure(requestData: any) {
    return {
      email: requestData.email || "newemail@example.com",
      user_name: requestData.user_name || "newemail@example.com",
      password: requestData.password || "Test@123",
      primary_phone: requestData.primary_phone || "9999999787",
      primary_phone_country: requestData.primary_phone_country || "US",
      primary_phone_type: requestData.primary_phone_type || 1,
      first_name: requestData.first_name || "John",
      last_name: requestData.last_name || "Doe",
      birth_date: requestData.birth_date || "1990-01-01",
      gender: requestData.gender || 1,
      address_line1: requestData.address_line1 || "123 Main St",
      city: requestData.city || "New York",
      state: requestData.state || "NY",
      zip: requestData.zip || "10001",
      country: requestData.country || "US",
      middle_name: requestData.middle_name || "Middle",
      secondary_phone: requestData.secondary_phone || "0987654321",
      secondary_phone_country: requestData.secondary_phone_country || "US",
      secondary_phone_type: requestData.secondary_phone_type || 2,
      address_line2: requestData.address_line2 || "Apt 4B",
      secret_question: requestData.secret_question || "What is your pet's name?",
      secret_answer: requestData.secret_answer || "Max"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login')
    console.log(formData);
    const mappedToSp:any = mapRequestToStoredProcedure(formData);
    dispatch(registerUserAsync(mappedToSp))
      .then(() => {
        toast('Registration successful!', {
          type: 'success',
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        toast('Registration failed!', {
          type: 'error',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
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
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Zip Code"
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
  );
};

export default Register;
