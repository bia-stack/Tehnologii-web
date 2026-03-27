import { useNavigate } from 'react-router-dom';

function PaginaAjutor() {
    const navigare = useNavigate();

    return (
        <div className="container-pagina">
            <button
                onClick={() => navigare(-1)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '1rem',
                    fontWeight: '600'
                }}
            >
                ← Inapoi
            </button>

            <div className="panou-alb">
                <h2 className="titlu-sectiune">Ghid de utilizare - Student</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 1: Profil</h3>
                            <p>Dupa inscrirea cu contul institutional, verifica datele tale in sectiunea <strong>"Profilul meu"</strong>. Asigura-te ca datele sunt corecte inainte de a incepe procesul de inscriere.</p>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 2: Solicita o colaborare</h3>
                            <p>Acceseaza sectiunea <strong>"Lista Profesori Disponibili"</strong>. Selecteaza un coordonator pentru a vedea sesiunile active. Completeaza <strong>"Titlul lucrarii propus"</strong> si <strong>"Mesaj pentru profesor"</strong>, apoi apasa butonul <strong>"Solicita Inscriere"</strong>.</p>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Cererile mele trimise</h3>
                            <p>In aceasta sectiune poti urmari statusul solicitarilor tale:</p>
                            <ul style={{ marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong style={{ color: 'var(--tema-albastru)' }}>IN ASTEPTARE:</strong> Profesorul inca nu a procesat cererea.</li>
                                <li><strong style={{ color: '#22c55e' }}>APROBAT:</strong> Ai fost acceptat si poti trece la pasul urmator.</li>
                                <li><strong style={{ color: '#ef4444' }}>REFUZAT:</strong> Solicitarea a fost respinsa (poti vedea motivul refuzului).</li>
                            </ul>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 3: Incarca documentul</h3>
                            <p>Dupa ce esti <strong>APROBAT</strong>, trebuie sa apesi butonul <strong>"Selecteaza cererea de inscriere (PDF)"</strong> si sa completezi cateva detalii despre lucrarea ta <strong>"Trimite Cererea"</strong>. Daca profesorul trimite un <strong>"Document refuzat"</strong>, va trebui sa incarci o varianta corectata.</p>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 4: Descarca cererea semnata</h3>
                            <p>Cand statusul devine <strong>SEMNAT</strong>, poti apasa pe butonul <strong>"Descarca cererea"</strong>. Acesta este ultimul pas al procesului de inscriere.</p>
                        </section>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ marginBottom: '15px', color: '#1e3a8a' }}>Informatii utile</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem' }}>
                            <li>Verifica sectiunea <strong>"Locuri disponibile"</strong> inainte de a trimite o solicitare.</li>
                            <li>Poti folosi butonul <strong>"Anuleaza solicitarea"</strong> daca doresti sa retragi o cerere aflata in asteptare.</li>
                            <li>Asigura-te ca fisierul incarcat este format PDF.</li>
                        </ul>
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <img src="/guide-books.png" alt="Ajutor" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaAjutor;
