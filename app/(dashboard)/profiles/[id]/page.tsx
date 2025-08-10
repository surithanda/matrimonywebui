"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  getPersonalProfileAsync,
  getAddressAsync,
  getEducationAsync,
  getEmploymentAsync,
  getFamilyAsync,
  getPropertiesAsync,
  getHobbiesInterestsAsync
} from "@/app/store/features/profileSlice";
import profile1 from "@/public/images/dashboard/profile1.png";

const ViewProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const profileId = parseInt(params.id as string);
  
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
    loading, 
    error 
  } = useSelector((state: RootState) => state.profile);

  const [activeTab, setActiveTab] = useState('personal');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

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
    }
  }, [dispatch, profileId]);

  // Debug: Log the Redux state data
  useEffect(() => {
    console.log('Redux State Debug:');
    console.log('personalProfile:', personalProfile);
    console.log('address:', address);
    console.log('education:', education);
    console.log('employment:', employment);
    console.log('family:', family);
    console.log('properties:', properties);
    console.log('hobbies:', hobbies); 
    console.log('interests:', interests);
    console.log('references:', references);
  }, [personalProfile, address, education, employment, family, properties, hobbies, interests, references]);

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
    { id: 'references', label: 'References', icon: '📋' }
  ];

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
    const familyList = family?.data?.family || (family ? [family] : []);
    
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
              const title = property.type || property.property_type || `Property ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`property-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileDetail title="Type" value={property.property_type} />
                    <ProfileDetail title="Ownership" value={property.ownership_type} />
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
    const referencesList = references?.data?.family || (references ? [references] : []);
    
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
            <Image
              src={(personalProfile?.data || personalProfile)?.profile_image || profile1}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
              width={128}
              height={128}
            />
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
              <button className="border border-orange-500 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-50 transition-colors">
                Add to Favorites
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
