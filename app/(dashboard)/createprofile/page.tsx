"use client";
import { Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  createPersonalProfileAsync,
  getPersonalProfileAsync,
} from "@/app/store/features/profileSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { IProfilePersonal } from "@/app/models/Profile";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/blocks/faq";

// Extended form data interface
interface FormData extends IProfilePersonal {
  phone_mobile_country: string;
  summary: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface RootState {
  profile: {
    loading: boolean;
    error: string | null;
    personalProfile: any;
  };
}

const Page = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.profile);
  const userData = useAppSelector((state) => state.auth.userData);
  const { setSelectedProfileID, selectedProfileID } = useProfileContext();

  const dummy = {
    profile_id: 1,
    account_id: 5,
    first_name: "John",
    last_name: "Air",
    middle_name: null,
    prefix: null,
    suffix: null,
    gender: "9",
    birth_date: "1990-06-06",
    phone_mobile: "01234567890",
    phone_mobile_country: "US",
    phone_home: null,
    phone_emergency: null,
    email_id: "john@gmail.com",
    marital_status: null,
    religion: null,
    nationality: 166,
    caste: null,
    height_inches: null,
    height_cms: null,
    weight: null,
    weight_units: "kg",
    complexion: null,
    linkedin: null,
    facebook: null,
    instagram: null,
    whatsapp_number: null,
    profession: null,
    disability: null,
    created_user: "genius.gen2k@gmail.com",
    summary: null,
    account_code: "20250712-155453-1",
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    defaultValues: {},
  });

  const fetchProfileData = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getPersonalProfileAsync(data)).unwrap();

      if (result) {
        reset(result?.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch profile");
      console.error("Error getting profile details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) fetchProfileData();
  }, [selectedProfileID, fetchProfileData]);

  const complexionOptions = [
    { value: "1", label: "Fair" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Olive" },
    { value: "4", label: "Brown" },
    { value: "5", label: "Dark" },
  ];

  const professionOptions = [
    { value: "1", label: "Engineer" },
    { value: "2", label: "Doctor" },
    { value: "3", label: "Teacher" },
    { value: "4", label: "Artist" },
    { value: "5", label: "Other" },
  ];

  const weightUnitsOptions = [
    { value: "kg", label: "Kilograms" },
    { value: "lbs", label: "Pounds" },
  ];

  // Display error with Toastify if error changes
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error(error, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [error]);

  // Transform form data to API payload
  const transformFormData = (data: FormData) => {
    const inches = data.height ? Number(data.height) : 0;
    return {
      account_id: userData?.account_id,
      first_name: data.first_name?.trim() || null,
      last_name: data.last_name?.trim() || null,
      middle_name: data.middle_name?.trim() || null,
      prefix: data.prefix?.trim() || null,
      suffix: data.suffix?.trim() || null,
      gender: data.gender || null,
      birth_date: data.birth_date || null,
      phone_mobile: data.phone_mobile?.trim() || null,
      phone_mobile_country: data.phone_mobile_country?.trim() || null,
      phone_home: data.phone_home?.trim() || null,
      phone_emergency: data.phone_emergency?.trim() || null,
      email_id: data.email_id?.trim() || null,
      marital_status: data.marital_status ? Number(data.marital_status) : null,
      religion: data.religion ? Number(data.religion) : null,
      nationality: data.nationality ? Number(data.nationality) : null,
      caste: data.caste ? Number(data.caste) : null,
      height_inches: inches || null,
      height_cms: inches ? Math.round(inches * 2.54) : null,
      weight: data.weight ? Number(data.weight) : null,
      weight_units: data.weight_units?.trim() || "kg",
      complexion: data.complexion ? Number(data.complexion) : null,
      linkedin: data.linkedin?.trim() || null,
      facebook: data.facebook?.trim() || null,
      instagram: data.instagram?.trim() || null,
      whatsapp_number: data.whatsapp_number?.trim() || null,
      profession: data.profession ? Number(data.profession) : null,
      disability: data.disability ? Number(data.disability) : null,
      created_user: "admin",
      summary: data.summary?.trim() || null,
    };
  };

  // React Hook Form submit handler
  const onSubmit = async (data: FormData) => {
    const mappedData = transformFormData(data);
    console.log(mappedData, selectedProfileID);

    try {
      if (!selectedProfileID) {
        const result = await dispatch(
          createPersonalProfileAsync(mappedData)
        ).unwrap();
        // console.log(result)
        if (result) {
          setSelectedProfileID(result?.data?.profile_id);
          toast.success("Profile created successfully!");
          reset();
          router.push("/createprofile/primarycontact");
        }
      } else {
        //update
        router.push("/createprofile/primarycontact");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create profile");
      console.error("Error submitting form:", err);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    reset();
  };

  // Helper for error display
  const getFieldError = (fieldName: keyof FormData) => {
    return errors[fieldName] ? (
      <span className="text-red-500 text-sm mt-1">
        {errors[fieldName]?.message as string}
      </span>
    ) : null;
  };

  return (
    <section className="px-4 py-5 md:px-0 md:py-2 w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Personal Details */}
          <div className="border border-gray-100  bg-gray-100 rounded-lg shadow mb-4">
            <h3
              className="text-lg font-semibold bg-gray-100 px-4 py-3"
              style={{ fontFamily: "BR Cobane" }}
            >
              Personal Details
            </h3>
            <div className="px-4 py-4 m-1 bg-white rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                {/* First Name */}
                <div className="">
                  <Label>
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    placeholder="First Name"
                    className={` w-full focus:outline-none focus:border-b focus:border-orange-500 ${
                      errors.first_name ? "border-red-500" : ""
                    }`}
                  />
                  {getFieldError("first_name")}
                </div>
                {/* Middle Name */}
                <div className="">
                  <Label>Middle Name</Label>
                  <Input
                    type="text"
                    {...register("middle_name")}
                    placeholder="Middle Name"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
                {/* Last Name */}
                <div className="">
                  <Label>
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    placeholder="Last Name"
                    className={` w-full focus:outline-none focus:border-b focus:border-orange-500 ${
                      errors.last_name ? "border-red-500" : ""
                    }`}
                  />
                  {getFieldError("last_name")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Prefix */}
                <div className="w-full">
                  <Label>Prefix</Label>
                  <Input
                    type="text"
                    {...register("prefix")}
                    placeholder="Mr, Ms, Dr, etc."
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>

                {/* Gender & Birth Date */}
                <div className="">
                  <Label>
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <MetadataSelectComponent
                    type="gender"
                    {...register("gender", { required: "Gender is required" })}
                    value={watch("gender")}
                    className={`flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)] ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  />
                  {getFieldError("gender")}
                </div>
                <div className="">
                  <Label>
                    Birth Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    {...register("birth_date", {
                      required: "Birth date is required",
                    })}
                    className={` w-full focus:outline-none focus:border-b focus:border-orange-500 ${
                      errors.birth_date ? "border-red-500" : ""
                    }`}
                  />
                  {getFieldError("birth_date")}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border border-gray-100 bg-gray-100 rounded shadow mb-4">
            <h3
              className="text-lg font-semibold bg-gray-100 px-4 py-3"
              style={{ fontFamily: "BR Cobane" }}
            >
              Contact Details
            </h3>
            <div className="px-4 py-4 m-1 bg-white rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {/* Primary Phone */}
                <div className="">
                  <Label>
                    Primary Phone <span className="text-red-500">*</span>
                  </Label>
                  <CustomPhoneComponent
                    type="phone_mobile"
                    callingCodeBinding={{
                      ...register("phone_mobile_country", {
                        required: "Primary country code is required",
                      }),
                    }}
                    {...register("phone_mobile", {
                      required: "Primary phone is required",
                    })}
                    placeholder="Primary Phone"
                    className={` w-full focus:outline-none focus:border-b focus:border-orange-500 ${
                      errors.phone_mobile ? "border-red-500" : ""
                    }`}
                  />
                  {getFieldError("phone_mobile")}
                </div>
                {/* Home Phone */}
                <div className="">
                  <Label>Home Phone</Label>
                  <Input
                    type="text"
                    {...register("phone_home")}
                    placeholder="Home Phone"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
                {/* Emergency Phone */}
                <div className="">
                  <Label>Emergency Phone</Label>
                  <Input
                    type="text"
                    {...register("phone_emergency")}
                    placeholder="Emergency Phone"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
                {/* Email */}
                <div className="">
                  <Label>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    {...register("email_id", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Email"
                    className={` w-full focus:outline-none focus:border-b focus:border-orange-500 ${
                      errors.email_id ? "border-red-500" : ""
                    }`}
                  />
                  {getFieldError("email_id")}
                </div>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="border border-gray-100 bg-gray-100 rounded shadow mb-4">
            <h3
              className="text-lg font-semibold bg-gray-100 px-4 py-3"
              style={{ fontFamily: "BR Cobane" }}
            >
              Demographics
            </h3>
            <div className="px-4 py-4 m-1 bg-white rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {/* Nationality */}
                <div className="">
                  <Label>
                    Nationality <span className="text-red-500">*</span>
                  </Label>
                  <MetadataSelectComponent
                    type="nationality"
                    value={watch("nationality")}
                    {...register("nationality", {
                      required: "Nationality is required",
                    })}
                    className={` flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)] ${
                      errors.nationality ? "border-red-500" : ""
                    }`}
                  />
                  {/* <option value="">Select Nationality</option>
              {nationalityOptions.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
                  {getFieldError("nationality")}
                </div>
                {/* Religion */}
                <div className="">
                  <Label>Religion</Label>
                  <MetadataSelectComponent
                    type="religion"
                    {...register("religion")}
                    value={watch("religion")}
                    className=" flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                  />
                  {/* <option value="">Select Religion</option>
              {religionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
                </div>
                {/* Marital Status */}
                <div className="">
                  <Label>Marital Status</Label>
                  <MetadataSelectComponent
                    type="marital_status"
                    {...register("marital_status")}
                    value={watch("marital_status")}
                    className=" flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                  />
                  {/* <option value="">Select Marital Status</option>
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
                </div>
                {/* Caste */}
                <div className="">
                  <Label>Caste</Label>
                  <MetadataSelectComponent
                    type="caste"
                    {...register("caste")}
                    value={watch("caste")}
                    className=" flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                  />
                  {/* <option value="">Select Caste</option>
              {casteOptions.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select> */}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="border border-gray-100 bg-gray-100 rounded shadow mb-8">
            <h3
              className="text-lg font-semibold bg-gray-100 px-4 py-3"
              style={{ fontFamily: "BR Cobane" }}
            >
              Physical Attributes
            </h3>
            <div className="px-4 py-5 m-1 bg-white rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {/* Height */}
                <div className="">
                  <Label>Height (inches)</Label>
                  <Input
                    type="text"
                    {...register("height")}
                    placeholder="Height in inches"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
                {/* Weight */}
                <div className=" flex flex-col">
                  <Label>Weight</Label>
                  <div className="flex gap-2">
                    {/* Select for weight units */}
                    <Controller
                      name="weight_units"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className=" w-32 focus:outline-none focus:border-b focus:border-orange-500">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {weightUnitsOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {/* Input for weight value */}
                    <Input
                      type="text"
                      {...register("weight")}
                      placeholder="Weight"
                      className=" flex-1 focus:outline-none focus:border-b focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="">
                  <Label>Complexion</Label>
                  <Controller
                    name="complexion"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <SelectTrigger className=" w-full focus:outline-none focus:border-b focus:border-orange-500">
                          <SelectValue placeholder="Select Complexion" />
                        </SelectTrigger>
                        <SelectContent>
                          {complexionOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Disability */}
                <div className="">
                  <Label>Disability</Label>
                  <MetadataSelectComponent
                    type="disability"
                    {...register("disability")}
                    value={watch("disability")}
                    className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                  />
                  {/* {disabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
                </div>
              </div>
            </div>
          </div>

          {/* Professional & Social Details */}
          <div className="border border-gray-100 bg-gray-100 rounded shadow mb-8">
            <h3
              className="text-lg font-semibold bg-gray-100 px-4 py-3"
              style={{ fontFamily: "BR Cobane" }}
            >
              Professional & Social Details
            </h3>

            <div className="px-4 py-2 m-1 bg-white rounded-md">
              {/* Profession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5 mt-1">
                <div className="">
                  <Label>Profession</Label>
                  <Controller
                    name="profession"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]">
                          <SelectValue placeholder="Select Profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* WhatsApp Number */}
                <div className="">
                  <Label>WhatsApp Number</Label>
                  <Input
                    type="text"
                    {...register("whatsapp_number")}
                    placeholder="WhatsApp Number"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                {/* LinkedIn */}
                <div className="">
                  <Label>LinkedIn</Label>
                  <Input
                    type="text"
                    {...register("linkedin")}
                    placeholder="LinkedIn URL"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
                {/* Facebook */}
                <div className="">
                  <Label>Facebook</Label>
                  <Input
                    type="text"
                    {...register("facebook")}
                    placeholder="Facebook URL"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
                {/* Instagram */}
                <div className="w-full md:mb-4">
                  <Label>Instagram</Label>
                  <Input
                    type="text"
                    {...register("instagram")}
                    placeholder="Instagram URL"
                    className=" w-full focus:outline-none focus:border-b focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border border-gray-100 bg-gray-100 rounded shadow mb-8">
            <h3
              className="text-lg font-semibold bg-gray-100 px-4 py-3"
              style={{ fontFamily: "BR Cobane" }}
            >
              Summary
            </h3>
            <div className="px-4 pt-4 pb-6 m-1 bg-white rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="w-full md:mb-4">
                  <Label>Brief summary about you</Label>
                  <textarea
                    {...register("summary")}
                    placeholder="A success story, achievement, or any additional info"
                    className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="gray-btn hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="yellow-btn hover:bg-orange-600 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
      <ToastContainer />
    </section>
  );
};

export default Page;
