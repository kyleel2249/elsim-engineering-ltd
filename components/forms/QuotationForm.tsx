'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { services } from '@/lib/data/services';
import { quotationSchema } from '@/lib/validation/quotation';
import type { QuotationResponse } from '@/lib/validation/quotation';
import { company } from '@/lib/data/company';
import { cn } from '@/lib/utils';

interface FormState {
  name: string;
  clientType: string;
  company: string;
  email: string;
  telephone: string;
  projectType: string;
  serviceRequired: string;
  projectLocation: string;
  projectDescription: string;
  estimatedTimeline: string;
  budgetRange: string;
  consent: boolean;
  website: string;
}

const initialState: FormState = {
  name: '',
  clientType: '',
  company: '',
  email: '',
  telephone: '',
  projectType: '',
  serviceRequired: '',
  projectLocation: '',
  projectDescription: '',
  estimatedTimeline: '',
  budgetRange: '',
  consent: false,
  website: '',
};

const STEPS = [
  { id: 1, label: 'Your details' },
  { id: 2, label: 'Project details' },
  { id: 3, label: 'Timeline & consent' },
] as const;

const STEP_FIELDS: Record<number, (keyof FormState)[]> = {
  1: ['name', 'clientType', 'email', 'telephone'],
  2: ['serviceRequired', 'projectLocation', 'projectDescription'],
  3: ['consent'],
};

const inputClass =
  'w-full rounded border px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:ring-2';

function fieldStyle(invalid: boolean) {
  return {
    borderColor: invalid ? '#B23034' : 'var(--theme-border)',
    backgroundColor: 'var(--theme-surface)',
    color: 'var(--theme-text)',
    boxShadow: invalid ? '0 0 0 1px rgba(178,48,52,0.25)' : undefined,
  } as const;
}

