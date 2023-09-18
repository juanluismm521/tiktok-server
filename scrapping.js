const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require('cors'); // Importa cors

const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

// Habilita CORS para todas las rutas
app.use(cors());

// Ruta para extraer el src de la imagen
app.get("/imagen/:perfil", async (req, res) => {
  try {
    const perfil = req.params.perfil; // Obtenemos el valor del parámetro
    const url = `https://tiktok.com/@${perfil}`; // Modificamos la URL con el parámetro

    // Realiza una solicitud GET a la página
    const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36',
        },
      });
      

      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
  
      // Busca el elemento con data-e2e="user-avatar"
      const userAvatarElement = $('[data-e2e="user-avatar"]');

      if (userAvatarElement.length > 0) {
        // Dentro del elemento encontrado, busca la etiqueta <img>
        const imgElement = userAvatarElement.find('img');

        // Obtiene el atributo 'src' de la imagen
        const src = imgElement.attr('src');

        if (src) {
          res.json({ src });
          } else {
            res.status(404).json({ error: 'No se encontró el atributo src de la imagen' });
          }
        } else {
          res.status(404).json({ error: 'No se encontró la imagen' });
        }
      } else {
        res.status(500).json({ error: 'Error al acceder a la página' });
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:');
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
