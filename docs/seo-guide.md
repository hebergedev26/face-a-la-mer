# Guide SEO & Google Business — Face À La Mer

Site : https://hebergedev26.github.io/face-a-la-mer/

---

## 1. Google Search Console (indexation Google)

### Étape 1 — Créer la propriété
1. Aller sur https://search.google.com/search-console
2. Se connecter avec le compte **hebergedev26@gmail.com** (celui du site)
3. Cliquer sur **Ajouter une propriété**
4. Choisir **Préfixe d'URL** et saisir :
   `https://hebergedev26.github.io/face-a-la-mer`

### Étape 2 — Vérifier la propriété
Méthode la plus simple : **fichier HTML**
1. Dans la fenêtre de vérification, cliquer sur **Fichier HTML**
2. Télécharger le fichier `google*.html` proposé (ex. `googleabc123.html`)
3. Le déposer à la racine du projet **face-a-la-mer** puis le mettre en ligne :
   - git add googleabc123.html
   - git commit -m "Vérification Google Search Console"
   - git push origin master
4. Attendre 1-2 minutes, puis cliquer sur **Vérifier**
5. Une fois vérifié, cliquer sur **Accéder à la propriété**

> Alternative : choisir la méthode **Google Analytics** si le même compte
> gère le GA `G-J7TYZHZTGC` déjà installé sur le site.

### Étape 3 — Soumettre le sitemap
1. Menu de gauche : **Plan du site (Sitemaps)**
2. Saisir : `sitemap.xml`
3. Cliquer sur **Envoyer**
   → Le sitemap est déjà présent : https://hebergedev26.github.io/face-a-la-mer/sitemap.xml

### Étape 4 — Demander l'indexation des pages
1. En haut, dans le champ **Inspecter n'importe quelle URL**, coller :
   `https://hebergedev26.github.io/face-a-la-mer/`
2. Cliquer **Entrée** puis **Demander l'indexation**
3. Répéter pour :
   - https://hebergedev26.github.io/face-a-la-mer/menu.html
   - https://hebergedev26.github.io/face-a-la-mer/contact.html
   - https://hebergedev26.github.io/face-a-la-mer/reservation.html

### Suivi
- Vérifier régulièrement **Performances** (clics, impressions, position)
- Surveiller **Indexation > Pages** pour détecter d'éventuelles erreurs
- Le site a déjà : sitemap.xml, robots.txt, balises meta description, Open Graph et données JSON-LD (Restaurant)

> ⚠️ Conseil pour le futur : acheter un nom de domaine (ex. facealamer.bj) et le
> connecter au site GitHub Pages rendrait le référencement plus fort.

---

## 2. Fiche Google Business (anciennement Google My Business)

### Étape 1 — Créer / revendiquer la fiche
1. Aller sur https://www.google.com/business ou taper « Face À La Mer Cotonou » sur Google et cliquer sur « Revendiquer cette fiche »
2. Se connecter avec **hebergedev26@gmail.com**
3. Ajouter une entreprise → choisir **Restaurant**

### Étape 2 — Renseigner les informations
| Champ | Valeur |
|---|---|
| Nom | Face À La Mer |
| Catégorie principale | Restaurant |
| Adresse | Route des Pêches, Fidjrossé, Cotonou, Bénin |
| Zone de service | Cotonou (si livraison) |
| Téléphone | +229 01 46 07 58 17 |
| Site web | https://hebergedev26.github.io/face-a-la-mer/ |
| Horaires | Lundi – Dimanche : 11h00 – 23h00 |

### Étape 3 — Photos
- Ajouter au moins 5-6 photos : terrasse, plats, entrée, soirée
- (Re)prendre les visuels déjà utilisés sur la page Galerie

### Étape 4 — Vérification de la fiche
- Google propose selon le pays : **carte postale**, **appel** ou **vidéo**
- Suivre les instructions à l'écran (la carte postale peut prendre 5 à 14 jours au Bénin)

### Étape 5 — Obtenir des avis Google
1. Après vérification, récupérer le **lien d'avis** de la fiche
   (sur la fiche : « Demander des avis » → copier le lien)
2. Partager ce lien sur WhatsApp à chaque client satisfait
3. Le site affiche déjà la note et les avis (page Avis + compteur sur la page d'accueil)

### Suivi
- Publier régulièrement des **publications** (photos, plats du jour, événements) sur la fiche
- Répondre à chaque avis (positif ou négatif)
- C'est la fiche Google qui fait apparaître le restaurant dans la recherche locale « restaurant Fidjrossé »
