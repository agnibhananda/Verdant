import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-eco-background z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <Player
          autoplay
          loop
          src="https://lottie.host/32a3fdc0-7a92-457c-9395-527848738b30/0xiABVJ9Yl.json"
          style={{ height: '200px', width: '200px' }}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-eco-primary text-xl font-semibold mt-4"
        >
          Loading your eco-journey...
        </motion.p>
      </div>
    </motion.div>
  );
};