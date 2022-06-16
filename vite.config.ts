/*
 * @Explain: xxx
 * @Author: SuperLy
 * @LastEditors: SuperLy
 * @Date: 2022-05-30 12:24:22
 * @LastEditTime: 2022-06-16 16:19:26
 * @FilePath: \lb-audio-v3\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path');
// https://vitejs.dev/config/

export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/Audio/index.ts'),
			name: 'lb-audio-v3',
			fileName: (format) => `lb-audio-v3.${format}.js`
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	resolve: {
		// 配置路径别名
		alias: {
			'@': path.resolve(__dirname, './src'),
			'#': __dirname,
		},
		// 使用路径别名时想要省略的后缀名，可以自己 增减
		extensions: ['.js', '.json', '.ts', '.vue']
	},
})