// See https://stackoverflow.com/questions/45742982/set-base-url-for-preact-cli

// You may need to comment out this block during development
// /*
export default (config, env, helpers) => {
  config.output.publicPath = "/deterioration-calculator/";

  // use the public path in your app as 'process.env.PUBLIC_PATH'
  config.plugins.push(
    new helpers.webpack.DefinePlugin({
      "process.env.PUBLIC_PATH": JSON.stringify(
        config.output.publicPath || "/"
      ),
    })
  );
};
//  */
