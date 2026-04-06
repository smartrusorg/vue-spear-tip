import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  presetTagify,
  transformerDirectives,
  // transformerVariantGroup
} from 'unocss'
import { presetScalpel } from 'unocss-preset-scalpel'
import transformerCompileClass from '@unocss/transformer-compile-class'
// const extractorPug = require('@unocss/extractor-pug')


export default defineConfig({
  shortcuts: [
    // ...
  ],
  content: {
    // This was the problematic, overly broad pattern:
    // filesystem: ["**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}"],
    
    // This is a more precise, safer target (adjust for your src structure):
    filesystem: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"]
  },
  theme: {
    colors: {
      // ...
    }
  },
  presets: [
    presetAttributify(),
    presetWind3(),
    presetIcons(),
    presetTagify(),
    presetScalpel(),
    presetTypography(),
    // presetWebFonts({
    //   fonts: {
    //     // ...
    //   },
    // }),
  ], // Presets
  transformers: [
    transformerCompileClass(),
    transformerDirectives(),
  ],

  // TODO написать свой pug extractor без esm
  // extractors: [
  //   extractorPug()
  // ]
})


