import type { ResonanceOracle } from '../api/oracle';
import styles from './OracleCard.module.css';

interface Props {
  oracle: ResonanceOracle;
  onClick: () => void;
}

export function OracleCard({ oracle, onClick }: Props) {
  // Extract first paragraph as preview (skip headings and frontmatter)
  const lines = oracle.content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
  const preview = lines.slice(0, 3).join(' ').slice(0, 200);

  return (
    <button className={styles.card} onClick={onClick} type="button">
      <div className={styles.aura} />
      <div className={styles.inner}>
        <div className={styles.avatar}>
          {oracle.displayName.charAt(0).toUpperCase()}
        </div>
        <h3 className={styles.name}>{oracle.displayName}</h3>
        <p className={styles.file}>{oracle.file}</p>
        {preview && <p className={styles.preview}>{preview}…</p>}
      </div>
    </button>
  );
}
