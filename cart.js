/* ==========================================================================
   cart.js — État du panier, partagé entre index.html et shop.html.
   Chargé APRÈS shared.js (a besoin de PACKS/ARTICLES/findItem/priceStr).

   Persistance : localStorage, sous la clé "scool_cart".
   -> Ça permet au panier de survivre à un changement de page (index.html
      <-> shop.html), contrairement à une simple variable JS qui se
      réinitialiserait à chaque chargement de page.
   -> Limite connue : en navigation privée ou dans un aperçu en bac à sable,
      localStorage peut être bloqué. Le panier reste alors fonctionnel pour
      la session en cours, il ne survit simplement pas au changement de page.
   ========================================================================== */

/* ---------- LIVRAISON ----------
   Le panier affiche une ligne "Livraison" séparée AVANT d'ouvrir WhatsApp,
   pour que le client ne découvre pas le supplément au dernier moment.
   Tant que DELIVERY_FEE vaut null, la ligne affiche "confirmée sur WhatsApp"
   (aucun montant inventé).
   -> Dès que tu connais ton tarif, mets par exemple :
        const DELIVERY_FEE = 1000;          // 1 000 FCFA sur Dakar
        const FREE_DELIVERY_FROM = 15000;   // offerte au-dessus de 15 000
      et le total se calcule tout seul. Mets FREE_DELIVERY_FROM à null
      si tu ne veux pas de seuil de gratuité. */
const DELIVERY_FEE = null;
const FREE_DELIVERY_FROM = null;

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

// État du panier : { id_produit: { qty, color } }
let cart = loadCart();

/* Seules les lignes qui correspondent encore à un produit existant comptent.
   Sinon un produit retiré du catalogue restait compté dans la pastille du
   panier alors qu'il n'apparaissait plus dans le tiroir. */
function cartEntries(){
  return Object.entries(cart).filter(([id]) => findItem(id));
}

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
  if(cart[cartKey]){
    cart[cartKey].qty += 1;
  } else {
    cart[cartKey] = { qty: 1, color: colorName };
  }
  saveCart();
  renderCart();
  const item = findItem(id);
  const label = (item ? item.name : 'Article') + (colorName ? ' ('+colorName+')' : '');
  showToast(label + ' ajouté au panier');
}

/* Utilisé par les boutons +/- DU TIROIR (la clé est déjà la clé de panier
   complète, variante couleur comprise). */
function changeQty(key, delta){
  if(!cart[key]) return;
  cart[key].qty += delta;
  if(cart[key].qty <= 0) delete cart[key];
  saveCart();
  renderCart();
  if(typeof refreshCardAction === 'function') refreshCardAction(String(key).split('::')[0]);
}

function removeFromCart(key){
  delete cart[key];
  saveCart();
  renderCart();
  // remet le bouton "Ajouter" sur la carte produit correspondante
  if(typeof refreshCardAction === 'function') refreshCardAction(String(key).split('::')[0]);
}

