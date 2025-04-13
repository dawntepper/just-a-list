import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    index: './src/app/page.tsx',
    sidepanel: './src/app/sidepanel/sidepanel.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 5,
      cacheGroups: {
        defaultVendors: false,
        default: false,
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|@radix-ui)[\\/]/,
          priority: 40,
          chunks: 'all',
        },
        lib: {
          test(module) {
            return (
              module.size() > 80000 &&
              /node_modules[/\\]/.test(module.identifier())
            );
          },
          name: 'lib',
          priority: 30,
          minChunks: 1,
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 20,
        },
        shared: {
          name: 'shared',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'autoprefixer',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
        { from: 'manifest.json', to: '.' },
        { 
          from: 'src/app/index.html',
          to: 'index.html',
          transform(content) {
            return content
              .toString()
              .replace('sidepanel.js', 'runtime.js"></script><script src="framework.js"></script><script src="commons.js"></script><script src="index.js');
          }
        },
        { 
          from: 'src/app/sidepanel/sidepanel.html',
          to: 'sidepanel.html',
          transform(content) {
            return content
              .toString()
              .replace('sidepanel.js', 'runtime.js"></script><script src="framework.js"></script><script src="commons.js"></script><script src="sidepanel.js');
          }
        },
      ],
    }),
  ],
}; 