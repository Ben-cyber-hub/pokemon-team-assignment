
import { useParams } from 'react-router-dom';

export const TeamDetails = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Team Details</h1>
      <p>Team ID: {id}</p>
    </div>
  );
};