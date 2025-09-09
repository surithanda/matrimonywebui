import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";

export function EditAddressModal({
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
              Edit Address
            </DialogTitle>

            {/* Button right */}
            <div className="flex items-center gap-2">
              <Button
                className="border hover:text-orange-600 gap-2"
                variant={"outline"}
              >
                <IoIosSave size={20} />
                Update
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
              <Label>Zip Code</Label>
              <Input
                type="text"
                placeholder="Enter zip code"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
          </div>
          <div className="mt-3">
            <Label>Address Line 1</Label>
            <Input
              type="text"
              placeholder="Address Line 1"
              className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
            />
          </div>
          <div className="mt-3">
            <Label>Address Line 2</Label>
            <Input
              type="text"
              placeholder="Address Line 2"
              className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <Label>Landmark 1</Label>
              <Input
                type="text"
                placeholder="Landmark 1"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label>Landmark 2</Label>
              <Input
                type="text"
                placeholder="Landmark 2"
                className=" stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
          </div>
        </form>
        {/* <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button className="bg-orange-500 hover:bg-orange-400">Add Address</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
