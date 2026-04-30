import { useParams } from 'react-router-dom';

export default function WorkerDetailsLayout() {
  const { workerId } = useParams();
  console.log(workerId);

  return <div>WorkerDetailsLayout</div>;
}
