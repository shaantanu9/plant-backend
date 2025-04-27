export interface UserSchemaType {
  name: string;
  gender: 'm' | 'f' | 'o';
  fatherName: string;
  motherName?: string;
  uncleName?: string;
  fatherMobile: string;
  uncleMobile: string;
  profileImage?: string;
  images: string[];
  email: string;
  fatherOccupation: string;
  farm: {
    bagayti: string;
    koradvahu: string;
  };
  maritalStatus: 'single' | 'divorced' | 'widowed';
  address: {
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
  };
  verified: boolean;
  bio: string;
  hobbies: string[];
  favorites: Types.ObjectId[];
  education: string[];
  salary?: string;
  height?: string;
  disability?: string;
  expectations?: string;
  dob: Date;
  birthTime?: string;
  birthPlace?: string;
  brother: number;
  sister: number;
  familyIncome?: number;
  subCaste?: string;
  gotra?: string;
  rashi?: string;
  nakshatra?: string;
  manglik?: boolean;
  caste?: string;
  createdAt: Date;
  updatedAt: Date;
}
