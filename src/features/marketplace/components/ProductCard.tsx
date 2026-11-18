import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ExternalLink, Gavel, ShoppingCart } from 'lucide-react';
import { Icon } from '@/shared/components/ui';
import { createProductRoute } from '@/core/routes';
import { formatPrice } from '../services/offerService';
import type { OfferType, Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAction: (product: Product, type: OfferType) => void;
}

const STATUS_STYLE: Record<Product['status'], string> = {
  available: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  'under-offer': 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  sold: 'text-fg-faint border-line bg-white/[0.03]',
};

const STATUS_LABEL: Record<Product['status'], string> = {
  available: 'Available',
  'under-offer': 'Under offer',
  sold: 'Sold',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, onAction }) => {
  const sold = product.status === 'sold';
  const biddable = product.minimumBid !== undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col rounded-3xl border border-line bg-white/[0.03] p-7 backdrop-blur-xl transition-colors hover:border-white/20"
    >
      <div className="absolute right-6 top-6 flex flex-col items-end gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLE[product.status]}`}>
          {STATUS_LABEL[product.status]}
        </span>
        {product.featured && (
          <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-medium text-fg">
            Featured
          </span>
        )}
      </div>

      {product.logo ? (
        <img
          src={product.logo}
          alt={`${product.name} logo`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-2xl"
        />
      ) : (
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-white/[0.04] text-accent-cyan">
          <Icon name={product.icon} size={22} />
        </span>
      )}

      <span className="chip mt-5 w-fit">{product.category}</span>

      <h3 className="mt-4 font-display text-xl font-semibold text-fg">
        <Link to={createProductRoute(product.slug)} className="hover:text-accent-cyan">{product.name}</Link>
      </h3>
      <p className="mt-1 text-sm text-fg">{product.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{product.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {product.techStack.map((t) => (
          <span key={t} className="rounded-full border border-line bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-fg-muted">
            {t}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-2">
        {product.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-fg-muted">
            <Check size={16} className="mt-0.5 flex-shrink-0 text-accent-cyan" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-2xl border border-line bg-white/[0.02] px-3.5 py-3 text-xs">
        <p className="text-fg-faint">You get</p>
        <ul className="mt-1.5 space-y-1">
          {product.includes.map((i) => (
            <li key={i} className="text-fg">{i}</li>
          ))}
        </ul>
      </div>

      <Link
        to={createProductRoute(product.slug)}
        className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm text-fg hover:text-accent-cyan"
      >
        Full details, FAQ &amp; what's included <ArrowRight size={14} />
      </Link>

      {product.demoUrl && (
        <a
          href={product.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm text-accent-cyan hover:underline"
        >
          Live demo <ExternalLink size={14} />
        </a>
      )}

      <div className="mt-auto border-t border-line pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="block text-xs text-fg-faint">Asking price</span>
            <span className="font-display text-lg font-semibold text-fg">
              {formatPrice(product.askingPrice, product.currency)}
            </span>
          </div>
          {biddable && (
            <div className="text-right">
              <span className="block text-xs text-fg-faint">Offers from</span>
              <span className="text-sm font-medium text-fg-muted">
                {formatPrice(product.minimumBid!, product.currency)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onAction(product, 'buy')}
            disabled={sold}
            className="btn-primary flex-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={16} /> {sold ? 'Sold' : 'Buy now'}
          </button>
          {biddable && (
            <button
              onClick={() => onAction(product, 'bid')}
              disabled={sold}
              className="btn-ghost flex-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Gavel size={16} /> Make an offer
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
