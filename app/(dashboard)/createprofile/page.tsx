"use client";
import { Loader2 } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  createPersonalProfileAsync,
  getPersonalProfileAsync,
} from "@/app/store/features/profileSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { IProfilePersonal } from "@/app/models/Profile";
import MetadataSelectComponent from "@/app/_components/custom_components/MetadataSelectComponent";
import CustomPhoneComponent from "@/app/_components/custom_components/CustomPhoneComponent";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/blocks/faq";
import ProfileGeneral from "./_components/ProfileGeneral";


const Page = () => {
  
  return (
    <ProfileGeneral />
  );
};

export default Page;
