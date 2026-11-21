import Image from "next/image";
import Link from "next/link";
import type { ProductCard as ProductCardData } from "@/lib/data";
import { StockLed } from "@/components/ui/stock-led";

export function ProductCard({ product }: { product: ProductCardData }) {
  const img = product.images[0];
  const keySpecs = product.specs.slice(0, 2);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col border border-rail-line bg-white transition-colors hover:border-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-rail-line bg-paper">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : null}
        <span className="port absolute left-3 top-3 bg-paper/90 px-1.5 py-0.5 uppercase text-text-muted">
          {product.category.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="port uppercase text-signal-ink">{product.brand.name}</span>
          <StockLed stock={product.stock} className="text-text-muted" />
        </div>
        <h3 className="heading mt-2 text-lg text-ink">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">{product.pitch}</p>
        {keySpecs.length ? (
          <dl className="mt-4 grid grid-cols-1 gap-1 border-t border-rail-line pt-3">
            {keySpecs.map((s) => (
              <div key={s.label} className="flex justify-between gap-3 text-xs">
                <dt className="text-text-muted">{s.label}</dt>
                <dd className="port text-right text-text">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <span className="port mt-auto pt-4 uppercase text-text-muted">SKU {product.sku}</span>
      </div>
    </Link>
  );
}
