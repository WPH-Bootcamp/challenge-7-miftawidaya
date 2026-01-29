/**
 * Logo Component
 *
 * Inline SVG logo component that inherits color from parent via currentColor.
 * This allows the logo to be styled with text-* utility classes.
 *
 * @example
 * // Red brand logo
 * <span className="text-primary"><Logo /></span>
 *
 * // White logo for dark backgrounds
 * <span className="text-white"><Logo /></span>
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  /** Additional CSS classes */
  className?: string;
  /** Accessible title for the logo */
  title?: string;
}

export function Logo({ className, title = 'Foody Logo' }: Readonly<LogoProps>) {
  return (
    <svg
      width='42'
      height='42'
      viewBox='0 0 42 42'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('size-10', className)}
      aria-labelledby='logo-title'
    >
      <title id='logo-title'>{title}</title>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22.5 0H19.5V13.2832L14.524 0.967222L11.7425 2.09104L16.8474 14.726L7.21142 5.09009L5.09011 7.21142L14.3257 16.447L2.35706 11.2178L1.15596 13.9669L13.8202 19.5H0V22.5H13.8202L1.15597 28.0331L2.35706 30.7822L14.3257 25.553L5.09011 34.7886L7.21142 36.9098L16.8474 27.274L11.7425 39.909L14.524 41.0327L19.5 28.7169V42H22.5V28.7169L27.476 41.0327L30.2574 39.909L25.1528 27.274L34.7886 36.9098L36.9098 34.7886L27.6742 25.553L39.643 30.7822L40.8439 28.0331L28.1799 22.5H42V19.5H28.1797L40.8439 13.9669L39.643 11.2178L27.6742 16.447L36.9098 7.2114L34.7886 5.09009L25.1528 14.726L30.2574 2.09104L27.476 0.967222L22.5 13.2832V0Z'
        fill='currentColor'
      />
    </svg>
  );
}
