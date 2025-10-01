"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { api } from "@/app/lib/axios";
import { CONSTANTS } from "@/constants";
import { toast } from "react-toastify";
import Link from "next/link";

type BillingFormProps = {
  planName: string;
  planPrice: number;
};
export default function BillingForm({ planName, planPrice }: BillingFormProps) {
  const { countryList, stateList } = useAppSelector((state) => state.metaData);
  const { loadNecessaryMetaData, loadStates } = useMetaDataLoader();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedCountry = watch("country");

  // Load state list when country changes
  useEffect(() => {
    if (selectedCountry) {
      loadStates(selectedCountry);
    }
  }, [selectedCountry, loadStates]);

  // Load initial metadata
  useEffect(() => {
    loadNecessaryMetaData();
  }, [loadNecessaryMetaData]);

  const openWindow = async (url: string) => {
    window.open(url, "_self");
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const currentUrl = window.location.origin + window.location.pathname;
      let payData = {
        name: data.name,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        zip_code: data.zipCode,
        amount: 1,
        plan: planName,
        front_end_success_uri: `${currentUrl}?plan=${planName}&status=success`,
        front_end_failed_uri: `${currentUrl}?plan=${planName}&status=failed`,
        currency: CONSTANTS.currency,
      };
      let res = await api.post("/stripe/create-session", payData);
      if (res && res.status === 201) {
        let payUrl = res.data.data.url;
        openWindow(payUrl);
        reset();
      }
    } catch (error: any) {
      toast.error(error.message || "Unable to complete the payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="account-details-box w-full max-w-full mx-auto text-left px-4 sm:px-6 lg:px-0 shadow-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4 sm:gap-4 text-left"
      >
        {/* Personal Info */}
        <div className="pb-4 sm:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <div className="grow text-left flex flex-col items-start">
              <Label className="mb-1">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                {...register("name")}
                required
                className="stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
            </div>
            <div className="grow text-left flex flex-col items-start">
              <Label className="mb-1">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                {...register("address")}
                required
                className="stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Country, State, City, Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Country */}
            <div className="flex flex-col items-start w-full">
              <Label className="mb-1">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("country", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
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

            {/* State */}
            <div className="flex flex-col items-start w-full">
              <Label className="mb-1">
                State <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("state", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="w-full">
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

            {/* City */}
            <div className="flex flex-col items-start w-full">
              <Label className="mb-1">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                {...register("city")}
                className="stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
            </div>

            {/* Zip Code */}
            <div className="flex flex-col items-start w-full">
              <Label className="mb-1">
                Zip Code <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                {...register("zipCode")}
                className="stretch w-full focus:outline-none focus:border-b focus:border-[#f7ac03] text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
          <Button type="button" variant={"outline"}>
            <Link href={"/payments"}>Back to plan</Link>
          </Button>
          <Button
            type="submit"
            variant={"default"}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Complete Payment
          </Button>
        </div>
      </form>
    </section>
  );
}
