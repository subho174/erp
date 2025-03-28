const { mongoose, Schema } = require("mongoose");

const feedbackSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assignment: {
    type: Schema.Types.ObjectId,
    ref: "File",
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
