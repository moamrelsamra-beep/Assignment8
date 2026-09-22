import { Router } from "express";
import * as NS from "./note.service.js";

const Noterouter = Router();

Noterouter.post("/", NS.createNote);
Noterouter.put("/:id", NS.UpdateNote);
Noterouter.post("/", NS.createNote);
Noterouter.patch("/all", NS.updateAllUserNotes);
Noterouter.put("/replace/:noteId", NS.replaceNote);
Noterouter.delete("/all", NS.deleteAllNotes); 
Noterouter.delete("/:noteId", NS.deleteNote);
Noterouter.get("/paginate-sort", NS.getPaginatedNotes);
Noterouter.get("/note-by-content", NS.getNoteByContent);
Noterouter.get("/note-with-user", NS.getNoteWithUser);
Noterouter.get("/aggregate", NS.aggregateNotes);
Noterouter.get("/:id", NS.getNoteById);


export default Noterouter;