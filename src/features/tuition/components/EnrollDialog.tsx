import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { batches } from '@/content/site';
import {
  submitEnrollment, whatsAppFromEnrollment, isEnrollmentConfigured,
} from '../services/enrollmentService';
import type { Course, EnrollmentFormData } from '../types';

const LEVELS = ['Complete beginner', 'Some basics', 'Comfortable', 'Experienced'] as const;

/** Default time slot (morning) — every course offers the same two slots. */
const defaultBatchId = batches[0]?.id ?? '';

interface EnrollDialogProps {
  course: Course | null;
  onClose: () => void;
}

export const EnrollDialog: React.FC<EnrollDialogProps> = ({ course, onClose }) => {
  const [form, setForm] = useState<EnrollmentFormData>({
    name: '', email: '', phone: '', courseSlug: '', batchId: defaultBatchId, currentLevel: '', goals: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Sync the selected course into the form and reset state each time the
  // dialog is opened for a (possibly different) course.
  useEffect(() => {
    if (!course) return;
    setForm((f) => ({ ...f, courseSlug: course.slug }));
    setStatus('idle');
    setError(null);
  }, [course]);

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!course) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [course, onClose]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    // No email/sheet channel configured → route straight to WhatsApp.
    if (!isEnrollmentConfigured()) {
      window.open(whatsAppFromEnrollment(form), '_blank', 'noopener');
      setStatus('sent');
      return;
    }

    const result = await submitEnrollment(form);
    if (result.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
      setError(result.error);
    }
  };

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Enroll in ${course.title}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-base/95 p-6 backdrop-blur-xl sm:rounded-3xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-line bg-white/[0.03] text-fg-muted transition-colors hover:text-fg"
            >
              <X size={18} />
            </button>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-dark text-fg">
                  <CheckCircle2 size={32} />
                </span>
                <h3 className="font-display text-2xl font-semibold text-fg">You're on the list!</h3>
                <p className="mt-2 max-w-sm text-fg-muted">
                  Thanks for enrolling in <strong className="text-fg">{course.title}</strong>. I'll be in
                  touch shortly to confirm your seat and share the payment details.
                </p>
                <button onClick={onClose} className="btn-ghost mt-6 text-sm">Done</button>
              </div>
            ) : (
              <>
                <span className="chip mb-3 w-fit">{course.level} · {course.duration}</span>
                <h3 className="font-display text-2xl font-semibold text-fg">Enroll — {course.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">
                  No payment now. Send your details and I'll confirm your seat and payment options over
                  WhatsApp or email.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" name="name" value={form.name} onChange={onChange} required placeholder="Your name" />
                    <Field label="Phone / WhatsApp" name="phone" value={form.phone} onChange={onChange} required placeholder="+977 …" />
                  </div>
                  <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="you@example.com" />

                  <div>
                    <label htmlFor="batchId" className="mb-2 block text-sm text-fg-muted">
                      Preferred time * <span className="text-fg-faint">· {course.days}</span>
                    </label>
                    <select
                      id="batchId"
                      name="batchId"
                      value={form.batchId}
                      onChange={onChange}
                      required
                      className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.id} className="bg-base text-fg">
                          {b.label} — {course.days} · {b.time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="currentLevel" className="mb-2 block text-sm text-fg-muted">Your Python level</label>
                    <select
                      id="currentLevel"
                      name="currentLevel"
                      value={form.currentLevel}
                      onChange={onChange}
                      className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                      <option value="" className="bg-base text-fg">Select…</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l} className="bg-base text-fg">{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="goals" className="mb-2 block text-sm text-fg-muted">What do you want to achieve? (optional)</label>
                    <textarea
                      id="goals"
                      name="goals"
                      rows={3}
                      value={form.goals}
                      onChange={onChange}
                      placeholder="e.g. switch careers into software, prepare for interviews, automate my work…"
                      className="w-full resize-none rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  {status === 'error' && error && (
                    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}{' '}
                      <a href={whatsAppFromEnrollment(form)} target="_blank" rel="noopener noreferrer" className="underline">
                        Enroll via WhatsApp instead
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
                      {status === 'sending' ? (
                        <><Loader2 size={18} className="animate-spin" /> Sending…</>
                      ) : (
                        <>Confirm enrollment <Send size={18} /></>
                      )}
                    </button>
                    <a href={whatsAppFromEnrollment(form)} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                      <MessageCircle size={16} /> Or WhatsApp
                    </a>
                  </div>
                  <p className="text-xs text-fg-faint">
                    * Required. Your details are emailed directly to me and saved to my private enrolment
                    sheet — nothing is charged and nothing is shared.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Small labelled input — matches the contact form field. */
const Field: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', required, placeholder }) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-sm text-fg-muted">
      {label}{required && ' *'}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
    />
  </div>
);
