"use client";

export default function Footer() {
  const footerLinks = [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center space-x-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-side transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Poynt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
