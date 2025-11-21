export type AppRequestStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

export interface AppRequest {
  id: string;
  title: string;
  status: AppRequestStatus;
  createdAt: Date;
}

export const normalizeAppRequestStatus = (s: string): AppRequestStatus => {
  const u = s.toUpperCase();
  return u === 'APPROVED' || u === 'DECLINED' || u === 'PENDING' ? (u as AppRequestStatus) : 'PENDING';
};

export type RequestStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

export const normalizeRequestStatus = (status: string): RequestStatus => {
  const upper = status?.toUpperCase();
  if (upper === 'APPROVED' || upper === 'DECLINED' || upper === 'PENDING') {
    return upper;
  }
  return 'PENDING';
};

export type Request = {
  id: string;
  eventId: string;
  userId: string;
  status: RequestStatus;
  submittedAt: string;
  message?: string | null;
};

export type Event = {
  id: string;
  schoolId: string | null;
  leagueId?: string | null;
  name: string;
  startsAt: string;
  endsAt?: string | null;
};

export type AssignmentStatus = 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';

export type Assignment = {
  id: string;
  eventId: string;
  userId: string;
  role: string;
  status: AssignmentStatus;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  schoolIds?: string[];
};
