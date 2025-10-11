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

export function EditEducationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <DialogHeader className="">
          <div className="flex items-center justify-between gap-4">
            {/* Title left */}
            <DialogTitle style={{ fontFamily: "BR Cobane" }}>
              Add Education
            </DialogTitle>

            {/* Button right */}
            <div className="flex items-center gap-2">
              <Button
                className="border hover:text-orange-600 gap-2"
               variant={"outline"}
                size={"sm"}
              >
                <IoIosSave size={20} />
                Save
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
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="">
              <Label>Institute Name</Label>
              <Input
                type="text"
                placeholder="Institute Name"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div className="">
              <Label>Year Completed</Label>
              <Input
                type="text"
                placeholder="Year Completed"
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
              placeholder="Address"
              className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label>Country</Label>
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
              <Label>State</Label>
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
              <Label>City</Label>
              <Input
                type="text"
                placeholder="Enter city"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label>ZIP / PIN Code</Label>
              <Input
                type="text"
                placeholder="Enter ZIP / PIN Code"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
