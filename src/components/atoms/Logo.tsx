import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// 풀 로고 (header-logo.svg 사용)
export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeStyles = {
    sm: { width: 120, height: 29 },
    md: { width: 165, height: 40 },
    lg: { width: 200, height: 48 },
  };

  const styles = sizeStyles[size];

  return (
    <Image
      src="/images/logo/header-logo.svg"
      alt="Semicolon"
      width={styles.width}
      height={styles.height}
      className={className}
    />
  );
}

// 히어로 섹션용 큰 로고
export function HeroLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/logo/header-logo.svg"
      alt="Semicolon"
      width={200}
      height={48}
      className={className}
    />
  );
}
