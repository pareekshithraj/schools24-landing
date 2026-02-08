export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'driver' | 'parent';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  schoolId?: string;
  createdAt: number;
  mustChangePassword?: boolean;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: any; // ServerTimestamp
  status: 'New' | 'Read' | 'Replied';
}

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  arrivalTime: string; // e.g. "07:30 AM"
  status: 'pending' | 'arrived' | 'departed';
}

export interface BusRoute {
  id?: string;
  name: string;
  driverId: string;
  driverName: string;
  vehicleNo: string;
  schoolId?: string;
  stops: BusStop[];
  createdAt: any;
}

export interface Trip {
  id?: string;
  routeId: string;
  driverId: string;
  schoolId?: string;
  date: string; // ISO date string YYYY-MM-DD
  status: 'active' | 'completed';
  currentStopIndex: number; // Index of the stop the bus is currently at or just left
  lastUpdated: any;
}
