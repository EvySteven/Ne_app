import { NextRequest, NextResponse } from "next/server";
import {PrismaClient} from '@prisma/client'
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try{
        const {pseudo, email, motDePasse} = await request.json()

        if(!pseudo || !email || !motDePasse){
            return NextResponse.json(
                { erreur: 'Veuillez remplir tous les champs'},
                {statuts: 400}
            )
        }

        const existDeja = await prisma.utilisatrice.findUnique({where: {email}})
        if(existDeja){
            return NextResponse.json({erreur: 'Email déjà utilisé'}, {status: 409})
        }

        //Hash du mot de passe 
        const hash = await bcrypt.hash(motDePasse, 12)

        const user = await prisma.utilisatrice.create({
            data: {pseudo, email, motDePasse: hash}
        })
        return NextResponse.json({message: `Bienvenue ${pseudo} ! Ton compte est prêt. 🌸` })
    }catch (e){
        return NextResponse.json({erreur:'Oups ! Quelque chose a mal tourné. Veuillez réessayer💜.'}, {status: 500})
    }
}
