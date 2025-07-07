import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // listar todos los clientes
    if(req.method === 'GET') {
        const { data, error} = await supabase
            .from('clients')
            .select('*')
            .order('created_at', {ascending: false});

        if(error) return res.status(500).json({error: error.message});

        return res.status(200).json(data);
    }

    // Crear un cliente nuevo
    if (req.method === 'POST') {
        const {name, lastname, address, phone} = req.body;
        if(!name || !lastname || !phone) {
            return res.status(400).json({error: 'Los campos nombre, apellido y telefono son requeridos'});
        }

        const {data, error} = await supabaseAdmin
            .from('clients')
            .insert([{name, lastname, address, phone}])
            .single();

        if (error) return res.status(500).json({error: error.message});

        return res.status(201).json({
            message: "Client added",
            client: data
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Methdo ${req.method} Not Allowed`);
}