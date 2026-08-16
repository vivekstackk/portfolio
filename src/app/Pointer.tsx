/* src/app/Pointer.tsx */

"use client";

import { useEffect, useRef } from "react";

export default function Pointer() {
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const lastTrail = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const pointer = pointerRef.current;

    if (!pointer) return;

    root.classList.add("xp-pointer-active");

    let mouseX = -100;
    let mouseY = -100;
    let renderX = -100;
    let renderY = -100;
    let frame = 0;

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!pointer.classList.contains("is-visible")) {
        pointer.classList.add("is-visible");
      }

      const target = event.target as HTMLElement | null;
      const clickable = target?.closest(
        "a, button, [role='button'], .desktop-icon, .taskbar-item"
      );

      pointer.classList.toggle("is-link", Boolean(clickable));

      const now = performance.now();

      /* Small stepped trail — deliberately retro rather than smooth. */
      if (now - lastTrail.current > 55) {
        lastTrail.current = now;

        const trail = document.createElement("span");
        trail.className = "xp-pointer-trail";
        trail.style.left = `${mouseX + 2}px`;
        trail.style.top = `${mouseY + 4}px`;
        document.body.appendChild(trail);

        window.setTimeout(() => trail.remove(), 380);
      }
    };

    const click = () => {
      pointer.style.setProperty("--xp-x", `${mouseX}px`);
      pointer.style.setProperty("--xp-y", `${mouseY}px`);

      pointer.classList.remove("is-clicking");

      /* Restart the animation every click. */
      void pointer.offsetWidth;

      pointer.classList.add("is-clicking");

      window.setTimeout(() => {
        pointer.classList.remove("is-clicking");
      }, 340);
    };

    const leave = () => {
      pointer.classList.remove("is-visible");
    };

    const enter = () => {
      pointer.classList.add("is-visible");
    };

    const render = () => {
      /* Slightly delayed movement gives the old desktop pointer a
         physical / low-frame-rate feel instead of a modern cursor. */
      renderX += (mouseX - renderX) * 0.72;
      renderY += (mouseY - renderY) * 0.72;

      pointer.style.transform =
        `translate3d(${Math.round(renderX)}px, ${Math.round(renderY)}px, 0)`;

      frame = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", click);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", click);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      root.classList.remove("xp-pointer-active");
    };
  }, []);

  return (
    <div ref={pointerRef} className="xp-pointer" aria-hidden="true">
      <span className="xp-pointer-tail" />
    </div>
  );
}