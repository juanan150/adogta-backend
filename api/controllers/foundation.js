// const Foundation = require("../models/Foundation");

// const createFoundation = async (req, res, next) => {
//   if (req.body.role === "foundation") {
//     try {
//       const newFoundation = await new Foundation(req.body);
//       await newFoundation.save();
//       res.status(201).json(newFoundation);
//     } catch (err) {
//       if (err.name === "ValidationError") {
//         console.log("Error de validación:", err.errors);
//         res.status(422).json(err.message);
//       } else {
//         next(err);
//         console.log(err);
//       }
//     }
//   }
// };

// module.exports = createFoundation;
