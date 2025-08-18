"use client";

import { Product } from "@prisma/client";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/Button";

interface ProductCardProps {
  product: Pick<Product, "id" | "name" | "picture" | "price">;
}

export default function ProductCard({ product }: ProductCardProps) {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const decrementFromCart = useCartStore((s) => s.decrementFromCart);

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="rounded-lg p-4 bg-white  overflow-hidden shadow-xs shadow-cherry hover:shadow-lg transition">
      <div className="aspect-square ">
        <img
          src={product.picture}
          alt={product.name}
          className="w-full rounded-lg h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col  items-center gap-2">
        <h3 className="font-heading text-cherry min-h-[8vh] text-lg text-center">
          {product.name}
        </h3>
        <p className="text-cherry font-bold">
          ${Number(product.price).toFixed(2)}
        </p>

        <div className="mt-2 flex justify-center font-heading items-center gap-2">
          {quantity === 0 ? (
            <Button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  picture: product.picture,
                })
              }
              className="">
              Add
            </Button>
          ) : (
            <div className="flex items-center p-2 justify-center gap-2">
              <button
                onClick={() => decrementFromCart(product.id)}
                className="">
                <i
                  className="bi bi-dash-lg bg-cherry rounded-full px-3 py-2 text-white border border-cherry 
                hover:text-cherry hover:bg-white"></i>
              </button>

              <div className="w-8 h-8 flex items-center text-cherry justify-center text-base md:text-xl leading-[1]">
                {quantity}
              </div>

              <button
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    picture: product.picture,
                  })
                }
                className="">
                <i
                  className="bi bi-plus-lg bg-cherry rounded-full px-3 py-2 text-white border border-cherry 
                hover:text-cherry hover:bg-white"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
