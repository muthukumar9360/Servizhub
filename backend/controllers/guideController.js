const Guide = require("../models/Guide");

const getGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGuides };
