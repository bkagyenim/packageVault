import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react' 
import { TanStackRouterVite } from '@tanstack/router-plugin/vite' 
 
// https://vitejs.dev/config/ 
export default defineConfig({ 
  plugins: [TanStackRouterVite({}), react()], 
  build: { 
    sourcemap: false, // Disable source maps 
    rollupOptions: { 
      output: { 
        manualChunks(id) { 
          if (id.includes('node_modules')) { 
            return 'vendor'; // Create a vendor chunk for dependencies 
          } 
          if (id.includes('src/components/')) { 
            return 'components'; // Create a chunk for components 
          } 
        }, 
      }, 
    }, 
  }, 
}) 
 
 
 
 
 
