import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { getResonance } from '../api/oracle';
import type { ResonanceOracle } from '../api/oracle';
import { OracleCard } from '../components/OracleCard';
import styles from './Oracles.module.css';

export function Oracles() {
  const [oracles, setOracles] = useState<ResonanceOracle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ResonanceOracle | null>(null);

  useEffect(() => {
    getResonance()
      .then(data => setOracles(data.oracles))
      .catch(err => console.error('Failed to load resonance:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Oracle Resonance</h1>
      <p className={styles.subtitle}>Identity files from ψ/memory/resonance/</p>

      {oracles.length === 0 ? (
        <p className={styles.empty}>No resonance files found.</p>
      ) : (
        <div className={styles.grid}>
          {oracles.map(oracle => (
            <OracleCard
              key={oracle.name}
              oracle={oracle}
              onClick={() => setSelected(oracle)}
            />
          ))}
        </div>
      )}

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selected.displayName}</h2>
              <button className={styles.closeBtn} onClick={() => setSelected(null)} type="button">✕</button>
            </div>
            <div className={styles.modalBody}>
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {selected.content}
              </Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
