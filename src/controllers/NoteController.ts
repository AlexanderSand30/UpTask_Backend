import { request, type Request, type Response } from "express"
import Note, { INote } from "../models/Note"
import { Types } from "mongoose"

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const { content } = req.body
            const note = new Note()
            note.content = content
            note.createdBy = req.user.id
            note.task = req.task.id

            req.task.notes.push(note.id)

            Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota Creada Correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getTaskNotes = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id })
            res.json(notes)

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params
        try {
            const note = await Note.findById(noteId)
            if (!note) {
                const error = new Error('Nota no encontrada')
                return res.status(404).json({ error: error.message })
            }

            if (note.createdBy.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                return res.status(401).json({ error: error.message })
            }
            req.task.notes = req.task.notes.filter(note => note._id.toString() !== noteId.toString())
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Nota Eliminada')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}