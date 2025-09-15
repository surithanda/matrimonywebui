"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/store/store";
import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectViewport } from "@radix-ui/react-select";

export default function BillingForm() {
  const { countryList, stateList, genderList } = useAppSelector(
    (state) => state.metaData
  );

  const { loadNecessaryMetaData, loadStates } = useMetaDataLoader();

  const [formData, setFormData] = useState<any>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "country") {
      loadStates(value);
    }
  };

  useEffect(() => {
    loadNecessaryMetaData();
  }, [loadNecessaryMetaData]);
  return (
    <>
      <section className="account-details-box w-full max-w-7xl mx-auto text-left px-4 sm:px-6 lg:px-0 shadow-xl">
        <form className="w-full flex flex-col gap-4 sm:gap-4 text-left">
          {/* Personal Information */}
          <div className="pb-4 sm:pb-6">
            <h3 className="BRCobane18700  mb-2 sm:mb-4 text-sm sm:text-base">
              BILLING INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <div className="grow text-left flex flex-col items-start">
                <Label className="mb-1">Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
              <div className="grow text-left flex flex-col items-start">
                <Label className="mb-1">Address</Label>
                <Input
                  type="text"
                  name="firstName"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>
            </div>

            {/* City, State, Country, Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "country", value }, // 👈 mimic event
                    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryList?.map((country: any) => (
                      <SelectItem
                        key={country.country_id}
                        value={country.country_id.toString()}
                      >
                        {country.country_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">State</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {/* viewport: set a max-height and allow overflow scroll */}
                    <SelectViewport className="max-h-60 overflow-auto">
                      {stateList?.map((st: any) => (
                        <SelectItem key={st.state_id} value={st.state_name}>
                          {st.state_name}
                        </SelectItem>
                      ))}
                    </SelectViewport>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">City</Label>
                <Input
                  type="text"
                  name="city"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col items-start w-full">
                <Label className="mb-1">Zip Code</Label>
                <Input
                  type="number"
                  name="zipCode"
                  className=" stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
            <Button type="button" variant={"outline"}>
              Back to plan
            </Button>
            <Button
              type="submit"
              variant={"default"}
              className="bg-orange-500 hover:bg-orange-600 "
            >
              Complete Payment
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
