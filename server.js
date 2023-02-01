const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");

server.use(express.json());
server.use(express.urlencoded({ extended: true}));
server.use(express.static("public"));

// This sends the landing page to the client when requested from the server
server.get("/", (request, response)=> {
    response.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

// This sends the notes page to the client when requested from the server
server.get("/notes", (request, response)=> {
    response.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});

server.get("/api/notes", (request, response)=> {
    fs.readFile("./Develop/db/db.json", "utf-8", (error, data)=> {
        if (error){
            throw error;
        } else {
            response.json(JSON.parse(data));
        }
    })
});


// Message displayed to terminal when server is running
server.listen(PORT, ()=> {
    console.log(`SERVER RUNNING - Listening on port: ${PORT}`);
});