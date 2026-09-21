/* ==========================================================================
   shared.js
   Chargé par index.html ET shop.html — données produits + fonctions
   d'affichage de carte, réutilisées sur les deux pages.
   Ordre de chargement obligatoire : shared.js AVANT cart.js AVANT le
   script propre à chaque page (script.js ou shop.js).
   ========================================================================== */

/* ---------- CONTACT : un seul endroit à modifier ---------- */
const WA_NUMBER = '221762098743';
function waLink(text){
  return 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
}

function priceStr(p){ return p.toLocaleString('fr-FR') + ' FCFA'; }

/* Normalisation pour la recherche : minuscules SANS accents.
   Indispensable ici : au clavier téléphone les clients tapent "regle",
   "crayon de couleur", "etudiant" — sans accents. */
function norm(s){
  return (s || '').toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const PACK_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 11h16" stroke="currentColor" stroke-width="1.2"/><path d="M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" stroke-width="1.5"/></svg>`;

const ARTICLE_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.3"/></svg>`;

/* Vrai glyphe WhatsApp (l'ancien SVG du site était un simple cercle). */
function waIcon(size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.25-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.34M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.005c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>`;
}

/* ---------- LES 4 VRAIS PACKS ----------
   Pour AJOUTER un pack : copie un objet {...} en entier (de { à },),
   colle-le juste avant le crochet fermant ], change chaque valeur.
   Pour SUPPRIMER un pack : supprime son objet {...} entier (garde la virgule
   correcte : jamais deux virgules à la suite, jamais de virgule après le
   dernier objet du tableau).
   Pour MODIFIER un pack : change juste la valeur voulue (price, desc, items). */
const PACKS = [
  {
    id:"pack-simple", name:"Simple", price:4900, accent:"#8FE9B4", badge:null, brands:["BIC", "MAPED", "FUTURA"],
    desc:"L'essentiel bien choisi, pour démarrer l'année sans se ruiner.",
    items:["3 stylos rouges (BIC Cristal)","4 stylos bleus (BIC Cristal)","2 stylos noirs (BIC Cristal)","2 stylos verts (BIC Cristal)","1 crayon noir avec gomme","1 crayon noir sans gomme","2 gommes (MAPED petit modèle)","1 taille-crayon","1 kit de traçage (MAPED petit modèle)","1 compas avec crayon (FUTURA)","1 règle incassable (MAPED Twist'n Flex)","1 correcteur liquide","1 paquet de crayons de couleur (MAPED Mini Color'Peps)"]
  },
  {
    id:"pack-extra", name:"Extra", price:15900, accent:"#EEF17A", badge:null, brands:["BIC", "MAPED"],
    desc:"Le pack le plus complet pour couvrir toute l'année sans y repenser.",
    items:["3 stylos rouges","4 stylos bleus","2 stylos noirs","2 stylos verts","1 stylo 4 couleurs (BIC)","2 crayons noirs avec gomme","2 crayons noirs sans gomme (MAPED Hb2)","2 gommes (MAPED grand + petit modèle)","1 taille-crayon","1 kit de traçage (MAPED Twist'n Flex, grand modèle)","1 compas avec crayon (MAPED Study)","1 règle 20cm flexible (MAPED Twist'n Flex)","2 correcteurs liquides","1 paquet de crayons de couleur (MAPED Color'Peps grand modèle)","1 scotch","1 tube de colle","1 critérium + recharge","1 paquet de surligneurs (pack de 4)"]
  },
  {
    id:"pack-etudiant", name:"Étudiant", price:17900, accent:"#B7D9E8", badge:"New", brands:["SCHNEIDER", "MAPED", "LINC", "Exacompta"],
    desc:"Pensé pour le collège/lycée : de quoi écrire, classer et t'organiser.",
    items:["3 stylos rouges","4 stylos bleus","2 stylos noirs","1 stylo 4 couleurs (SCHNEIDER)","3 crayons noirs (MAPED Hb2)","2 gommes","1 taille-crayon","1 kit de traçage (MAPED, grand modèle)","1 règle incassable","2 correcteurs liquides","1 critérium + 2 recharges","1 paquet de surligneurs (MAPED couleur pastel)","1 agrafeuse + recharge (MAPED)","1 paquet de 12 stylos de couleur (LINC)","1 porte-vue 100 vues ou trieur (Exacompta)","1 cahier A4 200 pages 🎁"]
  },
  {
    id:"pack-ultime", name:"Ultime", price:19900, accent:"#F4938C", badge:null, brands:["BIC", "MAPED", "MILAN", "UHU", "LINC"],
    desc:"Le pack complet, sans rien à racheter en cours d'année.",
    items:["3 stylos rouges","4 stylos bleus","2 stylos noirs","2 stylos verts","1 stylo 4 couleurs","2 crayons noirs avec gomme","2 crayons noirs sans gomme","2 gommes","1 taille-crayon","1 kit de traçage (MAPED, grand modèle)","1 compas avec crayon (MAPED)","1 règle 20cm flexible (MAPED Twist'n Flex)","1 correcteur liquide","1 souris blanco (MILAN)","1 paquet de crayons de couleur (MAPED Color'Peps grand modèle)","2 scotchs","1 tube de colle (UHU grand modèle)","1 critérium + recharge","1 paquet de surligneurs (MAPED couleur pastel)","1 agrafeuse + recharge (MAPED)","1 paire de ciseaux (MAPED)","1 paquet de 12 stylos de couleur (LINC Pentonic)"]
  }
];

/* ---------- ARTICLES VENDUS À L'UNITÉ ----------
   Source : base de stock réelle S'Cool — 35 produits.
   Prix de vente arrondis à la valeur ronde supérieure.
   Images : dossier images/produits/ (format .webp).
   Photos encore manquantes (p9, p30, p31, p32, p35) → image:"" affiche
   le placeholder "Photo bientôt". Dès que la photo est prise, il suffit
   de remettre le chemin ici.
   Pour MODIFIER un prix : change la valeur "price".
   Pour AJOUTER une variante couleur : ajoute un tableau "colors:[...]". */
const ARTICLES = [
  /* ⭐ BEST-SELLER — produit phare S'Cool, affiché en premier. */
  {id:"p100", name:"La SPECIALE, cahier feuille blanche relié", cat:"Rangement", price:2000,
   image:"images/produits/cahier-relie.webp", badge:"BEST-SELLER"},
  {id:"p1", name:"Crayons de couleur Color'Peps Strong x12 MAPED", cat:"Coloriage", price:1500, image:"images/produits/1.webp"},
  {id:"p2", name:"Crayons de couleur Color'Peps Mini Strong x12 MAPED", cat:"Coloriage", price:700, image:"images/produits/2.webp"},
  {id:"p3", name:"Crayon noir 2B MAPED", cat:"Écriture", price:200, image:"images/produits/3.webp"},
  {id:"p4", name:"Agrafes 6mm x1000 RAPID", cat:"Papeterie", price:600, image:"images/produits/4.webp"},
  {id:"p5", name:"Gomme blanche Technic 600 MAPED", cat:"Correction", price:300, image:"images/produits/5.webp"},
  {id:"p6", name:"Gomme blanche Technic 300 MAPED", cat:"Correction", price:150, image:"images/produits/6.webp"},
  {id:"p7", name:"Compas à crayon Study Neon MAPED", cat:"Traçage", price:1500, image:"images/produits/7.webp"},
  {id:"p8", name:"Stylo 4 couleurs Take4 SCHNEIDER", cat:"Écriture", price:1450, image:"images/produits/8.webp"},
  {id:"p9", name:"Stylo à bille Tops 505 F noir SCHNEIDER", cat:"Écriture", price:150, image:""},
  {id:"p10", name:"Bâton de colle 21g Coloured MILAN", cat:"Papeterie", price:1000, image:"images/produits/10orange.webp", colors:[{name:"Orange",hex:"#E8853A",image:"images/produits/10orange.webp"},{name:"Rose",hex:"#E86A9A",image:"images/produits/10rose.webp"}]},
  {id:"p11", name:"Surligneurs Classic assortis x4 MAPED", cat:"Écriture", price:2250, image:"images/produits/11.webp"},
  {id:"p12", name:"Surligneurs Pastel assortis x4 MAPED", cat:"Écriture", price:2500, image:"images/produits/12.webp"},
  {id:"p13", name:"Taille-crayon 1 trou Igloo Neon MAPED", cat:"Correction", price:450, image:"images/produits/13.webp"},
  {id:"p14", name:"Ciseaux 13cm gaucher Pulse MAPED", cat:"Papeterie", price:800, image:"images/produits/14.webp"},
  {id:"p15", name:"Ciseaux 13cm Security Smiling Planet MAPED", cat:"Papeterie", price:900, image:"images/produits/15.webp"},
  {id:"p16", name:"Blanco souris 5mm x8m MILAN", cat:"Correction", price:1350, image:"images/produits/16.webp"},
  {id:"p17", name:"Stylos Vizz M assortis x10 SCHNEIDER", cat:"Écriture", price:3500, image:"images/produits/17.webp"},
  {id:"p18", name:"Crayon noir HB embout gomme Navy MAPED", cat:"Écriture", price:200, image:"images/produits/18.webp"},
  {id:"p19", name:"Compas Study bague Flowpack MAPED", cat:"Traçage", price:800, image:"images/produits/19.webp"},
  {id:"p20", name:"Kit de traçage Study 20cm 4pcs MAPED", cat:"Traçage", price:1500, image:"images/produits/20.webp"},
  {id:"p21", name:"Agrafeuse Mini 24/6-26/6 Vivo MAPED", cat:"Papeterie", price:1350, image:"images/produits/21.webp"},
  {id:"p22", name:"Règle 20cm Twist'n Flex Patterns MAPED", cat:"Traçage", price:1000, image:"images/produits/22.webp"},
  {id:"p23", name:"Règle 20cm Study incassable Flow MAPED", cat:"Traçage", price:350, image:"images/produits/23.webp"},
  {id:"p24", name:"Stylo à bille bleu BIC Cristal", cat:"Écriture", price:100, image:"images/produits/24.webp"},
  {id:"p25", name:"Stylo à bille rouge BIC Cristal", cat:"Écriture", price:100, image:"images/produits/25.webp"},
  {id:"p26", name:"Stylo à bille noir BIC Cristal", cat:"Écriture", price:100, image:"images/produits/26.webp"},
  {id:"p27", name:"Stylo à bille vert BIC Cristal", cat:"Écriture", price:100, image:"images/produits/27.webp"},
  {id:"p28", name:"Kit de traçage 15cm 4pcs MAPED", cat:"Traçage", price:700, image:"images/produits/28.webp"},
  {id:"p29", name:"Correcteur liquide", cat:"Correction", price:300, image:"images/produits/29.webp"},
  {id:"p30", name:"Scotch", cat:"Papeterie", price:350, image:""},
  {id:"p31", name:"Critérium 0,7mm", cat:"Écriture", price:850, image:""},
  {id:"p32", name:"Mines 0,7mm MAPED", cat:"Écriture", price:350, image:""},
  {id:"p33", name:"Lot de 12 stylos gel multicolores LINC Pentonic", cat:"Écriture", price:2500, image:"images/produits/33.webp"},
  {id:"p34", name:"Classeur 100 vues Exacompta", cat:"Rangement", price:2700, image:"images/produits/34.webp"},
  {id:"p35", name:"Notebook A4", cat:"Rangement", price:2500, image:""}
];

/* Catégories déduites des données : pas de liste à maintenir à la main.
   Ajoute un article avec une nouvelle "cat" et le filtre apparaît tout seul. */
const CATEGORIES = [...new Set(ARTICLES.map(a => a.cat).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));

function findItem(id){
  // Les variantes couleur utilisent une clé composite "p10::Orange" → on retrouve le produit de base
  const baseId = String(id).split('::')[0];
  return PACKS.find(p => p.id === baseId) || ARTICLES.find(a => a.id === baseId);
}

/* Échappe le texte injecté dans un attribut HTML (noms de produits avec apostrophes). */
function attr(s){
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ---------- CARTES PACK ---------- */
function packCard(pack){
  return `<article class="pack-card reveal" style="--accent:${pack.accent};">
    ${pack.badge ? `<span class="product-badge">${pack.badge}</span>` : ''}
    <div class="pack-icon">${PACK_ICON}</div>
    <h3>${pack.name}</h3>
    <p class="pack-desc">${pack.desc}</p>
    <div class="pack-price">${priceStr(pack.price)}</div>
    ${pack.brands ? `<div class="pack-brands">${pack.brands.map(b=>`<span>${b}</span>`).join('')}</div>` : ''}
    <button type="button" class="pack-toggle" aria-expanded="false" aria-controls="packItems-${pack.id}" onclick="togglePack('${pack.id}')">
      <span>Voir le contenu (${pack.items.length} articles)</span>
      <svg id="toggleIcon-${pack.id}" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <ul class="pack-items" id="packItems-${pack.id}">
      ${pack.items.map(i=>`<li>${i}</li>`).join('')}
    </ul>
    <div class="article-action" id="action-${pack.id}">${cardActionHtml(pack.id)}</div>
  </article>`;
}

/* Ouverture/fermeture sur la hauteur réelle du contenu : plus de liste
   tronquée quand un pack dépasse une hauteur maximale arbitraire. */
function togglePack(id){
  const list = document.getElementById('packItems-'+id);
  const icon = document.getElementById('toggleIcon-'+id);
  const btn  = list.previousElementSibling;
  const open = !list.classList.contains('open');
  list.classList.toggle('open', open);
  list.style.maxHeight = open ? list.scrollHeight + 'px' : '0px';
  if(icon) icon.style.transform = open ? 'rotate(180deg)' : 'rotate(0)';
  if(btn) btn.setAttribute('aria-expanded', String(open));
}

/* ---------- CARTES ARTICLE ---------- */
function articleCard(article){
  const hasImg = article.image && article.image.length > 0;
  // onerror : si un fichier image manque, on retombe sur le placeholder
  // au lieu d'afficher l'icône « image cassée » du navigateur.
  const imgHtml = hasImg
    ? `<img id="img-${article.id}" src="${article.image}" alt="${attr(article.name)}" loading="lazy" decoding="async"
         onerror="productImgFallback(this)">`
    : noImgHtml();

  let colorsHtml = '';
  if(article.colors && article.colors.length){
    colorsHtml = `<div class="article-colors" role="group" aria-label="Couleur">` + article.colors.map((c,i)=>
      `<button type="button" class="color-dot${i===0?' active':''}" style="background:${c.hex}"
        title="${attr(c.name)}" aria-label="${attr(c.name)}"
        onclick="selectColor('${article.id}', ${i})"></button>`
    ).join('') + `</div>`;
  }

  const badgeHtml = article.badge
    ? `<span class="article-badge">${article.badge}</span>` : '';

  return `<article class="article-card-new reveal${article.badge ? ' is-featured' : ''}" id="card-${article.id}">
    <button type="button" class="article-img-wrap" onclick="openProduct('${article.id}')" aria-label="Voir ${attr(article.name)}">${badgeHtml}${imgHtml}</button>
    <div class="article-body-new">
      <span class="article-brand">${article.cat || ''}</span>
      <h4 class="article-title-new">
        <button type="button" class="article-title-btn" onclick="openProduct('${article.id}')">${article.name}</button>
      </h4>
      ${colorsHtml}
      <div class="article-price-new">${priceStr(article.price)}</div>
      <div class="article-action" id="action-${article.id}">
        ${cardActionHtml(article.id)}
      </div>
    </div>
  </article>`;
}

function noImgHtml(){
  return `<span class="article-noimg">${ARTICLE_ICON}<span>Photo bientôt</span></span>`;
}

/* Photo introuvable (fichier supprimé, chemin faux) : on affiche le
   placeholder plutôt que l'icône « image cassée » du navigateur. */
function productImgFallback(img){
  const wrap = img.closest('.article-img-wrap') || img.parentElement;
  if(wrap) wrap.innerHTML = noImgHtml();
}

/* ---------- QUANTITÉ SUR LA CARTE ----------
   Affiche soit le bouton "Ajouter", soit le sélecteur [- n +]
   selon que le produit (dans la couleur sélectionnée) est déjà au panier. */
function cartKeyFor(id){
  const item = findItem(id);
  if(item && item.colors && item.colors.length){
    const idx = selectedColors[id] != null ? selectedColors[id] : 0;
    return id + '::' + item.colors[idx].name;
  }
  return id;
}

function cardActionHtml(id){
  const key = cartKeyFor(id);
  const inCart = (typeof cart !== 'undefined' && cart[key]) ? cart[key].qty : 0;
  if(inCart > 0){
    return `<div class="qty-selector">
      <button type="button" class="qty-btn" onclick="cardQty('${id}', -1)" aria-label="Diminuer la quantité">−</button>
      <span class="qty-num" aria-live="polite">${inCart}</span>
      <button type="button" class="qty-btn" onclick="cardQty('${id}', 1)" aria-label="Augmenter la quantité">+</button>
    </div>`;
  }
  return `<button type="button" class="btn btn-outline btn-sm btn-add btn-block" onclick="cardAdd('${id}')">Ajouter</button>`;
}

function refreshCardAction(id){
  const el = document.getElementById('action-'+id);
  if(el) el.innerHTML = cardActionHtml(id);
  const modalAction = document.getElementById('modalAction');
  if(modalAction && modalAction.dataset.id === id) modalAction.innerHTML = cardActionHtml(id);
}

// Clic sur "Ajouter" : animation ✓ Ajouté puis apparition du sélecteur
function cardAdd(id){
  document.querySelectorAll('#action-'+CSS.escape(id)+' .btn-add, #modalAction .btn-add').forEach(btn=>{
    btn.classList.add('btn-added');
    btn.textContent = '✓ Ajouté';
  });
  const item = findItem(id);
  addToCart(id, !!(item && item.colors && item.colors.length));
  setTimeout(()=>refreshCardAction(id), 620);
}

// +/- directement sur la carte
function cardQty(id, delta){
  const key = cartKeyFor(id);
  if(!cart[key]) return;
  cart[key].qty += delta;
  if(cart[key].qty <= 0) delete cart[key];
  saveCart();
  renderCart();
  refreshCardAction(id);
}

// Sélection d'une couleur : change l'image + met à jour le compteur de CETTE couleur
const selectedColors = {};
function selectColor(id, idx){
  const item = findItem(id);
  if(!item || !item.colors) return;
  selectedColors[id] = idx;
  [document.getElementById('img-'+id), document.getElementById('modalImg')].forEach(img=>{
    if(img && item.colors[idx].image) img.src = item.colors[idx].image;
  });
  ['#card-'+CSS.escape(id), '#modalColors'].forEach(sel=>{
    const group = document.querySelector(sel);
    if(!group) return;
    group.querySelectorAll('.color-dot').forEach((d,i)=> d.classList.toggle('active', i === idx));
  });
  refreshCardAction(id); // le compteur suit la couleur sélectionnée
}

/* ==========================================================================
   FICHE PRODUIT (modale)
   La carte tronque le nom à 2 lignes ; la fiche permet enfin de lire le nom
   complet, de voir la photo en grand et de choisir la couleur.
   ========================================================================== */
function ensureProductModal(){
  if(document.getElementById('productModal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="modalOverlay" onclick="closeProduct()"></div>
    <div class="product-modal" id="productModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
      <button type="button" class="modal-close" onclick="closeProduct()" aria-label="Fermer la fiche produit">✕</button>
      <div class="modal-media" id="modalMedia"></div>
      <div class="modal-body">
        <span class="article-brand" id="modalCat"></span>
        <h3 id="modalTitle"></h3>
        <div id="modalColors"></div>
        <div class="modal-price" id="modalPrice"></div>
        <div class="article-action" id="modalAction"></div>
        <a class="modal-ask" id="modalAsk" target="_blank" rel="noopener">${waIcon(15)} Une question sur ce produit ?</a>
        <p class="modal-note">Paiement Wave, Orange Money ou espèces à la livraison · Dakar sous 48h</p>
      </div>
    </div>`;
  document.body.appendChild(el);
}

let lastFocused = null;
function openProduct(id){
  const a = findItem(id);
  if(!a) return;
  ensureProductModal();
  lastFocused = document.activeElement;
  const idx = selectedColors[id] != null ? selectedColors[id] : 0;
  const src = (a.colors && a.colors[idx] && a.colors[idx].image) || a.image;

  document.getElementById('modalMedia').innerHTML = src
    ? `<img id="modalImg" src="${src}" alt="${attr(a.name)}">`
    : noImgHtml();
  document.getElementById('modalCat').textContent = a.cat || '';
  document.getElementById('modalTitle').textContent = a.name;
  document.getElementById('modalPrice').textContent = priceStr(a.price);
  document.getElementById('modalColors').innerHTML = (a.colors && a.colors.length)
    ? `<div class="article-colors" id="modalColorDots" role="group" aria-label="Couleur">` + a.colors.map((c,i)=>
        `<button type="button" class="color-dot${i===idx?' active':''}" style="background:${c.hex}"
          title="${attr(c.name)}" aria-label="${attr(c.name)}" onclick="selectColor('${a.id}', ${i})"></button>`).join('') + `</div>`
    : '';
  const action = document.getElementById('modalAction');
  action.dataset.id = id;
  action.innerHTML = cardActionHtml(id);
  document.getElementById('modalAsk').href = waLink(`Bonjour S'Cool, j'ai une question sur : ${a.name} (${priceStr(a.price)}).`);

  document.getElementById('productModal').classList.add('open');
  document.getElementById('productModal').setAttribute('aria-hidden','false');
  document.getElementById('modalOverlay').classList.add('open');
  lockScroll(true);
  document.querySelector('#productModal .modal-close').focus();
}

function closeProduct(){
  const m = document.getElementById('productModal');
  if(!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  document.getElementById('modalOverlay').classList.remove('open');
  lockScroll(false);
  if(lastFocused && lastFocused.focus) lastFocused.focus();
}

/* ---------- UTILITAIRES PARTAGÉS (scroll, nav, toast, reveal) ---------- */

/* Un seul endroit verrouille le scroll : sinon fermer le panier
   déverrouillait le scroll alors que le menu burger était encore ouvert. */
const scrollLocks = new Set();
function lockScroll(on, key){
  const k = key || 'default';
  if(on) scrollLocks.add(k); else scrollLocks.delete(k);
  document.body.classList.toggle('scroll-locked', scrollLocks.size > 0);
}

function closeMenu(){
  const m = document.getElementById('mmenu');
  if(!m) return;
  m.classList.remove('open');
  document.body.classList.remove('menu-open');
  const b = document.querySelector('.burger');
  if(b) b.setAttribute('aria-expanded','false');
  lockScroll(false, 'menu');
}
function openMenu(){
  const m = document.getElementById('mmenu');
  if(!m) return;
  const open = !m.classList.contains('open');
  m.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  const b = document.querySelector('.burger');
  if(b) b.setAttribute('aria-expanded', String(open));
  lockScroll(open, 'menu');
}

// Fermeture burger au clic extérieur
document.addEventListener('click', function(e){
  const menu = document.getElementById('mmenu');
  const burger = document.querySelector('.burger');
  if(menu && menu.classList.contains('open')){
    if(!menu.contains(e.target) && burger && !burger.contains(e.target)){
      closeMenu();
    }
  }
});

// Échap ferme, dans l'ordre : la fiche produit, le panier, le menu.
document.addEventListener('keydown', function(e){
  if(e.key !== 'Escape') return;
  const modal = document.getElementById('productModal');
  if(modal && modal.classList.contains('open')){ closeProduct(); return; }
  const drawer = document.getElementById('cartDrawer');
  if(drawer && drawer.classList.contains('open')){ closeCart(); return; }
  const menu = document.getElementById('mmenu');
  if(menu && menu.classList.contains('open')) closeMenu();
});

function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove('show'), 3200);
}

