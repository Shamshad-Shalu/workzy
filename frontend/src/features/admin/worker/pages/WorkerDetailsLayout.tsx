import { useParams } from 'react-router-dom';

export default function WorkerDetailsLayout() {
  const { workerId } = useParams();
  console.log(workerId);

  return <main className="p-4 lg:p-6">WorkerDetailsLayout</main>;
}
