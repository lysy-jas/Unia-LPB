/* =========================================================
   Unia ŁPB – skrypt strony
   Pobiera postulaty z "postulaty.json"
   i kandydatów z "kandydaci.json", a potem pokazuje je na stronie.
   Tego pliku nie musisz zmieniać, żeby edytować treść.
   ========================================================= */

const IKONA_GWIAZDKI =
  '<svg viewBox="-20 -20 40 40" aria-hidden="true" focusable="false">' +
  '<polygon points="0,-18 4.11,-5.66 17.12,-5.56 6.66,2.16 10.58,14.56 0,7 -10.58,14.56 -6.66,2.16 -17.12,-5.56 -4.11,-5.66"/>' +
  "</svg>";

/* Pobiera plik JSON i zwraca jego zawartość */
async function wczytajJson(adres) {
  const odpowiedz = await fetch(adres);
  if (!odpowiedz.ok) {
    throw new Error("Nie udało się pobrać pliku " + adres);
  }
  return odpowiedz.json();
}

/* Pokazuje komunikat, gdy coś pójdzie nie tak */
function pokazBlad(kontener, tekst) {
  kontener.innerHTML = "";
  const p = document.createElement("p");
  p.className = "status status--error";
  p.textContent = tekst;
  kontener.appendChild(p);
}

/* Delikatne pojawianie się kart przy przewijaniu */
function obserwujKarty(kontener) {
  const karty = kontener.querySelectorAll(".card");

  if (!("IntersectionObserver" in window)) {
    return; // starsze przeglądarki: karty po prostu są widoczne
  }

  const obserwator = new IntersectionObserver(
    (wpisy) => {
      wpisy.forEach((wpis) => {
        if (wpis.isIntersecting) {
          wpis.target.classList.add("is-visible");
          obserwator.unobserve(wpis.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  karty.forEach((karta) => {
    karta.classList.add("reveal");
    obserwator.observe(karta);
  });
}

/* ---------- Postulaty ---------- */

async function pokazPostulaty() {
  const kontener = document.getElementById("lista-postulatow");

  try {
    const postulaty = await wczytajJson("postulaty.json");
    kontener.innerHTML = "";

    postulaty.forEach((postulat) => {
      const karta = document.createElement("article");
      karta.className = "card";

      const ikona = document.createElement("div");
      ikona.className = "card__icon";
      ikona.innerHTML = IKONA_GWIAZDKI;

      const tytul = document.createElement("h3");
      tytul.className = "card__title";
      tytul.textContent = postulat.tytul;

      const opis = document.createElement("p");
      opis.className = "card__text";
      opis.textContent = postulat.opis;

      karta.append(ikona, tytul, opis);
      kontener.appendChild(karta);
    });

    obserwujKarty(kontener);
  } catch (blad) {
    console.error(blad);
    pokazBlad(
      kontener,
      "Nie udało się wczytać postulatów. Jeśli otwierasz stronę prosto z komputera, uruchom ją przez GitHub Pages albo przez lokalny serwer."
    );
  }
}

/* ---------- Kandydaci ---------- */

async function pokazKandydatow() {
  const kontener = document.getElementById("lista-kandydatow");

  try {
    const kandydaci = await wczytajJson("kandydaci.json");
    kontener.innerHTML = "";

    kandydaci.forEach((osoba) => {
      const karta = document.createElement("article");
      karta.className = "card card--person";

      const inicjaly = (osoba.imie.charAt(0) + osoba.nazwisko.charAt(0)).toUpperCase();

      const awatar = document.createElement("div");
      awatar.className = "avatar";
      awatar.setAttribute("aria-hidden", "true");
      awatar.textContent = inicjaly;

      const dane = document.createElement("div");

      const imieNazwisko = document.createElement("h3");
      imieNazwisko.className = "person__name";
      imieNazwisko.textContent = osoba.imie + " " + osoba.nazwisko;

      const klasa = document.createElement("span");
      klasa.className = "person__class";
      klasa.textContent = "klasa " + osoba.klasa;

      dane.append(imieNazwisko, klasa);
      karta.append(awatar, dane);
      kontener.appendChild(karta);
    });

    obserwujKarty(kontener);
  } catch (blad) {
    console.error(blad);
    pokazBlad(
      kontener,
      "Nie udało się wczytać listy kandydatów. Jeśli otwierasz stronę prosto z komputera, uruchom ją przez GitHub Pages albo przez lokalny serwer."
    );
  }
}

pokazPostulaty();
pokazKandydatow();
