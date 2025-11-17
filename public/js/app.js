const api = '/api';
let PRODUCTS = [];
let CART = { items: [] };

async function fetchProducts() {
  const search = document.getElementById('search')?.value || '';
  const category = document.getElementById('category')?.value || '';
  const params = new URLSearchParams();
  if (search) params.append('q', search);
  if (category) params.append('category', category);
  const res = await fetch(`/api/products?${params.toString()}`);
  const data = await res.json();
  PRODUCTS = data.products || data;
  populateProducts();
  populateCategories();
}

function populateProducts() {
  const container = document.getElementById('products');
  if(!container) return;
  container.innerHTML = '';
  PRODUCTS.forEach(p => {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <p>${p.category || ''}</p>
      <p>${p.description || ''}</p>
      <button data-id="${p._id}" class="add-btn">Add to cart</button>`;
    container.appendChild(c);
  });
  document.querySelectorAll('.add-btn').forEach(b => b.onclick = () => addToCart(b.dataset.id));
}

function populateCategories() {
  const sel = document.getElementById('category');
  if(!sel) return;
  const cats = new Set(PRODUCTS.map(p => p.category).filter(Boolean));
  sel.innerHTML = '<option value="">All Categories</option>';
  cats.forEach(c => { sel.innerHTML += `<option value="${c}">${c}</option>`; });
}

function addToCart(productId) {
  const existing = CART.items.find(i => i.productId === productId);
  if (existing) existing.qty += 1;
  else CART.items.push({ productId, qty: 1 });
  updateCartCount();
  saveCartLocal();
}

function updateCartCount() {
  const total = CART.items.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.innerText = total;
}

function saveCartLocal() { localStorage.setItem('cart', JSON.stringify(CART)); }
function loadCartLocal() { const raw = localStorage.getItem('cart'); if (raw) CART = JSON.parse(raw); updateCartCount(); }

function showCart() {
  const modal = document.getElementById('cart-modal');
  const itemsDiv = document.getElementById('cart-items');
  if(!modal || !itemsDiv) return;
  itemsDiv.innerHTML = '';
  let total = 0;
  CART.items.forEach(it => {
    const p = PRODUCTS.find(x => x._id === it.productId);
    const el = document.createElement('div');
    el.innerHTML = `<strong>${p?.name || 'Product'}</strong> x ${it.qty} = ₹${(p?.price||0)*it.qty}`;
    itemsDiv.appendChild(el);
    total += (p?.price||0)*it.qty;
  });
  document.getElementById('cart-total').innerText = total;
  modal.classList.remove('hidden');
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'view-cart') showCart();
  if (e.target && e.target.id === 'close-cart') document.getElementById('cart-modal').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', async () => {
  loadCartLocal();
  document.getElementById('search')?.addEventListener('input', fetchProducts);
  document.getElementById('category')?.addEventListener('change', fetchProducts);
  document.getElementById('checkout')?.addEventListener('click', async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) { alert('Please login to checkout'); return; }
    const items = CART.items.map(i => ({ productId: i.productId, qty: i.qty }));
    const total = Number(document.getElementById('cart-total')?.innerText || 0);
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken },
      body: JSON.stringify({ userId: 'me', items, total, paymentMethod: 'stripe' })
    });
    const data = await res.json();
    if (data.clientSecret) alert('Stripe clientSecret returned. Integrate Stripe.js on frontend to complete payment.');
    else if (data.razorpayOrder) alert('Razorpay order created. Integrate Razorpay checkout on frontend.');
    else alert('Order created with id: ' + data.orderId);
  });
  await fetchProducts();
});
