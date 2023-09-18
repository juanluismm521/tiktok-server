const express = require("express");
const puppeteer = require("puppeteer");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get("/imagen/:perfil", async (req, res) => {
  try {
    const perfil = req.params.perfil;
    const url = `https://tiktok.com/@${perfil}`;

    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36');
    await page.goto(url);

    const imageSrc = await page.evaluate(() => {
      const avatarElement = document.querySelector('[data-e2e="user-avatar"]');
      if (avatarElement) {
        const imgElement = avatarElement.querySelector('img');
        if (imgElement) {
          return imgElement.src;
        }
      }
      return null;
    });

    await browser.close();

    if (imageSrc) {
      res.json({ src: imageSrc });
    } else {
      res.status(404).json({ error: 'No se encontró la imagen' });
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});