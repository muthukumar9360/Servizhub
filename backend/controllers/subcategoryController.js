const UserList = require("../models/UserList");
const mongoose = require("mongoose");

const getUsersBySubcategory = async (req, res) => {
  try {
    const { subId } = req.params;

    const objectId = new mongoose.Types.ObjectId(subId);

    const users = await UserList.find({ subcategoryId: objectId });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found for this subcategory" });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsersBySubcategory };
