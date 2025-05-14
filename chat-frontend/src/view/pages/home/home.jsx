import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../../services/api';

function Home() {
  const [users, setUsers] = useState([]);
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    console.log(name, email);
    if (name === null || email === null) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    api.get('/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // Fonction pour envoyer un nouvel utilisateur
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche la page de se recharger

    // Envoi des données au serveur
    api.post('/users', {
      name: nom,
      email: mail
    })
      .then((res) => {
        // Mettre à jour la liste des utilisateurs avec le nouvel utilisateur
        setUsers([...users, res.data]);
        setNom(''); // Réinitialiser le champ nom
        setMail(''); // Réinitialiser le champ mail
      })
      .catch((err) => {
        console.error(err);
      });
  };


  // Fonction pour supprimer un utilisateur
  const handleDelete = (id) => {
    api.delete(`/users/${id}`)
      .then((res) => {
        // Supprime l'utilisateur de la liste
        setUsers(users.filter(user => user.id !== id));
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err); 
      });
  };

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleDelete(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h1>Ajouter un utilisateur</h1>
      <button onClick={() => navigate('/login')}>Login</button>
      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input type="text" name="name" value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
        <label>
          Mail :
          <input type="email" name="mail" value={mail} onChange={(e) => setMail(e.target.value)} />
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    </div>
  );
}

export default Home;
