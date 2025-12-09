/** Packages */
import path from 'path';
import fs from 'fs';
/** Router */
import router from '.';
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
const isProduction = process.env.NODE_ENV === 'production';
createDirectoryNamesMap(basePath).forEach((componentName) => {
  const routesPath = `${basePath}/${componentName}/routes.${
    isProduction ? 'js' : 'ts'
  }`;
  if (fs.existsSync(routesPath)) {
    const componentRouter = require(routesPath).default;
    router.use('/', componentRouter);
  }
});
/** Export API routes */
export default router;