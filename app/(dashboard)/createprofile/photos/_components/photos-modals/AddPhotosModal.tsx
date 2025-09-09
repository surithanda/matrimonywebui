"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoIosSave, IoMdCloseCircle } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const photoTypes = [
  "Clear Headshot",
  "Full-body shot",
  "Casual or Lifestyle Shot",
  "Family Photo",
  "Candid or Fun Moment",
  "Hobby or Activity Photo",
  "Other",
];

export function AddPhotosModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form>
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle style={{ fontFamily: "BR Cobane" }}>
                Add Photos
              </DialogTitle>

              <div className="flex items-center gap-2">
                <Button
                  className="border hover:text-orange-600 gap-2"
                  variant={"outline"}
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

          <div className="mt-4 space-y-4">
            {/* Select option */}
            <Select onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select photo type(s)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {photoTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Show chosen items */}
            {selectedTypes.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {selectedTypes.map((type) => (
                  <div key={type} className="grid border rounded-lg px-3 py-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`file-${type}`} className="p-0 m-0">{type}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() =>
                          setSelectedTypes((prev) =>
                            prev.filter((t) => t !== type)
                          )
                        }
                      >
                       <RiDeleteBin6Line size={20}/>
                      </Button>
                    </div>
                    <Input
                      id={`file-${type}`}
                      type="file"
                      accept="image/*"
                      className="cursor-pointer h-10"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
