fetch('/api/products').then(r=>r.json()).then(d=>{
  const c=document.getElementById('products');
  d.forEach(p=>{
    const el=document.createElement('div');
    el.className='card';
    el.innerHTML=`<h3>${p.name}</h3><p>${p.price}</p>`;
    c.appendChild(el);
  });
});