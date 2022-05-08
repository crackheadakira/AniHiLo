const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                credits: resolve(__dirname, 'credits.html'),
                gameover: resolve(__dirname, 'gameover.html'),
                gameplay: resolve(__dirname, 'gameplay.html'),
            }
        }
    }
})