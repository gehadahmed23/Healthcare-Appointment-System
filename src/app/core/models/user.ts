export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  createdAt: string;
  isActive?: boolean; //for deactivatePatient
}
