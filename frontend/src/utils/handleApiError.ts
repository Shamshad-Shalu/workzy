import axios from 'axios';

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message;
  }

  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}
