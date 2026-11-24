import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { barbeiro, data, whatsapp } = req.query;

        if (barbeiro && data) {
            const { data: horarios, error } = await supabase
                .from('agendamentos')
                .select('horario')
                .eq('barbeiro', barbeiro)
                .eq('data_agendamento', data);

            if (error) {
                return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar horários.' });
            }

            return res.status(200).json({
                sucesso: true,
                ocupados: horarios.map(item => item.horario)
            });
        }

        if (whatsapp) {
            const { data: lista, error } = await supabase
                .from('agendamentos')
                .select('*')
                .eq('cliente_whatsapp', whatsapp)
                .order('data_agendamento', { ascending: true })
                .order('horario', { ascending: true });

            if (error) {
                return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar agendamentos.' });
            }

            return res.status(200).json({ sucesso: true, agendamentos: lista });
        }

        return res.status(400).json({ sucesso: false, mensagem: 'Parâmetros inválidos.' });
    }

    if (req.method === 'POST') {
        const {
            cliente_nome,
            cliente_whatsapp,
            ambiente,
            servico,
            barbeiro,
            data_agendamento,
            horario
        } = req.body;

        if (!cliente_nome || !cliente_whatsapp || !servico || !barbeiro || !data_agendamento || !horario) {
            return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
        }

        const { data, error } = await supabase
            .from('agendamentos')
            .insert([{
                cliente_nome,
                cliente_whatsapp,
                ambiente,
                servico,
                barbeiro,
                data_agendamento,
                horario
            }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Este horário acabou de ser reservado. Escolha outro.'
                });
            }
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar agendamento.' });
        }

        return res.status(200).json({ sucesso: true, agendamento: data });
    }
if (req.method === 'DELETE') {
        const { id, whatsapp } = req.query;

        if (!id || !whatsapp) {
            return res.status(400).json({ sucesso: false, mensagem: 'Dados inválidos para cancelamento.' });
        }

        const { error } = await supabase
            .from('agendamentos')
            .delete()
            .eq('id', id)
            .eq('cliente_whatsapp', whatsapp);

        if (error) {
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cancelar agendamento.' });
        }

        return res.status(200).json({ sucesso: true });
    }
    return res.status(405).json({ sucesso: false, mensagem: 'Método não permitido.' });
}