/* Un SEUL observateur pour toute la page, réutilisé à chaque rendu.
   Avant : un nouvel IntersectionObserver était créé à chaque frappe dans
   la recherche (6 lettres = 6 observateurs jamais libérés). */
let _revealObserver = null;
function observeReveals(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.reveal:not(.in-view), .highlight:not(.in-view)');
  if(reduce || !('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('in-view'));
    return;
  }
  if(!_revealObserver){
    _revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('in-view'); _revealObserver.unobserve(en.target); }
      });
    }, {threshold:0.12});
  }
  els.forEach(el=>_revealObserver.observe(el));
}

/* Filet de sécurité : si le JS plante ou qu'un navigateur ancien n'a pas
   IntersectionObserver, .reveal{opacity:0} rendrait TOUTE la page invisible.
   On force l'affichage au bout de 2,5s quoi qu'il arrive. */
setTimeout(()=>{
  document.querySelectorAll('.reveal:not(.in-view)').forEach(el=>el.classList.add('in-view'));
}, 2500);

/* Bouton WhatsApp flottant : le CSS existait déjà, le bouton n'était
   sur aucune page. Injecté ici pour être présent partout. */
document.addEventListener('DOMContentLoaded', function(){
  if(document.querySelector('.wa-float')) return;
  const a = document.createElement('a');
  a.className = 'wa-float';
  a.href = waLink("Bonjour S'Cool, j'aurais une question.");
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Nous écrire sur WhatsApp');
  a.innerHTML = waIcon(26);
  document.body.appendChild(a);
});

