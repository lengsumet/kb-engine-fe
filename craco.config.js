const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Production optimizations
      if (env === 'production') {
        // Enable tree shaking
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          usedExports: true,
          sideEffects: false,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5,
                reuseExistingChunk: true
              },
              // Separate chunk for AI components
              ai: {
                test: /[\\/]src[\\/]components[\\/](AI|Related)/,
                name: 'ai-components',
                chunks: 'all',
                priority: 8
              },
              // Separate chunk for comparison components
              comparison: {
                test: /[\\/]src[\\/]components[\\/](File|Timeline)/,
                name: 'comparison-components',
                chunks: 'all',
                priority: 7
              }
            }
          }
        };

        // Add compression
        const CompressionPlugin = require('compression-webpack-plugin');
        webpackConfig.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8
          })
        );
      }

      // Development optimizations
      if (env === 'development') {
        // Faster builds in development
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false
        };

        // Enable hot module replacement
        webpackConfig.devServer = {
          ...webpackConfig.devServer,
          hot: true
        };
      }

      // Add bundle analyzer (optional)
      if (process.env.ANALYZE) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
      }

      return webpackConfig;
    }
  },
  devServer: {
    // Faster development server
    compress: true,
    hot: true,
    // Enable caching
    setupMiddlewares: (middlewares, devServer) => {
      // Add cache headers for static assets
      devServer.app.use('/static', (req, res, next) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        next();
      });
      return middlewares;
    }
  }
};