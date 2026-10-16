export interface User {
  id: number;
  azureAdId: string;
  employeeId: string;
  name: string;
  jobTitle: string;
  email: string;
  assignment: string;
  phone: string;
  isActive: boolean;
  profiles: {
    id: number;
    description: string;
    text: string;
  }[];
}
