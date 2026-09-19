/* ==========================================================================
   shop.js — logique propre à shop.html uniquement.
   Suppose que shared.js et cart.js sont chargés AVANT ce fichier.

   Structure de la boutique :
   - Onglet "Articles"  -> grille verticale d'articles uniquement
   - Onglet "Packs"     -> grille de packs uniquement
   - Onglet "Tout voir" -> LES PACKS D'ABORD (bande scrollable sur mobile),
                           puis les articles en dessous.

   Sur les articles s'ajoutent un filtre par catégorie et un tri.
   L'état complet (onglet + catégorie + tri + recherche) est reflété dans
   l'URL, pour qu'un lien vers "les stylos triés par prix" soit partageable
   et que le bouton Retour du navigateur fonctionne.
   ========================================================================== */

let activeCat  = 'Articles';   // onglet : Articles | Packs | Tous
let activeFam  = 'Toutes';     // famille de produits : Écriture, Traçage...
let activeSort = 'default';    // default | price-asc | price-desc | name

/* Un article correspond si CHAQUE mot tapé se retrouve quelque part.
   - sans accents : "regle" trouve "Règle" (au clavier téléphone, personne
     ne tape les accents) ;
   - mot à mot : "stylo bleu" trouve "Stylo à bille bleu BIC Cristal",
     alors qu'avant la chaîne entière devait apparaître telle quelle. */
function matchQuery(item, tokens){
  if(!tokens.length) return true;
  const hay = norm([item.name, item.desc, item.cat, (item.brands||[]).join(' ')].filter(Boolean).join(' '));
  return tokens.every(t => hay.includes(t));
}

function sortItems(list){
  const out = list.slice();
  if(activeSort === 'price-asc')  out.sort((a,b)=> a.price - b.price);
  if(activeSort === 'price-desc') out.sort((a,b)=> b.price - a.price);
  if(activeSort === 'name')       out.sort((a,b)=> a.name.localeCompare(b.name,'fr'));
  return out;
}

/* Les filtres de famille ne concernent que les articles : on les masque
   quand l'onglet Packs est actif, au lieu de les laisser sans effet. */
function renderFamilyFilters(){
  const bar = document.getElementById('shopFilters');
  if(!bar) return;
  if(activeCat === 'Packs'){ bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  if(bar.dataset.built) { syncFamilyFilters(); return; }
  bar.innerHTML = ['Toutes', ...CATEGORIES].map(c=>
    `<button type="button" class="shop-chip${c==='Toutes'?' active':''}" data-fam="${c}" aria-pressed="${c==='Toutes'}">${c}</button>`
  ).join('');
  bar.dataset.built = '1';
  bar.querySelectorAll('.shop-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      activeFam = chip.dataset.fam;
      syncFamilyFilters();
      renderShop();
    });
  });
}
function syncFamilyFilters(){
  document.querySelectorAll('#shopFilters .shop-chip').forEach(c=>{
    const on = c.dataset.fam === activeFam;
    c.classList.toggle('active', on);
    c.setAttribute('aria-pressed', String(on));
  });
}

