export interface Member {
  _id: string;

  regNo: string;
  photo?: string;

  status?: string;
  formType?: string;
  organizationType?: string;

  categories?: string[];

  eventId?: {
    _id: string;
    name: string;
  };

  coordinatorId?: {
    _id: string;
    name: string;
    coordinatorId?: string;
  };

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