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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectScrollUpButton, SelectViewport } from "@radix-ui/react-select";
import loaderAnimation from "@/public/lottie/Loading.json";
import Lottie from "lottie-react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Register = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.register);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   if (name === "country") {
  //     loadStates(value);
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      let updatedData: any = { ...prev, [name]: value };

      // 👇 when country changes, also update phone country code
      if (name === "country") {
        const selectedCountry = countryList?.find(
          (c: any) => c.country_id.toString() === value
        );
        if (selectedCountry) {
          updatedData.primaryPhoneCountry =
            selectedCountry.country_calling_code;
        }
      }

      return updatedData;
    });
  };

  useEffect(() => {
    if (formData.country) {
      loadStates(formData.country);
    }
  }, [formData.country, loadStates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedirecting(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setRedirecting(false);
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
      setRedirecting(false);
    }
  };

  return (
    <>
      <section className="account-details-box w-full max-w-7xl mx-auto text-left px-4 sm:px-6 lg:px-0 shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 sm:gap-4 text-left"
        >
          {/* Login Information */}
          <h3 className="BRCobane18700  sm:mb-4 lg:mb-0 text-sm sm:text-base">
            LOGIN INFORMATION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grow">
              <Label>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
            </div>
            <div className="relative grow">
              <Label>
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <div className="relative grow">
              <Label>
                Re-enter Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="pb-4 sm:pb-6">
            <h3 className="BRCobane18700  mb-2 sm:mb-4 text-sm sm:text-base">
              PERSONAL INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="grow text-left flex flex-col items-start">
                <Label className="mb-1">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
              <div className="grow flex flex-col items-start">
                <Label className="mb-1">Middle Name</Label>
                <Input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
              <div className="grow flex flex-col items-start">
                <Label className="mb-1">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grow flex flex-col items-start">
                <Label className="mb-1">
                  Birth Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
              <div className="grow flex flex-col items-start">
                <Label className="mb-1">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "gender", value },
                    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-full text-sm sm:text-base placeholder:text-gray-400">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="w-full">
                    <SelectViewport className="max-h-60 overflow-auto">
                      {genderList?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectViewport>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* City, State, Country, Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "country", value }, // 👈 mimic event
                    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryList?.map((country: any) => (
                      <SelectItem
                        key={country.country_id}
                        value={country.country_id.toString()}
                      >
                        {country.country_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "state", value },
                    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="w-full">
                    {/* optional up button */}
                    <SelectScrollUpButton />

                    {/* viewport: set a max-height and allow overflow scroll */}
                    <SelectViewport className="max-h-60 overflow-auto">
                      {stateList?.map((st: any) => (
                        <SelectItem key={st.state_id} value={st.state_name}>
                          {st.state_name}
                        </SelectItem>
                      ))}
                    </SelectViewport>

                    {/* optional down button */}
                    <SelectScrollDownButton />
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">
                  Zip Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="mt-4 w-full">
              <div className="flex flex-col items-start">
                <Label className="mb-1">
                  Complete Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="BRCobane18700  mb-2 sm:mb-4 text-sm sm:text-base">
              CONTACT INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="mb-4 grow flex flex-col items-start">
                <Label className="mb-1">
                  Primary Phone <span className="text-red-500">*</span>
                </Label>
                <div className="flex w-full gap-2">
                  <Select
                    value={formData.primaryPhoneCountry} // default fallback
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: "primaryPhoneCountry", value },
                      } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
                    }
                  >
                    <SelectTrigger className="sm:w-32 md:w-52 text-xs sm:text-sm">
                      <SelectValue placeholder="" />
                    </SelectTrigger>

                    <SelectContent className="sm:w-32 md:w-52">
                      <SelectViewport className="max-h-60 overflow-auto">
                        {countryList?.map((country: any) => (
                          <SelectItem
                            key={country.country_id}
                            value={country.country_calling_code}
                          >
                            {country.flag_emoji} {country.country_calling_code}
                          </SelectItem>
                        ))}
                      </SelectViewport>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    name="primaryPhone"
                    value={formData.primaryPhone}
                    onChange={handleChange}
                    className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="mb-4 grow flex flex-col items-start">
                <Label className="mb-1">Email</Label>
                <Input
                  type="email"
                  name="contactEmail"
                  value={formData.email}
                  onChange={handleChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
            <Button
              type="button"
              className=" hover:bg-gray-100 w-full sm:w-auto px-6 py-3 rounded-md text-xl sm:text-base"
              variant={"outline"}
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
            </Button>
            <Button
              type="submit"
              variant={"default"}
              className="bg-[#f7ac03] hover:bg-[#e69a00] p-2 rounded-md text-xl w-full sm:w-auto px-6 py-3 font-semibold sm:text-base"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </section>
      {redirecting && (
        <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
          <Lottie
            animationData={loaderAnimation}
            loop
            autoplay
            style={{ height: 150, width: 150 }}
          />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Register;
