import multer from "multer";
import { uploadToCloudinary } from "../services/Upload_Pdf.js";
import axios from "axios";
import { File } from "../models/Pdf_model.js";
import { User } from "../models/User_model.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (req, res) => {
  const user = await req.user;

  const name = await User.findById(req.user.userId);
  const author_name = name.username;
  console.log(user);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const fileUrl = await uploadToCloudinary(req.file.buffer);
    // const {topic, subject, keywords, description} = req.body;

    let { topic, subject, keywords, description } = req.body;

    // Convert all values to lowercase
    topic = topic?.toLowerCase();
    subject = subject?.toLowerCase();
    keywords = keywords?.toLowerCase();
    description = description?.toLowerCase();

    const newfile = new File({
      file_path: fileUrl,
      topic,
      subject,
      keywords,
      author: user.userId,
      likes: 0,
      author_name,
      description,
    });

    await newfile.save();

    const updating_user = await User.findByIdAndUpdate(user.userId);
    console.log(updating_user);
    updating_user.uploaded_pdfs.push(fileUrl);
    await updating_user.save();
    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

const downloadFile = async (req, res) => {
  console.log("Get into download block");
  const pdfUrl = req.query.secure_url;

  console.log("This si the url i get", pdfUrl);

  if (!pdfUrl) {
    return res.status(400).send("No PDF URL provided.");
  }

  try {
    const response = await axios({
      method: "GET",
      url: pdfUrl,
      responseType: "stream",
    });
    console.log("Passed the response code");

    const urlParts = new URL(pdfUrl);
    let filename = urlParts.pathname.split("/").pop();

    if (!filename.toLowerCase().endsWith(".pdf")) {
      filename += ".pdf";
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
    const curr_file = await File.find({ file_path: pdfUrl });
    console.log(curr_file);

    response.data.pipe(res);
  } catch (error) {
    console.log("Error downloading the PDF:", error);
    res.status(500).send("Failed to download PDF.");
  }
};

const likeFile = async (req, res) => {
  try {
    const current_file_id = req.params.id;
    if (!current_file_id) {
      return res.status(500).json({ message: "Internal Error" });
    }
    console.log(current_file_id);
    const this_user = await req.user;
    console.log(this_user);

    const this_blog = await File.findByIdAndUpdate(current_file_id);

    if (!this_blog.liked_by.includes(this_user.userId)) {
      this_blog.likes += 1;
      this_blog.liked_by.push(this_user.userId);
      await this_blog.save(this_user.userId);

      // Getting user list...

      const updated_user = await User.findByIdAndUpdate(this_user.userId);
      updated_user.liked_pdfs.push(current_file_id);
      await updated_user.save();

      return res.status(200).json({ message: "Liked sucessfully" });
    } else {
      return res.status(200).json({ message: "Already liked this blog" });
    }
  } catch (error) {
    console.log("This is error", error);
    return res
      .status(500)
      .json({ message: "Internal Server error", error: error });
  }
};

const deleteFile = async (req, res) => {};

const allFile = async (req, res) => {
  const all_files = await File.find().sort({ _id: -1 });
  console.log("These are all pdf's", all_files);
  return res
    .status(200)
    .json({ message: "All files are extracted", all_files: all_files });
};

const Search_by_sub = async (req, res) => {
  try {
    // console.log("Get into try block");
    let subject = await req.params.subject;

    console.log(subject);

    if (!subject) {
      return res.status(400).json({ message: "No subject is  selected" });
    }
    // console.log(username);
    subject = subject.toLowerCase();
    const response = await File.find({ subject: subject });
    // console.log(response)

    return res
      .status(200)
      .json({ message: "Files fetched by Subject", files: response });
  } catch (error) {
    console.log("This is error in catch block", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const uploadMiddleware = upload.single("pdf");
export { uploadFile, downloadFile, likeFile, allFile, Search_by_sub };
