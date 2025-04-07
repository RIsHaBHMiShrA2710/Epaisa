import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const FadeInUp = ({ children, delay = 0, duration = 0.6 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;
