import userModel from "../../DB/models/user.model.js"


export const signup = async (req, res, next) => {
    try {
        const { name, email, password, phone, age } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = new userModel({ name, email, password, phone, age });
    await newUser.save();
        res.status(201).json({ message: "User created successfully", data: newUser });
    } catch (error) {
       res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "Login successful", data: user });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.query.id;
    const { email, password, ...updateData } = req.body;

    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updateData.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.query.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.query.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

