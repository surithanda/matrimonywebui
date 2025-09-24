import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoIosSave, IoMdClose, IoMdCloseCircle } from "react-icons/io";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  getPropertiesAsync,
  createPropertyAsync,
  updatePropertyAsync,
  deletePropertyAsync,
} from "@/app/store/features/profileSlice";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { IProfileProperty } from "@/app/models/Profile";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { Label } from "@/components/ui/label";

interface IPropertyFieldValue extends IProfileProperty {
  id?: string;
  _id?: string; // for react-hook-form
}

interface IFormValues {
  properties: IPropertyFieldValue[];
}

const defaultProperty: IPropertyFieldValue = {
  profile_id: null,
  property_type: -1,
  ownership_type: -1,
  property_value: null,
  property_description: "",
  property_address: "",
};

export function AddPropertyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const router = useRouter();
  const { selectedProfileID } = useProfileContext();
  const dispatch = useAppDispatch();
  const { properties, loading, error } = useAppSelector(
    (state) => state.profile
  );
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: { properties: [] },
  });
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "properties",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProperty, setCurrentProperty] = useState<IPropertyFieldValue>({
    ...defaultProperty,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { findPropertyTypeName, findOwnershipTypeName } = useMetaDataLoader();
  // Handle input changes for the local property form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // console.log("handleInputChange called with name:", name, "value:", value);
    setCurrentProperty((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update property in the field array (POST or PUT to backend)
  const handleAddOrUpdate = async () => {
    console.log(
      "handleAddOrUpdate called with currentProperty:",
      currentProperty
    );
    // Validation: require all key fields
    if (
      !currentProperty.property_type ||
      !currentProperty.ownership_type ||
      !currentProperty.property_value ||
      !currentProperty.property_address
    ) {
      setLocalError("All fields except description are required.");
      return;
    }
    setLocalError(null);
    if (!selectedProfileID) {
      setLocalError("Profile ID not found.");
      return;
    }
    if (editIndex !== null) {
      // Update existing property
      try {
        const result = await dispatch(
          updatePropertyAsync({
            ...currentProperty,
            id: fields[editIndex].id,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.status === "success") {
          proceedWithAddUpdate(currentProperty.id);
        }
      } catch (err: any) {
        setLocalError(err.message || "Error updating property");
      }
    } else {
      // Add new property
      try {
        const result = await dispatch(
          createPropertyAsync({
            ...currentProperty,
            profile_id: selectedProfileID,
          })
        ).unwrap();
        if (result && result.data.status === "success") {
          proceedWithAddUpdate(result.data.profile_property_id);
        }
      } catch (err: any) {
        setLocalError(err.message || "Error adding property");
      }
    }
  };

  const proceedWithAddUpdate = (updateID?: any) => {
    // Update the id field of record being added/updated
    const updatedData = updateID
      ? { ...currentProperty, id: updateID }
      : { ...currentProperty };
    if (editIndex !== null) {
      update(editIndex, updatedData);
      setEditIndex(null);
    } else {
      append(updatedData);
    }
    setCurrentProperty({ ...defaultProperty });
  };

  // Load property into form for editing
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentProperty({ ...fields[index] });
  };

  // Remove property from backend and local state
  const handleDelete = async (index: number) => {
    const item = fields[index];
    if (!item || !item.id) {
      // fallback: just remove locally if no backend id
      remove(index);
      if (editIndex === index) {
        setEditIndex(null);
        setCurrentProperty({ ...defaultProperty });
      }
      return;
    }
    try {
      const result = await dispatch(deletePropertyAsync(item.id)).unwrap();
      if (result && result.status === "success") {
        proceedWithDelete(index);
      }
    } catch (err: any) {
      setLocalError(err.message || "Error deleting property");
    }
  };

  const proceedWithDelete = (index: number) => {
    remove(index);
    if (editIndex === index) {
      setEditIndex(null);
      setCurrentProperty({ ...defaultProperty });
    }
  };

  // On submit, just continue (properties are already saved)
  const onSubmit = async () => {
    router.push("/createprofile/photos");
  };

  // Check if there are unsaved property data
  const hasUnsavedPropertyData = () => {
    return (
      currentProperty.property_type !== -1 ||
      currentProperty.ownership_type !== -1 ||
      currentProperty.property_value ||
      currentProperty.property_description ||
      currentProperty.property_address
    );
  };

  // Handle continue button click with confirmation
  const handleContinue = () => {
    if (hasUnsavedPropertyData()) {
      setShowConfirmation(true);
    } else {
      router.push("/createprofile/photos");
    }
  };

  // Handle confirmation actions
  const handleSaveAndContinue = async () => {
    await handleAddOrUpdate();
    setShowConfirmation(false);
    router.push("/createprofile/photos");
  };

  const handleDiscardAndContinue = () => {
    setCurrentProperty({ ...defaultProperty });
    setEditIndex(null);
    setShowConfirmation(false);
    router.push("/createprofile/photos");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Fetch properties from backend on mount
  useEffect(() => {
    if (!selectedProfileID) return;
    dispatch(getPropertiesAsync({ profile_id: selectedProfileID })).then(
      (result: any) => {
        if (result.payload?.data) {
          reset(result.payload.data);
        }
      }
    );
  }, [selectedProfileID, dispatch, reset]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form    onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle className="text-white text-xl" style={{ fontFamily: "BR Cobane" }}>
                Add Property
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
              <div className="">
                <Label className="block text-gray-700 mb-2">
                  Property Type
                </Label>
                <MetadataSelectComponent
                  type="property_type"
                  value={currentProperty.property_type ?? -1}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <Label className="block text-gray-700 mb-2">
                  Ownership Type
                </Label>
                <MetadataSelectComponent
                  type="ownership_type"
                  value={currentProperty.ownership_type ?? -1}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full mb-2">
              <Label className="block text-gray-700 mb-2">
                Complete Address
              </Label>
              <Input
                name="property_address"
                value={currentProperty.property_address}
                onChange={handleInputChange}
                className="stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-2">
              <Label className="block text-gray-700 mb-2">Size/Area</Label>
              <Input
             type="text"
                name="property_value"
                value={currentProperty.property_value ?? ""}
                onChange={handleInputChange}
                className="stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="">
              <Label className="block text-gray-700 mb-2">Description</Label>
              <Input
                type="text"
                name="property_description"
                value={currentProperty.property_description}
                onChange={handleInputChange}
                className="stretch w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