function cartCount(){
  return cartEntries().reduce((sum, [, item]) => sum + item.qty, 0);
}
function cartSubtotal(){
  return cartEntries().reduce((sum, [id, item]) => {
    const p = findItem(id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}
/* Retourne le montant de la livraison, ou null si elle n'est pas chiffrée. */
function deliveryFee(){
  if(DELIVERY_FEE == null) return null;
  const sub = cartSubtotal();
  if(sub === 0) return 0;
  if(FREE_DELIVERY_FROM != null && sub >= FREE_DELIVERY_FROM) return 0;
  return DELIVERY_FEE;
}
function cartTotal(){ return cartSubtotal() + (deliveryFee() || 0); }

function renderCart(){
  const count = cartCount();
  document.querySelectorAll('.cart-badge').forEach(b=>{
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
  document.querySelectorAll('.cart-btn').forEach(b=>{
    b.setAttribute('aria-label', count > 0 ? `Voir le panier (${count} article${count>1?'s':''})` : 'Voir le panier');
  });

  const itemsEl = document.getElementById('cartItems');
  if(!itemsEl) return; // le panier n'est peut-être pas dans le DOM de cette page

  const entries = cartEntries();
  if(entries.length === 0){
    itemsEl.innerHTML = `<div class="cart-empty">
        <p>Ton panier est vide pour l'instant.</p>
        <a class="btn btn-outline btn-sm" href="shop.html">Voir la boutique</a>
      </div>`;
  } else {
    itemsEl.innerHTML = entries.map(([id, item])=>{
      const p = findItem(id);
      const isPack = PACKS.includes(p);
      const thumb = (!isPack && p.image)
        ? `<img src="${p.image}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ci-fallback',innerHTML:ARTICLE_ICON}))">`
        : (isPack ? PACK_ICON : ARTICLE_ICON);
      return `<div class="cart-item">
        <div class="ci-icon" style="color:${p.accent || 'var(--green)'};">${thumb}</div>
        <div class="ci-info">
          <h6>${p.name}${item.color ? ' <span class="ci-variant">· '+item.color+'</span>' : ''}</h6>
          <span class="mono ci-unit">${priceStr(p.price)}</span>
          <div class="ci-qty">
            <button type="button" onclick="changeQty('${id}', -1)" aria-label="Retirer un ${attr(p.name)}">−</button>
            <span aria-live="polite">${item.qty}</span>
            <button type="button" onclick="changeQty('${id}', 1)" aria-label="Ajouter un ${attr(p.name)}">+</button>
            <span class="ci-line">${priceStr(p.price * item.qty)}</span>
          </div>
        </div>
        <button type="button" class="ci-remove" onclick="removeFromCart('${id}')" aria-label="Retirer ${attr(p.name)} du panier">✕</button>
      </div>`;
    }).join('');
  }

  // Sous-total / livraison / total : le client voit le montant réel avant WhatsApp.
  const sub = cartSubtotal(), fee = deliveryFee();
  const subEl = document.getElementById('cartSubtotal');
  const feeEl = document.getElementById('cartDelivery');
  const totalEl = document.getElementById('cartTotal');
  const hintEl = document.getElementById('cartDeliveryHint');
  if(subEl) subEl.textContent = priceStr(sub);
  if(feeEl){
    feeEl.textContent = fee == null ? 'confirmée sur WhatsApp'
                      : fee === 0   ? (sub === 0 ? '0 FCFA' : 'Offerte')
                      : priceStr(fee);
    feeEl.classList.toggle('is-tbc', fee == null);
  }
  if(totalEl) totalEl.textContent = priceStr(cartTotal());
  if(hintEl){
    let msg = '';
    if(sub > 0 && DELIVERY_FEE != null && FREE_DELIVERY_FROM != null && sub < FREE_DELIVERY_FROM){
      msg = `Plus que ${priceStr(FREE_DELIVERY_FROM - sub)} pour la livraison offerte.`;
    } else if(sub > 0 && DELIVERY_FEE == null){
      msg = 'Le montant de la livraison te sera confirmé sur WhatsApp avant paiement.';
    }
    hintEl.textContent = msg;
    hintEl.style.display = msg ? 'block' : 'none';
  }
}

/* ---------- OUVERTURE / FERMETURE DU TIROIR ----------
   Le tiroir est une boîte de dialogue : on verrouille le scroll du fond,
   on piège le focus dedans et Échap le ferme (géré dans shared.js). */
let cartLastFocused = null;
function openCart(){
  const drawer = document.getElementById('cartDrawer');
  if(!drawer) return;
  cartLastFocused = document.activeElement;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  document.getElementById('cartOverlay').classList.add('open');
  lockScroll(true, 'cart');
  const first = drawer.querySelector('.cart-close');
  if(first) first.focus();
}
function closeCart(){
  const drawer = document.getElementById('cartDrawer');
  if(!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  document.getElementById('cartOverlay').classList.remove('open');
  lockScroll(false, 'cart');
  if(cartLastFocused && cartLastFocused.focus) cartLastFocused.focus();
}

/* Piège à focus : tant que le tiroir est ouvert, Tab tourne à l'intérieur. */
document.addEventListener('keydown', function(e){
  if(e.key !== 'Tab') return;
  const drawer = document.getElementById('cartDrawer');
  const modal  = document.getElementById('productModal');
  const box = (modal && modal.classList.contains('open')) ? modal
            : (drawer && drawer.classList.contains('open')) ? drawer : null;
  if(!box) return;
  const f = [...box.querySelectorAll('a[href], button:not([disabled]), input, select, textarea')]
    .filter(el => el.offsetParent !== null);
  if(!f.length) return;
  const first = f[0], last = f[f.length-1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

function checkoutCartWhatsapp(){
  const entries = cartEntries();
  if(entries.length === 0){ showToast('Ton panier est vide.'); return; }
  const lines = ["Bonjour S'Cool, je souhaite commander :"];
  entries.forEach(([id, item])=>{
    const p = findItem(id);
    lines.push(`- ${p.name}${item.color ? ' ('+item.color+')' : ''} x${item.qty} (${priceStr(p.price * item.qty)})`);
  });
  const fee = deliveryFee();
  lines.push('');
  lines.push(`Sous-total : ${priceStr(cartSubtotal())}`);
  lines.push(`Livraison Dakar : ${fee == null ? 'à confirmer' : fee === 0 ? 'offerte' : priceStr(fee)}`);
  lines.push(`TOTAL ${fee == null ? '(hors livraison)' : ''}: ${priceStr(cartTotal())}`);
  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
}

renderCart();
