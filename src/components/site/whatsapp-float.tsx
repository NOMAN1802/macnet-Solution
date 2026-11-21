import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, "Hello Macnet Solutions, I'd like to ask about networking equipment.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 items-center gap-2 border border-[#3a3d4a] bg-rack px-4 text-paper shadow-[0_6px_20px_rgb(14_15_20/0.25)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
      aria-label="Chat with Macnet Solutions on WhatsApp"
    >
      <WhatsAppIcon className="h-5 w-5 text-led-green" />
      <span className="port hidden uppercase sm:inline">WhatsApp</span>
    </a>
  );
}
