import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export interface EditSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSkills: string[];
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export const EditSkillsModal: React.FC<EditSkillsModalProps> = ({
  isOpen,
  onClose,
  availableSkills,
  selectedSkills,
  onToggleSkill,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose} title="Select Skills">
      <form onSubmit={onSubmit} className="flex flex-col">
        <p className="text-xs text-slate-500 mb-4">
          Check the skill options you have experience with:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6">
          {availableSkills.map((skill) => {
            const isChecked = selectedSkills.includes(skill);
            return (
              <label
                key={skill}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => !isSubmitting && onToggleSkill(skill)}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="truncate">{skill}</span>
              </label>
            );
          })}
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Saving...' : 'Save Skills'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSkillsModal;
