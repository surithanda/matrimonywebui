import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import { IProfileFamilyReference } from "@/app/models/Profile";
import {
  createReferenceAsync,
  deleteReferenceAsync,
  getReferenceAsync,
  updateReferenceAsync,
} from "@/app/store/features/profileSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
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
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoIosSave, IoMdClose, IoMdCloseCircle } from "react-icons/io";

interface IReferenceFieldValue extends IProfileFamilyReference {
  id?: string;
  _id?: string; // for react-hook-form
}

interface IFormValues {
  references: IReferenceFieldValue[];
}

const defaultReference: IReferenceFieldValue = {
  profile_id: 0,
  reference_type: 0,
  first_name: "",
  last_name: "",
  gender: 0,
  date_of_birth: new Date(),
  religion: 0,
  nationality: 0,
  caste: 0,
  marital_status: 0,
  highest_education: 0,
  address_line1: "",
  city: "",
  state: "",
  country: "",
  zip: "",
  primary_phone: "",
  can_communicate: false,
  account_id: 0,
};

export function AddFriendAndReferenceModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const {
    references: referenceList,
    loading: referenceLoading,
    error: referenceError,
  } = useAppSelector((state) => state.profile);
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { references: [] },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "references",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentReference, setCurrentReference] =
    useState<IReferenceFieldValue>({ ...defaultReference });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { loadStates, findCountryName, findStateName } = useMetaDataLoader();

  // Handle input changes for the local reference form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "reference") {
      setCurrentReference((prev) => ({
        ...prev,
        reference_type: Number(value),
      }));
    } else if (name === "country") {
      setCurrentReference((prev) => ({ ...prev, country: value, state: "" }));
      loadStates(value);
    } else if (name === "date_of_birth") {
      setCurrentReference((prev) => ({
        ...prev,
        date_of_birth: new Date(value),
      }));
    } else if (name === "contactnumber") {
      setCurrentReference((prev) => ({ ...prev, primary_phone: value }));
    } else {
      setCurrentReference((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch references from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getReferenceAsync({ profile_id: selectedProfileID })).then(
      (result: any) => {
        if (result.payload?.data) {
          replace(result.payload.data);
        } else {
          replace([]);
        }
      }
    );
  }, [selectedProfileID, dispatch, replace]);

  // Add or update reference in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    // Validation: require all key fields
    if (
      !currentReference.first_name ||
      !currentReference.last_name ||
      !currentReference.address_line1 ||
      !currentReference.city ||
      !currentReference.state ||
      !currentReference.country ||
      !currentReference.zip ||
      !currentReference.date_of_birth ||
      !currentReference.primary_phone ||
      !currentReference.email ||
      !currentReference.reference_type
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (editIndex !== null) {
      // Update existing reference
      try {
        const result = await dispatch(
          updateReferenceAsync({
            ...currentReference,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(currentReference.id);
        }
      } catch (err: any) {
        setError(err.message || "Error updating reference");
      }
    } else {
      // Add new reference
      try {
        const result = await dispatch(
          createReferenceAsync({
            ...currentReference,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(result.profile_reference_id);
        }
      } catch (err: any) {
        setError(err.message || "Error adding reference");
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentReference, id: updateID }
      : { ...currentReference };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentReference({ ...defaultReference });
  };

  // Load reference into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    const referenceToEdit = fields[index];
    setCurrentReference({
      ...referenceToEdit,
      date_of_birth: new Date(referenceToEdit.date_of_birth), // Ensure it's a Date object
    });
  };

  // Remove reference from backend and local state
  const handleDelete = async (index: number) => {
    const member = fields[index];
    try {
      const result = await dispatch(deleteReferenceAsync(member.id)).unwrap();
      if (result && result.status === "success") {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setError(err.message || "Error deleting reference");
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentReference({ ...defaultReference });
    }
  };

  // On submit, just continue (references are already saved)
  const onSubmit = async () => {
    router.push("/createprofile/property");
  };

  // Check if there are unsaved reference data
  const hasUnsavedReferenceData = () => {
    return (
      currentReference.first_name ||
      currentReference.last_name ||
      currentReference.address_line1 ||
      currentReference.city ||
      currentReference.state ||
      currentReference.country ||
      currentReference.zip ||
      currentReference.primary_phone ||
      currentReference.email ||
      currentReference.reference_type !== 0
    );
  };

  // Handle continue button click with confirmation
  const handleContinue = () => {
    if (hasUnsavedReferenceData()) {
      setShowConfirmation(true);
    } else {
      router.push("/createprofile/property");
    }
  };

  // Handle confirmation actions
  const handleSaveAndContinue = async () => {
    await handleAddOrUpdate();
    setShowConfirmation(false);
    router.push("/createprofile/property");
  };

  const handleDiscardAndContinue = () => {
    setCurrentReference({ ...defaultReference });
    setEditIndex(null);
    setShowConfirmation(false);
    router.push("/createprofile/property");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form>
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                Add Friends & Reference
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-3">
                <Button
                  className="border-0 px-2 bg-white text-black hover:bg-transparent hover:text-orange-400 gap-2"
                  variant={"outline"}
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
                <Label className="ml-1">First Name</Label>
                <Input
                  type="text"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div className="">
                <Label className="ml-1">Last Name</Label>
                <Input
                  type="text"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div className="">
                <Label className="ml-1">Date if Birth</Label>
                <Input
                  type="date"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div className="">
                <Label className="ml-1">Email</Label>
                <Input
                  type="email"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div className="w-full mb-2">
                <Label className="ml-1">Contact Number</Label>
                <CustomPhoneComponent
                  type="contactnumber"
                  //   changeHandler={handleInputChange}
                  //   bindValue={currentFamilyMember.contactnumber}
                  //   bindValue2={currentFamilyMember.contactnumber_country}
                  //   disabled={loading}
                />
              </div>
              <div>
                <Label className="block text-gray-700 mb-2">
                  Relationship to you
                </Label>
                <MetadataSelectComponent
                  type="reference"
                  // value={String(currentReference.reference_type)}
                  // onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-2">
              <Label className="ml-1">Address</Label>
              <Input
                type="text"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="ml-1">Country</Label>
                <Select>
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="ml-1">State</Label>
                <Select>
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="ml-1">City</Label>
                <Input
                  type="text"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Zip Code</Label>
                <Input
                  type="text"
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
