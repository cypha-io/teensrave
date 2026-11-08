'use client';

import { Children, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type StagedFormProps = {
  stages: string[];
  /** One child per stage, in order. */
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  isSubmitting: boolean;
  missingFields: string[];
  /** Extra check for rules native validation can't express. Returns an error message or null. */
  validateStage?: (stage: number) => string | null;
  encType?: string;
};

export default function StagedForm({ stages, children, onSubmit, isSubmitting, missingFields, validateStage, encType }: StagedFormProps) {
  const [step, setStep] = useState(0);
  const [stageError, setStageError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastStep = stages.length - 1;

  const scrollToCard = () => {
    requestAnimationFrame(() => {
      formRef.current?.closest('[data-form-card]')?.scrollIntoView({ block: 'start' });
    });
  };

  const stageIsValid = () => {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `[data-stage="${step}"] input, [data-stage="${step}"] select, [data-stage="${step}"] textarea`
    );
    const invalid = Array.from(fields ?? []).find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return false;
    }
    const error = validateStage?.(step) ?? null;
    setStageError(error);
    return error === null;
  };

  // The one button is type="submit" on every stage, so Enter behaves like pressing Next.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stageIsValid()) return;
    if (step < lastStep) {
      setStep(step + 1);
      scrollToCard();
      return;
    }
    await onSubmit(e);
    scrollToCard();
  };

  const goBack = () => {
    setStageError(null);
    setStep(step - 1);
    scrollToCard();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} encType={encType} noValidate>
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-neutral-300">
          Step {step + 1} of {stages.length}
          <span className="text-neutral-500"> · {stages[step]}</span>
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {stages.map((stage, index) => (
            <span key={stage} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-green-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Stages stay mounted so typed values and chosen files survive moving between steps */}
      {Children.toArray(children).map((child, index) => (
        <div key={stages[index]} data-stage={index} hidden={index !== step}>
          {child}
        </div>
      ))}

      {stageError && (
        <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {stageError}
        </p>
      )}

      {step === lastStep && missingFields.length > 0 && !isSubmitting && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="mb-2 font-semibold text-red-300">Please complete the following fields:</p>
          <ul className="space-y-1 text-sm text-red-300">
            {missingFields.map((field) => (
              <li key={field}>• {field}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-500"
        >
          {step < lastStep ? (
            <>
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          ) : isSubmitting ? (
            'Submitting...'
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
}
