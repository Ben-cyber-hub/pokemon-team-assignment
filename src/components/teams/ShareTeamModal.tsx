import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { Team } from '../../types/team.types';

export interface ShareTeamModalProps {
  /** The team data to be shared */
  team: Team;
  /** Controls modal visibility */
  isOpen: boolean;
  /** Handler for closing the modal */
  onClose: () => void;
  /** Handler for updating team sharing status */
  onUpdateSharing: (isPublic: boolean) => Promise<void>;
}

/**
 * ShareTeamModal Component
 * 
 * Provides interface for managing team sharing settings and copying share links.
 * Handles public/private toggle and share URL generation.
 * 
 * @example
 * ```tsx
 * <ShareTeamModal
 *   team={team}
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onUpdateSharing={async (isPublic) => {
 *     await updateTeam({ ...team, is_public: isPublic });
 *   }}
 * />
 * ```
 */
export const ShareTeamModal = ({ 
  team, 
  isOpen, 
  onClose, 
  onUpdateSharing 
}: ShareTeamModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const shareUrl = `${window.location.origin}/pokemon-team-assignment/shared-teams/${team.team_code}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleTogglePublic = async () => {
    try {
      setIsUpdating(true);
      await onUpdateSharing(!team.is_public);
    } catch (error) {
      console.error('Failed to update sharing status:', error);
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
                {copySuccess && <span className="text-green-500 text-sm">Link copied!</span>}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};