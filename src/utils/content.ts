import fs from 'fs/promises';
import { getContentPath } from './paths';

/**
 * Reads a content file either from the local filesystem or from a remote GitHub repository.
 * 
 * To load content from GitHub, configure the following environment variables in `.env.local`:
 * - CONTENT_SOURCE=github
 * - GITHUB_CONTENT_REPO=epontoni/learning-platform  (owner/repository)
 * - GITHUB_CONTENT_BRANCH=main
 * - GITHUB_TOKEN=your_personal_access_token        (optional, to prevent rate limits)
 */
export async function readContentFile(relativePath: string): Promise<string> {
  const source = process.env.CONTENT_SOURCE || 'local';

  if (source === 'github') {
    const repo = process.env.GITHUB_CONTENT_REPO || 'epontoni/learning-platform';
    const branch = process.env.GITHUB_CONTENT_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    // Normalise path separators to forward slashes for URLs
    const normalisedPath = relativePath.replace(/\\/g, '/');
    const url = `https://raw.githubusercontent.com/${repo}/${branch}/content/${normalisedPath}`;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      const res = await fetch(url, {
        headers,
        // In Next.js, cache the responses or configure revalidation
        next: { revalidate: 3600 } 
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch from GitHub: ${res.statusText} (status: ${res.status})`);
      }

      return await res.text();
    } catch (err: any) {
      console.error(`Error loading remote content file from ${url}:`, err);
      throw err;
    }
  } else {
    // Local filesystem loading
    const segments = relativePath.split(/[/\\]/);
    const fullPath = getContentPath(...segments);
    return await fs.readFile(fullPath, 'utf-8');
  }
}
