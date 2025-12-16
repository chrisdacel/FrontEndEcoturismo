# Guía de Integración API React + Laravel

## 1. Instalación de dependencias

```bash
cd "C:\Users\USUARIO\Documents\Archivos Estudio\Sena\2025\PROYECTO FORMATIVO\FrontEnd\FrontEndEcoturismo"
npm install axios
```

## 2. Configuración del archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto React:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## 3. Inicializar servicio API

En tu `main.jsx` o en el componente raíz (`App.jsx`), llama a `initializeCsrfToken()` una sola vez:

```jsx
import { initializeCsrfToken } from './services/api';

// Al inicio de la app (App.jsx o main.jsx)
useEffect(() => {
  initializeCsrfToken();
}, []);
```

## 4. Ejemplos de uso en componentes

### LoginPage.jsx

```jsx
import { useState } from 'react';
import { login, initializeCsrfToken } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await initializeCsrfToken(); // Obtener CSRF token
      const user = await login(email, password);
      console.log('Usuario logueado:', user);
      // Redirigir o actualizar estado global
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error en login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

### ColeccionPage.jsx (listar sitios)

```jsx
import { useEffect, useState } from 'react';
import { fetchPlaces } from '../services/api';

export default function ColeccionPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await fetchPlaces();
        setPlaces(data);
      } catch (err) {
        setError(err.message || 'Error cargando sitios');
      } finally {
        setLoading(false);
      }
    }
    loadPlaces();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="coleccion">
      <h1>Sitios Ecoturísticos</h1>
      <div className="grid">
        {places.map((place) => (
          <div key={place.id} className="card">
            <img src={`http://127.0.0.1:8000/storage/${place.cover}`} alt={place.name} />
            <h3>{place.name}</h3>
            <p>{place.slogan}</p>
            <a href={`/sitio/${place.id}`}>Ver detalles</a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### SitioPage.jsx (detalle con reseñas)

```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPlace, createReview, deleteReview, getCurrentUser } from '../services/api';

export default function SitioPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const { place: placeData, reviews: reviewsData } = await fetchPlace(id);
        setPlace(placeData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message || 'Error cargando sitio');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Debes estar logueado para dejar una reseña');
      return;
    }
    try {
      const newReview = await createReview(id, rating, comment);
      setReviews([newReview.review, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.message || 'Error creando reseña');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError(err.message || 'Error eliminando reseña');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!place) return <div>Sitio no encontrado</div>;

  return (
    <div className="sitio-detalle">
      <img src={`http://127.0.0.1:8000/storage/${place.cover}`} alt={place.name} />
      <h1>{place.name}</h1>
      <p className="slogan">{place.slogan}</p>
      <p className="descripcion">{place.description}</p>

      <section className="clima">
        <img src={`http://127.0.0.1:8000/storage/${place.Weather_img}`} alt="Clima" />
        <p>{place.Weather}</p>
      </section>

      <section className="reviews">
        <h2>Reseñas</h2>
        {user && (
          <form onSubmit={handleAddReview}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tu comentario..."
              required
              minLength="10"
              maxLength="1000"
            />
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="1">⭐ Malo</option>
              <option value="2">⭐⭐ Regular</option>
              <option value="3">⭐⭐⭐ Bueno</option>
              <option value="4">⭐⭐⭐⭐ Muy bueno</option>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
            </select>
            <button type="submit">Comentar</button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p>Sin reseñas aún</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p className="author">{review.user?.name}</p>
              <p className="rating">{'⭐'.repeat(review.rating)}</p>
              <p className="comment">{review.comment}</p>
              {user && (user.id === review.user_id || user.role === 'admin') && (
                <button onClick={() => handleDeleteReview(review.id)}>Eliminar</button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
```

### CrearSitioPage.jsx (solo operador)

```jsx
import { useState } from 'react';
import { createPlace } from '../services/api';

export default function CrearSitioPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    slogan: '',
    descripcion: '',
    localizacion: '',
    lat: '',
    lng: '',
    clima: '',
    caracteristicas: '',
    flora: '',
    infraestructura: '',
    recomendacion: '',
  });
  const [images, setImages] = useState({
    portada: null,
    clima_img: null,
    caracteristicas_img: null,
    flora_img: null,
    infraestructura_img: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages({
      ...images,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createPlace(
        formData,
        images.portada,
        images.clima_img,
        images.caracteristicas_img,
        images.flora_img,
        images.infraestructura_img
      );
      setSuccess('Sitio creado exitosamente');
      console.log('Nuevo sitio:', result);
      // Redirigir a gestión de sitios
      navigate('/gestion-sitios');
    } catch (err) {
      setError(err.message || 'Error creando sitio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crear-sitio">
      <h1>Crear Nuevo Sitio</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre del sitio"
        required
      />
      <input
        type="text"
        name="slogan"
        value={formData.slogan}
        onChange={handleChange}
        placeholder="Slogan"
        required
      />
      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción (mínimo 10 caracteres)"
        minLength="10"
        required
      />

      {/* Más campos... */}

      <input
        type="file"
        name="portada"
        onChange={handleImageChange}
        accept="image/*"
        required
      />
      <input
        type="file"
        name="clima_img"
        onChange={handleImageChange}
        accept="image/*"
        required
      />
      {/* Más imágenes... */}

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Sitio'}
      </button>
    </form>
  );
}
```

### PreferenciasPage.jsx

```jsx
import { useEffect, useState } from 'react';
import { fetchPreferencesOptions, fetchUserPreferences, updateUserPreferences } from '../services/api';

export default function PreferenciasPage() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPreferences() {
      try {
        const optionsData = await fetchPreferencesOptions();
        setOptions(optionsData);

        const userPrefs = await fetchUserPreferences();
        setSelected(userPrefs.map((p) => p.id));
      } catch (err) {
        setError(err.message || 'Error cargando preferencias');
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await updateUserPreferences(selected);
      alert('Preferencias guardadas');
    } catch (err) {
      setError(err.message || 'Error guardando preferencias');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="preferencias">
      <h1>Mis Preferencias</h1>
      {error && <div className="error">{error}</div>}

      <div className="opciones">
        {options.map((pref) => (
          <label key={pref.id}>
            <input
              type="checkbox"
              checked={selected.includes(pref.id)}
              onChange={() => handleToggle(pref.id)}
            />
            <span>{pref.name}</span>
          </label>
        ))}
      </div>

      <button onClick={handleSave}>Guardar Preferencias</button>
    </div>
  );
}
```

## 5. Contexto Global (Autenticación recomendado)

Para manejar mejor la autenticación, crea un contexto:

```jsx
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

Usa en `App.jsx`:

```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Rutas */}
    </AuthProvider>
  );
}
```

## 6. Instrucciones para ejecutar

**Backend:**
```bash
cd "C:\Users\USUARIO\Documents\Archivos Estudio\Sena\2025\PROYECTO FORMATIVO\BackEnd\Conexion-EcoRisaralda"
php artisan serve
```

**Frontend:**
```bash
cd "C:\Users\USUARIO\Documents\Archivos Estudio\Sena\2025\PROYECTO FORMATIVO\FrontEnd\FrontEndEcoturismo"
npm run dev
```

## 7. Errores comunes

- **CORS error**: Asegúrate de que el backend está en `http://127.0.0.1:8000` y `config/cors.php` permite los orígenes.
- **401 No autorizado**: Ejecuta `initializeCsrfToken()` y verifica que estés logueado.
- **404 No encontrado**: Verifica que el ID del sitio existe.
- **Imágenes no se muestran**: Las imágenes están en `/storage/` del backend, accédelas así:
  ```
  http://127.0.0.1:8000/storage/{ruta_imagen}
  ```

## 8. Endpoints disponibles

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/places` | No | Listar sitios |
| GET | `/api/places/{id}` | No | Detalle del sitio |
| POST | `/api/register` | No | Registrar usuario |
| POST | `/api/login` | No | Iniciar sesión |
| POST | `/api/logout` | Sí | Cerrar sesión |
| GET | `/api/user` | Sí | Usuario actual |
| GET | `/api/preferences` | No | Catálogo de preferencias |
| GET | `/api/user/preferences` | Sí | Preferencias del usuario |
| POST | `/api/user/preferences` | Sí | Actualizar preferencias |
| POST | `/api/places` | Sí* | Crear sitio (operador) |
| PUT | `/api/places/{id}` | Sí* | Editar sitio (propietario) |
| DELETE | `/api/places/{id}` | Sí* | Eliminar sitio (propietario) |
| GET | `/api/user-places` | Sí* | Mis sitios (operador) |
| POST | `/api/places/{id}/reviews` | Sí | Crear reseña |
| DELETE | `/api/reviews/{id}` | Sí | Eliminar reseña (propietario) |

*Requiere rol `operator` o `admin`
