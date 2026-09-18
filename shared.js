/* ==========================================================================
   shared.js
   Chargé par index.html ET shop.html — données produits + fonctions
   d'affichage de carte, réutilisées sur les deux pages.
   Ordre de chargement obligatoire : shared.js AVANT cart.js AVANT le
   script propre à chaque page (script.js ou shop.js).
   ========================================================================== */

function priceStr(p){ return p.toLocaleString('fr-FR') + ' FCFA'; }

const PACK_ICON = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 11h16" stroke="currentColor" stroke-width="1.2"/><path d="M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" stroke-width="1.5"/></svg>`;

const ARTICLE_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.3"/></svg>`;

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
   Certaines images manquent (p9, p31, p32, p35) → placeholder générique.
   Pour MODIFIER un prix : change la valeur "price".
   Pour AJOUTER une variante couleur : ajoute un tableau "colors:[...]". */
const ARTICLES = [
  /* ⭐ BEST-SELLER — produit phare S'Cool, affiché en premier.
     Pour remplacer l'image : dépose ta photo dans images/produits/
     sous le nom cahier-relie.webp (elle sera prise automatiquement). */
  {id:"p100", name:"La SPECIALE — Cahier feuille blanche relié", cat:"Rangement", price:2000,
   image:"images/produits/cahier-relie.webp", badge:"BEST-SELLER"},
  {id:"p1", name:"Crayons de couleur Color'Peps Strong x12 MAPED", cat:"Coloriage", price:1600, image:"images/produits/1.webp"},
  {id:"p2", name:"Crayons de couleur Color'Peps Mini Strong x12 MAPED", cat:"Coloriage", price:800, image:"images/produits/2.webp"},
  {id:"p3", name:"Crayon noir 2B MAPED", cat:"Écriture", price:200, image:"images/produits/3.webp"},
  {id:"p4", name:"Agrafes 6mm x1000 RAPID", cat:"Papeterie", price:800, image:"images/produits/4.webp"},
  {id:"p5", name:"Gomme blanche Technic 600 MAPED", cat:"Correction", price:300, image:"images/produits/5.webp"},
  {id:"p6", name:"Gomme blanche Technic 300 MAPED", cat:"Correction", price:250, image:"images/produits/6.webp"},
  {id:"p7", name:"Compas à crayon Study Neon MAPED", cat:"Traçage", price:1850, image:"images/produits/7.webp"},
  {id:"p8", name:"Stylo 4 couleurs Take4 SCHNEIDER", cat:"Écriture", price:1450, image:"images/produits/8.webp"},
  {id:"p9", name:"Stylo à bille Tops 505 F noir SCHNEIDER", cat:"Écriture", price:150, image:""},
  {id:"p10", name:"Bâton de colle 21g Coloured MILAN", cat:"Papeterie", price:1000, image:"images/produits/10orange.webp", colors:[{name:"Orange",hex:"#E8853A",image:"images/produits/10orange.webp"},{name:"Rose",hex:"#E86A9A",image:"images/produits/10rose.webp"}]},
  {id:"p11", name:"Surligneurs Classic assortis x4 MAPED", cat:"Écriture", price:2250, image:"images/produits/11.webp"},
  {id:"p12", name:"Surligneurs Pastel assortis x4 MAPED", cat:"Écriture", price:2600, image:"images/produits/12.webp"},
  {id:"p13", name:"Taille-crayon 1 trou Igloo Neon MAPED", cat:"Correction", price:450, image:"images/produits/13.webp"},
  {id:"p14", name:"Ciseaux 13cm gaucher Pulse MAPED", cat:"Papeterie", price:600, image:"images/produits/14.webp"},
  {id:"p15", name:"Ciseaux 13cm Security Smiling Planet MAPED", cat:"Papeterie", price:900, image:"images/produits/15.webp"},
  {id:"p16", name:"Blanco souris 5mm x8m MILAN", cat:"Correction", price:1350, image:"images/produits/16.webp"},
  {id:"p17", name:"Stylos Vizz M assortis x10 SCHNEIDER", cat:"Écriture", price:3500, image:"images/produits/17.webp"},
  {id:"p18", name:"Crayon noir HB embout gomme Navy MAPED", cat:"Écriture", price:200, image:"images/produits/18.webp"},
  {id:"p19", name:"Compas Study bague Flowpack MAPED", cat:"Traçage", price:800, image:"images/produits/19.webp"},
  {id:"p20", name:"Kit de traçage Study 20cm 4pcs MAPED", cat:"Traçage", price:1350, image:"images/produits/20.webp"},
  {id:"p21", name:"Agrafeuse Mini 24/6-26/6 Vivo MAPED", cat:"Papeterie", price:1350, image:"images/produits/21.webp"},
  {id:"p22", name:"Règle 20cm Twist'n Flex Patterns MAPED", cat:"Traçage", price:1100, image:"images/produits/22.webp"},
  {id:"p23", name:"Règle 20cm Study incassable Flow MAPED", cat:"Traçage", price:350, image:"images/produits/23.webp"},
  {id:"p24", name:"Stylo à bille bleu BIC Cristal", cat:"Écriture", price:150, image:"images/produits/24.webp"},
  {id:"p25", name:"Stylo à bille rouge BIC Cristal", cat:"Écriture", price:150, image:"images/produits/25.webp"},
  {id:"p26", name:"Stylo à bille noir BIC Cristal", cat:"Écriture", price:150, image:"images/produits/26.webp"},
  {id:"p27", name:"Stylo à bille vert BIC Cristal", cat:"Écriture", price:150, image:"images/produits/27.webp"},
  {id:"p28", name:"Kit de traçage 15cm 4pcs MAPED", cat:"Traçage", price:700, image:"images/produits/28.webp"},
  {id:"p29", name:"Correcteur liquide", cat:"Correction", price:250, image:"images/produits/29.webp"},
  {id:"p30", name:"Scotch", cat:"Papeterie", price:350, image:"images/produits/30.webp"},
  {id:"p31", name:"Critérium 0,7mm", cat:"Écriture", price:850, image:""},
  {id:"p32", name:"Mines 0,7mm MAPED", cat:"Écriture", price:350, image:""},
  {id:"p33", name:"Lot de 12 stylos gel multicolores LINC Pentonic", cat:"Écriture", price:2500, image:"images/produits/33.webp"},
  {id:"p34", name:"Classeur 100 vues Exacompta", cat:"Rangement", price:3200, image:"images/produits/34.webp"},
  {id:"p35", name:"Notebook A4", cat:"Rangement", price:2500, image:""}
];

