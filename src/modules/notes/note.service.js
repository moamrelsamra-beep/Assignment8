import mongoose from "mongoose";
import noteModel from "../../DB/models/note.model.js";


export const createNote = async (req, res) => {
    try {
        const userId = req.query.id;
        const { title, content } = req.body;
        const newNote = new noteModel({ title, content, userId });
        await newNote.save();
        return res.status(201).json({ message: "Note created", note: newNote });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const UpdateNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, content } = req.body;
        const updatedNote = await noteModel.findByIdAndUpdate(noteId, { title, content }, { new: true });
        return res.status(200).json({ message: "Note updated", note: updatedNote });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const replaceNote = async (req, res) => {
    try {
        const userId = req.query.id;
        const { noteId } = req.params;
        const note = await noteModel.findById(noteId);

        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.status(403).json({ message: "You are not the owner" });

        note.title = req.body.title;
        note.content = req.body.content;
        await note.save();
        return res.status(200).json({ message: "Note replaced", note });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const updateAllUserNotes = async (req, res) => {
    try {
        const userId = req.query.id;
        const { title } = req.body;
        const result = await noteModel.updateMany({ userId }, { title }, { runValidators: true });
        
        if (result.matchedCount === 0) return res.status(404).json({ message: "No note found" });
        return res.status(200).json({ message: "All notes updated" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const userId = req.query.id;
        const { noteId } = req.params;
        const note = await noteModel.findById(noteId);

        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.status(403).json({ message: "You are not the owner" });

        await noteModel.findByIdAndDelete(noteId);
        return res.status(200).json({ message: "delete", note });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPaginatedNotes = async (req, res) => {
    try {
        const userId = req.query.id;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 3;
        const skip = (page - 1) * limit;

        const notes = await noteModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const userId = req.query.id;
        const { id } = req.params;
        const note = await noteModel.findById(id);

        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== userId) return res.status(403).json({ message: "You are not the owner" });

        return res.status(200).json(note);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getNoteByContent = async (req, res) => {
    try {
        const userId = req.query.id;
        const { content } = req.query;
        const notes = await noteModel.find({
            userId,
            content: { $regex: content, $options: 'i' }
        });

        if (!notes.length) return res.status(404).json({ message: "No note found" });
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getNoteWithUser = async (req, res) => {
    try {
        const userId = req.query.id;
        const notes = await noteModel.find({ userId })
            .select('title userId createdAt')
            .populate('userId', 'email');
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const aggregateNotes = async (req, res) => {
    try {
        const userId = req.query.id;
        const { title } = req.query;

        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    title: { $regex: title || '', $options: 'i' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    title: 1, userId: 1, createdAt: 1,
                    'user.name': 1, 'user.email': 1
                }
            }
        ];

        const results = await noteModel.aggregate(pipeline);
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteAllNotes = async (req, res) => {
    try {
        const userId = req.query.id;
        await noteModel.deleteMany({ userId });
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};