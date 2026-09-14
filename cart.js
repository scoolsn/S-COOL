/* ==========================================================================
   cart.js — État du panier, partagé entre index.html et shop.html.
   Chargé APRÈS shared.js (a besoin de PACKS/ARTICLES/findItem/priceStr).

   Persistance : localStorage, sous la clé "scool_cart".
   -> Ça permet au panier de survivre à un changement de page (index.html
      <-> shop.html), contrairement à une simple variable JS qui se
      réinitialiserait à chaque chargement de page.
   -> Limite connue : dans l'aperçu de fichier À L'INTÉRIEUR de Claude.ai,
      localStorage peut être bloqué par le bac à sable et donc ne pas
      persister. Une fois le site ouvert via Live Server ou ton lien
      GitHub Pages (donc dans un vrai navigateur), ça fonctionne normalement.
   ========================================================================== */

function loadCart(){
  try {
    const raw = localStorage.getItem('scool_cart');
    return raw ? JSON.parse(raw) : {};
  } catch(e){
    return {}; // localStorage indisponible (mode privé, sandbox...) : on continue sans persister
  }
}
function saveCart(){
  try { localStorage.setItem('scool_cart', JSON.stringify(cart)); }
  catch(e){ /* stockage indisponible : le panier reste fonctionnel pour la session en cours */ }
}

// État du panier : { id_produit: { qty, trousse } }
let cart = loadCart();

function addToCart(id, hasColors){
  let cartKey = id;
  let colorName = '';
  if(hasColors){
    const item = findItem(id);
    const idx = (typeof selectedColors !== 'undefined' && selectedColors[id] != null) ? selectedColors[id] : 0;
    if(item && item.colors && item.colors[idx]){
      colorName = item.colors[idx].name;
      cartKey = id + '::' + colorName;
    }
  }
  const trousseEl = document.getElementById('trousse-'+id);
  const wantsTrousse = !!(trousseEl && trousseEl.checked);
  if(cart[cartKey]) cart[cartKey].qty += 1;
  else cart[cartKey] = { qty: 1, trousse: wantsTrousse, color: colorName };
  saveCart();
  renderCart();
  const item = findItem(id);
  const label = (item ? item.name : 'Article') + (colorName ? ' ('+colorName+')' : '');
  showToast(label + ' ajouté au panier');
}
function changeQty(id, delta){
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}
function removeFromCart(id){
  delete cart[id];
  saveCart();
  renderCart();
  // remet le bouton "Ajouter" sur la carte produit correspondante
  const baseId = id.split('::')[0];
  if(typeof refreshCardAction === 'function') refreshCardAction(baseId);
}
function cartCount(){
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}
function cartTotal(){
  return Object.entries(cart).reduce((sum, [id, item]) => {
    const p = findItem(id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}
function renderCart(){
  const count = cartCount();
  document.querySelectorAll('.cart-badge').forEach(b=>{
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });

  const itemsEl = document.getElementById('cartItems');
  if(!itemsEl) return; // le panier n'est peut-être pas dans le DOM de cette page

  const entries = Object.entries(cart).filter(([id]) => findItem(id));
  if(entries.length === 0){
    itemsEl.innerHTML = `<p style="color:var(--ink-soft); text-align:center; padding:40px 0; font-size:14px;">Ton panier est vide pour l'instant.</p>`;
  } else {
    itemsEl.innerHTML = entries.map(([id, item])=>{
      const p = findItem(id);
      return `<div class="cart-item">
        <div class="ci-icon" style="color:${p.accent || 'var(--blue)'};">${PACKS.includes(p) ? PACK_ICON : ARTICLE_ICON}</div>
        <div class="ci-info">
          <h6>${p.name}${item.color ? ' <span class="mono" style="font-size:11px; color:var(--ink-soft);">· '+item.color+'</span>' : ''}${item.trousse ? ' <span class="mono" style="font-size:11px; color:var(--ink-soft);">+ trousse</span>' : ''}</h6>
          <span class="mono">${priceStr(p.price)} × ${item.qty}</span>
        </div>
        <button class="ci-remove" onclick="removeFromCart('${id}')" aria-label="Retirer">✕</button>
      </div>`;
    }).join('');
  }
  const totalEl = document.getElementById('cartTotal');
  if(totalEl) totalEl.textContent = priceStr(cartTotal());
}

function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function checkoutCartWhatsapp(){
  const entries = Object.entries(cart).filter(([id]) => findItem(id));
  if(entries.length === 0){ showToast('Ton panier est vide.'); return; }
  let lines = ["Bonjour S'Cool, je souhaite commander :"];
  entries.forEach(([id, item])=>{
    const p = findItem(id);
    lines.push(`- ${p.name}${item.color ? ' ('+item.color+')' : ''} x${item.qty} (${priceStr(p.price * item.qty)})${item.trousse ? ' + trousse (prix à confirmer)' : ''}`);
  });
  lines.push(`Total : ${priceStr(cartTotal())}`);
  const msg = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/221762098743?text=${msg}`, '_blank');
}

renderCart();
