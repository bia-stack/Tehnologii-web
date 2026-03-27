import { useState, useEffect } from 'react';
import api from '../api/axios';

function PanouStudent() {
    const [sesiuni, setSesiuni] = useState([]);
    const [profesori, setProfesori] = useState([]);
    const [cerereaMea, setCerereaMea] = useState(null);
    const [profesorSelectat, setProfesorSelectat] = useState(null);
    const [mesaj, setMesaj] = useState('');
    const [titluLucrare, setTitluLucrare] = useState('');
    const [pasActiv, setPasActiv] = useState(2);
    const [fisier, setFisier] = useState(null);

    // Luam utilizatorul pentru a salva starea descarcarii in localStorage per student
    const utilizatorRaw = localStorage.getItem('utilizator');
    const utilizator = utilizatorRaw ? JSON.parse(utilizatorRaw) : null;

    const [cerereDescarcata, setCerereDescarcata] = useState(() => {
        const idUser = JSON.parse(localStorage.getItem('utilizator'))?.id;
        return localStorage.getItem(`cerere_descarcata_${idUser}`) === 'true';
    });

    const incarcaDateStudent = async () => {
        try {

            const [respSesiuni, respCereri] = await Promise.all([
                api.get('/sessions'),
                api.get('/requests/my-requests')
            ]);


            const cerereAprobata = respCereri.data.find(c => (c.status === 'aprobat' || c.status === 'finalizat' || c.status === 'semnat') && c.sesiune);
            const cerereRefuzata = respCereri.data.find(c => c.status === 'refuzat');
            const cerereInAsteptare = respCereri.data.find(c => c.status === 'waiting' && c.sesiune);

            if (cerereAprobata) {
                setCerereaMea(cerereAprobata); // Daca e aprobat, tinem doar obiectul pentru pasi urmatori
                if (cerereAprobata.status === 'semnat') {
                    setPasActiv(4);
                } else if (cerereAprobata.status === 'finalizat') {
                    setPasActiv(3);
                } else {
                    setPasActiv(3);
                }
            } else {
                // Altfel tinem lista tuturor cererilor (waiting sau refuzat)
                // si ramanem la pasul 2
                setCerereaMea(respCereri.data);
                setPasActiv(2);
            }


            const grupati = {};
            respSesiuni.data.forEach(s => {
                if (s.profesor) {
                    const idProf = s.profesorId;
                    if (!grupati[idProf]) {
                        grupati[idProf] = {
                            id: idProf,
                            nume: `${s.profesor.firstName} ${s.profesor.lastName}`,
                            sesiuni: []
                        };
                    }
                    grupati[idProf].sesiuni.push(s);
                }
            });
            setProfesori(Object.values(grupati));
        } catch (err) {
            console.error("Eroare la incarcare", err);
        }
    };

    useEffect(() => {
        incarcaDateStudent();
    }, []);

    const aplicaLaSesiune = async (idSesiune) => {
        if (!titluLucrare) return alert("Te rugam sa introduci titlul lucrarii.");
        if (!mesaj) return alert("Te rugam sa scrii un mesaj.");
        try {
            await api.post('/requests', {
                sesiuneId: idSesiune,
                message: mesaj,
                workTitle: titluLucrare
            });
            alert('Solicitare trimisa! Asteapta raspunsul profesorului.');
            incarcaDateStudent();
        } catch (err) {
            alert(err.response?.data?.error || 'Eroare la trimitere');
        }
    };

    const incarcaFisier = async () => {
        if (!fisier) return alert("Selecteaza un fisier mai intai.");
        try {
            const formData = new FormData();
            formData.append('document', fisier);
            await api.post(`/requests/${cerereaMea.id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Document incarcat cu succes!');
            incarcaDateStudent();
        } catch (err) {
            alert('Eroare la incarcarea fisierului.');
        }
    };

    const anuleazaCererea = async (idCerere) => {
        if (!window.confirm('Esti sigur ca vrei sa anulezi aceasta solicitare?')) return;
        try {
            await api.delete(`/requests/${idCerere}`);
            localStorage.removeItem(`cerere_descarcata_${utilizator?.id}`);
            alert('Solicitarea a fost anulata.');
            incarcaDateStudent();
        } catch (err) {
            alert('Eroare la anularea solicitarii.');
        }
    };

    const descarcaCerere = () => {
        if (cerereaMea?.files?.length > 0) {
            const ultimulFisier = cerereaMea.files[cerereaMea.files.length - 1];
            if (ultimulFisier?.filePath) {
                const baseURL = import.meta.env.VITE_API_URL
                    ? import.meta.env.VITE_API_URL.replace('/api', '')
                    : 'http://localhost:3000';

                window.open(`${baseURL}/${ultimulFisier.filePath.replace(/\\/g, '/')}`, '_blank');
                setCerereDescarcata(true);
                localStorage.setItem(`cerere_descarcata_${utilizator?.id}`, 'true');
            } else {
                alert('Fisierul nu are o cale valida.');
            }
        } else {
            alert('Nu exista niciun fisier asociat.');
        }
    };

    return (
        <div className="container-pagina">
            <div className="bara-progres">
                <div className="pas-progres completat">
                    <div className="cerc-pas">✓</div>
                    <div className="text-pas">
                        <span className="titlu-pas">Profil</span>
                        <span className="desc-pas">Completarea profilului</span>
                    </div>
                </div>

                <div className={`linie-pas ${pasActiv >= 2 ? 'completata' : ''}`}></div>

                <div className={`pas-progres ${pasActiv === 2 ? 'activ' : pasActiv > 2 ? 'completat' : ''}`}>
                    <div className="cerc-pas">{pasActiv > 2 ? '✓' : '2'}</div>
                    <div className="text-pas">
                        <span className="titlu-pas">Solicita o colaborare</span>
                        <span className="desc-pas">Alege-ti un coordonator</span>
                    </div>
                </div>

                <div className={`linie-pas ${pasActiv >= 3 ? 'completata' : ''}`}></div>

                <div className={`pas-progres ${pasActiv === 3 ? 'activ' : pasActiv > 3 ? 'completat' : ''}`}>
                    <div className="cerc-pas">{pasActiv > 3 ? '✓' : '3'}</div>
                    <div className="text-pas">
                        <span className="titlu-pas">Incarca cererea</span>
                        <span className="desc-pas">Cererea ta PDF</span>
                    </div>
                </div>

                <div className={`linie-pas ${pasActiv >= 4 ? 'completata' : ''}`}></div>

                <div className={`pas-progres ${pasActiv === 4 ? 'activ' : ''} ${cerereDescarcata ? 'completat' : ''}`}>
                    <div className="cerc-pas">{cerereDescarcata ? '✓' : '4'}</div>
                    <div className="text-pas">
                        <span className="titlu-pas">Descarca cererea</span>
                        <span className="desc-pas">Semnata de coordonator</span>
                    </div>
                </div>
            </div>

            {pasActiv === 2 && (
                <>
                    {/* Lista Cererilor Trimise */}
                    <div className="panou-alb" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px', alignItems: 'center' }}>
                            <div>
                                <h2 className="titlu-sectiune">Cererile mele trimise</h2>
                                {(!cerereaMea || (Array.isArray(cerereaMea) && cerereaMea.length === 0)) ? (
                                    <p style={{ color: 'var(--text-sters)' }}>Nu ai trimis nicio cerere inca.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {(Array.isArray(cerereaMea) ? cerereaMea : [cerereaMea]).map((cerere) => (
                                            <div key={cerere.id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: cerere.status === 'refuzat' ? '#fef2f2' : 'transparent' }}>
                                                <p style={{ color: cerere.status === 'refuzat' ? '#991b1b' : 'inherit' }}>
                                                    Ai trimis o solicitare catre <strong>{cerere.sesiune?.profesor?.firstName} {cerere.sesiune?.profesor?.lastName}</strong>.
                                                </p>
                                                {cerere.workTitle && (
                                                    <p style={{ marginTop: '5px' }}>Titlu lucrare: <strong>{cerere.workTitle}</strong></p>
                                                )}
                                                {cerere.status === 'refuzat' && cerere.rejectionReason && (
                                                    <p style={{ marginTop: '5px', color: '#ef4444' }}><strong>Motiv refuz:</strong> {cerere.rejectionReason}</p>
                                                )}
                                                <p style={{ color: 'var(--text-sters)', marginTop: '5px' }}>
                                                    Status: <strong style={{ color: cerere.status === 'refuzat' ? '#ef4444' : cerere.status === 'aprobat' ? '#22c55e' : 'var(--tema-albastru)' }}>
                                                        {cerere.status === 'waiting' ? 'IN ASTEPTARE' :
                                                            cerere.status === 'aprobat' ? 'APROBAT' :
                                                                cerere.status === 'refuzat' ? 'REFUZAT' :
                                                                    cerere.status === 'finalizat' ? 'ASTEAPTA SEMNATURA' :
                                                                        cerere.status === 'semnat' ? 'SEMNAT' : cerere.status.toUpperCase()}
                                                    </strong>
                                                </p>
                                                <button
                                                    onClick={() => anuleazaCererea(cerere.id)}
                                                    style={{
                                                        marginTop: '10px',
                                                        background: 'none',
                                                        border: '1px solid #ef4444',
                                                        color: '#ef4444',
                                                        padding: '5px 10px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    {cerere.status === 'refuzat' ? 'Sterge notificare' : 'Anuleaza solicitarea'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src="/student-illustration.jpg"
                                    alt="Ilustrație student"
                                    style={{ width: '100%', height: 'auto', maxWidth: '250px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Selector Profesori */}
                    <div className="panou-alb">
                        <h2 className="titlu-sectiune">Lista Profesori Disponibili</h2>
                        <p style={{ color: 'var(--text-sters)', marginBottom: '20px' }}>
                            Selecteaza un profesor din lista de mai jos pentru a vedea sesiunile active de inscriere.
                        </p>

                        <div className="grila-profesori">
                            {profesori.map(p => (
                                <div
                                    key={p.id}
                                    className={`card-profesor ${profesorSelectat?.id === p.id ? 'selectat' : ''}`}
                                    onClick={() => setProfesorSelectat(p)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                                >
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '2px' }}>{p.nume}</p>
                                        <span className="badge-locuri">{p.sesiuni.length} sesiuni disponibile</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {profesorSelectat && (
                            <div className="sub-lista-sesiuni">
                                <h3 style={{ marginBottom: '20px' }}>Sesiuni disponibile pentru {profesorSelectat.nume}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {profesorSelectat.sesiuni.map(s => (
                                        <div key={s.id} className="card-cerere" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                            <h4 style={{ color: 'var(--tema-indigo)', marginBottom: '8px' }}>{s.title}</h4>
                                            <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>{s.description}</p>

                                            <div className="rand-form">
                                                <label style={{ fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Titlul lucrarii propus</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Managementul sistemelor informatice..."
                                                    className="textarea-fain"
                                                    style={{ height: 'auto', padding: '12px' }}
                                                    value={titluLucrare}
                                                    onChange={e => setTitluLucrare(e.target.value)}
                                                />
                                            </div>

                                            <div className="rand-form" style={{ marginTop: '15px' }}>
                                                <label style={{ fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Mesaj pentru profesor</label>
                                                <textarea
                                                    placeholder="Scrie o scurta prezentare..."
                                                    className="textarea-fain"
                                                    value={mesaj}
                                                    onChange={e => setMesaj(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                                <span style={{ fontSize: '0.8rem', color: (s.nrAprobati || 0) >= s.maxStudents ? '#ef4444' : 'var(--text-sters)' }}>
                                                    Locuri disponibile: {s.maxStudents - (s.nrAprobati || 0)} din {s.maxStudents}
                                                    {(s.nrAprobati || 0) >= s.maxStudents && <strong> (EPUIZAT)</strong>}
                                                </span>
                                                <button
                                                    className="btn-accepta"
                                                    onClick={() => aplicaLaSesiune(s.id)}
                                                    disabled={(s.nrAprobati || 0) >= s.maxStudents}
                                                    style={(s.nrAprobati || 0) >= s.maxStudents ? { opacity: 0.5, cursor: 'not-allowed', background: '#64748b' } : {}}
                                                >
                                                    {(s.nrAprobati || 0) >= s.maxStudents ? 'Locuri Epuizate' : 'Solicita Inscriere'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {pasActiv === 3 && (
                <div className="panou-alb">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px', alignItems: 'center' }}>
                        <div>
                            <h2 className="titlu-sectiune">Pasul 3: Incarca documentul</h2>
                            {cerereaMea?.status === 'aprobat' ? (
                                <>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                                        {cerereaMea.rejectionReason ? (
                                            <span style={{ color: '#ef4444' }}><strong>Document refuzat:</strong> {cerereaMea.rejectionReason}. Te rugam sa incarci o varianta corectata.</span>
                                        ) : (
                                            <>Felicitari! Profesorul <strong>{cerereaMea.sesiune?.profesor?.firstName} {cerereaMea.sesiune?.profesor?.lastName}</strong> a acceptat solicitarea ta.</>
                                        )}
                                    </p>
                                    <p style={{ marginTop: '5px' }}>Titlu aprobat: <strong>{cerereaMea.workTitle}</strong></p>
                                    <div className="rand-form" style={{ marginTop: '20px' }}>
                                        <label>Selecteaza cererea de inscriere (PDF)</label>
                                        <input type="file" onChange={e => setFisier(e.target.files[0])} style={{ margin: '15px 0' }} />
                                        <button className="buton-intrare" onClick={incarcaFisier}>Trimite Cererea</button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <p style={{ fontSize: '1.2rem', color: '#3b82f6', fontWeight: '600' }}>Document trimis cu succes!</p>
                                    <p style={{ marginTop: '10px', color: 'var(--text-sters)' }}>In asteptare pana profesorul coordonator iti semneaza cererea</p>
                                    <div className="spinner-mic" style={{ margin: '20px auto' }}></div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                src="/student-illustration.jpg"
                                alt="Ilustrație student"
                                style={{ width: '100%', height: 'auto', maxWidth: '250px' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {pasActiv === 4 && (
                <div className="panou-alb">
                    {!cerereDescarcata ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px', alignItems: 'center' }}>
                            <div>
                                <h2 className="titlu-sectiune">Pasul 4: Descarca cererea semnata</h2>
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--tema-indigo)' }}>
                                    Cererea este semnata de catre profesorul coordonator.
                                </p>
                                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <p>Titlu definitiv: <strong>{cerereaMea?.workTitle}</strong></p>
                                    <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '10px' }}>
                                        * Din acest moment nu mai poti schimba titlul lucrarii tale.
                                    </p>
                                </div>
                                <button className="btn-accepta" style={{ marginTop: '20px' }} onClick={descarcaCerere}>
                                    Descarca cererea
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src="/student-illustration.jpg"
                                    alt="Ilustrație student"
                                    style={{ width: '100%', height: 'auto', maxWidth: '250px' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <div style={{ fontSize: '3rem', color: '#22c55e', marginBottom: '15px' }}>✓</div>
                            <h2 style={{ color: '#22c55e', marginBottom: '15px' }}>Proces Finalizat!</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Cererea a fost descarcata!</p>
                            <p style={{ fontSize: '1.1rem' }}>Ai finalizat procesul de inscriere la disertatie!</p>
                            <p style={{ fontWeight: 'bold', marginTop: '20px', fontSize: '1.2rem', color: 'var(--tema-indigo)' }}>Mult succes in continuare!</p>

                            {/* Ilustratie Final - Artistica */}
                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                                <svg width="220" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Confetti / Decor */}
                                    <circle cx="20" cy="40" r="3" fill="#fbbf24" style={{ animation: 'bounce 2s infinite' }} />
                                    <circle cx="180" cy="50" r="2" fill="#6366f1" style={{ animation: 'bounce 2.5s infinite' }} />
                                    <rect x="30" y="20" width="4" height="4" fill="#3b82f6" transform="rotate(45 30 20)" />
                                    <rect x="170" y="80" width="5" height="5" fill="#ef4444" transform="rotate(15 170 80)" />
                                    <path d="M10 100 L15 105" stroke="#22c55e" strokeWidth="2" />
                                    <path d="M190 30 L185 35" stroke="#f59e0b" strokeWidth="2" />

                                    {/* Diploma */}
                                    <rect x="120" y="100" width="60" height="50" rx="2" fill="#fefce8" stroke="#fefce8" strokeWidth="2" transform="rotate(-15 120 100)" />
                                    <rect x="125" y="105" width="50" height="40" rx="1" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="4 2" transform="rotate(-15 125 105)" />
                                    <circle cx="150" cy="125" r="8" fill="#ef4444" transform="rotate(-15 125 105)" />
                                    <path d="M150 125 L155 140 L145 140 Z" fill="#ef4444" transform="rotate(-15 125 105)" />

                                    {/* Toca Absolvire (Graduation Cap) - Detaliata */}
                                    {/* Baza Tocii */}
                                    <path d="M60 90 L140 90 L135 110 C135 110 100 115 65 110 L60 90 Z" fill="#312e81" />
                                    {/* Partea de sus (romb) */}
                                    <path d="M100 50 L160 80 L100 110 L40 80 Z" fill="#4338ca" stroke="#312e81" strokeWidth="2" />
                                    {/* Ciucure (Tassel) */}
                                    <circle cx="100" cy="80" r="4" fill="#fbbf24" />
                                    <path d="M100 80 L130 100" stroke="#fbbf24" strokeWidth="2" />
                                    <circle cx="130" cy="100" r="3" fill="#fbbf24" />
                                    <path d="M130 100 L130 125" stroke="#fbbf24" strokeWidth="3" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PanouStudent;
