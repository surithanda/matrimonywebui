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
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSelect = (value: string) => {
    setSelectedType(value);
    setFile(null); // reset previous file if any
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-2xl">
        <form>
          <DialogHeader className="bg-[#0d0d0d]/50 p-1 rounded-t-sm">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle
                className="text-white text-xl"
                style={{ fontFamily: "BR Cobane" }}
              >
                Add Photo
              </DialogTitle>

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
                    className="border-0 p-0 bg-transparent text-white hover:bg-transparent hover:text-red-500"
                    variant="outline"
                  >
                    <IoMdCloseCircle size={20} />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          <div className="px-4 pt-2 pb-4">
            <div className="mt-4 space-y-4">
              {/* Select one photo type */}
              <Select onValueChange={handleSelect} value={selectedType || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select photo type" />
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

              {/* Show file input if a type is selected */}
              {selectedType && (
                <div className="grid border rounded-lg px-3 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="file-input">{selectedType}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        setSelectedType(null);
                        setFile(null);
                      }}
                    >
                      <RiDeleteBin6Line size={20} />
                    </Button>
                  </div>
                  <Input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer h-10"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
