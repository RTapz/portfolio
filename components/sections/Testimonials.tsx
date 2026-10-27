import type { TestimonialItem } from "@/lib/types";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const testimonial = testimonials[0];

  if (!testimonial) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Testimonials</h2>
      <div className="relative mt-10 min-h-[180px] rounded-2xl border border-white/5 bg-zinc-950 p-8 md:p-12">
        <p className="text-lg leading-relaxed text-zinc-300 md:text-xl">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-6 font-semibold text-white">{testimonial.name}</p>
        <p className="text-sm text-zinc-500">{testimonial.role}</p>
      </div>
    </div>
  );
}
