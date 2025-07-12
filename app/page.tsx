'use client';

import { HeroSection } from "./_components/HeroSection";
import { AboutSection } from "./_components/AboutSection";
import ReviewSection from "./_components/ReviewSection";
import WeddingWisdomSection from "./_components/WeddingWisdomSection";
import { Navbar } from "./_components/Navbar";
import Footer from "./_components/Footer";
import { useEffect } from "react";

import { useAppDispatch } from "./store/store";
import { getCountriesAsync, getMetaDataAsync,  setMetadataCategory} from "./store/features/metaDataSlice";

export default function Home() {
  const dispatch = useAppDispatch();

  const loadMetaData = async() => {
    try {
      let result = await dispatch(getMetaDataAsync({"category":"Caste"})).unwrap();
      dispatch(setMetadataCategory({"category":"Caste", "payload": result}));

      result = await dispatch(getMetaDataAsync({"category":"Gender"})).unwrap();
      dispatch(setMetadataCategory({"category":"Gender", "payload": result}));

      result = await dispatch(getCountriesAsync({})).unwrap();
      dispatch(setMetadataCategory({"category":"country", "payload": result}));
      
      // toast.success('Registration successful!', {
      //   autoClose: 3000
      // });
      // setTimeout(() => {
      //   router.push('/login'); 
      // }, 2000); 
    } catch (error: any) {
      // toast.error(error || 'Registration failed!', {
      //   autoClose: 5000
      // });
    }
  }


  useEffect(() => {
    loadMetaData()
  }, []);

  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ReviewSection />
      <WeddingWisdomSection />
      <Footer />
    </div>
  );
}
