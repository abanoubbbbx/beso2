"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  src: string;
  alt: string;
};

export function FeatureImage({ src, alt }: Props) {
  const [revealed, setRevealed] = useState(false);
  const router = useRouter();

  const handleOpen = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // لو الصورة نورت خلاص، افتح على طول
    if (revealed) {
      router.push("/portfolio");
      return;
    }

    // 1) نوّن الصورة فورًا
    setRevealed(true);

    // 2) استنى 400ms عشان المستخدم يشوف التلوين
    setTimeout(() => {
      router.push("/portfolio");
    }, 400);
  };

  return (
    <Link
      href="/portfolio"
      onClick={handleOpen}
      onTouchStart={() => setRevealed(true)}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:768px) 100vw, 33vw"
        className={`object-cover transition-all duration-500 ease-luxe ${
          revealed
            ? "grayscale-0 scale-105"
            : "grayscale group-hover:grayscale-0 group-hover:scale-105"
        }`}
      />
    </Link>
  );
}