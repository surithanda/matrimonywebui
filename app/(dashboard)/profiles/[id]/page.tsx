"use client";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  getPersonalProfileAsync,
  getAddressAsync,
  getEducationAsync,
  getEmploymentAsync,
  getFamilyAsync,
  getPropertiesAsync,
  getHobbiesInterestsAsync,
  trackProfileViewAsync,
  createFavoriteAsync,
  deleteFavoriteAsync,
  getFavoritesAsync,
  getProfilePhotosAsync
} from "@/app/store/features/profileSlice";

import { useMetaDataLoader } from "@/app/utils/useMetaDataLoader";
import femaleProfile from "@/public/images/dashboard/profile1.png";
import maleProfile from "@/public/images/dashboard/profile3.png";
import { useProfileContext } from "@/app/utils/useProfileContext";
import { profile } from "console";

const ViewProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const searchParams = useSearchParams();
  const profileId = parseInt(params.id as string);
  const fromSearch = searchParams.get('fromSearch') === 'true';
  const { findJobTitleName, findCountryName, findStateName, findPropertyTypeName, findOwnershipTypeName } = useMetaDataLoader();
  
  const { 
    personalProfile, 
    address, 
    education, 
    employment, 
    family, 
    properties, 
    hobbies, 
    interests,
    references,
    photos,
    loading, 
    error 
  } = useSelector((state: RootState) => state.profile);
  
  interface ImageFile {
    url: string;
    file?: File | null;
  }

  const [activeTab, setActiveTab] = useState('personal');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const { selectedProfileID } = useProfileContext();
  const accountProfileID = selectedProfileID > 0 ? selectedProfileID : 1;
  const [favoriteProfile, setFavoriteProfile] = useState<any>();

  const [profileImage, setProfileImage] = useState<ImageFile | null>(null);
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [individualImages, setIndividualImages] = useState<ImageFile[]>([]);

  // Hoisted helpers for photos (avoid hooks inside conditional renders)
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  const photoTypeAssociation = useMemo(() => ({
    profile: 450,
    cover: 454,
    individual: 456
  }), []);

  const toAbsoluteUrl = useCallback((u?: string | null) => {
    if (!u || typeof u !== 'string') return null;
    if (u.startsWith('http')) return u;
    if (apiOrigin) return `${apiOrigin}${u.startsWith('/') ? '' : '/'}${u}`;
    return u.startsWith('/') ? u : `/${u}`;
  }, [apiOrigin]);

  // Derive display images from redux photos once, not during render
  useEffect(() => {
    const photoData = (photos as any)?.data || photos;
    if (!Array.isArray(photoData)) return;

    const resolved = photoData
      .map((p: any) => ({ ...p, _rawUrl: p?.url || p?.photo_url || p?.file_url }))
      .map((p: any) => ({ ...p, _src: toAbsoluteUrl(p?._rawUrl) }))
      .filter((p: any) => !!p._src);

    const prof = resolved.find((p: any) => Number(p.photo_type) === photoTypeAssociation.profile);
    const cov = resolved.find((p: any) => Number(p.photo_type) === photoTypeAssociation.cover);
    const others = resolved.filter((p: any) => Number(p.photo_type) === photoTypeAssociation.individual);

    setProfileImage(prof ? { url: prof._src, file: null } : null);
    setCoverImage(cov ? { url: cov._src, file: null } : null);
    setIndividualImages(others.map((p: any) => ({ url: p._src, file: null })));
  }, [photos, toAbsoluteUrl, photoTypeAssociation]);
  
  useEffect(() => {
    const loadFavorites = async () => {
      if (accountProfileID > 0) {
        const response = await dispatch(getFavoritesAsync({ profileId: accountProfileID })).unwrap();
        // console.log(response, profileId);
        response.data.map((item: any) => {
          if(item.to_profile_id === profileId && item.is_active) {
            setFavoriteProfile(item);
            setIsFavorite(true);
          }
        })
      }
    };
    console.log(accountProfileID);
    loadFavorites();
  }, [dispatch, accountProfileID, profileId]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleToggleFavorite = async () => {
    if (isUpdatingFavorite) return;
    if(accountProfileID > 0) {
      try {
        setIsUpdatingFavorite(true);
        if(isFavorite){
          await dispatch(deleteFavoriteAsync({
            profileId: accountProfileID,
            favoriteProfileId: favoriteProfile?.profile_favorite_id,
          })).unwrap();
        } else {
          const result = await dispatch(createFavoriteAsync({
            profileId: accountProfileID,
            favoriteProfileId: profileId,
            isFavorite: !isFavorite
          })).unwrap();
          setFavoriteProfile({profile_favorite_id:result?.data?.id});
        }
        
        setIsFavorite(prev => !prev);
        // Toggle the local state if the API call is successful
      } catch (error) {
        console.error('Failed to update favorite status:', error);
        // You might want to show an error toast/notification here
      } finally {
        setIsUpdatingFavorite(false);
      }
    }
  }

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
      <div className="bg-[#F3F3F3] mt-10 rounded-xl overflow-hidden">
        <p className="bg-[#2F3C1F] px-6 py-4 text-white text-xl">{title}</p>
        <div className="p-6">{children}</div>
      </div>
    );
  };
  const ProfileDetail = ({ title, value, colspan = null }: { title: string; value: string; colspan?: number | null }) => {
    return (
      <div className={colspan ? `col-span-${colspan}` : ""}>
        <p className="text- text-slate-500">{title}</p>
        <p className="text-black font-semibold mt-1 text-xl">{value}</p>
      </div>
    );
  };

  // Accordion component for array items
  const AccordionItem = ({ title, children, sectionKey, defaultExpanded = false }: {
    title: string;
    children: React.ReactNode;
    sectionKey: string;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections[sectionKey] ?? defaultExpanded;
    
    return (
      <div className="border border-gray-200 rounded-lg mb-3">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-4 py-3 text-left bg-orange-50 hover:bg-orange-100 rounded-t-lg flex justify-between items-center transition-colors"
        >
          <span className="font-medium text-gray-800">{title}</span>
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    console.log('Profile ID:', profileId);
    console.log('From search:', fromSearch);
    if (profileId && fromSearch) {
      console.log('Tracking profile view for profile ID:', profileId);
      try {
        if(accountProfileID > 0){
          dispatch(trackProfileViewAsync({ profileId: accountProfileID, viewedProfileId: profileId }));
        }
      } catch (error) {
        console.error('Error tracking profile view:', error);
      }
    }
  }, [profileId, fromSearch, accountProfileID, dispatch]);

  useEffect(() => {
    if (profileId) {
      // Load all profile sections
      dispatch(getPersonalProfileAsync({ profile_id: profileId }));
      dispatch(getAddressAsync({ profile_id: profileId }));
      dispatch(getEducationAsync({ profile_id: profileId }));
      dispatch(getEmploymentAsync({ profile_id: profileId }));
      dispatch(getFamilyAsync({ profile_id: profileId, type: 'family' }));
      dispatch(getFamilyAsync({ profile_id: profileId, type: 'references' }));
      dispatch(getPropertiesAsync({ profile_id: profileId }));
      dispatch(getHobbiesInterestsAsync({ profile_id: profileId, category: 'hobby' }));
      dispatch(getHobbiesInterestsAsync({ profile_id: profileId, category: 'interest' }));
      dispatch(getProfilePhotosAsync(Number(profileId)));
    }
  }, [dispatch, profileId]);

  // Debug: Log the Redux state data
  // useEffect(() => {
  //   console.log('Redux State Debug:');
  //   console.log('personalProfile:', personalProfile);
  //   console.log('address:', address);
  //   console.log('education:', education);
  //   console.log('employment:', employment);
  //   console.log('family:', family);
  //   console.log('properties:', properties);
  //   console.log('hobbies:', hobbies); 
  //   console.log('interests:', interests);
  //   console.log('references:', references);
  // }, [personalProfile, address, education, employment, family, properties, hobbies, interests, references]);

  if (loading) {
    return (
      <div className="dashboard-background min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-background min-h-screen flex justify-center items-center">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'contact', label: 'Contact', icon: '📍' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'career', label: 'Career', icon: '💼' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'references', label: 'References', icon: '📋' },
    { id: 'photos', label: 'Photos', icon: '👤'}
  ];


  const renderPhotos = () => {
    return (
      <ProfileSection title="Photos">
        {/* Photos (by type) */}
        <div className="mt-8 w-full">
          <div className="flex flex-wrap gap-6">
            {/* Profile (450) */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Profile</p>
              <div className="relative w-[200px] h-[200px] border rounded-lg bg-gray-50 overflow-hidden">
                {profileImage ? (
                  <Image src={profileImage.url} alt="Profile photo" fill sizes="200px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No photo</div>
                )}
              </div>
            </div>

            {/* Cover (454) */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Cover</p>
              <div className="relative w-[300px] h-[150px] border rounded-lg bg-gray-50 overflow-hidden">
                {coverImage ? (
                  <Image src={coverImage.url} alt="Cover photo" fill sizes="300px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No photo</div>
                )}
              </div>
            </div>

            {/* Additional (456) */}
            <div className="flex-1 min-w-full">
              <p className="text-sm font-medium mb-2">Additional</p>
              <div className="flex flex-wrap gap-3">
                {individualImages && individualImages.length > 0 ? (
                  individualImages.map((img, idx) => (
                    <div key={idx} className="relative w-[150px] h-[150px] border rounded-lg bg-gray-50 overflow-hidden">
                      <Image src={img.url} alt={`Additional ${idx + 1}`} fill sizes="150px" className="object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">No photos</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProfileSection>
    );
  };


  const renderPersonalInfo = () => {
    const profileData = personalProfile?.data || personalProfile;
    
    return (
      <ProfileSection title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profileData ? (
            // Object.entries(profileData)
            //   .filter(([key, value]) => value !== null && value !== undefined && value !== '')
            //   .map(([key, value]) => (
            //     <ProfileDetail key={key} title={key.replace(/_/g, ' ')} value={String(value)} />
            //   ))
            <>
            <ProfileDetail title="First Name" value={profileData?.first_name} />
            <ProfileDetail title="Last Name" value={profileData?.last_name} />
            <ProfileDetail title="Gender" value={profileData?.gender} />
            <ProfileDetail title="DOB" value={profileData?.dob} />
            <ProfileDetail title="Religion" value={profileData?.religion} />
            <ProfileDetail title="Mother Tounge" value={profileData?.mother_tounge} />
            <ProfileDetail title="Marital Status" value={profileData?.marital_status} />
            <ProfileDetail title="Height" value={profileData?.height} />
            <ProfileDetail title="Weight" value={profileData?.weight} />
            </>
            
          ) : (
            <p className="text-gray-500 col-span-2">No personal information available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderContactInfo = () => {
    const addressList = address?.data?.addresses || (address ? [address] : []);
    
    return (
      <ProfileSection title="Contact Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProfileDetail title="Email" value={personalProfile?.data?.email} />
            <ProfileDetail title="Phone" value={personalProfile?.data?.phone} />
          </div>
          
          {addressList.length > 0 ? (
            addressList.map((addr: any, index: number) => {
              const title = `Address ${index + 1}${addr.type ? ` (${addr.type})` : ''}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`address-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Type" value={addr?.type || addr?.address_type} />
                    <ProfileDetail title="Street" value={addr?.street} />
                    <ProfileDetail title="City" value={addr?.city} />
                    <ProfileDetail title="State" value={addr?.state} />
                    <ProfileDetail title="Country" value={addr?.country} />
                    <ProfileDetail title="Pincode" value={addr?.pincode} />
                    <ProfileDetail title="Is Current" value={addr?.is_current ? 'Yes' : 'No'} />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No address information available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderEducation = () => {
    const educationList = education?.data?.educations || (education ? [education] : []);
    
    return (
      <ProfileSection title="Education">
        <div className="space-y-4">
          {educationList.length > 0 ? (
            educationList.map((edu: any, index: number) => {
              const title = edu?.degree || `Education ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`education-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Institution" value={edu?.institution} />
                    <ProfileDetail title="Field of Study" value={edu?.field_of_study} />
                    <ProfileDetail title="Degree" value={edu?.degree} />
                    <ProfileDetail title="Year of Completion" value={edu?.year_of_completion} />
                    <ProfileDetail title="Grade/Percentage" value={edu?.grade} />
                    <ProfileDetail title="Is Current" value={edu?.is_current ? 'Yes' : 'No'} />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No education information available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderCareer = () => {
    // Handle both array and object responses from the API
    let employmentList = [];
    
    if (Array.isArray(employment?.data)) {
      employmentList = employment.data;
    } else if (employment?.data?.employments) {
      employmentList = employment.data.employments;
    } else if (employment) {
      employmentList = [employment];
    }
    
    return (
      <ProfileSection title="Career">
        <div className="space-y-4">
          {employmentList.length > 0 ? (
            employmentList.map((emp: any, index: number) => {
              const title = emp?.job_title || emp?.company || `Employment ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`employment-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Company" value={emp?.company} />
                    <ProfileDetail title="Job Title" value={emp?.job_title} />
                    <ProfileDetail title="Job Type" value={emp?.job_type} />
                    <ProfileDetail title="Annual Income" value={emp?.annual_income} />
                    <ProfileDetail title="Industry" value={emp?.industry} />
                    <ProfileDetail title="Start Date" value={emp?.start_date} />
                    <ProfileDetail title="End Date" value={emp?.end_date || (emp?.is_current ? 'Present' : 'Not specified')} />
                    <ProfileDetail title="Is Current" value={emp?.is_current ? 'Yes' : 'No'} />
                    {emp?.description && (
                      <div className="md:col-span-3">
                        <ProfileDetail title="Description" value={emp.description} />
                      </div>
                    )}
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No employment information available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderFamily = () => {
    const familyList = (family as any)?.data?.family || (family ? [family] : []);
    
    return (
      <ProfileSection title="Family Information">
        <div className="space-y-4">
          {familyList.length > 0 ? (
            familyList.map((member: any, index: number) => {
              const title = member?.name || `Family Member ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`family-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Relation" value={member?.relation} />
                    <ProfileDetail title="Age" value={member?.age} />
                    <ProfileDetail title="Occupation" value={member?.occupation} />
                    <ProfileDetail title="Marital Status" value={member?.marital_status} />
                    <ProfileDetail title="Contact" value={member?.contact_number} />
                    <ProfileDetail title="Is Dependent" value={member?.is_dependent ? 'Yes' : 'No'} />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No family information available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderLifestyle = () => {
    // Handle different data structures for hobbies and interests
    const hobbiesData = Array.isArray(hobbies) ? hobbies : (hobbies as any)?.data?.hobby_interests || [];
    const interestsData = Array.isArray(interests) ? interests : (interests as any)?.data?.hobby_interests || [];
    
    return (
      <ProfileSection title="Lifestyle & Interests">
        <div className="space-y-6">
          {/* Hobbies */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Hobbies</h4>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(hobbiesData) && hobbiesData.length > 0 ? (
                hobbiesData.map((hobby: any, index: number) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {typeof hobby === 'string' ? hobby : hobby.name || hobby.hobby || hobby.title}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No hobbies listed</p>
              )}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(interestsData) && interestsData.length > 0 ? (
                interestsData.map((interest: any, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {typeof interest === 'string' ? interest : interest.name || interest.interest || interest.title}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No interests listed</p>
              )}
            </div>
          </div>
        </div>
      </ProfileSection>
    );
  };

  const renderProperties = () => {
    console.log("properties", properties);
    const propertiesData = Array.isArray(properties) ? properties : (properties as any)?.properties || [];
    
    return (
      <ProfileSection title="Properties">
        <div className="space-y-4">
          {propertiesData.length > 0 ? (
            propertiesData.map((property: any, index: number) => {
              const title = property.type || findPropertyTypeName(property.property_type) || `Property ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`property-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Type" value={findPropertyTypeName(property.property_type)} />
                    <ProfileDetail title="Ownership" value={findOwnershipTypeName(property.ownership_type)} />
                    <ProfileDetail title="Location" value={property.property_address} />
                    <ProfileDetail title="Value" value={property.property_value} />
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No property information available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderReferences = () => {
    const referencesList = (references as any)?.data?.family || (references ? [references] : []);
    
    return (
      <ProfileSection title="References">
        <div className="space-y-4">
          {referencesList.length > 0 ? (
            referencesList.map((ref: any, index: number) => (
              <AccordionItem
                key={index}
                title={ref?.name || `Reference ${index + 1}`}
                sectionKey={`reference-${index}`}
                defaultExpanded={index === 0}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileDetail title="Relation" value={ref?.relation} />
                  <ProfileDetail title="Contact Number" value={ref?.contact_number} />
                  <ProfileDetail title="Email" value={ref?.email} />
                  <ProfileDetail title="Address" value={ref?.address} colspan={3} />
                  <ProfileDetail title="Known Since" value={ref?.known_since} />
                  <ProfileDetail title="Occupation" value={ref?.occupation} />
                </div>
              </AccordionItem>
            ))
          ) : (
            <p className="text-gray-500">No references available</p>
          )}
        </div>
      </ProfileSection>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'contact':
        return renderContactInfo();
      case 'education':
        return renderEducation();
      case 'career':
        return renderCareer();
      case 'family':
        return renderFamily();
      case 'lifestyle':
        return renderLifestyle();
      case 'properties':
        return renderProperties();
      case 'references':
        return renderReferences();
      case 'photos':
        return renderPhotos();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="dashboard-background min-h-screen md:px-[120px] md:pt-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {profileImage ? (
              <Image
                src={profileImage?.url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                width={128}
                height={128}
              />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No photo</div>
                )}
            
          </div>
          <div className="flex-1 text-center md:text-left">
            {(() => {
              const profileData = personalProfile?.data || personalProfile;
              return (
                <>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {profileData?.first_name || profileData?.name || 'Unknown'} {profileData?.last_name || ''}
                  </h1>
                  <p className="text-gray-600 mb-2">
                    {profileData?.age && `${profileData.age} years`} 
                    {profileData?.age && (profileData?.city || profileData?.country) && ' • '}
                    {profileData?.city && `${profileData.city}`}
                    {profileData?.city && profileData?.country && ', '}
                    {profileData?.country && `${profileData.country}`}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {profileData?.occupation && `${profileData.occupation}`}
                    {profileData?.occupation && profileData?.education && ' • '}
                    {profileData?.education && `${profileData.education}`}
                  </p>
                </>
              );
            })()}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
                Send Interest
              </button>
              <button 
                onClick={handleToggleFavorite}
                disabled={isUpdatingFavorite}
                className={`flex items-center gap-2 border ${isFavorite ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-orange-500 text-orange-500 hover:bg-orange-50'} px-6 py-2 rounded-md transition-colors`}
              >
                {isUpdatingFavorite ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isFavorite ? 'Removing...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </>
                )}
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                Message
              </button>
            </div>
          </div>
        </div>
      

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mt-6">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-orange-500 text-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        

        {/* Tab Content */}
        <div className="mb-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
