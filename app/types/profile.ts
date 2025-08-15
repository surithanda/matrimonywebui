export interface Profile {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  religion: string;
  motherTongue: string;
  maritalStatus: string;
  height: string;
  weight: string;
  email: string;
  phone: string;
  address: string;
  education: {
    highestQualification: string;
    institution: string;
    fieldOfStudy: string;
    yearOfCompletion?: string;
  };
  profession: {
    jobTitle: string;
    company: string;
    annualIncome: string;
    industry?: string;
  };
  lifestyle: {
    dietaryPreference: string;
    smokingHabit: string;
    drinkingHabit: string;
    hobbies: string[];
    interests: string[];
  };
  family: {
    fatherName: string;
    motherName: string;
    siblings: string;
    familyType: string;
    familyValues: string;
    familyStatus: string;
  };
  partnerPreferences: {
    ageRange: string;
    height: string;
    maritalStatus: string;
    religion: string;
    caste: string;
    education: string;
    occupation: string;
    income: string;
    location: string;
    dietaryPreference: string;
  };
  aboutMe: string;
  profilePicture?: string;
  gallery?: string[];
  createdAt?: string;
  updatedAt?: string;
}
