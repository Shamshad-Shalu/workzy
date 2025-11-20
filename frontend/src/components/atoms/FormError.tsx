export default function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-red-600 text-sm mt-1">{message}</p>;
}
