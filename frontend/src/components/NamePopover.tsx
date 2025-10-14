import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface NamePopoverProps {
  children: React.ReactNode;
  name: {
    id: string;
    label: string;
    hebrew: string;
    transliteration: string;
    meaning: string;
    context: string;
    references: string[];
    category: string;
  };
}

export default function NamePopover({ children, name }: NamePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover className="relative inline-block">
      {({ open }) => (
        <>
          <Popover.Button
            as="div"
            className="inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {children}
          </Popover.Button>

          <Transition
            as={Fragment}
            show={open || isOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-1"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-1"
          >
            <Popover.Panel
              className="absolute z-50 mt-2 w-80 max-w-sm"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                className="glass rounded-xl p-6 shadow-xl border border-theme-border"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-theme-text mb-1">
                      {name.label}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="hebrew-text text-xl">{name.hebrew}</span>
                      <span className="text-sm text-theme-accent font-medium">
                        {name.transliteration}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-theme-text hover:text-theme-accent transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Meaning */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-theme-text mb-2">
                    Meaning
                  </h4>
                  <p className="text-sm text-theme-text leading-relaxed">
                    {name.meaning}
                  </p>
                </div>

                {/* Context */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-theme-text mb-2">
                    Context
                  </h4>
                  <p className="text-sm text-theme-text leading-relaxed">
                    {name.context}
                  </p>
                </div>

                {/* References */}
                {name.references && name.references.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-theme-text mb-2">
                      References
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {name.references.map((ref, index) => (
                        <span
                          key={index}
                          className="text-xs bg-theme-accent/10 text-theme-accent px-2 py-1 rounded"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-theme-text/60">
                    Category: {name.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-theme-accent rounded-full animate-glow-pulse"></div>
                    <span className="text-xs text-theme-accent font-medium">
                      Sacred Name
                    </span>
                  </div>
                </div>
              </motion.div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}