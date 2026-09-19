/* ==========================================================================
   script.js — logique propre à index.html uniquement.
   Suppose que shared.js et cart.js sont chargés AVANT ce fichier.
   ========================================================================== */

const TESTIMONIALS = [
  {name:"Aïssatou D.", role:"Élève en Terminale, Dakar", quote:"Les fiches sur la gestion du temps m'ont vraiment aidée à tenir pendant le Bac blanc. Et le sac tient encore nickel après un an.", color:"#16305B"},
  {name:"Moussa K.", role:"Parent d'élève, Thiès", quote:"Commander sur WhatsApp c'était super simple, livré en 2 jours. La qualité des cahiers est clairement au-dessus de la moyenne.", color:"#2E4E85"}
];

const FAQS = [
  {q:"Comment passer une commande ?", a:"Choisissez votre pack, ajoutez-le au panier puis cliquez sur « Valider sur WhatsApp ». On confirme votre commande et le paiement directement sur WhatsApp, en général sous 2h."},
  {q:"Quels sont les délais de livraison ?", a:"Comptez jusqu'à 48h pour Dakar et sa banlieue — vous êtes prévenu(e) en cas de retard. Une livraison dans les autres régions du Sénégal est possible, au cas par cas : écrivez-nous pour un délai précis."},
  {q:"Comment puis-je payer ?", a:"Wave, Orange Money, ou en espèces à la livraison. Le montant exact, livraison comprise, vous est confirmé sur WhatsApp avant tout paiement."},
  {q:"Puis-je retourner un produit ?", a:"Oui, tout article non utilisé peut être échangé sous 7 jours avec preuve d'achat. Contactez-nous simplement sur WhatsApp."},
  {q:"Le contenu éducatif est-il payant ?", a:"Non, quand le hub Student Resources sera lancé, il sera gratuit et accessible à tous, sans compte à créer."},
  {q:"Proposez-vous des tarifs pour les écoles ?", a:"Oui, nous avons des offres dédiées pour les commandes groupées d'écoles ou d'associations de parents d'élèves. Écrivez-nous via le formulaire de contact."}
];

/* ---------- RENDER ---------- */
document.getElementById('packGrid').innerHTML = PACKS.map(packCard).join('');

/* Aperçu boutique sur l'accueil : le visiteur voit des produits et des prix
   sans avoir à changer de page. Le premier article du catalogue porte le
   badge BEST-SELLER, les suivants suivent l'ordre de shared.js. */
const previewEl = document.getElementById('articlePreview');
if(previewEl){
  const featured = [
    ...ARTICLES.filter(a => a.badge),
    ...ARTICLES.filter(a => !a.badge && a.image)
  ].slice(0, 4);
  previewEl.innerHTML = featured.map(articleCard).join('');
}

/* Le nombre de témoignages pilote le nombre de colonnes : avec 2 avis dans
   une grille de 3, la troisième colonne restait vide sur grand écran. */
const testiGrid = document.getElementById('testiGrid');
testiGrid.style.setProperty('--testi-cols', Math.min(TESTIMONIALS.length, 3));
testiGrid.innerHTML = TESTIMONIALS.map(t=>`
  <figure class="testi-card reveal">
    <div class="stars" role="img" aria-label="Noté 5 sur 5">★★★★★</div>
    <blockquote class="quote">« ${t.quote} »</blockquote>
    <figcaption class="testi-person">
      <span class="avatar" style="background:${t.color};" aria-hidden="true">${t.name.split(' ').map(w=>w[0]).join('')}</span>
      <span><span class="name">${t.name}</span><span class="role">${t.role}</span></span>
    </figcaption>
  </figure>`).join('');

document.getElementById('faqList').innerHTML = FAQS.map((f,i)=>`
  <div class="faq-item" id="faq-${i}">
    <h3 class="faq-q">
      <button type="button" class="faq-btn" aria-expanded="false" aria-controls="faq-a-${i}" onclick="toggleFaq(${i})">
        <span>${f.q}</span>
        <span class="faq-icon" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>
      </button>
    </h3>
    <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-${i}"><p>${f.a}</p></div>
  </div>`).join('');

/* Ouverture sur la hauteur réelle du contenu : une réponse longue n'est
   plus coupée par une hauteur maximale fixe. */
function toggleFaq(i){
  const item = document.getElementById('faq-'+i);
  const panel = item.querySelector('.faq-a');
  const btn = item.querySelector('.faq-btn');
  const open = !item.classList.contains('open');
  item.classList.toggle('open', open);
  panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
  btn.setAttribute('aria-expanded', String(open));
}

/* ---------- INTERACTIONS ---------- */
function submitContact(e){
  e.preventDefault();
  const nom = document.getElementById('cf-nom').value.trim();
  const sujet = document.getElementById('cf-sujet').value;
  const message = document.getElementById('cf-message').value.trim();
  window.open(waLink(`Bonjour S'Cool,\n\nNom : ${nom}\nSujet : ${sujet}\n\nMessage :\n${message}`), '_blank', 'noopener');
  e.target.reset();
  return false;
}

/* Newsletter : il n'y a pas encore de service d'envoi branché derrière.
   Plutôt que d'afficher une fausse confirmation d'inscription, on bascule
   la demande sur WhatsApp — le seul canal réellement relevé aujourd'hui. */
function submitNewsletter(e){
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value.trim();
  if(!email) return false;
  window.open(waLink(`Bonjour S'Cool, je souhaite recevoir vos nouveautés. Mon email : ${email}`), '_blank', 'noopener');
  showToast('Merci ! Confirmez simplement l\'envoi sur WhatsApp.');
  e.target.reset();
  return false;
}

/* Lien de navigation actif au défilement.
   Lecture des positions groupée dans un requestAnimationFrame : avant,
   chaque événement de scroll interrogeait offsetTop de 6 sections,
   ce qui forçait le navigateur à recalculer la mise en page en continu. */
const sections = ['home','shop','resources','blog','about','contact'];
const navA = document.querySelectorAll('.nav-links a');
let navTicking = false;
function updateActiveNav(){
  let current = 'home';
  sections.forEach(id=>{
    const el = document.getElementById(id);
    if(el && window.scrollY >= el.offsetTop - 160) current = id;
  });
  navA.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === '#'+current));
  navTicking = false;
}
window.addEventListener('scroll', ()=>{
  if(navTicking) return;
  navTicking = true;
  requestAnimationFrame(updateActiveNav);
}, {passive:true});

observeReveals();
