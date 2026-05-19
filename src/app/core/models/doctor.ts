import { IUser } from "./user";

export interface IDoctor extends IUser {
  specialization: string;
  experience: number; // years
  bio: string;
  availableSlots: TimeSlot[];
  rating: number;
  reviewCount: number;
  price: number
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  session?: string;
}
