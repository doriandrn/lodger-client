# Lodger

Lodger este cea mai simplistă și ușor de utilizat aplicație pentru administrarea imobilelor, menită să vină în ajutorul oricui dorește a deveni / este administrator de asociații de locatari / proprietari;

Aplicația este complet transparentă din punct de vedere financiar tuturor utilizatorilor, este extrem de ușor de folosit, foarte intuitivă, accesibilă (Link to inclusive design). Atât aplicația cât și utilizarea acesteia nu vor fi niciodată taxate.

<!-- (DE CE: un studiu ne arată că aplicațiile de genul, în general tind să fie complexe d.p.d.v. al experienței oferite utilizatorului, de multe ori acestuia fiindu-i foarte greu să se acomodeze și să folosească aplicația) -->

Aplicația, de asemeni, oferă un mod eficient de a comunica cu locatarii și de a le înțelege mai bine nevoile și îngrijorările acestora.

Din punct de vedere tehnologic, Lodger se manifestă ca o aplicație web progresivă (PWA). [Citește mai multe despre asta...](https://developers.google.com/web/progressive-web-apps/)
cu următoarele specificații:
- Offline First - Funcționează în totalitate fără acces la internet.
- Mobile First
- Cross-device
- Bază de date reactivă

## Cum poți contribui!

Lodger este un proiect de tip open-source, licențiat sub MIT. [Vezi licența](./LICENSE).
Te rugăm să consulți [codul nostru de conduită](./COD_DE_CONDUITĂ.md) înainte de a contribui.


### Administratori, Președinți, Comitete de asociații

Încercarea noastră este una de a oferi un software calitativ și extrem  de intuitiv, cât mai adecvat administratorilor, acest lucru fiind imposibil fără ajutorul vostru.

Câteva dintre lucrurile care ne-ar putea ajuta:


### Programatori

Lodger folosește un stack modern atât pe backend cât și pe frontend.
Limbajele principale folosite sunt: JavaScript + TypeScript (acestea combinate, ne vor permite compilarea in WASM pe viitor). Native love.

Te invităm să te alături acestui proiect! Oricine este binevenit și încurajat să participe în orice părticică a proiectului.


## Contribuitori

Acest loc este rezervat celor ce doresc să ne ajute / să contribuie la dezvoltarea aplicației.


## Pentru dezvoltatori

### Unde suntem și unde vrem să ajungem?

Procesul ales ne reprezintă

- [x] Studii îndetaliate despre munca administratorului
- [] Ultimele iterații / validarea prototipului.


### De ce facem asta?

- din pasiunea noastră pentru tehnologie & cod;
- din dorința de a învăța să dezovoltăm o aplicație bazată pe o arhitectură complexă folosind tehnologii noi / inovative, de a evolua profesional ca dezvoltatori
- avem oportunitatea de a-i scăpa pe administratori de overehad-ul de zi cu zi folsind aplicații greu de utilizat sau facând mii de calcule.

Credem în simplitate și este principalul lucru de care ținem cont când definim experiența pe care vrem s-o oferim utilizatorului (administratorului / locatarului).


### Stack-ul

*Backend:* serverless - Graph.cool + Algolia + Mailgun + Auth0 + altele

*Frontend:* [Nuxt.js](https://github.com/nuxt/nuxt.js) (bazat pe VueJs si NodeJs)

Deși folosim microservicii, acestea sunt doar pentru funcționalitate, nicidecum pentru interfață decât doar dacă vin în ajutorul dezvoltatorului.


### Procesul

În favoarea


### Workflow

Câteva chestii de care ținem cont:
- *Inclusive Design* (aplicația este accesibilă oricui) => Teste in browser cu extensia "aXe" pentru Chrome pe fiecare paginăș
- *Mobile-First* Aplicația e dezvoltată pe principiul mobile-first.

ZenHub


# Contribuie

Experiența o capeți când lucrezi cu adevărat la un proiect complex.
Fie că vrei să înveți un stack modern, fie că
Aplicația Lodger este dezvoltată cu și din pasiune pentru administratorii de asociații de locatari / proprietari.

Fiind o aplicație de tip open-source, fiecare componentă / stil / funcționalitate este foarte bine documentată în așa fel încât orice dezvoltator să poată înțelege cât mai ușor ce se petrece cu codul.

Funcționalitatea acesteia este integral testată - unit, e2e, ux



## Build Setup

``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how front-end things work, checkout the .


# Pentru dezvoltatori

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
