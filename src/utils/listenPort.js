const listenPort = (app, port) => {
  app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = {listenPort};