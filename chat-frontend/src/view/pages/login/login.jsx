import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import api from '../../../services/api';
import '../login/login.css';

function Login() {
  const [users, setUsers] = useState([]);
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);


  useEffect(() => {
    api.get('/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('/login', {
      username: nom,
      email: mail,
      password: password,
    })
      .then((res) => {
        setUsers([...users, res.data]);
        setNom('');
        setMail('');
        setPassword('');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("upload un fichier de ses morts");

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:3000/images/upload', formData);
      alert('Image envoyée ! URL : ' + res.data.url);
      setFile(null); // reset input si tu veux
      fetchImages(); // recharge les images après upload
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    }
  };

  const fetchImages = () => {
    axios.get('http://localhost:3000/images/')
      .then((res) => {
        setImages(res.data);
      })
      .catch((err) => {
        console.error('❌ Erreur lors du chargement des images :', err);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className='login'>
      <div>
        <h1>Log toi</h1>
        <h2>Je me log</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom :
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
          <input type="submit" value="Envoyer" />
        </form>
      </div>

      <div className='jesuislog'>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleDelete(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      </div>

      <div className='uploadimages'>
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
      </div>
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
