const mongoose = require("mongoose");

//define schema
const mySongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title er påkrævet"],
      minlength: [1, "Titel skal være mindst 1 tegn"],
    },
    year: {
      type: Number,
      required: [true, "Year er påkrævet"],
      min: [1900, "Ikke for tidlig"],
      max: [2100, "Ikke for sen"],
    },
    artist: {
      type: String,
      required: [true, "Artist er påkrævet"],
      minlength: [1, "Artist skal være mindst 1 tegn"],
    },
    rating: {
      type: Number,
      min: [1, "Ikke for lavt"],
      max: [10, "Ikke for højt"],
    },
    duration: {
      type: Number,
      min: [1, "Ikke for kort"],
    },
    genre: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Genre er påkrævet",
      },
    },
    poster: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      required: [true, "Audio URL er påkrævet"],
    },
  },
  { timestamps: true }
); //timestamps: true, opretter createdAt og updatedAt

module.exports = mongoose.model("MySong", mySongSchema, "my_songs");