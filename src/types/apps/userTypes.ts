// ** Types
import { ThemeColor } from "src/@core/layouts/types";

export type UsersType = {
  id: number;
  role: string;
  email: string;
  status: string;
  avatar: string;
  billing: string;
  company: string;
  country: string;
  contact: string;
  fullName: string;
  ageGroup:string;
  username: string;
  currentPlan: string;
  avatarColor?: ThemeColor;
  customerCode:string;
  mobile:string;
  gender:string;
  dateOfBirth:string;
  city:string;
  region:string;
  street:string;
  district:string;
};

export type ProjectListDataType = {
  id: number;
  img: string;
  hours: string;
  totalTask: string;
  projectType: string;
  projectTitle: string;
  progressValue: number;
  progressColor: ThemeColor;
};
