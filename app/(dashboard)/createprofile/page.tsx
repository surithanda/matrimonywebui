"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createPersonalProfileAsync } from "@/app/store/features/profileSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";

// Extended form data interface
interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  prefix: string;
  suffix: string;
  gender: string;
  birthDate: string;
  primaryPhone: string;
  homePhone: string;
  emergencyPhone: string;
  email: string;
  maritalStatus: string;
  religion: string;
  nationality: string;
  caste: string;
  height: string; // assume inches
  weight: string;
  weightUnits: string;
  disability: string;
  complexion: string;
  profession: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  whatsappNumber: string;
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

  // Option arrays for dropdown fields
  const maritalStatusOptions = [
    { value: "1", label: "Single" },
    { value: "2", label: "Married" },
    { value: "3", label: "Divorced" },
    { value: "4", label: "Widowed" },
  ];

  const religionOptions = [
    { value: "1", label: "Christianity" },
    { value: "2", label: "Islam" },
    { value: "3", label: "Hinduism" },
    { value: "4", label: "Buddhism" },
    { value: "5", label: "Other" },
  ];

  const nationalityOptions = [
    { value: "1", label: "American" },
    { value: "2", label: "Canadian" },
    { value: "3", label: "Indian" },
  ];

  const casteOptions = [
    { value: "1", label: "Brahmin" }, 
    { value: "2", label: "Dalit" },   
    { value: "3", label: "WASP" },    ,
  ];

  const complexionOptions = [
    { value: "1", label: "Fair" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Olive" },
    { value: "4", label: "Brown" },
    { value: "5", label: "Dark" },
  ];

  const disabilityOptions = [
    { value: "0", label: "None" },
    { value: "1", label: "Visual Impairment" },
    { value: "2", label: "Hearing Impairment" },
    { value: "3", label: "Mobility Impairment" },
    { value: "4", label: "Cognitive Impairment" },
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

  // Autofilled initial state for testing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    prefix: "",
    suffix: "",
    gender: "",
    birthDate: "",
    primaryPhone: "",
    homePhone: "",
    emergencyPhone: "",
    email: "",
    maritalStatus: "",
    religion: "",
    nationality: "",
    caste: "",
    height: "",
    weight: "",
    weightUnits: "",
    disability: "",
    complexion: "",
    profession: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    whatsappNumber: "",
    summary: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

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

  // Validate required fields (adjust as necessary)
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.birthDate) {
      errors.birthDate = "Birth date is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.primaryPhone.trim()) {
      errors.primaryPhone = "Primary phone is required";
    }
    if (!formData.nationality) {
      errors.nationality = "Nationality is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

    if (submitAttempted) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Transform form data to API payload
  const transformFormData = (data: FormData) => {
    // Helper functions to map dropdown values to text
    const getMaritalStatusText = (value: string) => {
      const option = maritalStatusOptions.find(opt => opt.value === value);
      return option ? option.label : "Single";
    };

    const getReligionText = (value: string) => {
      const option = religionOptions.find(opt => opt.value === value);
      return option ? option.label : "Other";
    };

    const getNationalityText = (value: string) => {
      const option = nationalityOptions.find(opt => opt.value === value);
      return option ? option.label : "Other";
    };

    const getCasteText = (value: string) => {
      const option = casteOptions.find(opt => opt.value === value);
      return option ? option.label : "General";
    };

    const getComplexionText = (value: string) => {
      const option = complexionOptions.find(opt => opt.value === value);
      return option ? option.label : "Fair";
    };

    const getDisabilityText = (value: string) => {
      const option = disabilityOptions.find(opt => opt.value === value);
      return option ? option.label : "None";
    };

    const getProfessionText = (value: string) => {
      const option = professionOptions.find(opt => opt.value === value);
      return option ? option.label : "Other";
    };

    const getWeightUnitText = (value: string) => {
      const option = weightUnitsOptions.find(opt => opt.value === value);
      return option ? option.label : "Kilograms";
    };

    const inches = data.height.trim() ? Number(data.height) : 70;
    const weight = data.weight.trim() ? Number(data.weight) : 75.5;

    return {
      email: data.email.trim() || "",
      first_name: data.firstName.trim() || "",
      middle_name: data.middleName.trim() || "",
      last_name: data.lastName.trim() || "",
      prefix: data.prefix.trim() || "",
      suffix: data.suffix.trim() || "",
      gender: data.gender || "Male",
      birth_date: data.birthDate || "",
      primary_phone: data.primaryPhone.trim() || "",
      home_phone: data.homePhone.trim() || "",
      emergency_phone: data.emergencyPhone.trim() || "",
      nationality: getNationalityText(data.nationality),
      religion: getReligionText(data.religion),
      marital_status: getMaritalStatusText(data.maritalStatus),
      caste: getCasteText(data.caste),
      height_inches: inches,
      weight: weight,
      weight_unit: getWeightUnitText(data.weightUnits),
      complexion: getComplexionText(data.complexion),
      disability: getDisabilityText(data.disability),
      profession: getProfessionText(data.profession),
      whatsapp_number: data.whatsappNumber.trim() || "",
      linkedin_url: data.linkedin.trim() || "",
      facebook_url: data.facebook.trim() || "",
      instagram_url: data.instagram.trim() || "",
      summary: data.summary.trim() || "",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      return;
    }

    const mappedData = transformFormData(formData);

    try {
      const result = await dispatch(createPersonalProfileAsync(mappedData)).unwrap();
      if (result) {
        toast.success("Profile created successfully!");
        // Reset the form after successful submission
        setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
            prefix: "",
            suffix: "",
            gender: "",
            birthDate: "",
            primaryPhone: "",
            homePhone: "",
            emergencyPhone: "",
            email: "",
            maritalStatus: "",
            religion: "",
            nationality: "",
            caste: "",
            height: "",
            weight: "",
            weightUnits: "",
            disability: "",
            complexion: "",
            profession: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            whatsappNumber: "",
            summary: "",
        });
        setValidationErrors({});
        setSubmitAttempted(false);
        router.push("/createprofile/primarycontact");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create profile");
      console.error("Error submitting form:", err);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData({
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      prefix: "Mr",
      suffix: "Jr",
      gender: "Male",
      birthDate: "1990-01-15",
      primaryPhone: "1234567890",
      homePhone: "0987654321",
      emergencyPhone: "5555555555",
      email: "john.doe@email.com",
      maritalStatus: "1",
      religion: "2",
      nationality: "1",
      caste: "3",
      height: "70",
      weight: "75",
      weightUnits: "kg",
      disability: "0",
      complexion: "2",
      profession: "4",
      linkedin: "https://linkedin.com/in/johndoe",
      facebook: "https://facebook.com/johndoe",
      instagram: "https://instagram.com/johndoe",
      whatsappNumber: "1234567890",
      summary: "Test summary: This is a test profile",
    });
    setValidationErrors({});
    setSubmitAttempted(false);
  };

  const getFieldError = (fieldName: keyof FormData) => {
    return submitAttempted && validationErrors[fieldName] ? (
      <span className="text-red-500 text-sm mt-1">
        {validationErrors[fieldName]}
      </span>
    ) : null;
  };

  return (
    <section className="md:py-5 w-4/5">
      <form className="w-full box-border md:px-6" onSubmit={handleSubmit}>
        {/* Personal Details */}
        <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
        <div className="flex flex-wrap justify-between">
          {/* First Name */}
          <div className="w-[32%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.firstName ? "border-red-500" : ""
              }`}
            />
            {getFieldError("firstName")}
          </div>
          {/* Middle Name */}
          <div className="w-[32%] md:mb-4">
            <label className="block text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Last Name */}
          <div className="w-[32%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.lastName ? "border-red-500" : ""
              }`}
            />
            {getFieldError("lastName")}
          </div>
          {/* Prefix */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Prefix</label>
            <input
              type="text"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              placeholder="Mr, Ms, Dr, etc."
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Suffix */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Suffix</label>
            <input
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              placeholder="Jr, Sr, III, etc."
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Gender & Birth Date */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.gender ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {getFieldError("gender")}
          </div>
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.birthDate ? "border-red-500" : ""
              }`}
            />
            {getFieldError("birthDate")}
          </div>
        </div>

        {/* Contact Details */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Contact Details</h3>
        <div className="flex flex-wrap justify-between">
          {/* Primary Phone */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Primary Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="primaryPhone"
              value={formData.primaryPhone}
              onChange={handleChange}
              placeholder="Primary Phone"
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.primaryPhone ? "border-red-500" : ""
              }`}
            />
            {getFieldError("primaryPhone")}
          </div>
          {/* Home Phone */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Home Phone</label>
            <input
              type="text"
              name="homePhone"
              value={formData.homePhone}
              onChange={handleChange}
              placeholder="Home Phone"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Emergency Phone */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Emergency Phone</label>
            <input
              type="text"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="Emergency Phone"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Email */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.email ? "border-red-500" : ""
              }`}
            />
            {getFieldError("email")}
          </div>
        </div>

        {/* Demographics */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Demographics</h3>
        <div className="flex flex-wrap justify-between">
          {/* Nationality */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Nationality <span className="text-red-500">*</span>
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                validationErrors.nationality ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Nationality</option>
              {nationalityOptions.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {getFieldError("nationality")}
          </div>
          {/* Religion */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Religion</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Religion</option>
              {religionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Marital Status */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Marital Status</option>
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Caste */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Caste</label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Caste</option>
              {casteOptions.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Physical Attributes */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Physical Attributes</h3>
        <div className="flex flex-wrap justify-between">
          {/* Height */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">
              Height (inches)
            </label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Height in inches"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Weight */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Weight Units */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Weight Units</label>
            <select
              name="weightUnits"
              value={formData.weightUnits}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {weightUnitsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Complexion */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Complexion</label>
            <select
              name="complexion"
              value={formData.complexion}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Complexion</option>
              {complexionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Disability */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Disability</label>
            <select
              name="disability"
              value={formData.disability}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {disabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Professional & Social Details */}
        <h3 className="text-lg font-semibold mt-6 mb-3">
          Professional & Social Details
        </h3>
        <div className="flex flex-wrap justify-between">
          {/* Profession */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Profession</label>
            <select
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Profession</option>
              {professionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* WhatsApp Number */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">WhatsApp Number</label>
            <input
              type="text"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* LinkedIn */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Facebook */}
          <div className="w-[49%] md:mb-4">
            <label className="block text-gray-700 mb-2">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="Facebook URL"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Instagram */}
          <div className="w-full md:mb-4">
            <label className="block text-gray-700 mb-2">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Summary */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Summary</h3>
        <div className="flex w-full justify-between">
          <div className="w-full md:mb-4">
            <label className="block text-gray-700 mb-2">
              Brief summary about you
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="A success story, achievement, or any additional info"
              className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="yellow-btn hover:bg-orange-600 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="gray-btn hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer />
    </section>
  );
};

export default Page;