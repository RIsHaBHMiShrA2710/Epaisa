import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.customloadercontainer}>
      <div className= {styles.customspinner}></div>
    </div>
  );
};

export default Loader;
    