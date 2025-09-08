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

export function AddAddressModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "BR Cobane" }}>
            Add Address
          </DialogTitle>
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
                className="account-input-field stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label>Zip Code</Label>
              <Input
                type="text"
                placeholder="Enter zip code"
                className="account-input-field stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
          </div>
          <div className="mt-3">
            <Label>Complete</Label>
            <Textarea
              placeholder="Enter here complete address"
              className="account-input-field stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
            />
          </div>
          <div className="mt-3">
            <Label>Address Line 2</Label>
            <Input
              type="text"
              placeholder="Address Line 2"
              className="account-input-field stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <Label>Landmark 1</Label>
              <Input
                type="text"
                placeholder="Landmark 1"
                className="account-input-field stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
            <div>
              <Label>Landmark 2</Label>
              <Input
                type="text"
                placeholder="Landmark 2"
                className="account-input-field stretch w-full focus:outline-none focus:border-b focus:border-orange-500"
              />
            </div>
          </div>
        </form>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button className="bg-orange-500 hover:bg-orange-400">Add Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