function renderShop(){
  const query  = document.getElementById('shopSearch').value.trim();
  const tokens = norm(query).split(/\s+/).filter(Boolean);

  const packs = PACKS.filter(p => matchQuery(p, tokens));
  let articles = ARTICLES.filter(a => matchQuery(a, tokens));
  if(activeFam !== 'Toutes') articles = articles.filter(a => a.cat === activeFam);
  articles = sortItems(articles);

  const grid          = document.getElementById('shopGrid');
  const empty         = document.getElementById('shopEmpty');
  const packsSection  = document.getElementById('packsSection');
  const packsStrip    = document.getElementById('packsStrip');
  const articlesTitle = document.getElementById('articlesTitle');
  const countEl       = document.getElementById('shopCount');

  packsSection.style.display  = 'none';
  articlesTitle.style.display = 'none';

  renderFamilyFilters();

  let total = 0;

  if(activeCat === 'Tous'){
    if(packs.length){
      packsSection.style.display = 'block';
      packsStrip.innerHTML = packs.map(packCard).join('');
      total += packs.length;
    }
    if(articles.length){
      articlesTitle.style.display = 'block';
      grid.className = 'article-grid';
      grid.style.display = 'grid';
      grid.innerHTML = articles.map(articleCard).join('');
      total += articles.length;
    } else {
      grid.innerHTML = '';
      grid.style.display = 'none';
    }
  } else if(activeCat === 'Packs'){
    grid.className = 'pack-grid';
    grid.style.display = packs.length ? 'grid' : 'none';
    grid.innerHTML = packs.map(packCard).join('');
    total = packs.length;
  } else { // Articles
    grid.className = 'article-grid';
    grid.style.display = articles.length ? 'grid' : 'none';
    grid.innerHTML = articles.map(articleCard).join('');
    total = articles.length;
  }

  // Compteur de résultats : le client sait combien de produits il regarde.
  if(countEl){
    countEl.textContent = total === 0 ? 'Aucun produit'
      : `${total} produit${total > 1 ? 's' : ''}`
        + (activeFam !== 'Toutes' ? ` · ${activeFam}` : '')
        + (query ? ` · « ${query} »` : '');
  }

  // État vide
  if(total === 0){
    empty.style.display = 'block';
    document.getElementById('shopEmptyTitle').textContent = query
      ? `Aucun résultat pour "${query}" — pas encore ajouté au site`
      : `Rien dans cette catégorie pour l'instant`;
    document.getElementById('shopEmptyBtn').href = waLink(query
      ? `Bonjour S'Cool, je cherche : "${query}". Est-ce disponible ?`
      : `Bonjour S'Cool, avez-vous d'autres produits que ceux du site ?`);
  } else {
    empty.style.display = 'none';
  }

  observeReveals();
  syncUrl();
}

/* ---------- URL partageable + bouton Retour ---------- */
function syncUrl(){
  const p = new URLSearchParams();
  if(activeCat  !== 'Articles') p.set('vue', activeCat);
  if(activeFam  !== 'Toutes')   p.set('cat', activeFam);
  if(activeSort !== 'default')  p.set('tri', activeSort);
  const q = document.getElementById('shopSearch').value.trim();
  if(q) p.set('q', q);
  const url = location.pathname + (p.toString() ? '?' + p : '');
  history.replaceState(null, '', url);
}
function readUrl(){
  const p = new URLSearchParams(location.search);
  if(p.get('vue'))  activeCat  = p.get('vue');
  if(p.get('cat'))  activeFam  = p.get('cat');
  if(p.get('tri'))  activeSort = p.get('tri');
  if(p.get('q'))    document.getElementById('shopSearch').value = p.get('q');
  // Ancien lien "Voir les packs" depuis l'accueil
  if(location.hash === '#packs') activeCat = 'Tous';
}

function runSearch(){ renderShop(); }

/* La recherche se relance à la frappe, mais après une courte pause :
   sans ça, chaque lettre re-générait les 36 cartes et relançait
   l'animation d'apparition, ce qui faisait clignoter la grille. */
let searchTimer = null;
const searchInput = document.getElementById('shopSearch');
searchInput.addEventListener('input', ()=>{
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderShop, 180);
});
searchInput.addEventListener('keydown', e=>{
  if(e.key === 'Enter'){ e.preventDefault(); clearTimeout(searchTimer); runSearch(); searchInput.blur(); }
  if(e.key === 'Escape' && searchInput.value){ searchInput.value = ''; renderShop(); }
});

document.querySelectorAll('.shop-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.shop-tab').forEach(t=>{
      t.classList.remove('active');
      t.setAttribute('aria-selected','false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    activeCat = tab.dataset.cat;
    renderShop();
  });
});

const sortSelect = document.getElementById('shopSort');
if(sortSelect){
  sortSelect.addEventListener('change', ()=>{ activeSort = sortSelect.value; renderShop(); });
}

/* ---------- Démarrage ---------- */
readUrl();
document.querySelectorAll('.shop-tab').forEach(t=>{
  const on = t.dataset.cat === activeCat;
  t.classList.toggle('active', on);
  t.setAttribute('aria-selected', String(on));
});
if(sortSelect) sortSelect.value = activeSort;
renderShop();