export function QuotationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /** Rough completion signal so people can see progress within a step. */
  const completion = useMemo(() => {
    const required = [
      form.name,
      form.email,
      form.telephone,
      form.serviceRequired,
      form.projectLocation,
      form.projectDescription,
      form.consent ? 'yes' : '',
    ];
    const filled = required.filter(Boolean).length;
    return Math.round((filled / required.length) * 100);
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(target: number) {
    const payload = { ...form, website: form.website || undefined };
    const result = quotationSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fields = STEP_FIELDS[target] ?? [];
    const next: Partial<Record<keyof FormState, string>> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FormState;
      if (fields.includes(field) && !next[field]) next[field] = issue.message;
    }

    setErrors(next);

    if (Object.keys(next).length) {
      const firstField = fields.find((f) => next[f]);
      if (firstField) document.getElementById(firstField)?.focus();
      return false;
    }
    return true;
  }

  /** Build the enquiry body shared by WhatsApp (and email fallback). */
  function enquiryMessage() {
    return [
      'ELSIM Engineering — project enquiry',
      '',
      `Name: ${form.name}`,
      `Client type: ${form.clientType || '—'}`,
      `Company / organisation: ${form.clientType === 'Individual' ? 'N/A (individual)' : form.company || '—'}`,
      `Email: ${form.email}`,
      `Telephone: ${form.telephone}`,
      `Service required: ${form.serviceRequired}`,
      `Project type: ${form.projectType || '—'}`,
      `Project location: ${form.projectLocation}`,
      `Estimated timeline: ${form.estimatedTimeline || '—'}`,
      `Budget range: ${form.budgetRange || '—'}`,
      '',
      'Project description:',
      form.projectDescription,
    ].join('\n');
  }

  /** Primary handoff: open WhatsApp to the ELSIM business number with the form prefilled. */
  function whatsappHref() {
    const phone = company.phones.find((p) => p.whatsapp)?.tel.replace('+', '') ?? '233538578943';
    return `https://wa.me/${phone}?text=${encodeURIComponent(enquiryMessage())}`;
  }

  function mailtoHref() {
    return `mailto:?subject=${encodeURIComponent(
      'ELSIM Engineering — project enquiry'
    )}&body=${encodeURIComponent(enquiryMessage())}`;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validateStep(3)) return;

    setStatus('submitting');
    setServerMessage(null);

    // Primary path: send the enquiry to WhatsApp (+233 538 578 943).
    // This works on static hosting and on mobile/desktop WhatsApp apps.
    try {
      const href = whatsappHref();
      window.open(href, '_blank', 'noopener,noreferrer');
      setStatus('success');
      setReference(null);
      setForm(initialState);
      setStep(1);
    } catch {
      setStatus('error');
      setServerMessage(
        'We could not open WhatsApp automatically. Use the link below to send your enquiry, or call ' +
          (company.phones.find((p) => p.whatsapp)?.display ?? '+233 538 578 943') +
          '.'
      );
    }
  }

  async function copyReference() {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the reference is still on screen */
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded border p-8 text-center"
        style={{ borderColor: 'var(--theme-accent)', backgroundColor: 'var(--theme-accent-soft)' }}
        role="status"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent" aria-hidden />
        <h3 className="mt-4 font-display text-xl font-semibold" style={{ color: 'var(--theme-text)' }}>
          Opening WhatsApp
        </h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--theme-text-muted)' }}>
          Your project details have been prepared for WhatsApp. Complete the send in the chat that
          opened — the ELSIM team will reply on +233 538 578 943.
        </p>
        <a
          href="https://wa.me/233538578943"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-accent underline"
        >
          Open WhatsApp again if the chat did not appear
        </a>
        {reference && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--theme-text-subtle)' }}>
              Reference
            </p>
            <button
              type="button"
              onClick={copyReference}
              className="inline-flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-sm"
              style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
            >
              {reference}
              <Copy className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">{copied ? 'Copied' : 'Copy reference'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex items-center justify-between gap-4">
        <ol className="flex flex-wrap gap-2" aria-label="Form steps">
          {STEPS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  if (s.id < step || validateStep(step)) setStep(s.id);
                }}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  s.id === step ? 'bg-accent text-on-accent' : 'border'
                )}
                style={
                  s.id === step
                    ? undefined
                    : { borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }
                }
                aria-current={s.id === step ? 'step' : undefined}
              >
                {s.id}. {s.label}
              </button>
            </li>
          ))}
        </ol>
        <p className="text-xs tabular-nums" style={{ color: 'var(--theme-text-subtle)' }} aria-live="polite">
          {completion}% complete
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <Field id="name" label="Full name" required error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.name))}
                />
              </Field>
              <Field id="clientType" label="I am enquiring as" required error={errors.clientType}>
                <select
                  id="clientType"
                  name="clientType"
                  value={form.clientType}
                  onChange={(e) => {
                    update('clientType', e.target.value);
                    if (e.target.value === 'Individual') update('company', '');
                  }}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.clientType))}
                >
                  <option value="">Select…</option>
                  <option value="Individual">Individual</option>
                  <option value="Company / organisation">Company / organisation</option>
                </select>
              </Field>
              {form.clientType === 'Company / organisation' && (
                <Field id="company" label="Company / organisation name" error={errors.company}>
                  <input
                    id="company"
                    name="company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    className={inputClass}
                    style={fieldStyle(Boolean(errors.company))}
                    placeholder="Company or organisation name"
                  />
                </Field>
              )}
              <Field id="email" label="Email" required error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.email))}
                />
              </Field>
              <Field id="telephone" label="Telephone" required error={errors.telephone}>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  autoComplete="tel"
                  value={form.telephone}
                  onChange={(e) => update('telephone', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.telephone))}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field id="serviceRequired" label="Service required" required error={errors.serviceRequired}>
                <select
                  id="serviceRequired"
                  name="serviceRequired"
                  value={form.serviceRequired}
                  onChange={(e) => update('serviceRequired', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.serviceRequired))}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="projectType" label="Project type" error={errors.projectType}>
                <input
                  id="projectType"
                  name="projectType"
                  value={form.projectType}
                  onChange={(e) => update('projectType', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.projectType))}
                  placeholder="e.g. new build, retrofit, maintenance"
                />
              </Field>
              <Field id="projectLocation" label="Project location" required error={errors.projectLocation}>
                <input
                  id="projectLocation"
                  name="projectLocation"
                  value={form.projectLocation}
                  onChange={(e) => update('projectLocation', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.projectLocation))}
                  placeholder="City / site address"
                />
              </Field>
              <Field
                id="projectDescription"
                label="Project description"
                required
                error={errors.projectDescription}
                hint="Scope, load, any drawings or constraints"
              >
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  rows={5}
                  value={form.projectDescription}
                  onChange={(e) => update('projectDescription', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.projectDescription))}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field id="estimatedTimeline" label="Estimated timeline" error={errors.estimatedTimeline}>
                <input
                  id="estimatedTimeline"
                  name="estimatedTimeline"
                  value={form.estimatedTimeline}
                  onChange={(e) => update('estimatedTimeline', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.estimatedTimeline))}
                  placeholder="e.g. 8–12 weeks"
                />
              </Field>
              <Field id="budgetRange" label="Budget range" error={errors.budgetRange}>
                <input
                  id="budgetRange"
                  name="budgetRange"
                  value={form.budgetRange}
                  onChange={(e) => update('budgetRange', e.target.value)}
                  className={inputClass}
                  style={fieldStyle(Boolean(errors.budgetRange))}
                  placeholder="Optional"
                />
              </Field>
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border"
                  style={{ borderColor: errors.consent ? '#B23034' : 'var(--theme-border)' }}
                />
                <label htmlFor="consent" className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                  I agree that ELSIM Engineering may contact me about this enquiry using the details
                  provided.
                  {errors.consent && (
                    <span className="mt-1 block text-xs" style={{ color: '#B23034' }}>
                      {errors.consent}
                    </span>
                  )}
                </label>
              </div>
              {/* Honeypot — leave empty */}
              <div className="hidden" aria-hidden>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'var(--theme-border)' }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-2 rounded border px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)' }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => validateStep(step) && setStep((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:brightness-110"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-all hover:brightness-110 disabled:opacity-60"
          >
            {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {status === 'submitting' ? 'Opening WhatsApp' : 'Send via WhatsApp'}
          </button>
        )}
      </div>

      {status === 'error' && serverMessage && (
        <div
          className="flex gap-3 rounded border p-4 text-sm"
          style={{ borderColor: '#B23034', backgroundColor: 'var(--theme-accent-soft)' }}
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#B23034' }} aria-hidden />
          <div style={{ color: 'var(--theme-text)' }}>
            <p>{serverMessage}</p>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-medium text-accent underline"
            >
              Send this enquiry on WhatsApp
            </a>
            <span className="mx-2 text-xs" style={{ color: 'var(--theme-text-subtle)' }}>
              or
            </span>
            <a href={mailtoHref()} className="inline-block font-medium text-accent underline">
              open in email
            </a>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
          {label}
          {required && <span className="text-accent"> *</span>}
        </label>
        {hint && (
          <span className="text-xs" style={{ color: 'var(--theme-text-subtle)' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#B23034' }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
