// export default function () {
//   // Add .ts extension for store, middleware and more
//   this.nuxt.options.extensions.push('ts')
//   // Extend build
//   this.extendBuild((config) => {
//     const tsLoader = {
//       loader: 'ts-loader',
//       options: {
//         appendTsSuffixTo: [/\.vue$/]
//       },
//       exclude: [
//         /dist/,
//         /\.temp/
//       ]
//     }
//     // Add TypeScript loader
//     config.module.rules.push(
//       Object.assign({
//         test: /\.tsx?$/,
//         // use: [tsLoader]
//       }, tsLoader)
//     )

//     console.info(config.module.rules)
//     console.info('X', config.module.rules[11])
//     // Add .ts extension in webpack resolve
//     if (config.resolve.extensions.indexOf('.ts') === -1) {
//       config.resolve.extensions.push('.ts')
//     }
//   })
// }


export default function () {
  this.nuxt.options.extensions.push('ts')
  this.extendBuild(config => {
    config.module.rules.push({
      loader: 'ts-loader',
      test: new RegExp(/\.ts$/),
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    })
    if (config.resolve.extensions.indexOf('.ts') === -1) {
      config.resolve.extensions.push('.ts')
    }
  })
}
