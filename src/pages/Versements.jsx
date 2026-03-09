import { useState, useEffect } from 'react';
import { versementsAPI, clientsAPI } from '../services/api';

export default function Versements() {
    const [versements, setVersements] = useState([]);
    const [clients, setClients]       = useState([]);
    const [form, setForm]             = useState({ ncheque: '', ncompte: '', montant: '' });
    const [editId, setEditId]         = useState(null);
    const [message, setMessage]       = useState('');

    const charger = async () => {
        const [v, c] = await Promise.all([
            versementsAPI.getAll(),
            clientsAPI.getAll()
        ]);
        setVersements(v.data);
        setClients(c.data);
    };

    useEffect(() => { charger(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await versementsAPI.update({ ...form, nversement: editId });
            setMessage('✅ Versement modifié !');
            setEditId(null);
        } else {
            await versementsAPI.create(form);
            setMessage('✅ Versement ajouté !');
        }
        setForm({ ncheque: '', ncompte: '', montant: '' });
        charger();
        setTimeout(() => setMessage(''), 3000);
    };

    const handleEdit = (v) => {
        setEditId(v.nversement);
        setForm({ ncheque: v.ncheque, ncompte: v.ncompte, montant: v.montant });
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce versement ?')) return;
        await versementsAPI.delete(id);
        setMessage('🗑️ Versement supprimé !');
        charger();
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.titre}>💰 Gestion des Versements</h2>

            {/* Formulaire */}
            <div style={styles.card}>
                <h3>{editId ? '✏️ Modifier le versement' : '➕ Nouveau versement'}</h3>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        placeholder="N° Chèque"
                        value={form.ncheque}
                        onChange={e => setForm({...form, ncheque: e.target.value})}
                        required
                    />
                    <select
                        style={styles.input}
                        value={form.ncompte}
                        onChange={e => setForm({...form, ncompte: e.target.value})}
                        required
                    >
                        <option value="">-- Choisir un client --</option>
                        {clients.map(c => (
                            <option key={c.ncompte} value={c.ncompte}>
                                {c.nomclient} (Solde: {parseFloat(c.solde).toLocaleString()} Ar)
                            </option>
                        ))}
                    </select>
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Montant (Ar)"
                        value={form.montant}
                        onChange={e => setForm({...form, montant: e.target.value})}
                        required
                    />
                    <button type="submit" style={styles.btnAjouter}>
                        {editId ? '💾 Modifier' : '➕ Ajouter'}
                    </button>
                    {editId && (
                        <button type="button" onClick={() => { setEditId(null); setForm({ ncheque: '', ncompte: '', montant: '' }); }} style={styles.btnAnnuler}>
                            ❌ Annuler
                        </button>
                    )}
                </form>
                {message && <p style={styles.message}>{message}</p>}
            </div>

            {/* Tableau */}
            <div style={styles.card}>
                <h3>Liste des versements ({versements.length})</h3>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th style={styles.th}>N° Versement</th>
                            <th style={styles.th}>N° Chèque</th>
                            <th style={styles.th}>Client</th>
                            <th style={styles.th}>Montant (Ar)</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versements.map(v => (
                            <tr key={v.nversement} style={styles.tr}>
                                <td style={styles.td}>{v.nversement}</td>
                                <td style={styles.td}>{v.ncheque}</td>
                                <td style={styles.td}>{v.nomclient}</td>
                                <td style={{...styles.td, color: '#1a237e', fontWeight: 'bold'}}>
                                    {parseFloat(v.montant).toLocaleString()} Ar
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(v)} style={styles.btnEdit}>✏️</button>
                                    <button onClick={() => handleDelete(v.nversement)} style={styles.btnDelete}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container:  { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
    titre:      { color: '#1a237e', marginBottom: '20px' },
    card:       { background: 'white', borderRadius: '10px', padding: '25px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    form:       { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
    input:      { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', flex: 1, minWidth: '160px' },
    btnAjouter: { padding: '10px 20px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnAnnuler: { padding: '10px 20px', background: '#757575', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    btnEdit:    { padding: '6px 10px', background: '#f57f17', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    btnDelete:  { padding: '6px 10px', background: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    message:    { marginTop: '10px', color: '#2e7d32', fontWeight: 'bold' },
    table:      { width: '100%', borderCollapse: 'collapse' },
    thead:      { background: '#1a237e' },
    th:         { padding: '12px', color: 'white', textAlign: 'left' },
    tr:         { borderBottom: '1px solid #eee' },
    td:         { padding: '12px' }
};
