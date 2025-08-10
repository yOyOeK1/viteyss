import fs from 'fs';
import path from 'path';

export function myMiddlewarePlugin() {
  return {
    name: 'my-middleware-plugin',

    configureServer(server) {
      // The middleware will be active for all requests
      server.middlewares.use(async (req, res, next) => {
        // Check if the request is for a specific file we want to handle
        if (req.url.endsWith('.js') && req.url.includes('/my-special-files/')) {
          // Construct the absolute file path
          const filePath = path.join(server.config.root, req.url);

          try {
            // Read the raw content of the file
            const rawCode = await fs.promises.readFile(filePath, 'utf-8');

            // Use Vite's `transformRequest` to process the code
            // This is the key step that corrects the imports
            const transformedResult = await server.transformRequest(req.url, {
              ssr: false, // Set ssr to false for client-side code
            });

            // If the transformation was successful, serve the corrected code
            if (transformedResult) {
              res.setHeader('Content-Type', 'application/javascript');
              res.end(transformedResult.code);
              return; // End the middleware chain here
            }
          } catch (e) {
            console.error(`Failed to transform ${req.url}:`, e);
            // Fall through to the next middleware if an error occurs
          }
        }

        // If the request is not for our specific file, or if an error occurred,
        // pass the request to the next middleware in the chain
        next();
      });
    },
  };
}