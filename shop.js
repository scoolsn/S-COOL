/* ==========================================================================
   shop.js — logique propre à shop.html uniquement.
   Suppose que shared.js et cart.js sont chargés AVANT ce fichier.

   Structure de la boutique :
   - Onglet "Articles"  -> grille verticale d'articles uniquement
   - Onglet "Packs"     -> grille de packs uniquement
   - Onglet "Tout voir" -> LES PACKS D'ABORD (bande scrollable sur mobile),
                           puis les articles en dessous.
   ========================================================================== */

let activeCat = 'Articles';

function matchQuery(item, q){
  if(!q) return true;
  return item.name.toLowerCase().includes(q) ||
         (item.desc && item.desc.toLowerCase().includes(q)) ||
         (item.cat && item.cat.toLowerCase().includes(q));
}

function renderShop(){
  const query = document.getElementById('shopSearch').value.trim().toLowerCase();

  const packs    = PACKS.filter(p => matchQuery(p, query));
  const articles = ARTICLES.filter(a => matchQuery(a, query));

  const grid          = document.getElementById('shopGrid');
  const empty         = document.getElementById('shopEmpty');
  const packsSection  = document.getElementById('packsSection');
  const packsStrip    = document.getElementById('packsStrip');
  const articlesTitle = document.getElementById('articlesTitle');

  // Réinitialise les sections
  packsSection.style.display  = 'none';
  articlesTitle.style.display = 'none';

  let total = 0;

  if(activeCat === 'Tous'){
    // 1) Les packs d'abord, en bande scrollable
    if(packs.length){
      packsSection.style.display = 'block';
      packsStrip.innerHTML = packs.map(packCard).join('');
      total += packs.length;
    }
    // 2) Puis les articles, en grille verticale
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

  // État vide
  if(total === 0){
    empty.style.display = 'block';
    document.getElementById('shopEmptyTitle').textContent = query
      ? `Aucun résultat pour "${query}" — pas encore ajouté au site`
      : `Rien dans cette catégorie pour l'instant`;
    const waMsg = encodeURIComponent(query
      ? `Bonjour S'Cool, je cherche : "${query}". Est-ce disponible ?`
      : `Bonjour S'Cool, avez-vous d'autres produits que ceux du site ?`);
    document.getElementById('shopEmptyBtn').href = `https://wa.me/221762098743?text=${waMsg}`;
  } else {
    empty.style.display = 'none';
  }

  observeReveals();
}

function runSearch(){ renderShop(); }

document.getElementById('shopSearch').addEventListener('input', renderShop);
document.getElementById('shopSearch').addEventListener('keydown', e=>{ if(e.key === 'Enter') runSearch(); });

document.querySelectorAll('.shop-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    renderShop();
  });
});

// Si on arrive depuis "Voir les packs" (#packs), ouvrir l'onglet Tout voir
if(window.location.hash === '#packs'){
  activeCat = 'Tous';
  document.querySelectorAll('.shop-tab').forEach(t=>
    t.classList.toggle('active', t.dataset.cat === 'Tous'));
}

renderShop();
