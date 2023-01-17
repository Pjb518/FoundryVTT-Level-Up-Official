import micromatch from 'micromatch'

export default {
  "*.{js,mjs,cjs,jsx,ts,tsx,vue}": 'eslint --fix',
  "packs/classFeatures/*.json": files => {
    const matched = micromatch.not(files, '_*Schema.json')
    return [
      `jsonrepair ${matched.join(' ')}`,
      `jsonlint -V packs/classFeatures/_classFeaturesSchema.json ${matched.join(' ')}`
    ]
  }
}
