import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-eco-background z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <img src="/logo.png" alt="Verdant Logo" className="h-32 w-32 mx-auto mb-4" />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-eco-primary text-xl font-semibold mt-4"
        >
          Loading Verdant...
        </motion.p>
      </div>
    </motion.div>
  );
};