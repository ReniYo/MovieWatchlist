import {defineConfig} from 'vite'


export default defineConfig({
	build: {
    		rollupOptions: {
      			input: {
        		main: resolve(MovieWatchlist, 'index.html'),
        		main: resolve(MovieWatchlist, 'watchlist.html'),
      },
    },
  },	
})
