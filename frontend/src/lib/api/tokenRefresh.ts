import axios from 'axios';
import { HOST, AUTH_ROUTES } from '@/constants';

export async function refreshTokenRequest() {
  const baseURL = import.meta.env.MODE === 'development' ? `${HOST}/api` : '/api';

  const res = await axios.post(
    `${baseURL}${AUTH_ROUTES.REFRESH_TOKEN}`,
    {},
    { withCredentials: true }
  );

  return res.data;
}
