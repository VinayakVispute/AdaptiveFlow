import Link from "next/link";

type MobileMenuProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: Array<{ href: string; label: string }>;
  pathname: string;
};

export default function MobileMenu({
  isOpen,
  setIsOpen,
  navItems,
  pathname,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-blue-400/30 animate-in slide-in-from-top duration-300">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block py-3 px-4 hover:bg-blue-600/50 transition-all duration-300 ${
            pathname === item.href ? "bg-blue-600/30 font-medium" : ""
          }`}
          prefetch={false}
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
