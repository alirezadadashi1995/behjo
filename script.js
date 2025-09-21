// script.js — منو/مودال/سبدخرید ساده (حافظه محلی)
document.addEventListener('DOMContentLoaded', ()=>{

  /* helpers */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // cart in localStorage
  const CART_KEY = 'behjo_cart_v1';
  function loadCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch(e){return[]}}
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)) }
  function cartCount(){ return loadCart().reduce((s,i)=>s+i.qty,0) }

  // update cart badge
  function updateCartBadge(){
    $$('.cart-count').forEach(el=> el.textContent = cartCount() )
  }
  updateCartBadge();

  // add-to-cart buttons
  $$( '.add-cart' ).forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = btn.dataset.id || Date.now();
      const title = btn.dataset.title || btn.closest('.product')?.querySelector('h3')?.textContent || 'محصول';
      const price = Number(btn.dataset.price || 0);
      const cart = loadCart();
      const found = cart.find(x=>x.id==id);
      if(found) found.qty++;
      else cart.push({id, title, price, qty:1});
      saveCart(cart);
      updateCartBadge();
      // visual feedback
      btn.innerText = 'افزوده شد ✓';
      setTimeout(()=> btn.innerText = 'افزودن به سبد', 1200);
    })
  });

  // open cart drawer
  $('.open-cart')?.addEventListener('click', ()=>{
    const drawer = $('.cart-drawer'); drawer.style.display='flex';
    renderCart();
  });

  // close cart
  $$('.close-drawer').forEach(b=>b.addEventListener('click', ()=>{
    $('.cart-drawer').style.display='none';
  }));

  // render cart
  function renderCart(){
    const box = document.querySelector('.cart-body');
    if(!box) return;
    const cart = loadCart();
    if(cart.length===0){ box.innerHTML = '<p class="center">سبد خرید خالی است.</p>'; return }
    box.innerHTML = '';
    cart.forEach(item=>{
      const el = document.createElement('div');
      el.className='row';
      el.style.justifyContent='space-between';
      el.innerHTML = `<div><strong>${item.title}</strong><div style="color:#666">${item.qty} × ${item.price.toLocaleString()} تومان</div></div>
        <div class="row">
          <button class="icon-btn" data-id="${item.id}" data-op="dec">−</button>
          <button class="icon-btn" data-id="${item.id}" data-op="inc">+</button>
        </div>`;
      box.appendChild(el);
    });
    // attach handlers
    $$('.icon-btn[data-op]').forEach(btn=>{
      btn.onclick = (e)=>{
        const id = btn.dataset.id;
        const op = btn.dataset.op;
        const cart = loadCart();
        const it = cart.find(x=>x.id==id);
        if(!it) return;
        if(op==='inc') it.qty++;
        else it.qty = Math.max(0, it.qty-1);
        const filtered = cart.filter(x=>x.qty>0);
        saveCart(filtered);
        updateCartBadge(); renderCart();
      }
    });
  }

  // login modal
  $('.open-login')?.addEventListener('click', ()=> $('.login-modal').style.display='flex');
  $$('.close-modal').forEach(b=>b.addEventListener('click', ()=> { b.closest('.modal').style.display='none' } ));

  // supplier quick form
  $('#supplier-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.querySelector('[name=name]').value,
      contact: form.querySelector('[name=contact]').value,
      type: form.querySelector('[name=type]').value
    };
    alert('درخواست شما ثبت شد. با شما تماس گرفته می‌شود.\n' + JSON.stringify(data));
    form.reset();
  });

  // comment forms
  $$('.comment-form').forEach(form=>{
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const wrap = form.closest('.product') || form.closest('.card');
      const list = wrap.querySelector('.reviews-list');
      const name = form.querySelector('[name=name]').value || 'کاربر';
      const text = form.querySelector('[name=text]').value || '';
      if(!text) return alert('نظر نمی‌تواند خالی باشد.');
      const div = document.createElement('div'); div.className='review';
      div.innerHTML = `<h5>${name}</h5><p>${text}</p>`;
      list.prepend(div);
      form.reset();
    })
  });

  // category toggles for pages (data-sub attr)
  $$('.cat').forEach(el=>{
    el.addEventListener('click', ()=>{
      const target = el.dataset.target;
      if(!target) return;
      $$('.sub-list').forEach(s=> s.classList.add('hidden'));
      document.querySelector(`#${target}`)?.classList.remove('hidden');
      window.scrollTo({top:200, behavior:'smooth'});
    })
  });

});
