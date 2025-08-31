const listenPort = async (app, port) => {
  await new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      resolve();
    });
  });
};

module.exports = { listenPort };
