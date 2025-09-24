import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import {
  createAddressAsync,
  getAddressAsync,
} from "@/app/store/features/profileSlice";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
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
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";

interface IAddress {
  id: string;
  city: string;
  state: number;
  country: number;
  zip: string;
  address_line1: string;
  address_line2: string;
  landmark1: string;
  landmark2: string;
  phone?: string;
  state_id?: number;
  country_id?: number;
}

interface IFormData {
  addresses: IAddress[];
}

const defaultAddress = {
  id: "",
  city: "",
  state: 0,
  country: 0,
  zip: "",
  address_line1: "",
  address_line2: "",
  // phone: "",
  landmark1: "",
  landmark2: "",
};

export function AddAddressModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();
  const { selectedProfileID } = useProfileContext();
  const { control, handleSubmit, reset, register, watch } = useForm<IFormData>({
    defaultValues: { addresses: [] },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "addresses",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<IAddress>({
    ...defaultAddress,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { loadStates, formatWithMetaData, findCountryName, findStateName } =
    useMetaDataLoader();
  const { countryList } = useAppSelector((state) => state.metaData);
  // Check if currentAddress has any meaningful data
  const hasUnsavedAddressData = () => {
    return !!(
      currentAddress.city ||
      currentAddress.state ||
      currentAddress.country ||
      currentAddress.zip ||
      currentAddress.address_line1 ||
      currentAddress.address_line2 ||
      currentAddress.landmark1 ||
      currentAddress.landmark2
    );
  };

  const fetchProfileAddress = useCallback(async () => {
    const data = {
      profile_id: selectedProfileID,
    };
    try {
      const result = await dispatch(getAddressAsync(data)).unwrap();

      if (result?.success && result.data) {
        reset({ addresses: result.data?.addresses });
      }
    } catch (err: any) {
      console.error("Error getting profile address details:", err);
    }
  }, [dispatch, reset, selectedProfileID]);

  useEffect(() => {
    if (selectedProfileID && selectedProfileID !== 0) {
      // loadStates();
      // if (countryList) {
      fetchProfileAddress();
      // }
    }
  }, [selectedProfileID, loadStates, fetchProfileAddress]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setActiveDropdown(null);
    };

    if (activeDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  // When editing, load the address into local state
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setCurrentAddress(fields[index] as IAddress);
  };

  // Delete address
  const handleDelete = (index: number) => {
    remove(index);
    setEditIndex(null);
    setCurrentAddress({ ...defaultAddress });
  };

  // Cancel edit operation
  const handleCancelEdit = () => {
    setEditIndex(null);
    setCurrentAddress({ ...defaultAddress });
  };
  const handleAddOrUpdate = async () => {
    if (
      !currentAddress.city &&
      !currentAddress.state &&
      !currentAddress.country &&
      !currentAddress.zip &&
      !currentAddress.address_line1 &&
      !currentAddress.address_line2 &&
      // !currentAddress.phone &&
      !currentAddress.landmark1 &&
      !currentAddress.landmark2
    ) {
      // Prevent adding empty address
      return;
    }

    // proceedwithAddUpdate();
    // return;

    //update db and on positive response proceed ahead
    const addressData = {
      profile_id: selectedProfileID,
      address_type: 1,
      ...currentAddress,
    };
    console.log(addressData);
    // return;

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
        const result = await dispatch(createAddressAsync(addressData)).unwrap();
        console.log(result);
        if (result && result.status === "success") {
          // toast.success("Address added successfully!");
          proceedwithAddUpdate(result?.profile_address_id);
        }
      } catch (err: any) {
        // toast.error(err.message || "Failed to add address.");
        console.error("Error submitting form:", err);
      }
    }
  };

  const proceedwithAddUpdate = (updateID?: string | number) => {
    // Update the id field of the address being added/updated
    const updatedAddress = updateID
      ? { ...currentAddress, id: String(updateID) }
      : { ...currentAddress };
    if (editIndex !== null) {
      update(editIndex, updatedAddress);
      setEditIndex(null);
    } else {
      append(updatedAddress);
    }
    setCurrentAddress({ ...defaultAddress });
  };

  // Handle confirmation - save address and proceed
  const handleConfirmSaveAndContinue = async () => {
    setShowConfirmation(false);
    try {
      await handleAddOrUpdate();
      // Wait a bit for the address to be saved, then move to next
      setTimeout(() => {
        moveToNext();
      }, 500);
    } catch (error) {
      console.error("Error saving address:", error);
      // Still move to next even if save fails
      moveToNext();
    }
  };

  // Handle confirmation - discard changes and proceed
  const handleDiscardAndContinue = () => {
    setShowConfirmation(false);
    setCurrentAddress({ ...defaultAddress });
    moveToNext();
  };

  // Handle confirmation - cancel and stay on page
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const moveToNext = () => {
    const nextRoute = getNextRoute("/createprofile/primarycontact");
    router.push(nextRoute);
  };

  
  // On submit, check for unsaved data and show confirmation if needed
  const onSubmit = useCallback(async (data: IFormData) => {
    console.log("Form submitted:", data, hasUnsavedAddressData());
    if (hasUnsavedAddressData()) {
      setShowConfirmation(true);
    } else {
      moveToNext();
    }
  }, [hasUnsavedAddressData, moveToNext]);

  // Listen for continue event from top navigation
  useEffect(() => {
    const handleContinueEvent = () => {
      // Trigger form submission
      handleSubmit(onSubmit)();
    };

    window.addEventListener("profile-continue", handleContinueEvent);
    return () =>
      window.removeEventListener("profile-continue", handleContinueEvent);
  }, [handleSubmit, onSubmit]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                Add Address
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-3">
                <Button
                    className="px-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 gap-2 rounded-md shadow-md transition-colors"
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
              <div>
                <Label className="ml-1">Country</Label>
                <MetadataSelectComponent
                  type="country"
                  value={currentAddress.country}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      country: Number(e.target.value),
                    });
                    loadStates(e.target.value);
                  }}
                  dontUseID={true}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label className="ml-1">State</Label>
                <MetadataSelectComponent
                  type="state"
                  value={currentAddress?.state}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      state: Number(e.target.value),
                    });
                  }}
                  className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
                />
              </div>
              <div>
                <Label className="ml-1">City</Label>
                <Input
                  type="text"
                  value={currentAddress.city}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      city: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Zip Code</Label>
                <Input
                  type="text"
                  value={currentAddress.zip}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      zip: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
            </div>
            <div className="mt-3">
              <Label className="ml-1">Address Line 1</Label>
              <Input
                type="text"
                value={currentAddress.address_line1}
                onChange={(e) =>
                  setCurrentAddress({
                    ...currentAddress,
                    address_line1: e.target.value,
                  })
                }
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div className="mt-3">
              <Label className="ml-1">Address Line 2</Label>
              <Input
                type="text"
                value={currentAddress.address_line2}
                onChange={(e) =>
                  setCurrentAddress({
                    ...currentAddress,
                    address_line2: e.target.value,
                  })
                }
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <Label className="ml-1">Landmark 1</Label>
                <Input
                  type="text"
                  value={currentAddress.landmark1}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      landmark1: e.target.value,
                    })
                  }
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
                />
              </div>
              <div>
                <Label className="ml-1">Landmark 2</Label>
                <Input
                  type="text"
                  value={currentAddress.landmark2}
                  onChange={(e) =>
                    setCurrentAddress({
                      ...currentAddress,
                      landmark2: e.target.value,
                    })
                  }
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
