"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
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
    <div className="max-w-5xl mx-auto px-4 py-6 text-cherry ">
      <CheckoutStepper current={0} />

      <h1 className="text-xl sm:text-2xl font-bold font-heading text-center m-4">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <p className="font-body text-center mt-12 ">Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white font-body rounded-lg shadow rounded-lg">
            <table className="w-full  text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => {
                  const price = Math.round(Number(i.price) * 100);
                  const subtotal = price * i.quantity;
                  return (
                    <tr key={i.id} className="border-t-2 border-accent">
                      <td className="p-3 flex items-center gap-4">
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
                            className="px-2 py-1 border rounded-full hover:bg-cherry hover:text-white"
                            onClick={() => dec(i.id)}>
                            <i className="bi bi-dash"></i>
                          </button>
                          <span>{i.quantity}</span>
                          <button
                            className="px-2 py-1 border rounded-full hover:bg-cherry hover:text-white"
                            onClick={() =>
                              add({
                                id: i.id,
                                name: i.name,
                                price: i.price,
                                picture: i.picture,
                              })
                            }>
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          className="text-red-700 hover:text-gray-700"
                          onClick={() => remove(i.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center font-body justify-between">
            <button
              className="text-sm text-gray-600 underline hover:text-cherry"
              onClick={clear}>
              Clear cart
            </button>
            <div className="text-right ">
              <div className="text-lg pr-3">
                Total: <strong>${(total / 100).toFixed(2)}</strong>
              </div>
              <Button
                className="mt-2 "
                onClick={() => router.push("/shop/checkout/details")}>
                Next: Details
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
