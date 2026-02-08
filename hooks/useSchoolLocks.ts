import { useAuth } from '../contexts/AuthContext';
import { useDocument } from './useDocument';

interface SchoolRecord {
  id: string;
  locks?: {
    users?: boolean;
    academics?: boolean;
    transport?: boolean;
    finance?: boolean;
  };
}

export const useSchoolLocks = () => {
  const { profile } = useAuth();
  const schoolId = profile?.schoolId;
  const { data: school, loading, error } = useDocument<SchoolRecord>('schools', schoolId);
  const locks = profile?.role === 'super_admin' ? {} : school?.locks ?? {};

  return { locks, loading, error, school };
};