function findItem(id){
  // Les variantes couleur utilisent une clé composite "p10::Orange" → on retrouve le produit de base
  const baseId = id.split('::')[0];
  return PACKS.find(p => p.id === baseId) || ARTICLES.find(a => a.id === baseId);
}

function packCard(pack){
  return `<div class="pack-card reveal" style="--accent:${pack.accent};">
    ${pack.badge ? `<span class="product-badge">${pack.badge}</span>` : ''}
    <div class="pack-icon">${PACK_ICON}</div>
    <h3>${pack.name}</h3>
    <p class="pack-desc">${pack.desc}</p>
    <div class="pack-price">${priceStr(pack.price)}</div>
    ${pack.brands ? `<div class="pack-brands">${pack.brands.map(b=>`<span>${b}</span>`).join('')}</div>` : ''}
    <button class="pack-toggle" onclick="togglePack('${pack.id}')">
      <span id="toggleLabel-${pack.id}">Voir le contenu (${pack.items.length} articles)</span>
      <svg id="toggleIcon-${pack.id}" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <ul class="pack-items" id="packItems-${pack.id}">
      ${pack.items.map(i=>`<li>${i}</li>`).join('')}
    </ul>
    <label class="pack-trousse">
      <input type="checkbox" id="trousse-${pack.id}">
      + Ajouter une trousse (prix confirmé sur WhatsApp)
    </label>
    <button class="btn btn-primary btn-block" onclick="addToCart('${pack.id}')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 4h2l1.6 9.6a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20 8H7" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.3" fill="#fff"/><circle cx="17" cy="20" r="1.3" fill="#fff"/></svg>
      Ajouter au panier
    </button>
  </div>`;
}
function togglePack(id){
  const list = document.getElementById('packItems-'+id);
  const icon = document.getElementById('toggleIcon-'+id);
  list.classList.toggle('open');
  icon.style.transform = list.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
}

