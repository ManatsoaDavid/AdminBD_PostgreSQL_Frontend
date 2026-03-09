import { useState, useEffect } from 'react';
import { auditAPI } from '../services/api';

export default function Audit() {
    const [audits, setAudits] = useState([]);
    const [stats, setStats]   = useState({});

    useEffect(() => {
        auditAPI.getAll().then(res => {
            setAudits(res.data.audits);
            setStats(res.data.stats);
        });
    }, []);

    const couleurAction = (type) => {
        if (type === 'INSERT') return '#2e7d32';
        if (type === 'UPDATE') return '#f57f17';
        if (type === 'DELETE') return '#c62828';
        return '#000';
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.titre}>📋 Journal d'Audit</h2>

            {/* Statistiques */}
            <div style={styles.statsRow}>
                <div style={{...styles.statCard, background: '#e8f5e9'}}>
                    <div style={styles.statNombre}>{stats.nb_insertions || 0}</div>
                    <div style={styles.statLabel}>✅ Insertions</div>
                </div>
                <div style={{...styles.statCard, background: '#fff8e1'}}>
                    <div style={styles.statNombre}>{stats.nb_modifications || 0}</div>
                    <div style={styles.statLabel}>✏️ Modifications</div>
                </div>
                <div style={{...styles.statCard, background: '#ffebee'}}>
                    <div style={styles.statNombre}>{stats.nb_suppressions || 0}</div>
                    <div style={styles.statLabel}>🗑️ Suppressions</div>
                </div>
                <div style={{...styles.statCard, background: '#e3f2fd'}}>
                    <div style={styles.statNombre}>{audits.length}</div>
                    <div style={styles.statLabel}>📊 Total opérations</div>
                </div>
            </div>

            {/* Tableau audit */}
            <div style={styles.card}>
                <h3>Historique complet</h3>
                {audits.length === 0 ? (
                    <p style={{color: '#999', textAlign: 'center', padding: '30px'}}>
                        Aucune opération enregistrée pour l'instant.
                        Effectuez des versements pour voir l'audit !
                    </p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Action</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>N° Versement</th>
                                <th style={styles.th}>Client</th>
                                <th style={styles.th}>Montant Ancien</th>
                                <th style={styles.th}>Montant Nouveau</th>
                                <th style={styles.th}>Utilisateur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits.map(a => (
                                <tr key={a.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <span style={{
                                            background: couleurAction(a.type_action),
                                            color: 'white',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {a.type_action}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(a.date_operation).toLocaleString('fr-FR')}
                                    </td>
                                    <td style={styles.td}>{a.nversement}</td>
                                    <td style={styles.td}>{a.nomclient}</td>
                                    <td style={styles.td}>
                                        {a.montant_ancien ? parseFloat(a.montant_ancien).toLocaleString() + ' Ar' : '-'}
                                    </td>
                                    <td style={styles.td}>
                                        {a.montant_nouv ? parseFloat(a.montant_nouv).toLocaleString() + ' Ar' : '-'}
                                    </td>
                                    <td style={styles.td}>{a.utilisateur}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const styles = {
    container:   { padding: '30px', maxWidth: '1100px', margin: '0 auto' },
    titre:       { color: '#1a237e', marginBottom: '20px' },
    statsRow:    { display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' },
    statCard:    { flex: 1, minWidth: '150px', borderRadius: '10px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
    statNombre:  { fontSize: '36px', fontWeight: 'bold', color: '#1a237e' },
    statLabel:   { fontSize: '14px', color: '#555', marginTop: '5px' },
    card:        { background: 'white', borderRadius: '10px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    table:       { width: '100%', borderCollapse: 'collapse' },
    thead:       { background: '#1a237e' },
    th:          { padding: '12px', color: 'white', textAlign: 'left', fontSize: '13px' },
    tr:          { borderBottom: '1px solid #eee' },
    td:          { padding: '11px', fontSize: '13px' }
};
