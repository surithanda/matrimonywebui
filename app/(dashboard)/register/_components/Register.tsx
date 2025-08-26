"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { registerUserAsync } from "../../../store/features/registerSlice";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import {
  getStatesAsync,
  setMetadataCategory,
} from "@/app/store/features/metaDataSlice";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { use } from "chai";

const Register = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.register);
  const { countryList, stateList, genderList } = useAppSelector(
    (state) => state.metaData
  );
  const router = useRouter();
  const { loadNecessaryMetaData, loadStates } = useMetaDataLoader();

  useEffect(() => {
    loadNecessaryMetaData();
  }, [loadNecessaryMetaData]);

  // const loadStates = async(selectedCountry:string) => {
  //   let result = await dispatch(getStatesAsync({"country":selectedCountry})).unwrap();
  //   dispatch(setMetadataCategory({"category":"state", "payload": result}));
  // }

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
      email: requestData.email || "",
      user_name: requestData.user_name || "",
      password: requestData.password || "",
      primary_phone: requestData.primary_phone || "",
      primary_phone_country: requestData.primary_phone_country || "US",
      primary_phone_type: requestData.primary_phone_type || 1,
      first_name: requestData.first_name || "",
      last_name: requestData.last_name || "",
      birth_date: requestData.birth_date || "",
      gender: requestData.gender,
      address_line1: requestData.address_line1 || "",
      city: requestData.city || "",
      state: requestData.state || "",
      zip: requestData.zip || "",
      country: requestData.country || "",
      middle_name: requestData.middle_name || "",
      secondary_phone: requestData.secondary_phone || "",
      secondary_phone_country: requestData.secondary_phone_country || "",
      secondary_phone_type: requestData.secondary_phone_type || 2,
      address_line2: requestData.address_line2 || "",
      secret_question: requestData.secret_question || "N/A",
      secret_answer: requestData.secret_answer || "N/A",
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
    if (name === "country") {
      loadStates(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const mappedData = mapRequestToStoredProcedure({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      birth_date: formData.birthDate,
      gender: formData.gender,
      address_line1: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip: formData.zipCode,
      primary_phone: formData.primaryPhone,
      primary_phone_country: formData.primaryPhoneCountry,
      user_name: formData.email,
    });

    try {
      const result = await dispatch(registerUserAsync(mappedData)).unwrap();
      toast.success("Registration successful!", {
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error || "Registration failed!", {
        autoClose: 5000,
      });
    }
  };

  return (
    <>
     <section className="account-details-box w-full max-w-7xl mx-auto text-left px-4 sm:px-6 lg:px-0">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 sm:gap-6 text-left"
        >
          {/* Login Information */}
          <h3 className="BRCobane18700 opacity-30 mb-2 sm:mb-4 text-sm sm:text-base">
            LOGIN INFORMATION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grow">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                placeholder="Email"
                required
              />
            </div>
            <div className="grow">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                placeholder="Password"
                required
              />
            </div>
            <div className="grow">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base">
                Re-enter Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                placeholder="Re-enter Password"
                required
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="pb-4 sm:pb-6 border-b">
            <h3 className="BRCobane18700 opacity-30 mb-2 sm:mb-4 text-sm sm:text-base">
              PERSONAL INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="grow text-left flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-left text-sm sm:text-base">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Middle Name"
                />
              </div>
              <div className="grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Select Gender</option>
                  {genderList &&
                    genderList?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-4 w-full">
              <div className="flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Complete Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Complete Address"
                  required
                />
              </div>
            </div>

            {/* City, State, Country, Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-start w-full">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="City"
                  required
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Select State</option>
                  {stateList &&
                    stateList?.map((state: any) => (
                      <option key={state.state_id} value={state.state_name}>
                        {state.state_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col items-start w-full">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Select Country</option>
                  {countryList &&
                    countryList?.map((country: any) => (
                      <option
                        key={country.country_id}
                        value={country.country_id}
                      >
                        {country.country_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col items-start w-full">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Zip Code
                </label>
                <input
                  type="number"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Zip Code"
                  maxLength={7}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="">
            <h3 className="BRCobane18700 opacity-30 mb-2 sm:mb-4 text-sm sm:text-base">
              CONTACT INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="mb-4 grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.email}
                  onChange={handleChange}
                  className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-4 grow flex flex-col items-start">
                <label className="block BRCobane18600 mb-2.5 text-sm sm:text-base">
                  Primary Phone
                </label>
                <div className="flex w-full gap-2">
                  <select
                    name="primaryPhoneCountry"
                    value={formData.primaryPhoneCountry || "+91"}
                    onChange={handleChange}
                    className="account-input-field sm:w-32 md:w-52 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs sm:text-sm"
                    required
                  >
                    <option value="">Select Country Code</option>
                    {countryList &&
                      countryList?.map((country: any) => (
                        <option
                          key={country.country_id}
                          value={country.country_code_2}
                        >
                          {country.flag_emoji} {country.country_calling_code}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    name="primaryPhone"
                    value={formData.primaryPhone}
                    onChange={handleChange}
                    className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                    placeholder="Primary Phone"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
            <button
              type="button"
              className="white-btn hover:bg-gray-400 w-full sm:w-auto px-6 py-3 rounded-md text-xl sm:text-base"
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
            <button
              type="submit"
              className="bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-xl w-full sm:w-auto px-6 py-3 font-semibold sm:text-base"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default Register;
