import { ROLE } from '@/constants';
import type { NavigateFunction } from 'react-router-dom';

export function redirectBasedOnRole(role: string, navigate: NavigateFunction) {
  if (role === ROLE.ADMIN) {
    navigate('/admin/dashboard');
  } else if (role === ROLE.WORKER) {
    navigate('/worker/dashboard');
  } else {
    navigate('/');
  }
}
