"use client";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "../hooks/app";

export default function Logo({ className }: { className?: string }) {
    const { theme, } = useApp();

    return (
        <Link href="/" className={`flex items-center gap-2 group ring-1 ring-primary/30 group-hover:ring-primary/60 p-1.5 md:p-3 rounded-0 bg-primary/15 ${theme === "dark" ? 'bg-dark' : 'bg-light'} ${className}`}>
            <div className="relative size-8 grid place-items-center transition">
                <Image
                    src={"/logo.png"}
                    alt="AnD AI Logo"
                    width={32}
                    height={32}
                    priority
                    unoptimized
                    style={{ width: '32px', height: 'auto' }}
                    className="block"
                />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-display font-bold text-base">AnD AI</span>
                <span className="text-[10px] text-muted-foreground tracking-widest">NIGERIA</span>
            </div>
        </Link>

    );
}