import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createEducationAsync,
  getEducationAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch } from "@/app/store/store";
import { getNextRoute } from "@/app/utils/routeOrder";
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

interface IEducation {
  id: string | number;
  education_level: number;
  year_completed: string | number;
  institution_name: string;
  address_line1: string;
  city: string;
  zip: string;
  field_of_study: number;
  state_id?: number;
  country_id?: number;
}

interface IFormValues {
  educations: IEducation[];
}

const defaultEducation = {
  id: "",
  education_level: 1,
  year_completed: "",
  institution_name: "",
  address_line1: "",
  city: "",
  state_id: 0,
  country_id: 0,
  zip: "",
  field_of_study: 1,
};

export function AddEducationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { educations: [] },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "educations",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentEducation, setCurrentEducation] = useState<IEducation>({
    ...defaultEducation,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { loadStates, formatWithMetaData, findCountryName, findStateName } =
    useMetaDataLoader();
  const { selectedProfileID } = useProfileContext();

  // Check if currentEducation has any meaningful data
  const hasUnsavedEducationData = () => {
    return !!(
      currentEducation.institution_name ||
      currentEducation.year_completed ||
      currentEducation.education_level !== 1 ||
      currentEducation.field_of_study !== 1 ||
      currentEducation.address_line1 ||
      currentEducation.city ||
      currentEducation.zip ||
      currentEducation.state_id ||
      currentEducation.country_id
    );
  };

  const fetchProfileData = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getEducationAsync(data)).unwrap();

      if (result?.success && result.data) {
        reset({ educations: result.data?.educations });
      }
    } catch (err: any) {
      console.error("Error getting profile address details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      loadStates();
      fetchProfileData();
    }
  }, [selectedProfileID, fetchProfileData, loadStates]);

  // Handle input changes for the local education form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(e.target.value, 10);
    setCurrentEducation((prev) => ({
      ...prev,
      country_id: countryId,
      state_id: 0,
    })); // Reset state when country changes
    loadStates(countryId.toString());
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentEducation((prev) => ({
      ...prev,
      state_id: parseInt(e.target.value, 10),
    }));
  };

  // Add or update education in the field array
  const handleAddOrUpdate = async () => {
    // Prevent adding empty education
    if (
      !currentEducation.institution_name &&
      !currentEducation.year_completed
    ) {
      return;
    }

    //update db and on positive response proceed ahead
    const sectionData = {
      profile_id: selectedProfileID,
      ...currentEducation,
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
          createEducationAsync(sectionData)
        ).unwrap();
        console.log(result);
        if (result && result.status === "success") {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_education_id);
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
      ? { ...currentEducation, id: String(updateID) }
      : { ...currentEducation };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }

    setCurrentEducation({ ...defaultEducation });
  };

  // Load education into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentEducation({ ...fields[index] });
  };

  // Remove education and clear form if editing
  const handleDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentEducation({ ...defaultEducation });
    }
  };

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async () => {
    if (hasUnsavedEducationData()) {
      setShowConfirmation(true);
    } else {
      moveToNext();
    }
  };

  // Handle confirmation - save education and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the education to be saved, then move to next
      setTimeout(() => {
        moveToNext();
      }, 500);
    } catch (error) {
      console.error("Error saving education:", error);
      // Still move to next even if save fails
      moveToNext();
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentEducation({ ...defaultEducation });
    moveToNext();
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/education");
    router.push(nextRoute);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form           onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}>
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                Add Education
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="">
                <Label>Institute Name</Label>
                <Input
                  type="text"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div className="">
                <Label>Year Completed</Label>
                <Input
                  type="text"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>
            <div className="w-full mb-2">
              <Label>Field of Study</Label>
              <MetadataSelectComponent
                type="field_of_study"
                // value={currentEducation.field_of_study}
                // onChange={handleInputChange}
                className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
              />
            </div>
            <div className="mb-2">
              <Label>Address</Label>
              <Input
                type="text"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Country</Label>
                <MetadataSelectComponent
                  type="country"
                  value={currentEducation.country_id || ""}
                  onChange={handleCountryChange}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label>State</Label>
                <MetadataSelectComponent
                  type="state"
                  value={currentEducation.state_id || ""}
                  onChange={handleStateChange}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={currentEducation.city}
                  onChange={handleInputChange}
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label>ZIP / PIN Code</Label>
                <Input
                  type="text"
                  name="zip"
                  value={currentEducation.zip}
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
