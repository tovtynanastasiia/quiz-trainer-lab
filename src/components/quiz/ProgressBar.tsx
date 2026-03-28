import React from "react";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}%</span>
        </div>
      )}
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
