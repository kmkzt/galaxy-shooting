const isDev = process.env.NODE_ENV === 'development'
module.exports = api => {
  api.cache(false)

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react'
    ],
    plugins: [
      isDev && require.resolve('react-refresh/babel'),
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-object-rest-spread'
    ].filter(Boolean)
  }
}
