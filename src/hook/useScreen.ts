import { useEffect, useState, useRef } from "react";

type UseScreenResult = {
    isMobile: boolean;
    isDesktop: boolean;
    width: number;
    breakpoint: number;
};

/**
 * useScreen - hook para detectar vista mobile / desktop
 * - breakpoint: ancho en px a partir del cual se considera desktop (por defecto 768)
 * - ssrMobile: valor por defecto durante SSR (window no existe)
 */
export default function useScreen(
    breakpoint: number = 768,
    ssrMobile: boolean = false
): UseScreenResult {
    const isClient = typeof window !== "undefined";
    const initialWidth = isClient ? window.innerWidth : 0;
    const [width, setWidth] = useState<number>(initialWidth);
    const [isMobile, setIsMobile] = useState<boolean>(
        isClient ? initialWidth < breakpoint : ssrMobile
    );

    // ref para evitar múltiples RAF pendientes
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isClient) return;

        const updateFromResize = () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const w = window.innerWidth;
                setWidth(w);
                setIsMobile(w < breakpoint);
                rafRef.current = null;
            });
        };

        // Preferir matchMedia cuando esté disponible (mejor rendimiento)
        if ("matchMedia" in window) {
            const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

            const mqListener = (e: MediaQueryListEvent | MediaQueryList) => {
                // actualizar ancho también por si se necesita
                setWidth(window.innerWidth);
                setIsMobile(!!("matches" in e ? e.matches : (e as MediaQueryListEvent).matches));
            };

            // addEventListener fallback for older browsers that use addListener
            if (typeof mq.addEventListener === "function") {
                mq.addEventListener("change", mqListener as EventListener);
            } else {
                mq.addListener(mqListener);
            }

            // sincronizar estado inicial por si cambió desde la creación
            mqListener(mq);

            return () => {
                if (typeof mq.removeEventListener === "function") {
                    mq.removeEventListener("change", mqListener as EventListener);
                } else {
                    mq.removeListener(mqListener);
                }
                if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            };
        }

        // Fallback a resize
        (window as Window).addEventListener("resize", updateFromResize, { passive: true });
        // estado inicial
        updateFromResize();

        return () => {
            (window as Window).removeEventListener("resize", updateFromResize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
        // breakpoint intencionalmente en dependencias para que se recalcule si cambia
    }, [breakpoint, isClient]);

    return {
        isMobile,
        isDesktop: !isMobile,
        width,
        breakpoint,
    };
}