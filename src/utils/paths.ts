import path from 'path';
import fsSync from 'fs';

export function getContentPath(...segments: string[]) {
  const cwd = process.cwd();
  
  // 1. Try standard content path
  let base = path.join(cwd, 'content');
  
  if (!fsSync.existsSync(base)) {
    // 2. Try subfolder path if Next.js workspace root was resolved to the parent directory
    base = path.join(cwd, 'learning-platform', 'content');
  }
  
  return path.join(base, ...segments);
}
