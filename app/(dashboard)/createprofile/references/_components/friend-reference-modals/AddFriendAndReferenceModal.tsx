import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoIosSave, IoMdClose, IoMdCloseCircle } from "react-icons/io";

export function AddFriendAndReferenceModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
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
                className="border-0 p-0 bg-transparent text-white hover:bg-transparent hover:text-orange-400 gap-2"
                variant={"outline"}
              >
                <IoIosSave size={20} />
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
          <form>
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
