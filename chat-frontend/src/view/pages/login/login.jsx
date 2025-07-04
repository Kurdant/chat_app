import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../../services/api';
import '../login/login.css';

function Login() {
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const [mail2, setMail2] = useState(''); 
  const [password2, setPassword2] = useState('');


  const handleSubmitSignup = async (e) => {
    e.preventDefault();
  
    console.log("🟡 Envoi des données au backend...");

    try{
      const res = await axios.post('http://localhost:3000/signup', {
        username: nom,
        email: mail,
        password: password,
      })
      console.log("🟢 Réponse reçue :", res);
      if (res.status >= 200 && res.status < 300) {
        alert("Bravo ça a fonctionné");
      }
  }
  catch(err) {
      console.error("❌ Erreur avec l'inscription :", err);
      alert("Erreur : " + (err.response?.data?.error || err.message));
    }
  }

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await api.post(`/login`, {
        email: mail2,
        password: password2,
      });
  
      if (res.status === 200 && res.data.token) {
        console.log(res.data.user.username);
  
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('email', res.data.user.email);
  
        navigate('/chat');
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
    }
  };
  
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const deconnexion = (e) => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
  }

  // const handleUpload = async () => {
  //   if (!file) return alert("upload un fichier de ses morts");

    // const formData = new FormData();
    // formData.append('image', file);

  //   try {
  //     const res = await axios.post('http://localhost:3000/images/upload', formData);
  //     setFile(null);
  //     fetchImages();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Erreur lors de l'upload");
  //   }
  // };

  // const handleDelete = (id) => {
  //   axios.delete(`http://localhost:3000/users/${id}`)
  //     .then((res) => {
  //       setUsers(users.filter(user => user.id !== id))
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //     })
  // }

  // const fetchImages = () => {
  //   axios.get('http://localhost:3000/images/')
  //     .then((res) => {
  //       setImages(res.data);
  //     })
  //     .catch((err) => {
  //       console.error('❌ Erreur lors du chargement des images :', err);
  //     });
  // };

  // useEffect(() => {
  //   fetchImages();
  // }, []);



  return (
    <div className='loginSignupParent'>
      <h1>Nom Provisoire</h1>
      <div className='loginSignupEnfant'>
        {/* LOGIN */}
        <div className='login'>
          <h2>Connexion</h2>
          <form onSubmit={handleSubmitLogin}>
            <label>
              Mail :
              <input type="email" name="mail2" value={mail2} onChange={(e) => setMail2(e.target.value)} />
            </label>
            <label>
              Password :
              <input type="password" name="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            </label>
            <input type="submit" value="Envoyer" />
          </form>
          <button onClick={deconnexion}>Deconnexion</button>
        </div>
        {/* SIGNUP */}
        <div className='signup'>
          <h2>Inscription</h2>
          <form onSubmit={handleSubmitSignup}>
            <label>
              Username :
              <input type="text" name="name" value={nom} onChange={(e) => setNom(e.target.value)} />
            </label>
            <label>
              Mail :
              <input type="email" name="mail" value={mail} onChange={(e) => setMail(e.target.value)} />
            </label>
            <label>
              Password :
              <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <input type="submit" value="Envoyer" className='submitButton' />
          </form>
          <button onClick={() => {
            setNom('');
            setMail('');
            setPassword('');
          }}>Vider manuellement</button>

        </div>
      </div>
      {/* LISTE USERS */}
      {/* <div className='jesuislog'>
        <h1>Liste des utilisateurs</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} - {user.email}
              <button onClick={() => handleDelete(user.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div> */}

      {/* IMAGES */}
      {/* <div className='uploadimages'>
        <h1>Rajouter une image</h1>
        <p>rajoute une image maintenant</p>
        <input type="file" onChange={handleChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className='gallerieimage'>
        <h1>la gallerie</h1>
        <p>de belles images que voici</p>
        <div className="gallery" style={styles.gallery}>
          {images.map((img) => (
            <img
              key={img.filename}
              src={`http://localhost:3000${img.url}`}
              alt={img.filename}
              style={styles.image}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
}

const styles = {
  gallery: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '20px',
  },
  image: {
    width: '200px',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    objectFit: 'cover',
  },
};

export default Login;
