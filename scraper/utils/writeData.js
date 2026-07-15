import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateSnapshot } from '../schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../../data');
const HISTORY_DIR = resolve(DATA_DIR, 'history');

/**
 * Writes the merged rate snapshot to:
 *  - data/latest.json  (overwritten)
 *  - data/history/YYYY-MM-DD.json  (appended as array element)
 *
 * @param {object} snapshot - { updated: string, sources: object }
 */
export function writeData(snapshot) {
  const validation = validateSnapshot(snapshot);
  if (!validation.valid) {
    console.error('[writeData] Invalid snapshot:', validation.errors);
    throw new Error('Invalid snapshot: ' + validation.errors.join('; '));
  }

  // Write latest.json
  const latestPath = resolve(DATA_DIR, 'latest.json');
  writeFileSync(latestPath, JSON.stringify(snapshot, null, 2), 'utf-8');
  console.log(`[writeData] Written ${latestPath}`);

  // Append to daily history file
  const dateStr = new Date(snapshot.updated).toISOString().slice(0, 10); // YYYY-MM-DD
  const historyPath = resolve(HISTORY_DIR, `${dateStr}.json`);

  let history = [];
  if (existsSync(historyPath)) {
    try {
      history = JSON.parse(readFileSync(historyPath, 'utf-8'));
      if (!Array.isArray(history)) history = [];
    } catch {
      history = [];
    }
  }

  history.push(snapshot);
  writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
  console.log(`[writeData] Appended to ${historyPath} (${history.length} entries)`);
}
