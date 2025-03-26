const { mongoose, Schema } = require("mongoose");

const fileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    due_date: {
      type: Date,
      // required: true,
    },
    file_url: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
