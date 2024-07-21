import User from "../models/user.mjs";

// Function to get user data by userId
export const getUserData = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user data");
  }
};
