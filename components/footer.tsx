"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Company</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm hover:text-white transition-colors">About</a>
              <a href="#" className="block text-sm hover:text-white transition-colors">Blog</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block text-sm hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Legal</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm hover:text-white transition-colors">Privacy</a>
              <a href="#" className="block text-sm hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-sm">
          <p>© 2024 Poynt</p>
        </div>
      </div>
    </footer>
  );
}