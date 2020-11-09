const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Create a GET request to respond with the contents of the profiles.json file
app.get("/api/profiles", (_, res) => {
  console.log(path.join(__dirname, "..", "models", "profile.json"));
  fs.readFile(
    path.join(__dirname, "..", "models", "profile.json"),
    "utf8",
    (_, data) => {
      console.log(data);
      res.end(data);
    }
  );
});

// Create a GET request with an :id parameter and use it to respond with the profile object which ends with the same number e.g. for 1 return object which key is “profile1” in profile.json
app.get("/api/profiles/:id", (req, res) => {
  const data = fs.readFile(
    path.join(__dirname, "..", "models", "profile.json"),
    "utf8",
    (err, data) => {
      if (err) throw err;
      return data;
    }
  );
  res.setHeader("Content-Type", "application/json");
  let profiles = JSON.parse(data);
  let profile = profiles["profile" + req.params.id];
  if (profile) {
    console.log(profile);
    res.end(JSON.stringify(profile));
  } else {
    res.status(404).send("Error, profile not found");
  }
});

// Create a PUT request which will append another new profile at the end of the file
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.put("/api/profiles", (req, res) => {
  let newProfile = JSON.stringify(req.body);
  fs.appendFile("newProfile.txt", "text", "utf8", (err, data) => {
    console.log(req.body);
    if (err) throw err;
    res.send("Data received, thank you!");
  });

  // [Optional] Create a DELETE request with an :id which will delete the corresponding profile (as in point 2)
  app.delete("/api/delete/:id", (req, res) => {
    fs.readFile(
      path.join(__dirname, "..", "models", "profile.json"),
      "utf8",
      (err, data) => {
        res.setHeader("Content-Type", "application/json");
        let profiles = JSON.parse(data);
        let profile = profiles["profile" + req.params.id];
        console.log(profile);
        res.end(JSON.stringify(profile));
      }
    );
  });
});
app.listen(3000, () => {
  console.log("Node server is running http://localhost:3000 ...");
});
