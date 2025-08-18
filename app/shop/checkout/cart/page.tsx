"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.addToCart);
  const dec = useCartStore((s) => s.decrementFromCart);
  const remove = useCartStore((s) => s.removeFromCart);
  const clear = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) =>
    s.items.reduce(
      (sum, i) => sum + Math.round(Number(i.price) * 100) * i.quantity,
      0
    )
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <CheckoutStepper current={0} />

      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => {
                  const price = Math.round(Number(i.price) * 100);
                  const subtotal = price * i.quantity;
                  return (
                    <tr key={i.id} className="border-t">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={i.picture}
                          alt={i.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>{i.name}</span>
                      </td>
                      <td className="p-3">${(price / 100).toFixed(2)}</td>
                      <td className="p-3">
                        <div className="inline-flex items-center gap-2">
                          <button
                            className="px-2 py-1 border rounded"
                            onClick={() => dec(i.id)}>
                            -
                          </button>
                          <span>{i.quantity}</span>
                          <button
                            className="px-2 py-1 border rounded"
                            onClick={() =>
                              add({
                                id: i.id,
                                name: i.name,
                                price: i.price,
                                picture: i.picture,
                              })
                            }>
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3">${(subtotal / 100).toFixed(2)}</td>
                      <td className="p-3">
                        <button
                          className="text-red-600"
                          onClick={() => remove(i.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button className="text-sm text-gray-600 underline" onClick={clear}>
              Clear cart
            </button>
            <div className="text-right">
              <div className="text-lg">
                Total: <strong>${(total / 100).toFixed(2)}</strong>
              </div>
              <button
                className="mt-2 bg-cherry text-white px-4 py-2 rounded-full"
                onClick={() => router.push("/shop/checkout/details")}>
                Next: Details
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
