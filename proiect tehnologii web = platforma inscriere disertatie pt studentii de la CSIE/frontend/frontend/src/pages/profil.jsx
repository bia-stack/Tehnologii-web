import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

//componenta care afiseaza profilul utilizatorului
function PaginaProfil() {
    const navigare = useNavigate(); //permite navigarea intre pagini
    const utilizatorRaw = localStorage.getItem('utilizator'); //iau utilizatorul din localStorage
    const [utilizator, setUtilizator] = useState(utilizatorRaw ? JSON.parse(utilizatorRaw) : null);

    const [anulInmatriculare, setAnulInmatriculare] = useState(utilizator?.matriculationYear || 2024);
    const [formaInvatamant, setFormaInvatamant] = useState(utilizator?.educationForm || 'IF');
    const [anStudiu, setAnStudiu] = useState(utilizator?.studyYear || 'An 2');
    const [specializare, setSpecializare] = useState(utilizator?.specialization || 'Baze de date');
    const [seIncarca, setSeIncarca] = useState(false);

    //functia pentru salvarea modificarilor
    const actualizeazaProfil = async () => {
        setSeIncarca(true);
        try {
            const response = await api.put('/auth/profile', {
                matriculationYear: anulInmatriculare || 2024,
                educationForm: formaInvatamant,
                studyYear: anStudiu,
                specialization: specializare
            });

            // Actualizam localStorage cu noile date
            localStorage.setItem('utilizator', JSON.stringify(response.data.user));
            setUtilizator(response.data.user);
            alert('Profil actualizat cu succes!');
        } catch (err) {
            alert(err.response?.data?.error || 'Eroare la actualizarea profilului');
        } finally {
            setSeIncarca(false);
        }
    };

    //daca nu exista niciun utilizator, nu afiseaza nimic
    if (!utilizator) return null;

    //daca exista un utilizator, afiseaza profilul
    return (
        <div className="container-pagina">
            <button
                onClick={() => navigare(-1)} //intoarce la pagina anterioara
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem', fontWeight: '600' }}
            >
                ← Inapoi la panou
            </button>

            <div className="panou-alb">
                <h2 className="titlu-sectiune">Profilul meu</h2>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '50px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                        <div className="rand-form">
                            <label>Nume utilizator</label>
                            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{utilizator.firstName} {utilizator.lastName}</p>
                        </div>

                        <div className="rand-form">
                            <label>Adresa de email</label>
                            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{utilizator.email}</p>
                        </div>

                        <div className="rand-form">
                            <label>Rol utilizator</label>
                            <p style={{ fontSize: '1.1rem', fontWeight: '500', textTransform: 'capitalize' }}>
                                {utilizator.role}
                            </p>
                        </div>

                        {utilizator.role === 'student' && (
                            <>
                                <div className="rand-form">
                                    <label>Anul inmatricularii</label>
                                    <input
                                        type="number"
                                        className="textarea-fain"
                                        style={{ height: 'auto', padding: '10px' }}
                                        value={anulInmatriculare}
                                        onChange={(e) => setAnulInmatriculare(e.target.value)}
                                        placeholder="Ex: 2023"
                                    />
                                </div>

                                <div className="rand-form">
                                    <label>Forma de invatamant</label>
                                    <select
                                        className="textarea-fain"
                                        style={{ height: 'auto', padding: '10px' }}
                                        value={formaInvatamant}
                                        onChange={(e) => setFormaInvatamant(e.target.value)}
                                    >
                                        <option value="IF">IF</option>
                                        <option value="ID">ID</option>
                                    </select>
                                </div>

                                <div className="rand-form">
                                    <label>An de studiu</label>
                                    <select
                                        className="textarea-fain"
                                        style={{ height: 'auto', padding: '10px' }}
                                        value={anStudiu}
                                        onChange={(e) => setAnStudiu(e.target.value)}
                                    >
                                        <option value="An 2">An 2</option>
                                        <option value="An suplimentar">An suplimentar</option>
                                    </select>
                                </div>

                                <div className="rand-form">
                                    <label>Specializare</label>
                                    <select
                                        className="textarea-fain"
                                        style={{ height: 'auto', padding: '10px' }}
                                        value={specializare}
                                        onChange={(e) => setSpecializare(e.target.value)}
                                    >
                                        <option value="Baze de date">Baze de date</option>
                                        <option value="Securitate Cibernetica">Securitate Cibernetica</option>
                                        <option value="Inteligenta artificiala">Inteligenta artificiala</option>
                                        <option value="Cercetare Info-eco">Cercetare Info-eco</option>
                                        <option value="Cibernetica si economie">Cibernetica si economie</option>
                                        <option value="E-business">E-business</option>
                                        <option value="Statistica aplicata si Data Science">Statistica aplicata si Data Science</option>
                                        <option value="Ingineria Datelor">Ingineria Datelor</option>
                                    </select>
                                </div>

                                <button
                                    className="buton-intrare"
                                    style={{ marginTop: '10px', width: 'fit-content', padding: '12px 30px' }}
                                    onClick={actualizeazaProfil}
                                    disabled={seIncarca}
                                >
                                    {seIncarca ? 'Se salveaza...' : 'Salveaza modificari'}
                                </button>
                            </>
                        )}
                    </div>

                    <div style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '3px solid var(--tema-indigo)',
                        flexShrink: 0,
                        background: '#fff',
                        marginTop: '25px'
                    }}>
                        <img
                            src={utilizator.role === 'profesor' ? "/prof-avatar.jpg" : "/student-avatar.jpg"}
                            alt={`Profil ${utilizator.firstName} ${utilizator.lastName}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaProfil;
