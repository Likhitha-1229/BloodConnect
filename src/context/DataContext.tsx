import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, testConnection, handleFirestoreError, OperationType } from '../firebase/config';
import {
  DonorProfile,
  BloodRequest,
  DonorRequestItem,
  NotificationItem,
  DonationRecord,
  AdminLogItem,
  RequestStatus,
  DonorRequestStatus,
  BLOOD_COMPATIBILITY,
  BloodGroup,
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DONATIONS,
  INITIAL_ADMIN_LOGS,
} from '../data/sampleData';
import { useAuth } from './AuthContext';

interface DataContextType {
  donors: DonorProfile[];
  bloodRequests: BloodRequest[];
  donorRequests: DonorRequestItem[];
  notifications: NotificationItem[];
  donations: DonationRecord[];
  adminLogs: AdminLogItem[];
  loading: boolean;
  addBloodRequest: (data: Partial<BloodRequest>) => Promise<BloodRequest>;
  registerDonor: (data: Partial<DonorProfile>) => Promise<DonorProfile>;
  updateDonorAvailability: (donorId: string, isAvailable: boolean) => Promise<void>;
  updateDonorProfile: (donorId: string, data: Partial<DonorProfile>) => Promise<void>;
  verifyDonor: (donorId: string, adminEmail?: string) => Promise<void>;
  suspendDonor: (donorId: string, adminEmail?: string) => Promise<void>;
  verifyRequest: (requestId: string, note?: string, adminEmail?: string) => Promise<void>;
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string) => Promise<void>;
  sendDonorRequest: (donorId: string, requestId: string, message?: string) => Promise<void>;
  respondToDonorRequest: (donorRequestId: string, newStatus: DonorRequestStatus) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: (userId: string) => Promise<void>;
  seedSampleData: () => Promise<void>;
  getMatchingDonors: (bloodGroup: BloodGroup, city?: string) => DonorProfile[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [donors, setDonors] = useState<DonorProfile[]>(INITIAL_DONORS);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);
  const [donorRequests, setDonorRequests] = useState<DonorRequestItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [adminLogs, setAdminLogs] = useState<AdminLogItem[]>(INITIAL_ADMIN_LOGS);
  const [loading, setLoading] = useState(true);

  // Initialize and load from Firestore on mount
  useEffect(() => {
    const initData = async () => {
      // Test firestore connection per skill instructions
      await testConnection();

      try {
        // Load donors
        const donorsSnap = await getDocs(collection(db, 'donors'));
        if (!donorsSnap.empty) {
          const list: DonorProfile[] = [];
          donorsSnap.forEach((d) => list.push(d.data() as DonorProfile));
          setDonors(list);
        } else {
          // Sync sample donors to firestore in background
          INITIAL_DONORS.forEach(async (d) => {
            try {
              await setDoc(doc(db, 'donors', d.id), d);
            } catch {
              // ignore offline errors
            }
          });
        }

        // Load blood requests
        const reqSnap = await getDocs(collection(db, 'bloodRequests'));
        if (!reqSnap.empty) {
          const list: BloodRequest[] = [];
          reqSnap.forEach((d) => list.push(d.data() as BloodRequest));
          // Sort descending by date
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBloodRequests(list);
        } else {
          INITIAL_REQUESTS.forEach(async (r) => {
            try {
              await setDoc(doc(db, 'bloodRequests', r.id), r);
            } catch {
              // ignore
            }
          });
        }

        // Load notifications
        const notifSnap = await getDocs(query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(50)));
        if (!notifSnap.empty) {
          const list: NotificationItem[] = [];
          notifSnap.forEach((d) => list.push(d.data() as NotificationItem));
          setNotifications(list);
        }

        // Load donor requests
        const drSnap = await getDocs(collection(db, 'donorRequests'));
        if (!drSnap.empty) {
          const list: DonorRequestItem[] = [];
          drSnap.forEach((d) => list.push(d.data() as DonorRequestItem));
          setDonorRequests(list);
        }

        // Load donations
        const donSnap = await getDocs(collection(db, 'donations'));
        if (!donSnap.empty) {
          const list: DonationRecord[] = [];
          donSnap.forEach((d) => list.push(d.data() as DonationRecord));
          setDonations(list);
        }

        // Load admin logs
        const logSnap = await getDocs(collection(db, 'adminLogs'));
        if (!logSnap.empty) {
          const list: AdminLogItem[] = [];
          logSnap.forEach((d) => list.push(d.data() as AdminLogItem));
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setAdminLogs(list);
        }
      } catch (err) {
        console.warn('Firestore initial data fetch note (using local cache):', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Request matching logic (non-AI database filtering per requirement #10)
  const getMatchingDonors = (bloodGroup: BloodGroup, city?: string): DonorProfile[] => {
    // Compatible donor blood groups for this recipient
    const compatibleGroups = BLOOD_COMPATIBILITY[bloodGroup]?.canReceiveFrom || [bloodGroup];

    return donors.filter((d) => {
      if (!d.isAvailable || d.status !== 'Active') return false;
      const matchesBlood = compatibleGroups.includes(d.bloodGroup);
      if (!matchesBlood) return false;
      if (city && city.trim() !== '') {
        return d.city.toLowerCase().includes(city.toLowerCase().trim());
      }
      return true;
    });
  };

  const addBloodRequest = async (data: Partial<BloodRequest>): Promise<BloodRequest> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestId = `BC-REQ-${randomSuffix}`;
    const id = `req-${Date.now()}`;
    const now = new Date().toISOString();

    const matchingDonors = getMatchingDonors(data.bloodGroup || 'O+', data.city);

    const newRequest: BloodRequest = {
      id,
      requestId,
      requesterId: currentUser?.uid || userProfile?.id || 'guest-requester',
      requesterName: data.requesterName || 'Confidential Requester',
      requesterPhone: data.requesterPhone || '+1 (555) 000-0000',
      requesterEmail: data.requesterEmail || currentUser?.email || 'seeker@bloodconnect.org',
      bloodGroup: data.bloodGroup || 'O+',
      unitsRequired: data.unitsRequired || 1,
      hospitalName: data.hospitalName || 'Metropolitan Hospital',
      hospitalAddress: data.hospitalAddress || 'City Medical District',
      city: data.city || 'Seattle',
      area: data.area || 'Central',
      requiredDate: data.requiredDate || new Date().toISOString().split('T')[0],
      requiredTime: data.requiredTime || '12:00',
      urgency: data.urgency || 'Normal',
      additionalNotes: data.additionalNotes || '',
      status: data.urgency === 'Urgent' ? 'Urgent - Pending Verification' : 'Pending Verification',
      matchedDonorCount: matchingDonors.length,
      createdAt: now,
      updatedAt: now,
    };

    // Update local state immediately
    setBloodRequests((prev) => [newRequest, ...prev]);

    // Send notifications to matching donors
    matchingDonors.forEach((donor) => {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}-${donor.id}`,
        userId: donor.userId,
        title: `${newRequest.urgency === 'Urgent' ? 'URGENT: ' : ''}Blood Needed (${newRequest.bloodGroup})`,
        message: `${newRequest.hospitalName} in ${newRequest.city} requested ${newRequest.unitsRequired} unit(s) of ${newRequest.bloodGroup} blood.`,
        type: 'request',
        isRead: false,
        link: '/donor-dashboard',
        createdAt: now,
      };
      setNotifications((prev) => [notif, ...prev]);
      try {
        setDoc(doc(db, 'notifications', notif.id), notif);
      } catch {
        // ignore
      }
    });

    try {
      await setDoc(doc(db, 'bloodRequests', id), newRequest);
    } catch (err) {
      console.warn('Saving blood request locally:', err);
    }

    return newRequest;
  };

  const registerDonor = async (data: Partial<DonorProfile>): Promise<DonorProfile> => {
    const id = `donor-${Date.now()}`;
    const now = new Date().toISOString();

    const newDonor: DonorProfile = {
      id,
      userId: currentUser?.uid || userProfile?.id || `user-${Date.now()}`,
      displayName: data.displayName || 'Anonymous Donor',
      bloodGroup: data.bloodGroup || 'O+',
      age: data.age || 25,
      city: data.city || 'Seattle',
      area: data.area || 'Central',
      approximateDistanceKm: data.approximateDistanceKm || 3.5,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      isVerified: false,
      lastDonationDate: data.lastDonationDate || '',
      lastVerifiedDate: undefined,
      donationCount: 0,
      preferredDonationCenters: data.preferredDonationCenters || 'City General Blood Center',
      contactPreference: data.contactPreference || 'In-App Notification',
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    };

    setDonors((prev) => [newDonor, ...prev]);

    try {
      await setDoc(doc(db, 'donors', id), newDonor);
    } catch (err) {
      console.warn('Saving donor locally:', err);
    }

    return newDonor;
  };

  const updateDonorAvailability = async (donorId: string, isAvailable: boolean) => {
    const now = new Date().toISOString();
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, isAvailable, updatedAt: now } : d))
    );

    try {
      await updateDoc(doc(db, 'donors', donorId), {
        isAvailable,
        updatedAt: now,
      });
    } catch (err) {
      console.warn('Updating availability locally:', err);
    }
  };

  const updateDonorProfile = async (donorId: string, data: Partial<DonorProfile>) => {
    const now = new Date().toISOString();
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, ...data, updatedAt: now } : d))
    );

    try {
      await updateDoc(doc(db, 'donors', donorId), {
        ...data,
        updatedAt: now,
      });
    } catch (err) {
      console.warn('Updating donor profile locally:', err);
    }
  };

  const verifyDonor = async (donorId: string, adminEmail = 'admin@bloodconnect.org') => {
    const now = new Date().toISOString();
    let verifiedDonor: DonorProfile | undefined;

    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          verifiedDonor = { ...d, isVerified: true, lastVerifiedDate: now.split('T')[0], updatedAt: now };
          return verifiedDonor;
        }
        return d;
      })
    );

    const log: AdminLogItem = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.uid || 'admin-1',
      adminEmail: currentUser?.email || adminEmail,
      action: 'Donor Verified',
      targetType: 'Donor',
      targetId: donorId,
      details: `Verified donor record (${verifiedDonor?.displayName || donorId}) under blood donation safety checks.`,
      timestamp: now,
    };
    setAdminLogs((prev) => [log, ...prev]);

    if (verifiedDonor) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: verifiedDonor.userId,
        title: 'Donor Profile Verified',
        message: 'Your BloodConnect donor profile has been officially reviewed and verified.',
        type: 'verification',
        isRead: false,
        link: '/donor-dashboard',
        createdAt: now,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    try {
      await updateDoc(doc(db, 'donors', donorId), {
        isVerified: true,
        lastVerifiedDate: now.split('T')[0],
        updatedAt: now,
      });
      await setDoc(doc(db, 'adminLogs', log.id), log);
    } catch (err) {
      console.warn('Logged locally:', err);
    }
  };

  const suspendDonor = async (donorId: string, adminEmail = 'admin@bloodconnect.org') => {
    const now = new Date().toISOString();
    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId ? { ...d, status: 'Suspended', isAvailable: false, updatedAt: now } : d
      )
    );

    const log: AdminLogItem = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.uid || 'admin-1',
      adminEmail: currentUser?.email || adminEmail,
      action: 'Account Suspended',
      targetType: 'Donor',
      targetId: donorId,
      details: `Suspended donor account ${donorId} due to safety or administrative protocol.`,
      timestamp: now,
    };
    setAdminLogs((prev) => [log, ...prev]);

    try {
      await updateDoc(doc(db, 'donors', donorId), {
        status: 'Suspended',
        isAvailable: false,
        updatedAt: now,
      });
      await setDoc(doc(db, 'adminLogs', log.id), log);
    } catch (err) {
      console.warn('Suspended locally:', err);
    }
  };

  const verifyRequest = async (requestId: string, note?: string, adminEmail = 'admin@bloodconnect.org') => {
    const now = new Date().toISOString();
    let updatedReq: BloodRequest | undefined;

    setBloodRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          updatedReq = {
            ...r,
            status: 'Verified',
            hospitalVerificationNote: note || 'Verified with Hospital Transfusion Coordination Department.',
            updatedAt: now,
          };
          return updatedReq;
        }
        return r;
      })
    );

    const log: AdminLogItem = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.uid || 'admin-1',
      adminEmail: currentUser?.email || adminEmail,
      action: 'Request Verified',
      targetType: 'Request',
      targetId: updatedReq?.requestId || requestId,
      details: `Verified blood requisition at ${updatedReq?.hospitalName || 'hospital'}. ${note || ''}`,
      timestamp: now,
    };
    setAdminLogs((prev) => [log, ...prev]);

    if (updatedReq) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: updatedReq.requesterId,
        title: `Request ${updatedReq.requestId} Verified`,
        message: `Your blood request for ${updatedReq.unitsRequired} units of ${updatedReq.bloodGroup} has been verified by the coordination team.`,
        type: 'status',
        isRead: false,
        link: '/requester-dashboard',
        createdAt: now,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    try {
      await updateDoc(doc(db, 'bloodRequests', requestId), {
        status: 'Verified',
        hospitalVerificationNote: note || 'Verified with Hospital Blood Bank.',
        updatedAt: now,
      });
      await setDoc(doc(db, 'adminLogs', log.id), log);
    } catch (err) {
      console.warn('Request verified locally:', err);
    }
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus, note?: string) => {
    const now = new Date().toISOString();
    let updatedReq: BloodRequest | undefined;

    setBloodRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          updatedReq = {
            ...r,
            status,
            hospitalVerificationNote: note || r.hospitalVerificationNote,
            updatedAt: now,
          };
          return updatedReq;
        }
        return r;
      })
    );

    if (updatedReq) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: updatedReq.requesterId,
        title: `Request ${updatedReq.requestId} Updated`,
        message: `Status changed to "${status}".`,
        type: 'status',
        isRead: false,
        link: '/requester-dashboard',
        createdAt: now,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    try {
      await updateDoc(doc(db, 'bloodRequests', requestId), {
        status,
        hospitalVerificationNote: note || updatedReq?.hospitalVerificationNote || '',
        updatedAt: now,
      });
    } catch (err) {
      console.warn('Request updated locally:', err);
    }
  };

  const sendDonorRequest = async (donorId: string, requestId: string, message?: string) => {
    const targetDonor = donors.find((d) => d.id === donorId);
    const targetRequest = bloodRequests.find((r) => r.id === requestId);
    if (!targetDonor || !targetRequest) return;

    const id = `dreq-${Date.now()}`;
    const now = new Date().toISOString();

    const newDonorReq: DonorRequestItem = {
      id,
      requestId: targetRequest.requestId,
      donorId: targetDonor.userId,
      requesterId: targetRequest.requesterId,
      bloodGroup: targetRequest.bloodGroup,
      hospitalName: targetRequest.hospitalName,
      units: targetRequest.unitsRequired,
      status: 'New',
      message: message || `Direct blood request invitation for ${targetRequest.hospitalName}.`,
      createdAt: now,
      updatedAt: now,
    };

    setDonorRequests((prev) => [newDonorReq, ...prev]);

    // Also update request status to 'Donor Contacted' if it was Verified or Matching
    if (['Verified', 'Matching'].includes(targetRequest.status)) {
      updateRequestStatus(targetRequest.id, 'Donor Contacted');
    }

    // Send in-app notification to donor
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetDonor.userId,
      title: 'New Blood Donation Request',
      message: `You have been requested to coordinate donation at ${targetRequest.hospitalName} for ${targetRequest.bloodGroup}.`,
      type: 'request',
      isRead: false,
      link: '/donor-dashboard',
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'donorRequests', id), newDonorReq);
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (err) {
      console.warn('Saved donor request locally:', err);
    }
  };

  const respondToDonorRequest = async (donorRequestId: string, newStatus: DonorRequestStatus) => {
    const now = new Date().toISOString();
    let updatedItem: DonorRequestItem | undefined;

    setDonorRequests((prev) =>
      prev.map((r) => {
        if (r.id === donorRequestId) {
          updatedItem = { ...r, status: newStatus, updatedAt: now };
          return updatedItem;
        }
        return r;
      })
    );

    if (updatedItem) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: updatedItem.requesterId,
        title: `Donor ${newStatus} Request (${updatedItem.requestId})`,
        message: `The invited donor has marked their response as "${newStatus}". Coordination details updated.`,
        type: 'status',
        isRead: false,
        link: '/requester-dashboard',
        createdAt: now,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    try {
      await updateDoc(doc(db, 'donorRequests', donorRequestId), {
        status: newStatus,
        updatedAt: now,
      });
    } catch (err) {
      console.warn('Updated response locally:', err);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { isRead: true });
    } catch {
      // ignore
    }
  };

  const markAllNotificationsRead = async (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, isRead: true } : n))
    );
  };

  const seedSampleData = async () => {
    setDonors(INITIAL_DONORS);
    setBloodRequests(INITIAL_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDonations(INITIAL_DONATIONS);
    setAdminLogs(INITIAL_ADMIN_LOGS);

    try {
      for (const d of INITIAL_DONORS) {
        await setDoc(doc(db, 'donors', d.id), d);
      }
      for (const r of INITIAL_REQUESTS) {
        await setDoc(doc(db, 'bloodRequests', r.id), r);
      }
      for (const n of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, 'notifications', n.id), n);
      }
      for (const a of INITIAL_ADMIN_LOGS) {
        await setDoc(doc(db, 'adminLogs', a.id), a);
      }
    } catch (e) {
      console.warn('Seeded sample data locally and attempted cloud save:', e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        donors,
        bloodRequests,
        donorRequests,
        notifications,
        donations,
        adminLogs,
        loading,
        addBloodRequest,
        registerDonor,
        updateDonorAvailability,
        updateDonorProfile,
        verifyDonor,
        suspendDonor,
        verifyRequest,
        updateRequestStatus,
        sendDonorRequest,
        respondToDonorRequest,
        markNotificationRead,
        markAllNotificationsRead,
        seedSampleData,
        getMatchingDonors,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
