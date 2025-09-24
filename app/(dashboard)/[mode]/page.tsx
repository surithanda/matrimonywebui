"use client";

import { useEffect } from "react";
import { useProfileContext } from "@/app/utils/useProfileContext";
import ProfileGeneral from "./_components/ProfileGeneral";
import { useProfileModeInfo } from "./hooks/useValidatedProfileMode";

const Page = () => {
  const { mode, isCreateMode, isUpdateMode, modeLabel } = useProfileModeInfo();
  const { setSelectedProfileID, selectedProfileID } = useProfileContext();
  
  // useEffect(() => {
  //   if(selectedProfileID > 0 && isCreateMode) {
  //     localStorage.setItem("selectedProfile", selectedProfileID.toString());
  //     setSelectedProfileID(0);
  //   }
  // }, [selectedProfileID, isCreateMode, setSelectedProfileID]);

  return (
    <ProfileGeneral />
  );
};

export default Page;
