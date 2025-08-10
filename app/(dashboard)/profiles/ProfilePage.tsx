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
import ViewProfileDummy from "../view-profile";

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
          className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg flex justify-between items-center transition-colors"
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData ? (
            Object.entries(profileData)
              .filter(([key, value]) => value !== null && value !== undefined && value !== '')
              .map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="ml-2 text-gray-800">{String(value)}</span>
                </div>
              ))
          ) : (
            <p className="text-gray-500 col-span-2">No personal information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderContactInfo = () => {
    const addressData = address?.data.addresses || address;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact & Address</h3>
        <div className="space-y-4">
          {addressData && Array.isArray(addressData) && addressData.length > 0 ? (
            addressData.map((addr: any, index: number) => {
              const title = addr.type || addr.address_type || `Address ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`address-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(addr)
                      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="ml-2 text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              );
            })
          ) : addressData && typeof addressData === 'object' ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(addressData)
                  .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="ml-2 text-gray-800">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No contact information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    const educationData = education?.data.educations || education;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Education</h3>
        <div className="space-y-4">
          {educationData && Array.isArray(educationData) && educationData.length > 0 ? (
            educationData.map((edu: any, index: number) => {
              const title = edu.degree || edu.qualification || edu.education_level || `Education ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`education-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(edu)
                      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="ml-2 text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              );
            })
          ) : educationData && typeof educationData === 'object' ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(educationData)
                  .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="ml-2 text-gray-800">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No education information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderCareer = () => {
    const employmentData = employment?.data.employements || employment;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Career & Employment</h3>
        <div className="space-y-4">
          {employmentData && Array.isArray(employmentData) && employmentData.length > 0 ? (
            employmentData.map((emp: any, index: number) => {
              const title = emp.position || emp.job_title || emp.designation || emp.occupation || `Employment ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`employment-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(emp)
                      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="ml-2 text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              );
            })
          ) : employmentData && typeof employmentData === 'object' ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(employmentData)
                  .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="ml-2 text-gray-800">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No employment information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderFamily = () => {
    const familyData = family?.data.family || family;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Family Information</h3>
        <div className="space-y-4">
          {familyData && Array.isArray(familyData) && familyData.length > 0 ? (
            familyData.map((member: any, index: number) => {
              const title = member.name || member.member_name || `${member.relationship || member.relation || 'Family Member'} ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`family-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(member)
                      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="ml-2 text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              );
            })
          ) : familyData && typeof familyData === 'object' ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(familyData)
                  .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="ml-2 text-gray-800">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No family information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderLifestyle = () => {
    // Handle different data structures for hobbies and interests
    const hobbiesData = Array.isArray(hobbies) ? hobbies : (hobbies as any)?.data.hobby_interests || [];
    const interestsData = Array.isArray(interests) ? interests : (interests as any)?.data.hobby_interests || [];
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Lifestyle & Interests</h3>
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
      </div>
    );
  };

  const renderProperties = () => {
    const propertiesData = Array.isArray(properties) ? properties : (properties as any)?.data.properties || [];
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Properties</h3>
        <div className="space-y-4">
          {propertiesData && Array.isArray(propertiesData) && propertiesData.length > 0 ? (
            propertiesData.map((property: any, index: number) => {
              const title = property.type || property.property_type || `Property ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`property-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(property)
                      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="ml-2 text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              );
            })
          ) : propertiesData && typeof propertiesData === 'object' ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(propertiesData)
                  .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="ml-2 text-gray-800">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No property information available</p>
          )}
        </div>
      </div>
    );
  };

  const renderReferences = () => {
    // Note: References data would come from a separate API call if available
    // For now, we'll check if there's any references data in the profile state
    const referencesData = references?.data?.family || [];
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">References</h3>
        <div className="space-y-4">
          {referencesData && Array.isArray(referencesData) && referencesData.length > 0 ? (
            referencesData.map((reference: any, index: number) => {
              const title = reference.name || `Reference ${index + 1}`;
              return (
                <AccordionItem
                  key={index}
                  title={title}
                  sectionKey={`reference-${index}`}
                  defaultExpanded={index === 0}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(reference)
                      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="ml-2 text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-gray-500">No references available</p>
          )}
        </div>
      </div>
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
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
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
      <div className="mb-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ViewProfile;
