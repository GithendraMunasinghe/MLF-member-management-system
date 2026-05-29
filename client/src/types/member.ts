export interface Member {
  _id: string;
  name: string;
  regNo: number;
  photo?: string;

  position?: string;
  title?: string;
  membershipDate?: string;
  
  createdAt: string;
}