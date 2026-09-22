import type { ReactNode } from 'react';

import { Reveal } from '@/components/reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Nội dung phụ nằm bên phải trên màn hình rộng, thường là một liên kết. */
  aside?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  aside,
  align = 'left',
  tone = 'dark',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <Reveal className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow ? (
          <p className={`eyebrow ${tone === 'light' ? 'text-accent-soft' : ''}`}>{eyebrow}</p>
        ) : null}
        <h2
          className={`mt-4 font-display text-3xl leading-tight md:text-4xl lg:text-[2.75rem] ${
            tone === 'light' ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
        {description ? (
          <div
            className={`mt-5 text-[0.9375rem] leading-relaxed ${
              tone === 'light' ? 'text-white/65' : 'text-ink-soft'
            }`}
          >
            {description}
          </div>
        ) : null}
      </Reveal>

      {aside ? (
        <Reveal delay={120} className="shrink-0">
          {aside}
        </Reveal>
      ) : null}
    </div>
  );
}
