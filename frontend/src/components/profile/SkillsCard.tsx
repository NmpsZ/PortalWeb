import React from 'react';
import Button from '../common/Button';
import { UserProfile } from '../../types';

export interface SkillsCardProps {
  profile: UserProfile;
  onEdit: () => void;
}

const getSkillBadgeStyle = (skill: string) => {
  const normalized = skill.toLowerCase().trim();
  if (normalized.includes('go')) {
    return 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-100';
  }
  if (normalized.includes('react')) {
    return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100';
  }
  if (normalized.includes('flutter')) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-100';
  }
  if (normalized.includes('ci/cd') || normalized.includes('cicd')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100';
  }
  // Default dynamic palette
  const palettes = [
    'bg-violet-50 text-violet-700 border-violet-200 ring-1 ring-violet-100',
    'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-100',
    'bg-teal-50 text-teal-700 border-teal-200 ring-1 ring-teal-100',
    'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-100',
  ];
  let hash = 0;
  for (let i = 0; i < skill.length; i++) hash += skill.charCodeAt(i);
  return palettes[hash % palettes.length];
};

export const SkillsCard: React.FC<SkillsCardProps> = ({ profile, onEdit }) => {
  const skillsCount = profile.skills?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">Skills & Proficiencies</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                {skillsCount} Skills
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">Technical skill sets</p>
          </div>
        </div>
        {/* Compact Edit Button on single line */}
        <Button
          variant="outline"
          onClick={onEdit}
          className="shrink-0 whitespace-nowrap text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 hover:border-violet-500 hover:text-violet-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit Skills</span>
        </Button>
      </div>

      {/* Skills Pill Badges */}
      <div className="flex flex-wrap gap-2.5 pt-0.5">
        {profile.skills && profile.skills.length > 0 ? (
          profile.skills.map((skill) => (
            <span
              key={skill}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide border shadow-2xs ${getSkillBadgeStyle(
                skill
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
              <span>{skill}</span>
            </span>
          ))
        ) : (
          <div className="py-2 text-sm text-slate-400 italic flex items-center gap-2">
            <span>No skills added yet.</span>
            <button
              onClick={onEdit}
              className="text-blue-600 font-semibold hover:underline not-italic text-xs cursor-pointer"
            >
              + Add Skills
            </button>
          </div>
        )}
      </div>

      {/* Clean compact summary without big empty space */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] font-medium text-slate-400">
          Verified technical capabilities
        </span>
        <button
          onClick={onEdit}
          className="text-violet-600 hover:text-violet-700 hover:underline text-[11px] font-semibold cursor-pointer"
        >
          Manage skill tags &rarr;
        </button>
      </div>
    </div>
  );
};

export default SkillsCard;
