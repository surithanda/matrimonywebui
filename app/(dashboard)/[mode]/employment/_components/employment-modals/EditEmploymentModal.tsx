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

export function EditEmploymentModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form>
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Title left */}
              <DialogTitle className="text-white text-xl" style={{ fontFamily: "BR Cobane" }}>
                Edit Employment
              </DialogTitle>

              {/* Button right */}
              <div className="flex items-center gap-3">
                <Button
                  className="border-0 p-0 bg-transparent text-white hover:bg-transparent hover:text-orange-400 gap-2"
                    variant={"outline"}
                size={"sm"}
              >
                <IoIosSave size={20} />
                Save
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
                placeholder="Institute Name"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="ml-1">Job Title</Label>
              <MetadataSelectComponent
                type="job_title"
                // value={currentEducation.field_of_study}
                // onChange={handleInputChange}
                className="flex gap-10 align-self-stretch px-4 py-3 w-full border rounded-lg focus:outline-none focus:border-b focus:border-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
              />
            </div>
            <div className="">
              <Label className="ml-1">Start Year</Label>
              <Input
                type="text"
                placeholder="Year Started"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div className="">
              <Label className="ml-1">End Year</Label>
              <Input
                type="text"
                placeholder="Year Ended"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="ml-1">Last Salary Drawn</Label>
              <Input
                type="text"
                placeholder="Last Salary Drawn"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="ml-1">Address</Label>
              <Input
                type="text"
                placeholder="Complete Address"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <Label className="ml-1">Country</Label>
              <Select>
                <SelectTrigger className="w-[100%]">
                  <SelectValue placeholder="Select a country" />
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
                  <SelectValue placeholder="Select a state" />
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
                placeholder="Enter city"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="ml-1">Zip Code</Label>
              <Input
                type="text"
                placeholder="Enter zip code"
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
