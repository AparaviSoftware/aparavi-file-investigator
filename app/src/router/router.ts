/** Packages */
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
/** Router */
import router from '.';
/** Handle healthcheck */
router.get('/', (_: Request, res: Response) => {
  res.status(200).send(`
        <html>
            <head>
                <title>Healthcheck</title>
            </head>
            <body>
                <p>OK</p>
            </body>
        </html>
    `);
});
/**
 * Create a map of directory names from path
 *
 * @param {string} path - path to directories
 *
 * @return {Map} Map of directory names
 *
 * @example
 *
 *     createDirectoryNamesMap(path);
 */
function createDirectoryNamesMap(path: string) {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((dir) => dir.name);
}
/**
 * Import all the component directories and setup the routes
 */
const basePath = path.join(__dirname, '../components');
const isTestEnv = process.env.NODE_ENV === 'test';
createDirectoryNamesMap(basePath).forEach((componentName) => {
  const routesPath = `${basePath}/${componentName}/routes.${
    isTestEnv ? 'ts' : 'js'
  }`;
  if (fs.existsSync(routesPath)) {
    import(routesPath);
  }
});
/** Export API routes */
export default router;