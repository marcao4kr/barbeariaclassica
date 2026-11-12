import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ sucesso: false, mensagem: 'Método não permitido.' });
    }

    const { acao, nome, email, whatsapp, data_nascimento } = req.body;

    if (acao === 'login') {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('whatsapp', whatsapp)
            .single();

        if (error || !data) {
            return res.status(401).json({ sucesso: false, mensagem: 'Cliente não encontrado. Verifique os dados.' });
        }

        return res.status(200).json({ sucesso: true, cliente: data });
    }

    if (!nome || !email || !whatsapp || !data_nascimento) {
        return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios.' });
    }

    const { data, error } = await supabase
        .from('clientes')
        .insert([{ nome, email: email.toLowerCase(), whatsapp, data_nascimento }])
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return res.status(409).json({ sucesso: false, mensagem: 'Este e-mail já está cadastrado.' });
        }
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar no banco de dados.' });
    }

    return res.status(200).json({ sucesso: true, cliente: data, mensagem: 'Cliente cadastrado com sucesso!' });
}