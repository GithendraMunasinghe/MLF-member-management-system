export interface Member {
  _id: string;

  regNo: string;
  photo?: string;

  status?: string;
  formType?: string;
  organizationType?: string;

  personalInfo?: {
    fullName?: string;
    certificateName?: string;
    nameWithInitials?: string;
    nicNumber?: string;
    passportNumber?: string;
    drivingLicense?: string;
    gender?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
  };

  contact?: {
    mobilePhone?: string;
    whatsappNumber?: string;
    email?: string;
  };

  address?: {
    permanentAddress?: string;
    province?: string;
    district?: string;
  };

  createdAt: string;
  updatedAt?: string;
}