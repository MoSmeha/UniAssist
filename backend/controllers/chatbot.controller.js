// Store building information
const buildingInfo = {
  description: `Building A Overview: On the ground floor, upon entering the main entrance, the Secretary's office is located to the left, while the Church is to the right. The Principal's office is situated behind the staircase, and the Admission office is next to the Principal's office. The Theatre is also on the ground floor, located next to the cafeteria. Moving up to the first floor, you will find the Robotics Lab in room 100, the Amphitheatre in room 104, the Office of Student Affairs in room 110, and the Office of Management in room 106. On the second floor, Room 203 houses the IT department, Room 204 is the Library, Room 207 is Mirna Akchouty's office, Room 210 is the Learning Lab, Room 200 is designated for Cuisine, and Room 201 is the Cisco Lab. Finally, the third floor features Room 304 for the Electronics Lab, Room 303 for the School of Music, Room 301 for the Multimedia Lab, and Room 300 for the Telecom Lab.`,

  floors: {
    ground: [
      { name: "Secretary's office", location: "left of main entrance" },
      { name: "Church", location: "right of main entrance" },
      { name: "Principal's office", location: "behind the staircase" },
      { name: "Admission office", location: "next to Principal's office" },
      { name: "Theatre", location: "next to the cafeteria" },
      { name: "Cafeteria", location: "next to the Theatre" },
    ],
    first: [
      { name: "Robotics Lab", room: "100" },
      { name: "Amphitheatre", room: "104" },
      { name: "Office of Student Affairs", room: "110" },
      { name: "Office of Management", room: "106" },
    ],
    second: [
      { name: "IT department", room: "203" },
      { name: "Library", room: "204" },
      { name: "Mirna Akchouty's office", room: "207" },
      { name: "Learning Lab", room: "210" },
      { name: "Cuisine", room: "200" },
      { name: "Cisco Lab", room: "201" },
    ],
    third: [
      { name: "Electronics Lab", room: "304" },
      { name: "School of Music", room: "303" },
      { name: "Multimedia Lab", room: "301" },
      { name: "Telecom Lab", room: "300" },
    ],
  },
};

export const getBuildingInfo = async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
    You are a helpful assistant for Building A at a university. Answer questions about locations and facilities strictly based on the information provided below.
    
    Building Information:
    ${buildingInfo.description}
    
    Question: ${question}
    
    Guidelines:
    1. Be concise and specific
    2. Include floor and room number when available
    3. If location is described (e.g. "next to"), include that context
    4. If you don't know the answer, say "I don't have information about that location"
    5. For location questions, mention the floor first
    `;

    const headers = {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    };

    // Add optional headers if environment variables are set
    if (process.env.SITE_URL) {
      headers["HTTP-Referer"] = process.env.SITE_URL;
    }

    if (process.env.SITE_NAME) {
      headers["X-Title"] = process.env.SITE_NAME;
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that provides information about Building A layout.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 256,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return res.status(500).json({
        error: `OpenRouter API request failed with status ${response.status}`,
      });
    }

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get building information" });
  }
};

export const getFloors = (req, res) => {
  res.json({ floors: Object.keys(buildingInfo.floors) });
};

export const getFloorDetails = (req, res) => {
  const { floor } = req.params;
  if (buildingInfo.floors[floor]) {
    res.json({ floor, details: buildingInfo.floors[floor] });
  } else {
    res.status(404).json({ error: "Floor not found" });
  }
};
