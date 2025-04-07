import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const FadeInLeft = ({ children, delay = 0, duration = 0.6 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInLeft;
