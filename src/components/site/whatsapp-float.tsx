import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, "Hello Macnet Solutions, I'd like to ask about networking equipment.")}
      target="_blank"
      rel="noopener noreferrer"
      className="pulse-ring fixed bottom-5 right-5 z-40 isolate grid h-14 w-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-[0_8px_24px_rgb(0_0_0/0.25)] transition-transform duration-300 hover:scale-110 motion-reduce:transition-none"
      aria-label="Chat with Macnet Solutions on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
