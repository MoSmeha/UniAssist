import mongoose from "mongoose";
import dotenv from "dotenv";
import KnowledgeBase from "../models/KnowledgeBase.model.js";

dotenv.config();

const knowledgeData = [
  // Ground Floor
  {
    content: "On the ground floor, upon entering the main entrance, the Secretary's office is located to the left. The Church is to the right. The Principal's office is situated behind the staircase, and the Admission office is next to it. The Theatre and Cafeteria are also on the ground floor, adjacent to each other.",
    category: "floor",
    metadata: { floor: "ground" },
  },
  // First Floor
  {
    content: "On the first floor: Robotics Lab (room 100), Amphitheatre (room 104), Office of Student Affairs (room 110), Office of Management (room 106).",
    category: "floor",
    metadata: { floor: "first" },
  },
  // Second Floor
  {
    content: "On the second floor: IT department (room 203), Library (room 204), Mirna Achkouty's office (room 207), Learning Lab (room 210), Cuisine (room 200), Cisco Lab (room 201).",
    category: "floor",
    metadata: { floor: "second" },
  },
  // Third Floor
  {
    content: "On the third floor: Electronics Lab (room 304), School of Music (room 303), Multimedia Lab (room 301), Telecom Lab (room 300).",
    category: "floor",
    metadata: { floor: "third" },
  },
  // Building B
  {
    content: "Building B houses the Business, Physiotherapy, and Dental Lab departments. Detailed layouts are coming soon.",
    category: "general",
    metadata: { building: "B" },
  },
  // Staff
  {
    content: "Anthony Tannoury, PhD is the Dean's Delegate. Contact: +961 8 902020, anthony.tannoury@ua.edu.lb",
    category: "staff",
    metadata: { name: "Anthony Tannoury" },
  },
  {
    content: "Michel Tannoury is a Senior Lecturer. Contact: +961 8 902020 - 30 - 40 ext. 4111, michel.tannoury@ua.edu.lb",
    category: "staff",
    metadata: { name: "Michel Tannoury" },
  },
  {
    content: "Mirna Achkouty is the Administrative Assistant. Her office is on the second floor, room 207. Contact: +961 8 902020, mirna.achkouty@ua.edu.lb",
    category: "staff",
    metadata: { name: "Mirna Achkouty" },
  },
  {
    content: "Faculty of Engineering and Technology contact: +961 8 902020, assistant.foe@ua.edu.lb",
    category: "staff",
    metadata: { name: "Faculty of Engineering" },
  },
  {
    content: "Chady Abou Jaoude, PhD is the Associate Professor and Dean of the Faculty of Engineering. Contact: +961 5 927000 ext. 2100, chady.aboujaoude@ua.edu.lb",
    category: "staff",
    metadata: { name: "Chady Abou Jaoude" },
  },
  {
    content: "Kabalan Chaccour, PhD is the Head of the Department of Computer and Communications Engineering. Contact: +961 5 927000 ext. 2122, kabalan.chaccour@ua.edu.lb",
    category: "staff",
    metadata: { name: "Kabalan Chaccour" },
  },
  {
    content: "Charbel El Gemayel, PhD is the Head of the Department of Technology in Computer Science. Email: charbel.gemayel@ua.edu.lb",
    category: "staff",
    metadata: { name: "Charbel El Gemayel" },
  },
];

const seedKnowledge = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");

    // Clear existing knowledge
    await KnowledgeBase.deleteMany({});
    console.log("Cleared existing knowledge base");

    // Insert new knowledge
    const result = await KnowledgeBase.insertMany(knowledgeData);
    console.log(`Seeded ${result.length} knowledge documents`);

    await mongoose.disconnect();
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedKnowledge();
