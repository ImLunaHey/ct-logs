import { defineConfig } from 'tsup';

export default defineConfig({
    banner: {
        js: `
            import { dirname } from 'path';
            import { fileURLToPath } from 'url';
            import { createRequire as topLevelCreateRequire } from 'module';
            const require = topLevelCreateRequire(import.meta.url);
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
        `
    },
})