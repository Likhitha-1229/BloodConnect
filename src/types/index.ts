export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'donor' | 'requester' | 'admin';

export type RequestUrgency = 'Normal' | 'Urgent';

export type RequestStatus = 
  | 'Pending Verification'
  | 'Urgent - Pending Verification'
  | 'Verified'
  | 'Matching'
  | 'Donor Contacted'
  | 'Fulfilled'
  | 'Cancelled';

export type DonorRequestStatus = 'New' | 'Accepted' | 'Declined' | 'Completed' | 'Cancelled';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  area?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonorProfile {
  id: string;
  userId: string;
  displayName: string; // Privacy-safe (e.g. "Alex M." or "David K.")
  bloodGroup: BloodGroup;
  age?: number;
  city: string;
  area: string;
  approximateDistanceKm?: number;
  isAvailable: boolean;
  isVerified: boolean;
  lastDonationDate?: string;
  lastVerifiedDate?: string;
  donationCount: number;
  preferredDonationCenters?: string;
  contactPreference: 'In-App Notification' | 'SMS via Platform' | 'Authorized Hospital Only';
  status: 'Active' | 'Suspended' | 'Unavailable';
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  requestId: string; // e.g. "BC-REQ-1042"
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  area: string;
  requiredDate: string;
  requiredTime?: string;
  urgency: RequestUrgency;
  additionalNotes?: string;
  status: RequestStatus;
  matchedDonorCount?: number;
  hospitalVerificationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonorRequestItem {
  id: string;
  requestId: string;
  donorId: string;
  requesterId: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  units: number;
  status: DonorRequestStatus;
  message?: string;
  hospitalContactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'status' | 'verification' | 'alert';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donationDate: string;
  donationCenter: string;
  units: number;
  bloodGroup: BloodGroup;
  status: 'Completed' | 'Scheduled';
  createdAt: string;
}

export interface AdminLogItem {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'Donor' | 'Request' | 'User';
  targetId: string;
  details: string;
  timestamp: string;
}

// Blood compatibility mapping (for coordination display, clearly disclaiming medical approval)
export const BLOOD_COMPATIBILITY: Record<BloodGroup, { canGiveTo: BloodGroup[]; canReceiveFrom: BloodGroup[] }> = {
  'O-': {
    canGiveTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-']
  },
  'O+': {
    canGiveTo: ['A+', 'B+', 'AB+', 'O+'],
    canReceiveFrom: ['O+', 'O-']
  },
  'A-': {
    canGiveTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-']
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
  },
  'B-': {
    canGiveTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-']
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
  },
  'AB-': {
    canGiveTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-']
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  }
};
