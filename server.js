const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");

server.use(express.json());
server.use(express.urlencoded({ extended: true}));
server.use(express.static(__dirname + "/Develop/public"));

// This sends the landing page to the client when requested from the server
server.get("/", (request, response)=> {
    response.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

// This sends the notes page to the client when requested from the server
server.get("/notes", (request, response)=> {
    response.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});


// Displays the data from the db.json file when requested from the server
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

server.delete("/api/notes/:id", (request, response)=> {
    // Reads db.json and saves the data to a new array dbArray
    fs.readFile("./Develop/db/db.json", "utf-8", (error, data) => {
        if (error) {
            // Response used to show process was unsuccessful
            response.send("Unable to delete note!");
            throw error;
        } else {
            // Array used to hold notes that don't match the id parameter
            let dbArray = [];
            // Loops over db.json and checks if the note's id == id paramter
            for (let note of JSON.parse(data)){
                // If the note.id doesn't match, it's put into the dbArray
                if (!(note.id == request.params.id)){
                    dbArray.push(note);
                }
            }
            
            // All note's that didn't match the id parameter overwrite the db.json file which removes the specified note
            fs.writeFile("./Develop/db/db.json", JSON.stringify(dbArray, null, 4), error => {
                if (error) throw error;
            });
            // Response used to confirm process
            response.send("The note has been deleted!");
        }
    });
});


// Message displayed to terminal when server is running
server.listen(PORT, ()=> {
    console.log(`SERVER RUNNING - Listening on port: ${PORT}`);
});