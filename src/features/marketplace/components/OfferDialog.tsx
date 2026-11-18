import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, MessageCircle, Gavel, ShoppingCart } from 'lucide-react';
import {
  submitOffer, whatsAppFromOffer, isOfferConfigured, validateOffer, formatPrice,
} from '../services/offerService';
import type { OfferFormData, OfferType, Product } from '../types';

interface OfferDialogProps {
  product: Product | null;
  offerType: OfferType;
  onClose: () => void;
}

const inputClass =
  'w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-fg placeholder:text-fg-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20';

export const OfferDialog: React.FC<OfferDialogProps> = ({ product, offerType, onClose }) => {
  const [form, setForm] = useState<OfferFormData>({
    name: '', email: '', phone: '', productSlug: '', offerType: 'buy', amount: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Sync the product + chosen action into the form and reset state each time
  // the dialog is opened for a (possibly different) product.
  useEffect(() => {
    if (!product) return;
    setForm((f) => ({
      ...f,
      productSlug: product.slug,
      offerType,
      amount: offerType === 'bid' && product.minimumBid !== undefined ? String(product.minimumBid) : '',
    }));
    setStatus('idle');
    setError(null);
  }, [product, offerType]);

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const setType = (type: OfferType) => {
    setForm((f) => ({ ...f, offerType: type }));
    setError(null);
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const invalid = validateOffer(form, product);
    if (invalid) {
      setStatus('error');
      setError(invalid);
      return;
    }

    setStatus('sending');
    setError(null);

    // No email/sheet channel configured → route straight to WhatsApp.
    if (!isOfferConfigured()) {
      window.open(whatsAppFromOffer(form), '_blank', 'noopener');
      setStatus('sent');
      return;
    }

    const result = await submitOffer(form);
    if (result.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
      setError(result.error);
    }
  };

  const biddable = product?.minimumBid !== undefined;
  const isBid = form.offerType === 'bid';

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${isBid ? 'Make an offer on' : 'Buy'} ${product.name}`}
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
                <h3 className="font-display text-2xl font-semibold text-fg">
                  {isBid ? 'Offer received!' : 'Request received!'}
                </h3>
                <p className="mt-2 max-w-sm text-fg-muted">
                  Thanks for your interest in <strong className="text-fg">{product.name}</strong>. I'll get back
                  to you shortly over WhatsApp or email to {isBid ? 'respond to your offer' : 'confirm the purchase'}{' '}
                  and arrange payment and handover.
                </p>
                <button onClick={onClose} className="btn-ghost mt-6 text-sm">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 pr-10">
                  {product.logo && (
                    <img
                      src={product.logo}
                      alt={`${product.name} logo`}
                      width={56}
                      height={56}
                      className="h-14 w-14 flex-shrink-0 rounded-2xl"
                    />
                  )}
                  <div>
                    <span className="chip mb-2 w-fit">{product.category}</span>
                    <h3 className="font-display text-2xl font-semibold text-fg">{product.name}</h3>
                  </div>
                </div>
                <p className="mt-2 text-sm text-fg-muted">
                  Nothing is charged here. Send your details and I'll reply over WhatsApp or email to agree the
                  deal, then share payment options and hand over.
                </p>

                {/* Buy at asking price vs. place a bid */}
                {biddable && (
                  <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-line bg-white/[0.02] p-1">
                    {(['buy', 'bid'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        aria-pressed={form.offerType === t}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                          form.offerType === t ? 'bg-white/[0.08] text-fg' : 'text-fg-muted hover:text-fg'
                        }`}
                      >
                        {t === 'buy' ? <ShoppingCart size={15} /> : <Gavel size={15} />}
                        {t === 'buy' ? 'Buy now' : 'Make an offer'}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 rounded-2xl border border-accent-cyan/30 bg-accent-cyan/[0.08] p-4 text-sm">
                  <p className="flex justify-between gap-3 text-fg">
                    <span className="text-fg-muted">Asking price</span>
                    <strong>{formatPrice(product.askingPrice, product.currency)}</strong>
                  </p>
                  {biddable && (
                    <p className="mt-1 flex justify-between gap-3 text-fg">
                      <span className="text-fg-muted">Minimum offer</span>
                      <span>{formatPrice(product.minimumBid!, product.currency)}</span>
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {isBid && (
                    <div>
                      <label htmlFor="amount" className="mb-2 block text-sm text-fg-muted">
                        Your offer ({product.currency}) *
                      </label>
                      <input
                        id="amount"
                        name="amount"
                        inputMode="numeric"
                        value={form.amount}
                        onChange={onChange}
                        required
                        placeholder={String(product.minimumBid)}
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" name="name" value={form.name} onChange={onChange} required placeholder="Your name" />
                    <Field label="Phone / WhatsApp" name="phone" value={form.phone} onChange={onChange} required placeholder="+977 …" />
                  </div>
                  <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="you@example.com" />

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm text-fg-muted">
                      How will you use it? (optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={onChange}
                      placeholder="e.g. rebrand for my company, launch as a SaaS, customisations needed, timeline…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {status === 'error' && error && (
                    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}{' '}
                      <a href={whatsAppFromOffer(form)} target="_blank" rel="noopener noreferrer" className="underline">
                        Talk on WhatsApp instead
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
                      {status === 'sending' ? (
                        <><Loader2 size={18} className="animate-spin" /> Sending…</>
                      ) : (
                        <>{isBid ? 'Submit offer' : 'Request to buy'} <Send size={18} /></>
                      )}
                    </button>
                    <a href={whatsAppFromOffer(form)} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                      <MessageCircle size={16} /> Or WhatsApp
                    </a>
                  </div>
                  <p className="text-xs text-fg-faint">
                    * Required. Your details come straight to me and are never shared. Offers aren't binding
                    until we both agree.
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

/* Small labelled input — matches the enrol form field. */
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
      className={inputClass}
    />
  </div>
);
