import { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api';

export default function Clients() {
    const [clients, setClients]   = useState([]);
    const [form, setForm]         = useState({ nomclient: '', solde: '' });
    const [message, setMessage]   = useState('');

    const charger = async () => {
        const res = await clientsAPI.getAll();
        setClients(res.data);
    };

    useEffect(() => { charger(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await clientsAPI.create(form);
        setForm({ nomclient: '', solde: '' });
        setMessage('✅ Client ajouté !');
        charger();
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce client ?')) return;
        await clientsAPI.delete(id);
        setMessage('🗑️ Client supprimé !');
        charger();
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.titre}>👥 Gestion des Clients</h2>

            {/* Formulaire */}
            <div style={styles.card}>
                <h3>Ajouter un client</h3>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        placeholder="Nom du client"
                        value={form.nomclient}
                        onChange={e => setForm({...form, nomclient: e.target.value})}
                        required
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Solde initial"
                        value={form.solde}
                        onChange={e => setForm({...form, solde: e.target.value})}
                    />
                    <button type="submit" style={styles.btnAjouter}>
                        ➕ Ajouter
                    </button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
            </div>

            {/* Tableau */}
            <div style={styles.card}>
                <h3>Liste des clients ({clients.length})</h3>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th style={styles.th}>N° Compte</th>
                            <th style={styles.th}>Nom Client</th>
                            <th style={styles.th}>Solde (Ar)</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(c => (
                            <tr key={c.ncompte} style={styles.tr}>
                                <td style={styles.td}>{c.ncompte}</td>
                                <td style={styles.td}>{c.nomclient}</td>
                                <td style={{...styles.td, color: c.solde >= 0 ? '#2e7d32' : '#c62828', fontWeight: 'bold'}}>
                                    {parseFloat(c.solde).toLocaleString()} Ar
                                </td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleDelete(c.ncompte)}
                                        style={styles.btnDelete}
                                    >
                                        🗑️ Supprimer
                                    </button>
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
    container: { padding: '30px', maxWidth: '900px', margin: '0 auto' },
    titre:     { color: '#1a237e', marginBottom: '20px' },
    card:      { background: 'white', borderRadius: '10px', padding: '25px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    form:      { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
    input:     { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', flex: 1, minWidth: '180px' },
    btnAjouter:{ padding: '10px 20px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnDelete: { padding: '6px 12px', background: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    message:   { marginTop: '10px', color: '#2e7d32', fontWeight: 'bold' },
    table:     { width: '100%', borderCollapse: 'collapse' },
    thead:     { background: '#1a237e' },
    th:        { padding: '12px', color: 'white', textAlign: 'left' },
    tr:        { borderBottom: '1px solid #eee' },
    td:        { padding: '12px' }
};
