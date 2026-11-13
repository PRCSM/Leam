import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  position?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Cropped photograph that fills its box. The dark gradient behind it shows while the image loads. */
export function Photo({ src, alt, sizes = "50vw", priority, className, imgClassName, position, style, children }: PhotoProps) {
  return (
    <div className={cn("photo", className)} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imgClassName}
        style={{ objectFit: "cover", objectPosition: position ?? "50% 50%" }}
      />
      {children}
    </div>
  );
}

export function Avatar({ src, alt, size = 32, className, ring }: { src: string; alt: string; size?: number; className?: string; ring?: boolean }) {
  return (
    <span
      className={cn("avatar", ring && "avatar-ring", className)}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} width={size * 2} height={size * 2} sizes={`${size * 2}px`} />
    </span>
  );
}
