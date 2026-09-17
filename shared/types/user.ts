export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  admissionYear?: number;
  degreeProgram?: string;
  savedSchemeIds: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY';
  entityType: 'bank' | 'loanScheme' | 'governmentScheme' | 'document' | 'source';
  entityId: string;
  fieldChanged?: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason: string;
  timestamp: string;
}
