import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Renders the exact uploaded Birari Unisex Salon logo PNG.
 * The image itself is never redrawn, stretched, or regenerated —
 * only its display size is controlled via the `size` prop.
 */
export default function Logo({ size = 96, className = "", priority = false }: LogoProps) {
  return (
    <Image
      src="/assets/birari-unisex-salon-logo.png"
      alt="Birari Unisex Salon"
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
