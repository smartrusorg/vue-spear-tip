import { normalizePath, defineConfig } from 'vite'
import pugPlugin from 'vite-plugin-pug' // @ts-ignore
import UnoCSS from 'unocss/vite' // @ts-ignore
import vue from '@vitejs/plugin-vue' // @ts-ignore
import { fileURLToPath } from 'node:url' // @ts-ignore
import { dirname, resolve } from 'node:path' // @ts-ignore
import {flowPlugin, esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow' // @ts-ignore
import {mkdir, promises} from 'fs'
import typescript from '@rollup/plugin-typescript'


const __dirname = dirname(fileURLToPath(import.meta.url))
await promises.copyFile(resolve(__dirname, 'index.d.ts'), resolve(__dirname, 'dist/vue-spear-tip.d.ts'))

await promises.mkdir(resolve(__dirname, 'dist'), {recursive: true})
await promises.mkdir(resolve(__dirname, 'src/replaceable/Elements/Button'), {recursive: true})
await promises.writeFile(
  resolve(__dirname, 'src/replaceable/Elements/Button/ButtonInherited.ts'),
  (await promises.readFile(
    resolve(__dirname, 'src/components/Elements/Button/ButtonInherited.ts'))
  ).toString()
  // .replace(
  //   `'../../../core'`, `'../../../core'\nimport BaseComponent from '../../BaseComponent.vue'`
  // ).replace(
  //   `extends VueClass`, `extends BaseComponent`
  // )
)

// TODO перед прод сборкой подменять наследуемые компоненты с внедрением зависимостей

//@ts-ignore
export default defineConfig(async (options) => {
  
  // examples-build
  // examples-docs-build
  // examples-dev
  // examples-docs-dev
  if (
    options.mode === 'examples-docs-build'
    // || options.mode === 'examples-build'
    || options.mode === 'examples-docs-dev'
  ) {
    await promises.copyFile(
      resolve(__dirname, 'src/components/BaseComponentUnoCss.vue'),
      resolve(__dirname, 'src/replaceable/BaseComponent.vue'),
    )
    await promises.copyFile(
      resolve(__dirname, 'src/components/FieldComponentUnoCss.vue'),
      resolve(__dirname, 'src/replaceable/FieldComponent.vue'),
    )
  }
  else {
    await promises.copyFile(
      resolve(__dirname, 'src/components/BaseComponent.vue'),
      resolve(__dirname, 'src/replaceable/BaseComponent.vue'),
    )
    
    await promises.copyFile(
      resolve(__dirname, `src/components/FieldComponent${
        // По факту во всех полях используется unocss
        options.mode === 'examples-build' ? 'UnoCss' :
          ''
      }.vue`),
      resolve(__dirname, 'src/replaceable/FieldComponent.vue'),
    )
  }
  
  
  const build = options.mode === 'examples-docs-build'
    ? {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          dir:`${__dirname}/docs`,
          assetFileNames: () => 'static/[name]-[hash][extname]',
          chunkFileNames: "static/[name]-[hash].js",
          entryFileNames: "static/[name]-[hash].js",
        },
      },
    }
    : {
      lib: {
        entry: {
          'index.js': resolve(__dirname, 'src/index.ts'),
          // 'grid-style': resolve(__dirname, 'src/kit/styles/grid.min.css'),
        },
        name: 'VueSpearTip',
        fileName: (format: string, entryName: string) => `vue-spear-tip.${format}.js`,
        formats: ['es', 'cjs']
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          dir:`${__dirname}/dist`,
        },
        cssFileName: 'vue-spear-tip'
      },
      manifest: true,
      // resolve: {
      //   alias: {
      //     'vue-spear-tip/grid': resolve(__dirname, 'src/kit/styles/grid.scss')
      //   }
      // }
    }
  
  return {
    esbuild: {
      keepNames : true,
    },
    // sourcemap: false,
    css: {
      devSourcemap: false,
    },
    server: {
      host: 'localhost',
      port: 5174,
      hmr: {
        protocol: 'ws',
        overlay: false,
        timeout: 5000,
      }
    },
    build,
    optimizeDeps: {
      // include: ['@unocss/extractor-pug'],
      esbuildOptions: {
        plugins: [esbuildFlowPlugin()],
        tsconfig: resolve(__dirname, 'tsconfig.json'),
        // tsconfigRaw: {
        //   compilerOptions: {
        //     experimentalDecorators: true
        //   }
        // },
      }
    },
    // publicPath: ".",
    plugins: [
      pugPlugin(),
      flowPlugin(),
      UnoCSS({
        configFile: resolve(__dirname, 'uno.config.ts'),
        // mode: 'vue-scoped',
      }),
      vue({
        template: {
          // preprocessOptions: { // <- ИИ предлагал, что бы pug не делал переносы, не помогло
          //   pug: {
          //     doctype: 'html',
          //     pretty: true,
          //     basedir: process.cwd()
          //   }
          // },
          // transformAssetUrls: {
          //   base: null,
          //   includeAbsolute: false,
          // },
        },
      }),
      ...(options.mode !== 'examples-build' ? [] : [
        typescript({
          declaration: true,
          declarationDir: './dist',
          rootDir: './src',
        })
      ]),
      {
        name: 'post-build-actions',
        async closeBundle() {
          await promises.copyFile(
            resolve(__dirname, 'src/components/FieldComponent.vue'),
            resolve(__dirname, 'dist/replaceable/FieldComponent.vue')
          )
          await promises.copyFile(
            resolve(__dirname, 'src/replaceable/BaseComponent.vue'),
            resolve(__dirname, 'dist/replaceable/BaseComponent.vue')
          )
          await promises.copyFile(resolve(__dirname, 'src/resources/VST_LOGO.png'), resolve(__dirname, 'docs/VST_LOGO.png')) // @ts-ignore
          await promises.copyFile(resolve(__dirname, 'src/resources/favicon.ico'), resolve(__dirname, 'docs/favicon.ico')) // @ts-ignore
          await promises.copyFile(resolve(__dirname, 'src/kit/styles/grid.min.css'), resolve(__dirname, 'dist/grid-style.css'))
          // Example: Copy a file
          // fs.copyFileSync('dist/index.html', 'some/other/path/index.html');
        },
      },
    ]
  }
})
