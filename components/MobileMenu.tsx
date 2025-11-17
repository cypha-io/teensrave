import { AnimatePresence, motion } from "framer-motion";
import { X, Home, Info, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavLink {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  //   refLink: string;
  ref: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

const MobileMenu = ({ isOpen, onClose, navLinks }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
          >
            {/* Header */}

            <button
              onClick={onClose}
              className="p-2 rounded-full absolute top-3 right-3 hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {/* Navigation Links */}
            <div className="px-6 pt-16">
              <nav className="space-y-2">
                {navLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 50, filter: "blur(8px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      // exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                      transition={{
                        duration: 1,
                        delay: index * 0.1,
                        filter: { duration: 0.8, delay: 0.4 },
                        ease: "easeInOut",
                      }}

                      // transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#edabf953]  transition-all duration-200 group"
                      >
                        <IconComponent
                          size={20}
                          className="text-gray-500 group-hover:text-[#78118a]"
                        />
                        <span className="font-medium text-gray-800 group-hover:text-[#78118a]">
                          {link.ref}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-r from-[#360040] to-[#78118a] text-white">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span className="text-sm">+233 XX XXX XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span className="text-sm">info@theperryeffect.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span className="text-sm">Accra, Ghana</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
