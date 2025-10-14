import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createFamilyAsync,
  deleteFamilyAsync,
  getFamilyAsync,
  updateFamilyAsync,
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoIosSave, IoMdClose, IoMdCloseCircle } from "react-icons/io";

interface IFamilyMember {
  id: string;
  firstname: string;
  lastname: string;
  dob: string;
  contactnumber: string;
  contactnumber_country: string;
  email: string;
  relationshiptoyou: string;
  address_line: string;
  city: string;
  state_id: number;
  country_id: number;
  zip: string;
  _id?: string; // for react-hook-form
}

interface IFormValues {
  family: IFamilyMember[];
}

const defaultFamilyMember: IFamilyMember = {
  id: "",
  firstname: "",
  lastname: "",
  dob: "",
  contactnumber: "",
  contactnumber_country: "",
  email: "",
  relationshiptoyou: "",
  address_line: "",
  city: "",
  state_id: 0,
  country_id: 0,
  zip: "",
};

type familyReferenceProps = {
  category: string;
  next_url: string;
  actionButton_label: string;
};

export function EditFamilyModal({
  open,
  onOpenChange,
  category = "family",
  next_url = "/createprofile/references",
  actionButton_label = "Member",
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
} & familyReferenceProps) {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const {
    family: familyList,
    loading: familyLoading,
    error: familyError,
  } = useAppSelector((state) => state.profile);
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { family: [] },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "family",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentFamilyMember, setCurrentFamilyMember] = useState<IFamilyMember>(
    { ...defaultFamilyMember }
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadStates, findCountryName, findStateName } = useMetaDataLoader();
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
  });

  // Check if currentFamilyMember has any meaningful data
  const hasUnsavedFamilyData = () => {
    return !!(
      currentFamilyMember.firstname ||
      currentFamilyMember.lastname ||
      currentFamilyMember.dob ||
      currentFamilyMember.contactnumber ||
      currentFamilyMember.email ||
      currentFamilyMember.relationshiptoyou ||
      currentFamilyMember.address_line ||
      currentFamilyMember.city ||
      currentFamilyMember.zip ||
      currentFamilyMember.state_id ||
      currentFamilyMember.country_id
    );
  };

  // Handle input changes for the local family member form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "relationshiptoyou") {
      setCurrentFamilyMember((prev) => ({ ...prev, relationshiptoyou: value }));
    } else if (name === "country_id") {
      const countryId = parseInt(value, 10);
      setCurrentFamilyMember((prev) => ({
        ...prev,
        country_id: countryId,
        state_id: 0,
      }));
      loadStates(value);
    } else if (name === "state_id") {
      setCurrentFamilyMember((prev) => ({
        ...prev,
        state_id: parseInt(value, 10),
      }));
    } else {
      setCurrentFamilyMember((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch family members from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(
      getFamilyAsync({ profile_id: selectedProfileID, type: category })
    ).then((result: any) => {
      if (result.payload?.success && result.payload.data) {
        const formattedData = result.payload.data?.family?.map((item: any) => ({
          id: item.profile_family_reference_id,
          firstname: item.first_name,
          lastname: item.last_name,
          dob: item.date_of_birth,
          contactnumber: item.primary_phone,
          contactnumber_country: item.contactnumber_country, // Assuming this field exists
          email: item.email,
          relationshiptoyou: item.reference_type,
          address_line: item.address_line1,
          city: item.city,
          state_id: item.state_id,
          country_id: item.country_id,
          zip: item.zip,
        }));
        reset({ family: formattedData || [] });
      }
    });
  }, [selectedProfileID, dispatch, category, reset]);

  // Add or update family member in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    console.log(currentFamilyMember);
    // Validation: require all key fields
    if (
      !currentFamilyMember.firstname ||
      !currentFamilyMember.lastname ||
      !currentFamilyMember.address_line ||
      !currentFamilyMember.city ||
      !currentFamilyMember.state_id ||
      !currentFamilyMember.country_id ||
      !currentFamilyMember.zip ||
      !currentFamilyMember.dob ||
      !currentFamilyMember.contactnumber ||
      !currentFamilyMember.email ||
      !currentFamilyMember.relationshiptoyou
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    if (editIndex !== null) {
      // Update existing family member
      try {
        const result = await dispatch(
          updateFamilyAsync({
            ...currentFamilyMember,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedwithAddUpdate(currentFamilyMember.id);
        }
      } catch (err: any) {
        setError(
          err.message || `Error updating ${actionButton_label.toLowerCase()}`
        );
      }
    } else {
      // Add new family member
      try {
        const result = await dispatch(
          createFamilyAsync({
            ...currentFamilyMember,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        console.log("Add family result:", result);
        if (result && result.data.status === "success") {
          proceedwithAddUpdate(result.data.profile_family_reference_id);
        }
      } catch (err: any) {
        setError(
          err.message || `Error adding ${actionButton_label.toLowerCase()}`
        );
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentFamilyMember, id: String(updateID) }
      : { ...currentFamilyMember };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentFamilyMember({ ...defaultFamilyMember });
  };

  // Load family member into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentFamilyMember({ ...fields[index] });
  };

  // Remove family member from backend and local state
  const handleDelete = async (index: number) => {
    const member = fields[index];
    // if (!member || !member.id) {
    //   // fallback: just remove locally if no backend id
    //   remove(index);
    //   if (editIndex === index) {
    //     setEditIndex(null);
    //     setCurrentFamilyMember({ ...defaultFamilyMember });
    //   }
    //   return;
    // }
    try {
      const result = await dispatch(deleteFamilyAsync(member.id)).unwrap();
      if (result && result.status === "success") {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setError(
        err.message || `Error deleting ${actionButton_label.toLowerCase()}`
      );
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentFamilyMember({ ...defaultFamilyMember });
    }
  };

  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = async () => {
    if (hasUnsavedFamilyData()) {
      setShowConfirmation(true);
    } else {
      router.push(next_url);
    }
  };

  // Handle confirmation - save family member and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the family member to be saved, then move to next
      setTimeout(() => {
        router.push(next_url);
      }, 500);
    } catch (error) {
      console.error(`Error saving ${actionButton_label.toLowerCase()}:`, error);
      // Still move to next even if save fails
      router.push(next_url);
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentFamilyMember({ ...defaultFamilyMember });
    router.push(next_url);
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form
          className="w-full px-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <DialogHeader className="">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle style={{ fontFamily: "BR Cobane" }}>
                Edit Family
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-2">
                <Button
                 onClick={handleConfirmSaveAndContinue}
                  className="border hover:text-orange-600 gap-2"
             variant={"outline"}
                size={"sm"}
              >
                <IoIosSave size={20} />
                Save
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="border bg-transparent p-0 hover:text-red-500"
                    variant="outline"
                    size={"icon"}
                  >
                    <IoMdCloseCircle size={20} />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label className="block text-gray-700 mb-2">
                Relationship to you
              </Label>
              <MetadataSelectComponent
                type={category}
                name="relationshiptoyou"
                value={currentFamilyMember.relationshiptoyou}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="">
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstname"
                value={currentFamilyMember.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>

            <div className="">
              <Label className="block text-gray-700 mb-2">Last Name</Label>
              <Input
                type="text"
                name="lastname"
                value={currentFamilyMember.lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="">
              <Label className="block text-gray-700 mb-2">Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={currentFamilyMember.dob}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div>
              <Label className="block text-gray-700 mb-2">Contact Number</Label>
              <CustomPhoneComponent
                type="contactnumber"
                changeHandler={handleInputChange}
                bindValue={currentFamilyMember.contactnumber}
                bindValue2={currentFamilyMember.contactnumber_country}
                placeholder="Contact Number"
                disabled={loading}
              />
            </div>
            <div>
              <Label className="block text-gray-700 mb-2">Email</Label>
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={currentFamilyMember.email}
                onChange={handleInputChange}
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
          </div>
          <div className="mt-2 mb-2">
            <Label>Address</Label>
            <Input
              type="text"
              placeholder="Complete Address"
              className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <Label className="block text-gray-700 mb-2">Country</Label>
              <MetadataSelectComponent
                type="country"
                name="country_id"
                value={currentFamilyMember.country_id}
                onChange={handleInputChange}
                className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                disabled={loading}
              />
            </div>
            <div>
              <Label className="block text-gray-700 mb-2">State</Label>
              <MetadataSelectComponent
                type="state"
                name="state_id"
                value={currentFamilyMember.state_id}
                onChange={handleInputChange}
                className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                disabled={loading}
              />
            </div>
            <div>
              <Label className="block text-gray-700 mb-2">City</Label>
              <Input
                type="text"
                name="city"
                value={currentFamilyMember.city}
                onChange={handleInputChange}
                placeholder="City"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
            <div className="">
              <Label className="block text-gray-700 mb-2">Zip</Label>
              <Input
                type="text"
                name="zip"
                value={currentFamilyMember.zip}
                onChange={handleInputChange}
                placeholder="ZIP / PIN Code"
                className="account-input-field stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
