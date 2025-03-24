import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { team_name: string; team_description?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateTeamModal = ({ isOpen, onClose, onSubmit, isLoading }: CreateTeamModalProps) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit({ team_name: teamName, team_description: description });
      onClose();
      setTeamName('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
      console.error('Team creation error:', err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">Create New Team</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-orange-300"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};