/* ---------- Glyphe WhatsApp injecté là où il est marqué ----------
   Évite de recopier 40 lignes de SVG dans chaque bouton des deux pages. */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('[data-wa-icon]').forEach(el=>{
    el.insertAdjacentHTML('afterbegin', waIcon(parseInt(el.dataset.waIcon,10) || 16));
  });
});

/* ---------- Données structurées produits (SEO) ----------
   Générées à partir de PACKS / ARTICLES : une seule source de vérité,
   donc aucun risque que le prix du balisage diverge du prix affiché.
   Google exécute le JavaScript pour lire ce balisage. */
document.addEventListener('DOMContentLoaded', function(){
  const BASE = 'https://scoolsn.github.io/S-COOL/';
  const all = [...PACKS, ...ARTICLES].filter(p => p.image);
  const data = {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "name":"Catalogue S'Cool",
    "numberOfItems": all.length,
    "itemListElement": all.map((p,i)=>({
      "@type":"ListItem",
      "position": i+1,
      "item": {
        "@type":"Product",
        "name": p.name + (PACKS.includes(p) ? ' : pack de rentrée S’Cool' : ''),
        "description": p.desc || `${p.name}, ${p.cat || 'fourniture scolaire'} disponible chez S'Cool à Dakar.`,
        "category": p.cat || 'Pack de rentrée',
        ...(p.image ? {"image": BASE + p.image} : {}),
        "offers": {
          "@type":"Offer",
          "price": p.price,
          "priceCurrency":"XOF",
          "availability":"https://schema.org/InStock",
          "url": BASE + 'shop.html',
          "seller":{"@type":"Organization","name":"S'Cool"}
        }
      }
    }))
  };
  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(data);
  document.head.appendChild(tag);
});
