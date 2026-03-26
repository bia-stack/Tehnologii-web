import { useNavigate, Link, useLocation } from 'react-router-dom';

//creaza bara de navigare
function BaraNavigare() {
    const navigare = useNavigate(); //creaza functia de navigare
    const locatie = useLocation(); //creaza locatia
    const utilizatorRaw = localStorage.getItem('utilizator'); //creaza utilizator
    const utilizator = utilizatorRaw ? JSON.parse(utilizatorRaw) : null;

    //creaza fucntia de delogare
    const iesireCont = () => {
        localStorage.clear();
        navigare('/login');
    };

    //verifica daca utilizatorul e logat
    if (!utilizator) return null;

    //returneaza bara de navigare
    return (
        <nav className="bara-sus">
            <div>
                {/* creaza linkul catre panoul principal */}
                <Link to={utilizator.role === 'profesor' ? '/panou-profesor' : '/panou-student'} className="logo-platforma">
                    PLATFORMA DISERTATIE
                </Link>

                <div className="meniu-nav">
                    <Link
                        to={utilizator.role === 'profesor' ? '/panou-profesor' : '/panou-student'}
                        className={`link-nav ${locatie.pathname.includes('panou') ? 'activ' : ''}`}
                    >
                        Panou principal
                    </Link>
                    {utilizator.role === 'student' && (
                        <Link
                            to="/ajutor"
                            className={`link-nav ${locatie.pathname === '/ajutor' ? 'activ' : ''}`}
                        >
                            Ajutor
                        </Link>
                    )}
                    {utilizator.role === 'profesor' && (
                        <Link
                            to="/ajutor-profesor"
                            className={`link-nav ${locatie.pathname === '/ajutor-profesor' ? 'activ' : ''}`}
                        >
                            Ajutor
                        </Link>
                    )}
                    {/* creaza linkul catre profilul utilizatorului */}
                    <Link
                        to="/profil"
                        className={`link-nav ${locatie.pathname === '/profil' ? 'activ' : ''}`}
                    >
                        Profilul meu
                    </Link>

                    {/* creaza butonul de delogare */}
                    <button className="buton-iesire" onClick={iesireCont}>
                        Iesire
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default BaraNavigare;
