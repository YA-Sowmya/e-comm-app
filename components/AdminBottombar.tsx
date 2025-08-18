const bottomLinks = [
  {
    href: "/admin",
    icon: <img src={"/home.png"} className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Home",
  },
  {
    href: "/admin/products",
    icon: <img src={"/products.png"} className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Products",
  },
  {
    href: "/admin/categories",
    icon: <img src={"/categories.png"} className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Categories",
  },
  {
    href: "/admin/orders",
    icon: <img src={"/orders.png"} className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Orders",
  },
  {
    href: "/admin/analytics",
    icon: <img src={"/analytics.png"} className="w-6 h-6 sm:w-8 sm:h-8" />,
    label: "Analytics",
  },
];
export default function Bottombar() {
  return (
    <div className="fixed bottom-0 w-full left-0 bg-accent text-cherry font-body font-light flex justify-between p-2 sm:px-8 lg:hidden">
      {bottomLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="flex flex-col items-center">
          {link.icon}
          <span className="text-xs sm:text-sm">{link.label}</span>
        </a>
      ))}
    </div>
  );
}
