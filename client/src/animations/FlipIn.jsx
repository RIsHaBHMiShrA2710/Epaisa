
import { motion } from 'framer-motion';

export const FlipIn = ({ children, delay = 0, duration = 0.6 }) => (
  <motion.div
    initial={{ rotateY: 90, opacity: 0 }}
    whileInView={{ rotateY: 0, opacity: 1 }}
    transition={{ delay, duration }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);
