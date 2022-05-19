import './style.css';
import Vibrant = require('node-vibrant');
import TmdbApi = require('tmdb-typescript-api');
import { Palette, Swatch } from 'node-vibrant/lib/color';

type SwatchPalette =
  | 'DarkMuted'
  | 'DarkVibrant'
  | 'LightMuted'
  | 'LightVibrant'
  | 'Muted'
  | 'Vibrant';

// const imgURL = 'https://robohash.org/FBG.png?set=set4&size=150x150';
// const inputURL = document.getElementById('inputURL') as HTMLInputElement;
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<p>Material Palette Colors</p>`;
appDiv.style.backgroundColor = 'white';

const container: HTMLElement = document.getElementById('container');
const paleteColors: HTMLElement = document.getElementById('PaleteColors');
const header: HTMLElement = document.getElementById('Header');
const subheader: HTMLElement = document.getElementById('Subheader');

const URL_IMAGE = 'https://image.tmdb.org/t/p/w500';
const API_MOVIES: TmdbApi.TmdbApi = new TmdbApi.TmdbApi(
  '5f3a6c8f58f5aa4231c3724fe54e387d',
  'es-mx'
);

API_MOVIES.search.tvshows('Dark').subscribe((response) => {
  if (response.total_results > 0) {
    setDataMovie(response.results[0]);
  } else {
    header.innerText = 'Sin resultados';
    subheader.innerText = '';
  }
});

const setDataMovie = async (data) => {
  const { title, name, overview, poster_path, backdrop_path } = data;
  setTitle(title || name);
  setDescription(overview);
  setBackgroundImage(backdrop_path || poster_path);
  setPosterImage(poster_path);

  const palette = await getColors(poster_path);

  setColorsToElement(palette, 'DarkVibrant');
  setPaletteElements(palette);
};

const setTitle = (title: string) => (header.innerText = title);

const setDescription = (description: string) =>
  (subheader.innerText = description);

const setBackgroundImage = (bgImage) => {
  document.body.style.backgroundImage = `url(${URL_IMAGE}${bgImage})`;
  document.body.style.backgroundSize = 'contain';
  document.body.style.backgroundRepeat = 'no-repeat';
};

const setPosterImage = (posterImage) => {
  const imageView = document.getElementsByTagName('img')[0];
  imageView.setAttribute('src', `${URL_IMAGE}${posterImage}`);
};

const getColors = async (image: string): Promise<Palette> => {
  const url = `${URL_IMAGE}${image}`;
  return await Vibrant.from(url).getPalette();
};

const setColorsToElement = (palette: Palette, swatchPalette: SwatchPalette) => {
  const swatch: Swatch = palette[swatchPalette];

  container.style.border = 'solid rgba(0,0,0,0.1) 1px';
  container.style.backgroundColor = swatch.getHex();

  header.style.color = swatch.getTitleTextColor();
  subheader.style.color = swatch.getBodyTextColor();

  appDiv.style.background = swatch.getHex();
  appDiv.style.color = swatch.getTitleTextColor();

  paleteColors.style.background = swatch.getHex();

  document.body.style.backgroundColor = palette['DarkMuted'].getHex();
};

const setPaletteElements = (palette: Palette) => {
  paleteColors.innerHTML = null;
  Object.entries(palette).forEach(([key, value]: [string, Swatch]) => {
    const div = document.createElement('div');
    div.classList.add('swatch');
    div.style.background = value.getHex();

    const p1 = document.createElement('p');
    p1.classList.add('title');
    p1.innerText = `${key}`;
    p1.style.color = value.getTitleTextColor();

    const p2 = document.createElement('p');
    p2.innerText = `Body text`;
    p2.style.color = value.getBodyTextColor();

    div.append(p1, p2);

    paleteColors.append(div);
  });
};

const toDataURL = (url, callback) => {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };

  xhr.onerror = function (err) {
    console.log(err.target);
  };

  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};
