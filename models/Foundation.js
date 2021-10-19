const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const foundationSchema = mongoose.Schema(
  {
    email: {
      type: String,
      match: /.+\@.+\..+/,
      required: [true, "Email is required"],
      validate: {
        validator: async function (value) {
          const foundation = await Foundation.findOne({ email: value });
          const user = await mongoose.model("User").findOne({ email: value });
          if (foundation) {
            return foundation === null;
          } else if (foundation === user) {
            return foundation === null;
          }
          return foundation;
        },
        message: "Email is already taken",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      required: [true, " Role is required"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

foundationSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

foundationSchema.statics.authenticate = async (email, password) => {
  const foundation = await Foundation.findOne({ email });
  if (foundation) {
    const result = await bcrypt.compare(password, foundation.password);
    return result === true ? foundation : null;
  }

  return null;
};

const Foundation = mongoose.model("Foundation", foundationSchema);

module.exports = Foundation;
