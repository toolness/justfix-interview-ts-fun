import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { Photo } from './util';

/**
 * Converts a path to a photo into a Photo URL.
 * 
 * @param pathname The OS-specific path to the photo file.
 */
export async function toPhotoURL(pathname: string): Promise<Photo|null> {
  if (!pathname) {
    return null;
  }

  // If the pathname was dragged-and-dropped from the desktop to a user's
  // terminal, it might have quotes around it. If this is the case, remove
  // the quotes.
  let quotedPathMatch = pathname.match(/^['"](.+)['"]$/);
  if (quotedPathMatch) {
    pathname = quotedPathMatch[1];
  }

  pathname = path.resolve(pathname);

  const pathExists = await promisify(fs.exists)(pathname);

  if (!pathExists) {
    return null;
  }

  pathname = pathname.replace(/\\/g, '/');

  // Windows drive letters must be prefixed with slashes.
  // https://stackoverflow.com/a/28214523
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }

  return encodeURI(`file://${pathname}`);
}
