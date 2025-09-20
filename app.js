const SAMPLE = [
  {id:'p1',market:'b2b',title:'لبنیات مدارس — شیر 1 لیتری',desc:'شیر پگاه، بسته 12 عددی',price:'245,000 تومان',img:'images/dairy.jpg',rating:4.5,rating_count:12,badge:'-10%'},
  {id:'p2',market:'b2b',title:'لوازم تحریر عمده — خودکار 100تایی',desc:'خودکار ساده، بسته 100 عددی',price:'120,000 تومان',img:'images/stationery-bulk.jpg',rating:4.1,rating_count:8},
  {id:'p3',market:'b2c',title:'بسته تغذیه — صبحانه سالم',desc:'بسته اختصاصی تغذیه مدرسه',price:'32,000 تومان',img:'images/food-pack.jpg',rating:4.8,rating_count:45,badge:'پرفروش'},
  {id:'p4',market:'b2c',title:'کیف مدرسه — طرح کودک',desc:'کیف ارگونومیک برای سنین 6-10',price:'420,000 تومان',img:'images/bag.jpg',rating:4.3,rating_count:21},
  {id:'p5',market:'c2c',title:'کتاب درسی دست دوم — ریاضی',desc:'حالت: سالم، جلد سالم',price:'25,000 تومان',img:'images/book-used.jpg',rating:4.0,rating_count:3},
  {id:'p6',market:'c2c',title:'دفتر 60 برگ دست دوم',desc:'دفتر سیمی در حد نو',price:'7,000 تومان',img:'images/notebook-used.jpg',rating:3.9,rating_count:2}
];

function stars(r){
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1:0;
  return '★'.repeat(full)+(half?'☆':'') ;
}

function renderGrid(target, items){
  const el = document.getElementById(target);
  if(!el) return;
  el.innerHTML = '';
  items.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="card-media"><img src="${p.img}" alt="${p.title}">${p.badge?'<div class="badge">'+p.badge+'</div>':''}</div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-meta"><span class="price">${p.price}</span><button class="add-cart" data-id="${p.id}">افزودن به سبد</button></div>
        <div class="rating-sample">${stars(p.rating)} <span class="rating-count">(${p.rating_count})</span></div>
        <a class="view-details" href="#">مشاهده جزئیات</a>
      </div>`;
    el.appendChild(div);
  });
}

function init(){
  // Featured on index
  const featured = SAMPLE.slice(0,4);
  renderGrid('featured-grid', featured);

  // product pages - if grid exists, render after filtering & search
  const grid = document.getElementById('product-grid');
  if(grid){
    const templateHTML = document.getElementById('product-card-template').innerHTML;
    const search = document.getElementById('search');
    const filter = document.getElementById('market-filter');

    function apply(){
      const q = search?search.value.trim().toLowerCase():'';
      const f = filter?filter.value:'all';
      let out = SAMPLE.filter(p=>{
        if(f!=='all' && p.market!==f) return false;
        if(q && !(p.title+p.desc).toLowerCase().includes(q)) return false;
        return true;
      });
      renderGrid('product-grid', out);
    }
    if(search) search.addEventListener('input',apply);
    if(filter) filter.addEventListener('change',apply);
    apply();
  }

  // simple add to cart alerts (local)
  document.body.addEventListener('click',function(e){
    if(e.target.matches('.add-cart')){
      const id = e.target.dataset.id;
      alert('محصول به سبد اضافه شد: '+id);
    }
  });
}

window.addEventListener('DOMContentLoaded',init);
