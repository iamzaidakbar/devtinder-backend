function handleError(res, err, context = "") {
  console.log(err);
  console.error(context ? `${context}:` : "Error:", err);
  switch (err.name) {
    case "ValidationError":
      return res.status(400).json({ message: err.message });
    case "MongoError":
      if (err.code === 11000) {
        return res.status(409).json({ message: "Duplicate key error" });
      }
      return res.status(500).json({ message: err.message });
    case "CastError":
      return res.status(400).json({ message: "Invalid ID format" });
    default:
      return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = handleError;
