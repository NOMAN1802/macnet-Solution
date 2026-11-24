import Image from "next/image";
import Link from "next/link";
import type { ProductCard as ProductCardData } from "@/lib/data";
import { StockLed } from "@/components/ui/stock-led";
import { ArrowRight, CategoryIcon } from "@/components/ui/icons";

/** Product card in the reference case-study style: photo, red title bar with icon, body, "View details". */
export function ProductCard({ product }: { product: ProductCardData }) {
  const img = product.images[0];
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card-shadow flex h-full flex-col bg-white transition-transform duration-500 hover:-translate-y-2 motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"
          />
        ) : null}
        <span className="absolute right-3 top-3 bg-white/95 px-2.5 py-1">
          <StockLed stock={product.stock} className="text-heading" />
        </span>
      </div>
      <div className="flex items-center gap-3.5 bg-red px-5 py-4 text-white">
        <CategoryIcon slug={product.category.slug} className="h-9 w-9 shrink-0" />
        <span className="min-w-0">
          <span className="line-clamp-2 block font-display text-[1.0625rem] font-semibold leading-snug text-white">{product.name}</span>
          <span className="block text-sm text-white/85">
            {product.brand.name}, {product.category.name}
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <p className="line-clamp-2 text-[0.9375rem]">{product.pitch}</p>
        <p className="mt-3 text-xs">SKU {product.sku}</p>
        <span className="link-more mt-auto pt-5">
          View details <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
