import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { Team } from '../../types/team.types';

interface ShareTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSharing: (isPublic: boolean) => Promise<void>;
}

export const ShareTeamModal = ({ team, isOpen, onClose, onUpdateSharing }: ShareTeamModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const shareUrl = `${window.location.origin}/pokemon-team-assignment/shared-teams/${team.team_code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const handleTogglePublic = async () => {
    try {
      setIsUpdating(true);
      await onUpdateSharing(!team.is_public);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Share Team
          </Dialog.Title>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Public Sharing</span>
              <button
                onClick={handleTogglePublic}
                disabled={isUpdating}
                className={`relative inline-flex h-6 w-11 items-center rounded-full 
                  ${team.is_public ? 'bg-orange-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                  ${team.is_public ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>

            {team.is_public && (
              <div className="mt-4">
                <label className="text-sm font-medium">Share Link</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};