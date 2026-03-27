import { useNavigate } from 'react-router-dom';

function PaginaAjutorProfesor() {
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
                <h2 className="titlu-sectiune">Ghid de utilizare - Profesor</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 1: Crearea sesiunii</h3>
                            <p>Acceseaza sectiunea <strong>"Creaza o noua sesiune"</strong> din panoul principal. Completeaza <strong>"Titlu sesiune"</strong>, <strong>"Descriere"</strong>, <strong>"Data de inceput"</strong>, <strong>"Data de sfarsit"</strong> si <strong>"Numar maxim de studenti"</strong>. Apasa pe butonul <strong>"Creaza sesiune"</strong> pentru a o activa.</p>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 2: Gestionarea cererilor</h3>
                            <p>In sectiunea <strong>"Cereri noi"</strong> poti vizualiza toate solicitarile primite de la studenti. Pentru fiecare cerere poti:</p>
                            <ul style={{ marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong style={{ color: '#22c55e' }}>Accepta:</strong> Aproba cererea studentului si il muti la pasul urmator.</li>
                                <li><strong style={{ color: '#ef4444' }}>Refuza:</strong> Respinge cererea cu un motiv obligatoriu.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 3: Verificarea documentelor</h3>
                            <p>Dupa ce un student incarca documentul PDF, acesta apare in sectiunea <strong>"Cereri aprobate"</strong>. Poti:</p>
                            <ul style={{ marginLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li><strong>Descarca cererea:</strong> Vizualizeaza documentul trimis de student.</li>
                                <li><strong>Refuza documentul:</strong> Daca documentul este gresit, il poti respinge cu un motiv.</li>
                                <li><strong>Incarca raspuns semnat:</strong> Incarca documentul semnat in format PDF.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 style={{ color: 'var(--tema-indigo)', marginBottom: '10px' }}>Pasul 4: Finalizarea procesului</h3>
                            <p>Odata ce ai incarcat documentul semnat, cererea trece in statusul <strong>SEMNAT</strong>. Studentul va putea descarca documentul final si procesul este complet.</p>
                        </section>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ marginBottom: '15px', color: '#1e3a8a' }}>Informatii utile</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem' }}>
                            <li>Verifica numarul de locuri disponibile inainte de a accepta o cerere.</li>
                            <li>Motivul refuzului este vizibil pentru student.</li>
                            <li>Documentele semnate trebuie sa fie in format PDF.</li>
                        </ul>
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <img src="/prof-guide.jpg" alt="Ajutor" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaAjutorProfesor;
