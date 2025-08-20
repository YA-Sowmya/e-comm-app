"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  createdAt: string;
  name: string;
  items: OrderItem[];
  total: number;
  status: string;
  country: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="p-6 font-body bg-white rounded-xl h-screen text-cherry">
      <h1 className="text-2xl font-heading font-bold mb-6 ">Orders</h1>

      {orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const itemCount = order.items?.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            return (
              <div
                key={order.id}
                className="bg-accent shadow rounded-2xl p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                <div className="flex justify-between items-center mb-3 flex-wrap gap-4">
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-semibold">{order.name || "Guest"}</p>
                  <p className="text-sm text-gray-500">
                    {itemCount} items • {order.country} • #{order.id.slice(-6)}
                  </p>
                  <p className="font-bold">${(order.total / 100).toFixed(2)}</p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 border rounded px-2 py-1 text-sm">
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                {/* Items */}
                {isExpanded && order.items?.length > 0 && (
                  <div className="border-t pt-3">
                    <ul className="list-disc ml-5 space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No orders found</p>
      )}
    </div>
  );
}
