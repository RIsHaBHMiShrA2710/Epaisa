import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const ZoomIn = ({ children, delay = 0, duration = 0.6 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default ZoomIn;
