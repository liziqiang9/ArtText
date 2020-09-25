const path = require('path')
const postcssPresetEnv = require('postcss-preset-env')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const proMode = process.env.NODE_ENV === 'production'
exports.default = {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'lib': path.resolve(__dirname, '../lib'),
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
            {
              loader: 'tslint-loader',
              options: {
                  configFile: path.resolve(__dirname, '../tslint.json'),
              },
            },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    // 指定特定的ts编译配置，为了区分脚本的ts配置
                    configFile: path.resolve(__dirname, '../tsconfig.json'),
                },
            },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          proMode ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssPresetEnv({
                stage: 0
              })
            ]
          } }
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              publicPath: '/static/'
            }
          },
          'svgo-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
}