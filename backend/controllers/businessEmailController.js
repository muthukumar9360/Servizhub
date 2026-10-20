const BusinessEmailOtp = require("../models/BusinessEmailOtp");
const BusinessList = require("../models/BusinessList");
const BusinessCategory = require("../models/Business");
const { sendMail } = require("../utils/mailer");
const { generateBusinessPdf } = require("../utils/pdfGenerator");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 📩 Send OTP
exports.sendOtpToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await BusinessEmailOtp.findOneAndUpdate(
      { email },
      { otp, expiresAt, verified: false },
      { upsert: true }
    );

    await sendMail({
      to: email,
      subject: "Your Servizio OTP",
      html: `<h3>Your OTP is <b>${otp}</b></h3><p>Valid for 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP & Send PDF
exports.verifyOtpAndSendPdf = async (req, res) => {
  try {
    const { email, otp, subCategoryId, name } = req.body;

    if (!email || !otp || !subCategoryId)
      return res.status(400).json({ message: "Missing fields" });

    const record = await BusinessEmailOtp.findOne({ email });

    if (!record)
      return res.status(400).json({ message: "OTP not found" });

    if (record.verified)
      return res.status(400).json({ message: "OTP already used" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    record.verified = true;
    await record.save();

    // 🔍 Get businesses
    const listings = await BusinessList.find({ subCategoryId });

    if (!Array.isArray(listings)) {
      return res.status(404).json({ message: "No listings found" });
    }

    // get subcategory title
    const cat = await BusinessCategory.findOne({
      "subCategories._id": subCategoryId,
    });

    const subTitle =
      cat?.subCategories.find(
        (s) => s._id.toString() === subCategoryId
      )?.title || "Business List";

    const pdfBuffer = await generateBusinessPdf(subTitle, listings);

    await sendMail({
      to: email,
      subject: `Servizio - ${subTitle} List`,
      html: `<p>Hello ${name || ""},</p>
             <p>Please find attached the business list you requested.</p>`,
      attachments: [
        {
          filename: `${subTitle.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.json({ message: "Business list sent to email" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};
