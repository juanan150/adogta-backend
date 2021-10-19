const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      match: /.+\@.+\..+/,
      required: [true, "Email is required"],
      validate: {
        validator: async function (value) {
          const user = await User.findOne({ email: value });
          const foundation = await mongoose
            .model("Foundation")
            .findOne({ email: value });
          if (user) {
            return user === null;
          } else if (user === foundation) {
            return user === null;
          }
          return user;
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
    epaycoCustomerId: {
      type: String,
    },
    token_card: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.statics.authenticate = async (email, password) => {
  let user = await User.findOne({ email });

  !user && (user = await mongoose.model("Foundation").findOne({ email }));

  if (user && user.active === true) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return user;
    }
    throw new Error("Invalid password");
  } else if (user && user.active === false) {
    throw new Error("Please verify your email");
  } else {
    throw new Error("User does not exist");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
