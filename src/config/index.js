// Centralized configuration (e.g., environment variables)
module.exports = {
  PORT: process.env.PORT || 5555,
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://iamxaidakbar_db_user:ejrUcwGyI31q7l9P@devtinder.4flqoj9.mongodb.net/devtinder",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "e585d4dbca7492abec8d51ab43d6c91c7b7c7b78abc5053c31a8e8bf0ac1ac54faa47312bf2c89014c9895a56483e4003f5f571b8a412c2baba07f2aa343c387",
};
