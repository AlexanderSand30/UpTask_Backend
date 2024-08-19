import { Request, Response } from "express";
import User from "../models/Users";
import Project from "../models/Project";

export class TeamController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body
        //Buscar User
        const user = await User.findOne({ email }).select('id email name')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {

        const project = await (await Project.findById(req.project.id)).populate({ 
            path: 'team',
            select:'id email name'
        })
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body
        // Buscar User
        const user = await User.findById(id).select('id')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya existe en el proyecto')
            return res.status(409).json({ error: error.message })
        }
        req.project.team.push(user.id)
        await req.project.save()

        res.send('Usuario agregado correctamente')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params
        // Buscar User
        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no existe en el projecto')
            return res.status(409).json({ error: error.message })
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
        await req.project.save()

        res.send('Usuario eliminado correctamente')
    }
}