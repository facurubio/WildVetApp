import type { NextApiRequest, NextApiResponse } from "next";
import {supabase, supabaseAdmin} from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const { id } = req.query;
    if(typeof id !== 'string'){
        res.status(400).json({error: 'Invalid id'});
        return;
    }

    // obtener un cliente por ID
    if(req.method === 'GET') {
        const {data, error} = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

        if (error) return res.status(404).json({error: error.message});

        return res.status(200).json(data);
    }

    // actualizar un cliente
    if (req.method === 'PUT') {
        const updates = req.body;
        const {data, error} = await supabaseAdmin
        .from('clients')
        .update(updates)
        .eq('id', id)
        .single();

        if (error) return res.status(500).json({error: error.message});

        return res.status(200).json({
            message: "Client updated",
            client: data
        });
    }

    // eliminar un cliente 
    if (req.method === 'DELETE') {
        const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

        if (error) return res.status(500).json({error: error.message});

        return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not allowed`);
}