import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PaginaLogare from './pages/login';
import PanouProfesor from './pages/panou-profesor';
import PanouStudent from './pages/panou_student';
import PaginaProfil from './pages/profil';
import BaraNavigare from './components/baraNavigare';

import PaginaAjutor from './pages/ajutor';
import PaginaAjutorProfesor from './pages/ajutor-profesor';

//asigura ca paginile importate(cele de deasupra)nu pot fi accesate de cineva care nu s-a logat
const ProtectieRuta = ({ children }) => {
  //verifica daca exista un token generat pentru fiecare util si se salveaza in browser
  const logat = localStorage.getItem('token');
  //daca nu esti logat te da afara si te intoarce la pagina de login
  return logat ? children : <Navigate to="/login" />;
};

//gestioneaza structura paginii si decide daca afiseaza sau nu elementele de ex. meniu
const LayoutAplicatie = ({ children }) => {
  const locatie = useLocation();//afla adresa url la care utilizatorul se afla
  const esteLogare = locatie.pathname === '/login'; //verifica daca util este pe pagina de login

  return (
    <>
      {/*afiseaza bara de navigare doar daca util nu este pe pagina de login */}
      {!esteLogare && <BaraNavigare />}
      {/* aici este afisat continutul fiecarei pagini*/}
      {children}
    </>
  );
};

//componenta principala care organizeaza structura aplicatiei
function App() {
  return (
    <Router> {/* porneste sist de nav al aplicatiei si monitorizeaza url-ul */}
      <LayoutAplicatie> {/* organizeaza structura paginii si afiseaza meniul*/}
        <Routes> {/*lista paginilor */}
          {/*pagina de login */}
          <Route path="/login" element={<div className="container-centrat"><PaginaLogare /></div>} />

          {/*Pagina student protejata */}
          <Route path="/panou-student" element={
            <ProtectieRuta>
              <PanouStudent />
            </ProtectieRuta>
          } />

          {/*Pagina profesorului protejata */}
          <Route path="/panou-profesor" element={
            <ProtectieRuta>
              <PanouProfesor />
            </ProtectieRuta>
          } />

          {/*Pagina de profil protejata */}
          <Route path="/profil" element={
            <ProtectieRuta>
              <PaginaProfil />
            </ProtectieRuta>
          } />

          {/*Pagina de ajutor protejata */}
          <Route path="/ajutor" element={
            <ProtectieRuta>
              <PaginaAjutor />
            </ProtectieRuta>
          } />

          {/*Pagina de ajutor pentru profesori */}
          <Route path="/ajutor-profesor" element={
            <ProtectieRuta>
              <PaginaAjutorProfesor />
            </ProtectieRuta>
          } />

          {/* daca util scrie o adresa de email gresita,il trimite la login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </LayoutAplicatie>
    </Router>
  );
}

//exporteaza componenta App
export default App;
