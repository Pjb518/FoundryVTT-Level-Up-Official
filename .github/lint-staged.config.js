import micromatch from 'micromatch'

export default {
  "*.{js,mjs,cjs,jsx,ts,tsx,vue}": 'eslint --fix',
  "packs/ids.json": "jsonsort",
  "packs/classFeatures/*.json": files => {
    const matched = micromatch.not(files, '_*Schema.json')
    return [
      `jsonrepair "${matched.join('" "')}" --overwrite`,
      `jsonlint -V packs/classFeatures/_classFeaturesSchema.json ${matched.join(' ')}`
    ]
  }
}
