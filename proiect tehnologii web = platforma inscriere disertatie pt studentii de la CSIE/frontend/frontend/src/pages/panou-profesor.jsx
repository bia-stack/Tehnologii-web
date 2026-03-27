import { useState, useEffect } from 'react';
import api from '../api/axios';
import IllustrationSesiune from '../components/IllustrationSesiune';

//afiseaza panou prof
function PanouProfesor() {
    const [cereri, setCereri] = useState([]); //lista cu toate cererile studentilor
    const [sesiuni, setSesiuni] = useState([]); //lista cu toate sesiunile profesorului
    const [sesiuneNoua, setSesiuneNoua] = useState({ //datele pentru formularul de creare sesiune
        title: '',
        desc: '',
        startDate: '',
        endDate: '',
        maxStud: 10
    });

    //preia datele prodesorului logat din localStorage
    const utilizatorRaw = localStorage.getItem('utilizator');
    const utilizator = utilizatorRaw ? JSON.parse(utilizatorRaw) : null;

    //aduce datele din baza de date
    const incarcaDate = async () => {
        try {
            const currentProfId = Number(utilizator?.id);
            const [raspunsCereri, raspunsSesiuni] = await Promise.all([
                api.get('/requests/professor'),
                api.get('/sessions')
            ]);

            setCereri(raspunsCereri.data);

            //filtreaza doar sesiunile care apartin profesorului respectiv
            const doarSesiunileMele = raspunsSesiuni.data.filter(s => Number(s.profesorId) === currentProfId);
            setSesiuni(doarSesiunileMele);
        } catch (err) {
            console.error('Eroare la incarcarea datelor', err);
        }
    };

    //trimite datele catre backend pentru a crea o sesiune noua
    const trimiteDateSesiune = async (e) => {
        e.preventDefault(); //opreste reincarcarea paginii
        try {
            await api.post('/sessions', sesiuneNoua);
            alert('Sesiunea a fost adaugata cu succes!');
            setSesiuneNoua({ title: '', desc: '', startDate: '', endDate: '', maxStud: 10 });
            incarcaDate(); //reincarca lista ptr a vedea o noua sesiune
        } catch (eroare) {
            const mesaj = eroare.response?.data?.error || 'Nu am putut salva sesiunea';
            alert(mesaj);
        }
    };

    //sterge o sesiune existenta
    const stergeSesiune = async (id) => {
        if (!window.confirm("Esti sigur ca vrei sa stergi aceasta sesiune? Toate cererile asociate vor fi de asemenea sterse.")) return;

        try {
            await api.delete(`/sessions/${id}`);
            alert('Sesiunea a fost stearsa!');
            incarcaDate();
        } catch (err) {
            const mesaj = err.response?.data?.error || 'Eroare la stergerea sesiunii';
            alert(mesaj);
        }
    };

    useEffect(() => {
        incarcaDate();
    }, []);

    //schimba starea unei cereri
    const actualizeazaStatus = async (id, statusNou, motivManual = null) => {
        let motiv = motivManual;
        if (statusNou === 'refuzat' && !motivManual) {
            motiv = prompt("Te rugam sa introduci motivul respingerii:");
            if (!motiv) return;
        }

        try {
            await api.put(`/requests/${id}`, {
                stadiu: statusNou,
                rejectionReason: motiv
            });
            alert('Cerere actualizata');
            incarcaDate();
        } catch (err) {
            const mesajEroare = err.response?.data?.error || 'Eroare la procesarea cererii';
            alert(mesajEroare);
        }
    };

    //urca documentul semnat de profesor inapoi pe server
    const semneazaDocument = async (id, file) => {
        if (!file) return alert("Selecteaza documentul semnat!");

        try {
            const formData = new FormData();
            formData.append('document', file);

            //adauga fisierul in containerul de trimitere
            await api.put(`/requests/${id}/sign`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' } //specifica faptul ca trimiti un fisier
            });

            alert('Documentul semnat a fost incarcat!');
            incarcaDate();
        } catch (err) {
            alert('Eroare la incarcarea documentului semnat');
        }
    };


    const cereriNoi = cereri.filter(c => c.status === 'waiting');
    const cereriPentruSemnat = cereri.filter(c => c.status === 'finalizat');

    return (
        <div className="container-pagina">
            {/* Sectiune 1 - formularul de creare sesiune */}
            <div className="panou-alb">
                <h2 className="titlu-sectiune">Creare sesiune de inscriere</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', alignItems: 'start' }}>
                    <form className="formular-sesiune" onSubmit={trimiteDateSesiune} style={{ marginBottom: 0 }}>
                        <div className="rand-form">
                            <label htmlFor="titlu-s">Denumire sesiune</label>
                            <input
                                id="titlu-s"
                                type="text"
                                placeholder="Ex: Disertatie 2025"
                                value={sesiuneNoua.title}
                                onChange={e => setSesiuneNoua({ ...sesiuneNoua, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="rand-form">
                            <label htmlFor="desc-s">Descriere si detalii</label>
                            <textarea
                                id="desc-s"
                                className="textarea-fain"
                                placeholder="Detalii despre teme, cerinte etc."
                                value={sesiuneNoua.desc}
                                onChange={e => setSesiuneNoua({ ...sesiuneNoua, desc: e.target.value })}
                            />
                        </div>

                        <div className="rand-dublu">
                            <div className="rand-form">
                                <label htmlFor="data-i">Data inceput</label>
                                <input
                                    id="data-i"
                                    type="date"
                                    value={sesiuneNoua.startDate}
                                    onChange={e => setSesiuneNoua({ ...sesiuneNoua, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="rand-form">
                                <label htmlFor="data-s">Data final</label>
                                <input
                                    id="data-s"
                                    type="date"
                                    value={sesiuneNoua.endDate}
                                    onChange={e => setSesiuneNoua({ ...sesiuneNoua, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rand-form">
                            <label htmlFor="max-s">Numar maxim de studenti</label>
                            <input
                                id="max-s"
                                type="number"
                                value={sesiuneNoua.maxStud}
                                onChange={e => setSesiuneNoua({ ...sesiuneNoua, maxStud: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="buton-intrare" style={{ marginTop: '10px' }}>Creeaza sesiunea</button>
                    </form>

                    <div style={{ padding: '10px' }}>
                        <IllustrationSesiune />
                    </div>
                </div>
            </div>

            {/*Sectiune 2 - lista cu sesiunile create anterior */}
            <div className="panou-alb">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '30px', alignItems: 'center' }}>
                    <div>
                        <h2 className="titlu-sectiune">Sesiunile mele</h2>
                        {sesiuni.length === 0 ? (
                            <p style={{ color: 'var(--text-sters)' }}>Inca nu ai postat nicio sesiune.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {sesiuni.map(s => (
                                    <div key={s.id} className="card-cerere" style={{ position: 'relative' }}>
                                        <p><strong>{s.title}</strong></p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-sters)' }}>{s.description}</p>
                                        <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                                            <span>Valabila pana la: {new Date(s.endDate).toLocaleDateString()}</span>
                                            <br />
                                            <span>Locuri disponibile: {s.maxStudents}</span>
                                        </div>
                                        <button
                                            onClick={() => stergeSesiune(s.id)}
                                            style={{
                                                marginTop: '15px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                padding: '0',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Sterge Sesiunea
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/calendar-3d.png"
                            alt="Calendar 3D"
                            style={{ width: '100%', height: 'auto', maxWidth: '150px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="panou-alb">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '30px', alignItems: 'center' }}>
                    <div>
                        <h2 className="titlu-sectiune">Cereri noi (Solicitari in asteptare)</h2>
                        {cereriNoi.length === 0 ? (
                            <p style={{ color: 'var(--text-sters)' }}>Nu exista cereri noi.</p>
                        ) : (
                            cereriNoi.map(c => (
                                <div key={c.id} className="card-cerere">
                                    <div className="detalii-student">
                                        <p><strong>{c.student?.firstName} {c.student?.lastName}</strong></p>
                                        <span style={{ fontSize: '0.8rem' }}>Sesiune: {c.sesiune?.title}</span>
                                    </div>
                                    <p style={{ margin: '10px 0', fontSize: '1rem', color: 'var(--tema-indigo)' }}>
                                        Titlu propus: <strong>{c.workTitle}</strong>
                                    </p>
                                    <p style={{ margin: '10px 0', fontSize: '0.9rem' }}>{c.message}</p>
                                    <div className="grup-butoane">
                                        <button className="btn-accepta" onClick={() => actualizeazaStatus(c.id, 'aprobat')}>Aproba</button>
                                        <button className="btn-refuza" onClick={() => actualizeazaStatus(c.id, 'refuzat')}>Refuza</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/cereri-noi.png"
                            alt="Cereri Noi Illustration"
                            style={{ width: '100%', height: 'auto', maxWidth: '150px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="panou-alb">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '30px', alignItems: 'center' }}>
                    <div>
                        <h2 className="titlu-sectiune">Documente pentru semnat</h2>
                        {cereriPentruSemnat.length === 0 ? (
                            <p style={{ color: 'var(--text-sters)' }}>Nu exista documente de semnat.</p>
                        ) : (
                            cereriPentruSemnat.map(c => (
                                <div key={c.id} className="card-cerere" style={{ borderLeft: '4px solid var(--tema-indigo)', marginBottom: '15px' }}>
                                    <div className="detalii-student">
                                        <p><strong>{c.student?.firstName} {c.student?.lastName}</strong></p>
                                        <p style={{ fontSize: '0.9rem' }}>Titlu lucrare: <strong>{c.workTitle}</strong></p>
                                        <span style={{ fontSize: '0.8rem' }}>Sesiune: {c.sesiune?.title}</span>
                                    </div>
                                    <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <a
                                            href={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000'}/${c.files?.[0]?.filePath?.replace(/\\/g, '/')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-refuza"
                                            style={{ textDecoration: 'none', textAlign: 'center', background: 'rgba(255,255,255,0.05)', width: 'fit-content' }}
                                        >
                                            Descarca PDF Student
                                        </a>

                                        <div className="zona-upload-semnat" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ccc' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Incarca documentul semnat:</label>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                                                <input type="file" id={`semnat-${c.id}`} />
                                                <button
                                                    className="btn-accepta"
                                                    onClick={() => {
                                                        const fileInput = document.getElementById(`semnat-${c.id}`);
                                                        semneazaDocument(c.id, fileInput.files[0]);
                                                    }}
                                                >
                                                    Incarca si Semneaza
                                                </button>
                                                <button
                                                    className="btn-refuza"
                                                    style={{
                                                        marginLeft: '10px',
                                                        padding: '14px 28px',
                                                        fontSize: '16px',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none'
                                                    }}
                                                    onClick={() => {
                                                        const motiv = prompt("Motivul respingerii documentului (studentul va vedea acest mesaj):");
                                                        if (motiv) {
                                                            actualizeazaStatus(c.id, 'aprobat', motiv);
                                                        }
                                                    }}
                                                >
                                                    Respinge Document
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/documente-semnat.png"
                            alt="Documente Semnat Illustration"
                            style={{ width: '100%', height: 'auto', maxWidth: '150px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="panou-alb">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', gap: '30px', alignItems: 'center' }}>
                    <div>
                        <h2 className="titlu-sectiune">Studenti Acceptati</h2>
                        {cereri.filter(c => ['aprobat', 'finalizat', 'semnat'].includes(c.status)).length === 0 ? (
                            <p style={{ color: 'var(--text-sters)' }}>Nu ai acceptat niciun student inca.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {cereri
                                    .filter(c => ['aprobat', 'finalizat', 'semnat'].includes(c.status))
                                    .map(c => (
                                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div>
                                                <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{c.student?.firstName} {c.student?.lastName}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-sters)' }}>Lucrare: {c.workTitle}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    padding: '5px 10px',
                                                    borderRadius: '15px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    background: c.status === 'aprobat' ? '#f59e0b' : c.status === 'finalizat' ? '#3b82f6' : '#22c55e',
                                                    color: 'white'
                                                }}>
                                                    {c.status === 'aprobat' ? 'Asteapta Incarcare' :
                                                        c.status === 'finalizat' ? 'Asteapta Semnare' : 'Dosar Complet'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/studenti-acceptati.jpg"
                            alt="Studenti Acceptati"
                            style={{ width: '100%', height: 'auto', maxWidth: '150px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PanouProfesor;
