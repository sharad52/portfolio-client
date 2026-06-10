import React from 'react';
import { motion } from 'framer-motion';
import { skillGroups } from '@/content/site';
import { Reveal, Section, SectionHeading } from '@/shared/components/ui';
import { staggerContainer, staggerItem } from '@/shared/components/ui/motion';

export const Skills: React.FC = () => (
  <Section id="skills">
    <SectionHeading
      eyebrow="Toolkit"
      title={<>The stack I reach for</>}
      intro="A pragmatic toolset, chosen for what ships reliably — not what's trending."
    />

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, i) => (
        <Reveal key={group.category} delay={i * 0.06}>
          <div className="h-full rounded-2xl border border-line bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-faint">
              {group.category}
            </h3>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2"
            >
              {group.items.map((item) => (
                <motion.li
                  key={item}
                  variants={staggerItem}
                  className="rounded-full border border-line bg-white/[0.04] px-3 py-1.5 text-sm text-fg transition-colors hover:border-accent/40 hover:text-accent-cyan"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);
