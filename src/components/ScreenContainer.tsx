import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface ScreenContainerProps {
  children: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children }) => {
  const { currentScreen, transitionType } = useApp();

  const getVariants = () => {
    switch (transitionType) {
      case 'push':
        return {
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -40 },
          transition: { duration: 0.25, ease: 'easeOut' }
        };
      case 'push_back':
        return {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 40 },
          transition: { duration: 0.25, ease: 'easeOut' }
        };
      case 'slide_up':
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.28, ease: 'easeOut' }
        };
      case 'none':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.15, ease: 'easeInOut' }
        };
    }
  };

  const variants = getVariants();

  return (
    <div className="w-full flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={variants.transition}
          className="w-full flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
