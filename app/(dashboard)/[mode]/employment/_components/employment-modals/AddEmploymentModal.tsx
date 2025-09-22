import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createEmploymentAsync,
  getEmploymentAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoIosSave, IoMdClose, IoMdCloseCircle } from "react-icons/io";

interface IEmployment {
  id: string | number;
  institution_name: string;
  address_line1: string;
  city: string;
  state_id: number;
  country_id: number;
  zip: string;
  start_year: string;
  end_year: string;
  job_title_id: number;
  last_salary_drawn: string;
}

const defaultEmployment: IEmployment = {
  id: "",
  institution_name: "",
  address_line1: "",
  city: "",
  state_id: 0,
  country_id: 0,
  zip: "",
  start_year: "",
  end_year: "",
  job_title_id: 0,
  last_salary_drawn: "",
};

export function AddEmploymentModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<{
    employments: IEmployment[];
  }>({ defaultValues: { employments: [] } });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "employments",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentEmployment, setCurrentEmployment] = useState<IEmployment>({
    ...defaultEmployment,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { loadStates, findCountryName, findStateName, findJobTitleName } =
    useMetaDataLoader();
  const { selectedProfileID } = useProfileContext();

  // Check if currentEmployment has any meaningful data
  const hasUnsavedEmploymentData = () => {
    return !!(
      currentEmployment.institution_name ||
      currentEmployment.address_line1 ||
      currentEmployment.city ||
      currentEmployment.zip ||
      currentEmployment.start_year ||
      currentEmployment.end_year ||
      currentEmployment.job_title_id ||
      currentEmployment.last_salary_drawn ||
      currentEmployment.state_id ||
      currentEmployment.country_id
    );
  };

  const fetchProfileData = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getEmploymentAsync(data)).unwrap();

      if (result?.success && result.data) {
        reset({ employments: result.data?.employments });
      }
    } catch (err: any) {
      console.error("Error getting profile employment details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      loadStates();
      fetchProfileData();
    }
  }, [selectedProfileID, fetchProfileData, loadStates]);

  // Handle input changes for the local employment form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentEmployment((prev) => ({ ...prev, [name]: value }));
    if (name === "country") loadStates(e.target.value);
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentEmployment((prev) => ({
      ...prev,
      job_title_id: Number(e.target.value),
    }));
  };

  // Add or update employment in the field array
  const handleAddOrUpdate = async () => {
    // Prevent adding empty employment
    if (
      !currentEmployment.institution_name &&
      !currentEmployment.job_title_id &&
      !currentEmployment.start_year &&
      !currentEmployment.end_year
    ) {
      return;
    }

    //update db and on positive response proceed ahead
    const sectionData = {
      profile_id: selectedProfileID,
      ...currentEmployment,
    };
    console.log(sectionData);

    if (editIndex !== null) {
      //update
      // try {
      //   const result = await dispatch(updateAddressAsync(addressData)).unwrap();
      //   if (result && result.status === 'success') {
      //     // toast.success("Address updated successfully!");
      //     proceedwithAddUpdate();
      //   }
      // } catch (err: any) {
      //   // toast.error(err.message || "Failed to update address.");
      //   console.error("Error submitting form:", err);
      // }
    } else {
      //add
      try {
        const result = await dispatch(
          createEmploymentAsync(sectionData)
        ).unwrap();
        console.log(result);
        if (result && result.status === "success") {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_employment_id);
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to add address.");
        console.error("Error submitting form:", err);
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentEmployment, id: String(updateID) }
      : { ...currentEmployment };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }

    setCurrentEmployment({ ...defaultEmployment });
  };

  // Load employment into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentEmployment(fields[index] as IEmployment);
  };

  // Remove employment and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentEmployment({ ...defaultEmployment });
    }
  };

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async () => {
    if (hasUnsavedEmploymentData()) {
      setShowConfirmation(true);
    } else {
      router.push("/createprofile/hobbies");
    }
  };

  // Handle confirmation - save employment and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the employment to be saved, then move to next
      setTimeout(() => {
        router.push("/createprofile/hobbies");
      }, 500);
    } catch (error) {
      console.error("Error saving employment:", error);
      // Still move to next even if save fails
      router.push("/createprofile/hobbies");
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentEmployment({ ...defaultEmployment });
    router.push("/createprofile/hobbies");
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                Add Employment
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-3">
                <Button
                  className="border-0 px-2 bg-white text-black hover:bg-transparent hover:text-orange-400 gap-2"
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleAddOrUpdate}
                >
                  <IoIosSave size={20} />
                  {editIndex !== null ? "Update" : "Save"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="border-0 p-0 bg-transparent text-white hover:bg-transparent  hover:text-red-500"
                    variant="outline"
                  >
                    <IoMdCloseCircle size={20} />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>
          <div className="px-4 pt-2 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="">
                <Label className="ml-1">Company Name</Label>
                <Input
                  type="text"
                  name="institution_name"
                  value={currentEmployment.institution_name}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Job Title</Label>
                <MetadataSelectComponent
                  type="job_title"
                  value={currentEmployment.job_title_id}
                  onChange={handleInputChange}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div className="">
                <Label className="ml-1">Start Year</Label>
                <Input
                  type="number"
                  name="start_year"
                  value={currentEmployment.start_year}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div className="">
                <Label className="ml-1">End Year</Label>
                <Input
                  type="number"
                  name="end_year"
                  value={currentEmployment.end_year}
                  onChange={handleInputChange}
                  placeholder="Year Ended"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Last Salary Drawn</Label>
                <Input
                  type="text"
                  name="last_salary_drawn"
                  value={currentEmployment.last_salary_drawn}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Address</Label>
                <Input
                  type="text"
                  name="address_line1"
                  value={currentEmployment.address_line1}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <Label className="ml-1">Country</Label>
                <MetadataSelectComponent
                  type="country"
                  name="country_id"
                  value={currentEmployment.country_id || ""}
                  onChange={handleInputChange}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label className="ml-1">State</Label>
                <MetadataSelectComponent
                  type="state"
                  name="state_id"
                  value={currentEmployment.state_id || ""}
                  onChange={handleInputChange}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label className="ml-1">City</Label>
                <Input
                  type="text"
                  name="city"
                  value={currentEmployment.city}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Zip Code</Label>
                <Input
                  type="text"
                  name="zip"
                  value={currentEmployment.zip}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