function articleCard(article){
  const hasImg = article.image && article.image.length > 0;
  const imgHtml = hasImg
    ? `<img id="img-${article.id}" src="${article.image}" alt="${article.name}" loading="lazy">`
    : `<div class="article-noimg">${ARTICLE_ICON}<span>Photo bientôt</span></div>`;

  // Pastilles de couleur (si variantes)
  let colorsHtml = '';
  if(article.colors && article.colors.length){
    colorsHtml = `<div class="article-colors">` + article.colors.map((c,i)=>
      `<button class="color-dot${i===0?' active':''}" style="background:${c.hex}"
        title="${c.name}" aria-label="${c.name}"
        onclick="selectColor('${article.id}', ${i})"></button>`
    ).join('') + `</div>`;
  }

  const badgeHtml = article.badge
    ? `<span class="article-badge">${article.badge}</span>` : '';

  return `<div class="article-card-new reveal${article.badge ? ' is-featured' : ''}" id="card-${article.id}">
    <div class="article-img-wrap">${badgeHtml}${imgHtml}</div>
    <div class="article-body-new">
      <span class="article-brand">${article.cat || ''}</span>
      <h4 class="article-title-new">${article.name}</h4>
      ${colorsHtml}
      <div class="article-price-new">${priceStr(article.price)}</div>
      <div class="article-action" id="action-${article.id}">
        ${cardActionHtml(article.id)}
      </div>
    </div>
  </div>`;
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
      <button class="qty-btn" onclick="cardQty('${id}', -1)" aria-label="Diminuer">−</button>
      <span class="qty-num">${inCart}</span>
      <button class="qty-btn" onclick="cardQty('${id}', 1)" aria-label="Augmenter">+</button>
    </div>`;
  }
  return `<button class="btn btn-primary btn-sm btn-add" onclick="cardAdd('${id}')">Ajouter</button>`;
}

function refreshCardAction(id){
  const el = document.getElementById('action-'+id);
  if(el) el.innerHTML = cardActionHtml(id);
}

// Clic sur "Ajouter" : animation ✓ Ajouté puis apparition du sélecteur
function cardAdd(id){
  const el = document.getElementById('action-'+id);
  const btn = el ? el.querySelector('.btn-add') : null;
  if(btn){
    btn.classList.add('btn-added');
    btn.textContent = '✓ Ajouté';
  }
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
  const img = document.getElementById('img-'+id);
  if(img && item.colors[idx].image) img.src = item.colors[idx].image;
  const card = document.getElementById('card-'+id);
  if(card){
    card.querySelectorAll('.color-dot').forEach((d,i)=>
      d.classList.toggle('active', i===idx));
  }
  refreshCardAction(id); // le compteur suit la couleur sélectionnée
}

/* ---------- UTILITAIRES PARTAGÉS (nav, toast, scroll-reveal) ---------- */
function closeMenu(){
  const m = document.getElementById('mmenu');
  m.classList.remove('open');
  document.body.classList.remove('menu-open');
}
function openMenu(){
  const m = document.getElementById('mmenu');
  m.classList.toggle('open');
  document.body.classList.toggle('menu-open', m.classList.contains('open'));
}

// Fermeture burger au clic extérieur
document.addEventListener('click', function(e){
  const menu = document.getElementById('mmenu');
  const burger = document.querySelector('.burger');
  if(menu && menu.classList.contains('open')){
    if(!menu.contains(e.target) && !burger.contains(e.target)){
      closeMenu();
    }
  }
});

// Fermeture panier au clic sur l'overlay
document.addEventListener('DOMContentLoaded', function(){
  const overlay = document.getElementById('cartOverlay');
  if(overlay) overlay.addEventListener('click', closeCart);
});
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3200);
}
function observeReveals(){
  const els = document.querySelectorAll('.reveal:not(.in-view), .highlight:not(.in-view)');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target);} });
  }, {threshold:0.12});
  els.forEach(el=>io.observe(el));
}
