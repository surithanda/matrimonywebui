export enum Gender {
    MALE = 1,
    FEMALE = 2,
    OTHER = 3,
  }
  
  export function getGenderLabel(value: Gender): string {
    switch (value) {
      case Gender.MALE:
        return "Male";
      case Gender.FEMALE:
        return "Female";
      case Gender.OTHER:
        return "Other";
      default:
        return "Unknown";
    }
  }