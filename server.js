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

// Creates a new note from user input and adds it to the current data in db.json
server.post("/api/notes", (request, response)=> {
    // Reads db.json and saves the data to a new array dbArray
    fs.readFile("./Develop/db/db.json", "utf-8", (error, data) => {
        if (error){
            throw error;
        } else {
            if (request.body){
                // Holds JSON parsed data from db.json
                const dbArray = JSON.parse(data);
                // Destructured object values from request.body
                const {title, text} = request.body;
                // New note created based off of user input
                const newNote = {
                    "id": generateUniqueId(),
                    title,
                    text
                }
                // Appends the new note to the dbArray
                dbArray.push(newNote);
                // Overwrites existing db.json with new data
                fs.writeFile("./Develop/db/db.json", JSON.stringify(dbArray, null, 4), error => {
                    if (error) throw error;
                })
                // Returns a response that the note was added
                response.send("The note has been added!");
            } else {
                // If no request data was found, a response is sent saying unable to complete
                response.send("Unable to create new note!");
            }
        }
    });
});


// Message displayed to terminal when server is running
server.listen(PORT, ()=> {
    console.log(`SERVER RUNNING - Listening on port: ${PORT}`);
});