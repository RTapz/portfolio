import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { isServiceIconId } from "@/lib/serviceIcons";
import type { ServiceItem } from "@/lib/types";

interface ServicesProps {
  intro: string;
  services: ServiceItem[];
}

function resolveIcon(service: ServiceItem): ServiceItem["icon"] {
  if (service.icon && isServiceIconId(service.icon)) {
    return service.icon;
  }
  return "fullstack";
}

export function Services({ intro, services }: ServicesProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <h2 className="text-3xl font-bold text-white md:text-4xl">Service</h2>
      <p className="mt-3 max-w-2xl text-zinc-400">{intro}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const icon = resolveIcon(service);
          return (
            <div
              key={service.title}
              className="rounded-2xl border border-white/5 bg-gradient-to-b from-zinc-900/80 to-black p-6 transition hover:border-brand/30"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand"
                aria-hidden
              >
                <ServiceIcon icon={icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
