/**
 * Resonance Routes — /api/resonance
 * Scan ψ/memory/resonance/ and return Oracle identity files
 */

import type { Hono } from 'hono';
import { REPO_ROOT } from '../config.ts';
import { join } from 'path';
import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

export function registerResonanceRoutes(app: Hono) {
  app.get('/api/resonance', async (c) => {
    try {
      const resonanceDir = join(REPO_ROOT, 'ψ', 'memory', 'resonance');
      const files = await readdir(resonanceDir).catch(() => [] as string[]);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      const oracles = mdFiles.map(file => {
        const filePath = join(resonanceDir, file);
        let content = '';
        try {
          content = readFileSync(filePath, 'utf-8');
        } catch { /* skip unreadable */ }

        const name = file.replace(/\.md$/, '');
        // Extract display name from first H1 or H2
        const titleMatch = content.match(/^#{1,2}\s+(.+)/m);
        const displayName = titleMatch ? titleMatch[1].trim() : name;

        return { name, displayName, file, content };
      });

      return c.json({ oracles, total: oracles.length });
    } catch (err) {
      return c.json({ error: String(err) }, 500);
    }
  });
}
