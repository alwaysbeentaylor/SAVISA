
import React from 'react';
import { ApplicationStep } from '../types';
import { STEPS } from '../constants';

interface Props {
  currentStep: ApplicationStep;
}

export const StepProgressBar: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative flex-1">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${index < currentStep ? 'bg-emerald-600 border-emerald-600 text-white' :
                  index === currentStep ? 'border-emerald-600 text-emerald-600 ring-4 ring-emerald-50' :
                    'border-slate-300 text-slate-400'
                }`}>
                {index < currentStep ? (
                  <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs md:text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span className={`mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider hidden lg:block ${index <= currentStep ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                {step}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-200 self-center -mt-4 md:mt-0">
                <div className={`h-full bg-emerald-600 transition-all duration-500 ${index < currentStep ? 'w-full' : 'w-0'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
