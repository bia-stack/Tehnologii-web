import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

//pagina de logare a utilizatorilui
function PaginaLogare() {
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [seIncarca, seteazaIncarcare] = useState(false);
    const navigare = useNavigate();

    //functia de logare
    const intraInCont = async (e) => {
        e.preventDefault();
        seteazaIncarcare(true);
        try {
            const raspuns = await api.post('/auth/login', { email, password: parola });
            localStorage.setItem('token', raspuns.data.token); //salveaza tokenul in local storage
            localStorage.setItem('utilizator', JSON.stringify(raspuns.data.user)); //salveaza utilizatorul in local storage

            const rol = raspuns.data.user.role;
            navigare(rol === 'profesor' ? '/panou-profesor' : '/panou-student'); //redirectioneaza utilizatorul in panoul aferent rolului
        } catch (eroare) {
            console.error(eroare);
            const mesajEroare = eroare.response?.data?.error || 'A aparut o eroare la conexiune';
            alert(mesajEroare);
        } finally {
            seteazaIncarcare(false);
        }
    };

    //returneaza pagina de logare
    return (
        <div className="cutie-acces">
            <form className="zona-inputuri" onSubmit={intraInCont}>
                <div className="rand-form">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="rand-form">
                    <label>Parola</label>
                    <input type="password" value={parola} onChange={e => setParola(e.target.value)} required />
                </div>
                <button className="buton-intrare" disabled={seIncarca}>
                    {seIncarca ? 'Se trimite...' : 'Logare'}
                </button>
            </form>
        </div>
    );
}

export default PaginaLogare;
