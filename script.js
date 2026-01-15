// حالة التطبيق
const appState = {
    currentCurrency: localStorage.getItem('trendCardCurrency') || 'USD',
    currentSectionId: null,
    currentProduct: null,
    searchQuery: '',
    sortType: 'default',
    viewMode: localStorage.getItem('trendCardViewMode') || 'grid',
    isDarkMode: true,
    isLoading: false,
    currentPage: 1,
    filteredProducts: []
};

// تهيئة التطبيق
function initApp() {
    setupMobileMenu();
    setupScrollTop();
    setupThemeToggle();
    setupHeaderScroll();
    setupSearch();
    setupSort();
    setupViewToggle();
    setupModal();
    setupCurrency();
    setupAnimations();
    setupAccessibility();
    
    // تحديث حالة التطبيق
    updateAppState();
    
    console.log('Trend Card App Initialized');
}

// تحديث حالة التطبيق
function updateAppState() {
    // تحديث العملة
    const currencyToggle = document.querySelector('.currency-toggle');
    if (currencyToggle) {
        currencyToggle.textContent = appState.currentCurrency === 'USD' ? 
            '﷼ تبديل إلى الريال اليمني' : 
            '$ تبديل إلى الدولار الأمريكي';
    }
    
    // تحديث وضع العرض
    const viewBtns = document.querySelectorAll('.view-btn');
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === appState.viewMode);
        });
    }
    
    // حفظ التفضيلات
    localStorage.setItem('trendCardCurrency', appState.currentCurrency);
    localStorage.setItem('trendCardViewMode', appState.viewMode);
}

// تحميل الأقسام في الصفحة الرئيسية
function loadSections() {
    const container = document.getElementById('sections-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    sections.forEach(section => {
        const sectionColor = sectionColors[section.color] || sectionColors.blue;
        
        const sectionCard = document.createElement('div');
        sectionCard.className = 'section-card';
        sectionCard.style.setProperty('--section-color', sectionColor.primary);
        sectionCard.setAttribute('role', 'button');
        sectionCard.setAttribute('tabindex', '0');
        sectionCard.setAttribute('aria-label', `القسم: ${section.name} - ${section.description}`);
        
        sectionCard.addEventListener('click', () => goToSection(section.id));
        sectionCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSection(section.id);
            }
        });
        
        // عدد المنتجات في القسم
        const productsCount = products.filter(p => p.sectionId === section.id).length;
        
        sectionCard.innerHTML = `
            <div class="section-card-header">
                <img src="${section.image}" 
                     alt="${section.name}" 
                     class="section-card-image"
                     loading="lazy"
                     width="280"
                     height="180">
                <div class="section-card-overlay">
                    <div class="section-card-icon" style="background: ${sectionColor.primary}">
                        <i class="${section.icon}"></i>
                    </div>
                </div>
            </div>
            <div class="section-card-content">
                <h3 class="section-card-title">${section.name}</h3>
                <p class="section-card-description">${section.description}</p>
                <div class="section-card-meta">
                    <span class="section-card-count">${productsCount} منتج</span>
                    ${section.featured ? '<span class="section-card-featured">مميز</span>' : ''}
                </div>
                <a href="#" class="section-card-button" onclick="event.preventDefault(); goToSection(${section.id})">
                    <span>عرض المنتجات</span>
                    <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        `;
        
        container.appendChild(sectionCard);
    });
}

// الانتقال إلى صفحة القسم
function goToSection(sectionId) {
    localStorage.setItem('currentSectionId', sectionId);
    window.location.href = 'section.html';
}

// تحميل صفحة القسم
function loadSectionPage() {
    const sectionId = localStorage.getItem('currentSectionId');
    
    if (!sectionId) {
        window.location.href = 'index.html';
        return;
    }
    
    appState.currentSectionId = parseInt(sectionId);
    
    const section = sections.find(s => s.id === appState.currentSectionId);
    
    if (!section) {
        window.location.href = 'index.html';
        return;
    }
    
    // تحديث خريطة الموقع
    const breadcrumbSection = document.getElementById('breadcrumb-section');
    if (breadcrumbSection) {
        breadcrumbSection.textContent = section.name;
    }
    
    // تحديث عنوان الصفحة
    document.title = `${section.name} - ترند كارد`;
    
    // تحديث اسم القسم ووصفه
    const sectionName = document.getElementById('section-name');
    const sectionDesc = document.getElementById('section-desc');
    const productsCount = document.getElementById('products-count');
    
    if (sectionName) sectionName.textContent = section.name;
    if (sectionDesc) sectionDesc.textContent = section.description;
    
    // حساب عدد المنتجات
    const sectionProducts = products.filter(p => p.sectionId === section.id);
    if (productsCount) {
        productsCount.textContent = sectionProducts.length;
    }
    
    // إظهار وصف يويو إذا كان القسم هو شحن التطبيقات
    const yoyoDesc = document.getElementById('yoyo-description');
    if (yoyoDesc && section.id === 1) {
        yoyoDesc.style.display = 'block';
    }
    
    // تحميل المنتجات
    loadProducts();
}

// تحميل المنتجات
function loadProducts() {
    const container = document.getElementById('products-container');
    const loading = document.getElementById('loading-products');
    const noResults = document.getElementById('no-results');
    const resultsText = document.getElementById('results-text');
    
    if (!container) return;
    
    // إظهار رسالة التحميل
    if (loading) {
        loading.style.display = 'block';
        container.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
    }
    
    // تأخير لمحاكاة التحميل
    setTimeout(() => {
        // الحصول على منتجات القسم الحالي
        let filteredProducts = products.filter(p => p.sectionId === appState.currentSectionId);
        
        // تطبيق البحث
        if (appState.searchQuery.trim()) {
            const query = appState.searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.productNumber.toString().includes(query)
            );
        }
        
        // تطبيق الترتيب
        filteredProducts = sortProducts(filteredProducts, appState.sortType);
        
        // حفظ المنتجات المصفاة
        appState.filteredProducts = filteredProducts;
        
        // تحديث عدد النتائج
        if (resultsText) {
            resultsText.textContent = `${filteredProducts.length} منتج`;
        }
        
        // تحديث عرض المنتجات
        updateProductsDisplay(container, filteredProducts, loading, noResults);
    }, 300);
}

// ترتيب المنتجات
function sortProducts(productsArray, sortType) {
    const sortedProducts = [...productsArray];
    
    switch(sortType) {
        case "number-asc":
            return sortedProducts.sort((a, b) => a.productNumber - b.productNumber);
        case "number-desc":
            return sortedProducts.sort((a, b) => b.productNumber - a.productNumber);
        case "price-asc":
            return sortedProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        case "price-desc":
            return sortedProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        default:
            return sortedProducts.sort((a, b) => {
                // المنتجات المميزة أولاً، ثم التقييم
                if (a.featured !== b.featured) {
                    return a.featured ? -1 : 1;
                }
                return b.rating - a.rating;
            });
    }
}

// الحصول على سعر المنتج
function getProductPrice(product) {
    if (product.type === 'quantity') {
        return product.unitPrice * product.defaultQuantity;
    } else if (product.type === 'category') {
        const defaultCategory = product.categories.find(c => c.id === product.defaultCategory);
        return defaultCategory ? defaultCategory.price : 0;
    }
    return 0;
}

// تحديث عرض المنتجات
function updateProductsDisplay(container, productsArray, loading, noResults) {
    if (!container) return;
    
    // إضافة فئة وضع العرض
    container.className = `products-container ${appState.viewMode}-view`;
    
    // إخفاء رسالة التحميل
    if (loading) {
        loading.style.display = 'none';
    }
    
    // التحقق من وجود نتائج
    if (productsArray.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    // إظهار الحاوية
    container.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';
    
    // مسح المحتوى الحالي
    container.innerHTML = '';
    
    // إضافة المنتجات
    productsArray.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// إنشاء بطاقة المنتج
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${product.name} - ${product.description}`);
    
    // الحصول على السعر
    let price = getProductPrice(product);
    let priceText = formatPrice(price, appState.currentCurrency);
    
    // إنشاء البطاقة
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 loading="lazy"
                 width="300"
                 height="200">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-content">
            <div class="product-header">
                <div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-number">#${product.productNumber}</div>
                </div>
                ${product.featured ? '<div class="product-featured"><i class="fas fa-star"></i></div>' : ''}
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="rating-stars">
                    ${getRatingStars(product.rating)}
                </div>
                <span class="rating-value">${product.rating}</span>
            </div>
            <div class="product-footer">
                <div class="product-price">${priceText}</div>
                <button class="product-button" onclick="openProductModal(${product.id})" aria-label="طلب ${product.name}">
                    <i class="fas fa-shopping-cart"></i>
                    <span>اطلب الآن</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// الحصول على نجوم التقييم
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// إعداد البحث
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearSearch = document.getElementById('clear-search');
    const resetFilters = document.getElementById('reset-filters');
    
    // بحث عند النقر
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // بحث عند الضغط على Enter
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // بحث أثناء الكتابة (بعد تأخير)
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 500);
            
            // إظهار زر المسح إذا كان هناك نص
            if (clearSearch) {
                clearSearch.classList.toggle('show', searchInput.value.trim() !== '');
            }
        });
        
        // مسح البحث
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                performSearch();
                searchInput.focus();
            });
        }
    }
    
    // إعادة تعيين الفلاتر
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }
}

// تنفيذ البحث
function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        appState.searchQuery = searchInput.value.trim();
        appState.currentPage = 1;
        loadProducts();
    }
}

// إعادة تعيين جميع الفلاتر
function resetAllFilters() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (sortSelect) {
        sortSelect.value = 'default';
    }
    
    appState.searchQuery = '';
    appState.sortType = 'default';
    appState.currentPage = 1;
    
    loadProducts();
}

// إعداد الترتيب
function setupSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = appState.sortType;
        sortSelect.addEventListener('change', () => {
            appState.sortType = sortSelect.value;
            loadProducts();
        });
    }
}

// إعداد تبديل العرض
function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // إزالة التحديد من جميع الأزرار
                viewBtns.forEach(b => b.classList.remove('active'));
                
                // تحديد الزر المضغوط
                btn.classList.add('active');
                
                // تغيير وضع العرض
                appState.viewMode = btn.dataset.view;
                
                // إعادة تحميل المنتجات
                loadProducts();
            });
        });
    }
}

// إعداد النافذة المنبثقة
function setupModal() {
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProductModal);
    }
    
    // إغلاق بالضغط على Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
}

// فتح نافذة المنتج
function openProductModal(productId) {
    const modal = document.querySelector('.product-modal');
    const product = products.find(p => p.id === productId);
    
    if (!product || !modal) return;
    
    appState.currentProduct = product;
    
    // تحديث عنوان النافذة
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = product.name;
    }
    
    // إنشاء محتوى النافذة
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.innerHTML = createProductModalContent(product);
    }
    
    // إظهار النافذة
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // إعداد أحداث النافذة
    setupModalEvents();
    
    // حساب السعر الأولي
    updatePriceDisplay();
}

// إنشاء محتوى نافذة المنتج
function createProductModalContent(product) {
    if (product.type === 'quantity') {
        return createQuantityProductModal(product);
    } else if (product.type === 'category') {
        return createCategoryProductModal(product);
    }
    return '';
}

// إنشاء نافذة منتج كمية
function createQuantityProductModal(product) {
    return `
        <form class="product-form" id="product-form">
            <div class="form-group">
                <label for="user-id" class="form-label">
                    <i class="fas fa-user"></i>
                    معرف الحساب (ID)
                </label>
                <input type="text" 
                       id="user-id" 
                       class="form-input" 
                       placeholder="أدخل معرف حسابك" 
                       required
                       aria-required="true">
            </div>
            
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-layer-group"></i>
                    الكمية
                </label>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn" id="decrease-qty" aria-label="تقليل الكمية">-</button>
                    <input type="number" 
                           class="quantity-input" 
                           id="quantity" 
                           min="${product.minQuantity}" 
                           max="${product.maxQuantity}" 
                           value="${product.defaultQuantity}"
                           aria-label="الكمية">
                    <button type="button" class="quantity-btn" id="increase-qty" aria-label="زيادة الكمية">+</button>
                </div>
                <p class="quantity-range">
                    الحد الأدنى: ${product.minQuantity} | الحد الأقصى: ${product.maxQuantity}
                </p>
            </div>
            
            <div class="price-display">
                <h4>السعر الإجمالي</h4>
                <div class="price-amount" id="price-amount">0</div>
                <button type="button" class="currency-toggle" id="currency-toggle" aria-label="تبديل العملة">
                    <i class="fas fa-exchange-alt"></i>
                    ${appState.currentCurrency === 'USD' ? 'تبديل إلى الريال اليمني' : 'تبديل إلى الدولار الأمريكي'}
                </button>
            </div>
            
            <button type="button" class="whatsapp-order-btn" id="whatsapp-btn" aria-label="طلب عبر واتساب">
                <i class="fab fa-whatsapp"></i>
                طلب عبر واتساب
            </button>
        </form>
    `;
}

// إنشاء نافذة منتج فئات
function createCategoryProductModal(product) {
    const categoriesHtml = product.categories.map(cat => `
        <div class="category-option ${cat.id === product.defaultCategory ? 'active' : ''}" 
             data-category-id="${cat.id}" 
             data-price="${cat.price}"
             role="button"
             tabindex="0"
             aria-label="${cat.name} - ${cat.price} دولار">
            <div class="category-name">${cat.name}</div>
            <div class="category-price">${cat.price.toFixed(2)} $</div>
        </div>
    `).join('');
    
    return `
        <form class="product-form" id="product-form">
            <div class="form-group">
                <label for="user-id" class="form-label">
                    <i class="fas fa-user"></i>
                    معرف الحساب (ID)
                </label>
                <input type="text" 
                       id="user-id" 
                       class="form-input" 
                       placeholder="أدخل معرف حسابك" 
                       required
                       aria-required="true">
            </div>
            
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-tags"></i>
                    اختر الفئة
                </label>
                <div class="categories-grid" id="categories-container">
                    ${categoriesHtml}
                </div>
                <input type="hidden" id="selected-category" value="${product.defaultCategory}">
            </div>
            
            <div class="price-display">
                <h4>السعر</h4>
                <div class="price-amount" id="price-amount">0</div>
                <button type="button" class="currency-toggle" id="currency-toggle" aria-label="تبديل العملة">
                    <i class="fas fa-exchange-alt"></i>
                    ${appState.currentCurrency === 'USD' ? 'تبديل إلى الريال اليمني' : 'تبديل إلى الدولار الأمريكي'}
                </button>
            </div>
            
            <button type="button" class="whatsapp-order-btn" id="whatsapp-btn" aria-label="طلب عبر واتساب">
                <i class="fab fa-whatsapp"></i>
                طلب عبر واتساب
            </button>
        </form>
    `;
}

// إعداد أحداث النافذة
function setupModalEvents() {
    // تبديل العملة
    const currencyToggle = document.getElementById('currency-toggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('click', toggleCurrency);
    }
    
    // أحداث الكمية
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => adjustQuantity(-1));
        increaseBtn.addEventListener('click', () => adjustQuantity(1));
        quantityInput.addEventListener('change', updatePriceDisplay);
        quantityInput.addEventListener('input', updatePriceDisplay);
    }
    
    // أحداث الفئات
    const categoryOptions = document.querySelectorAll('.category-option');
    const selectedCategoryInput = document.getElementById('selected-category');
    
    if (categoryOptions.length > 0) {
        categoryOptions.forEach(option => {
            option.addEventListener('click', () => selectCategory(option));
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectCategory(option);
                }
            });
        });
    }
    
    // زر واتساب
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendWhatsAppOrder);
    }
}

// إغلاق نافذة المنتج
function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
}

// ضبط الكمية
function adjustQuantity(amount) {
    const quantityInput = document.getElementById('quantity');
    const product = appState.currentProduct;
    
    if (!quantityInput || !product) return;
    
    let currentValue = parseInt(quantityInput.value) || product.defaultQuantity;
    let newValue = currentValue + amount;
    
    // التحقق من الحدود
    if (newValue >= product.minQuantity && newValue <= product.maxQuantity) {
        quantityInput.value = newValue;
        updatePriceDisplay();
    }
}

// اختيار الفئة
function selectCategory(option) {
    const categoryOptions = document.querySelectorAll('.category-option');
    const selectedCategoryInput = document.getElementById('selected-category');
    
    // إزالة التحديد من جميع الخيارات
    categoryOptions.forEach(o => o.classList.remove('active'));
    
    // تحديد الخيار المضغوط
    option.classList.add('active');
    
    // تحديث الفئة المختارة
    if (selectedCategoryInput) {
        selectedCategoryInput.value = option.dataset.categoryId;
    }
    
    updatePriceDisplay();
}

// تبديل العملة
function toggleCurrency() {
    appState.currentCurrency = appState.currentCurrency === 'USD' ? 'YER' : 'USD';
    updateAppState();
    updatePriceDisplay();
}

// تحديث عرض السعر
function updatePriceDisplay() {
    const priceAmount = document.getElementById('price-amount');
    const product = appState.currentProduct;
    
    if (!priceAmount || !product) return;
    
    let price = 0;
    
    if (product.type === 'quantity') {
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            const quantity = parseInt(quantityInput.value) || product.defaultQuantity;
            price = product.unitPrice * quantity;
        }
    } else if (product.type === 'category') {
        const selectedCategoryInput = document.getElementById('selected-category');
        if (selectedCategoryInput) {
            const categoryId = parseInt(selectedCategoryInput.value) || product.defaultCategory;
            const category = product.categories.find(c => c.id === categoryId);
            if (category) {
                price = category.price;
            }
        }
    }
    
    priceAmount.textContent = formatPrice(price, appState.currentCurrency);
}

// تنسيق السعر
function formatPrice(price, currency) {
    if (currency === 'YER') {
        price = price * exchangeRate.USD_TO_YER;
        return `${price.toFixed(0)} ﷼`;
    } else {
        return `${price.toFixed(2)} $`;
    }
}

// إرسال طلب واتساب
function sendWhatsAppOrder() {
    const product = appState.currentProduct;
    const userIdInput = document.getElementById('user-id');
    
    if (!userIdInput || !userIdInput.value.trim()) {
        showNotification('يرجى إدخال معرف الحساب (ID)', 'error');
        userIdInput.focus();
        return;
    }
    
    const userId = userIdInput.value.trim();
    let price = 0;
    let details = '';
    let priceDisplay = '';
    
    // بناء تفاصيل الطلب
    if (product.type === 'quantity') {
        const quantityInput = document.getElementById('quantity');
        const quantity = parseInt(quantityInput.value) || product.defaultQuantity;
        price = product.unitPrice * quantity;
        
        if (appState.currentCurrency === 'YER') {
            price = price * exchangeRate.USD_TO_YER;
            priceDisplay = `${price.toFixed(0)} ﷼`;
        } else {
            priceDisplay = `${price.toFixed(2)} $`;
        }
        
        details = `🎯 الكمية: ${quantity} 💰 السعر: ${priceDisplay}`;
    } else if (product.type === 'category') {
        const selectedCategoryInput = document.getElementById('selected-category');
        const categoryId = parseInt(selectedCategoryInput.value) || product.defaultCategory;
        const category = product.categories.find(c => c.id === categoryId);
        
        if (category) {
            price = category.price;
            
            if (appState.currentCurrency === 'YER') {
                price = price * exchangeRate.USD_TO_YER;
                priceDisplay = `${price.toFixed(0)} ﷼`;
            } else {
                priceDisplay = `${price.toFixed(2)} $`;
            }
            
            details = `🎯 الفئة: ${category.name} 💰 السعر: ${priceDisplay}`;
        }
    }
    
    // بناء رسالة واتساب
    let message = `🛒 طلب جديد من ترند كارد%0A%0A`;
    message += `📦 المنتج: ${product.name}%0A`;
    message += `${details}%0A`;
    message += `🆔 معرف الحساب: ${userId}%0A%0A`;
    message += `شكراً لاختيارك ترند كارد! 🎉`;
    
    // إنشاء رابط واتساب
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // فتح واتساب
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // إغلاق النافذة
    closeProductModal();
    
    // إظهار رسالة نجاح
    showNotification('تم فتح واتساب لإرسال طلبك', 'success');
}

// إعداد العملة
function setupCurrency() {
    const currencyToggle = document.querySelector('.currency-toggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('click', toggleCurrency);
    }
}

// إعداد القائمة المتنقلة
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// إعداد زر العودة للأعلى
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    if (scrollTopBtn) {
        // إظهار/إخفاء الزر عند التمرير
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // التمرير إلى الأعلى
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// إعداد تبديل الثيم
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            appState.isDarkMode = !appState.isDarkMode;
            document.body.classList.toggle('light-mode', !appState.isDarkMode);
            
            // تغيير الأيقونة
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = appState.isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
            }
            
            // حفظ التفضيل
            localStorage.setItem('trendCardTheme', appState.isDarkMode ? 'dark' : 'light');
        });
        
        // تحميل التفضيل المحفوظ
        const savedTheme = localStorage.getItem('trendCardTheme');
        if (savedTheme === 'light') {
            appState.isDarkMode = false;
            document.body.classList.add('light-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }
    }
}

// إعداد التمرير للرأس
function setupHeaderScroll() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// إعداد الرسوم المتحركة
function setupAnimations() {
    if (!appSettings.enableAnimations) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر
    const animatedElements = document.querySelectorAll('.section-card, .feature-card, .product-card, .step-item');
    animatedElements.forEach(el => observer.observe(el));
}

// إعداد إمكانية الوصول
function setupAccessibility() {
    // تحسين التنقل بلوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        // إغلاق القائمة المتنقلة بالضغط على Escape
        if (e.key === 'Escape') {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const nav = document.getElementById('nav');
            
            if (mobileMenuBtn && nav && nav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
                mobileMenuBtn.focus();
            }
        }
    });
    
    // تحسين النماذج
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="إغلاق الإشعار">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // إضافة إلى الصفحة
    document.body.appendChild(notification);
    
    // إظهار مع تأثير
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إغلاق الإشعار
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // إزالة تلقائية بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// CSS للإشعارات (يتم إضافته ديناميكياً)
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    box-shadow: var(--shadow-xl);
    border-left: 4px solid var(--primary-color);
    transform: translateX(100%);
    opacity: 0;
    transition: all var(--transition-normal);
    z-index: 10000;
    max-width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-success {
    border-left-color: var(--success-color);
}

.notification-error {
    border-left-color: var(--danger-color);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
}

.notification-content i {
    font-size: var(--text-lg);
}

.notification-success .notification-content i {
    color: var(--success-color);
}

.notification-error .notification-content i {
    color: var(--danger-color);
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.notification-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
}
`;

// إضافة أنماط الإشعارات
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة فئة للجسم للإشارة إلى تحميل الصفحة
    document.body.classList.add('loaded');
    
    // تهيئة التطبيق
    initApp();
    
    // إضافة فئة للجسم للإشارة إلى نوع الجهاز
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    document.body.classList.add(isMobile ? 'device-mobile' : isTablet ? 'device-tablet' : 'device-desktop');
    
    // تحديث عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        const isMobileNow = window.innerWidth <= 768;
        const isTabletNow = window.innerWidth > 768 && window.innerWidth <= 1024;
        document.body.classList.add(isMobileNow ? 'device-mobile' : isTabletNow ? 'device-tablet' : 'device-desktop');
    });
});

// تصدير الوظائف العامة
window.loadSections = loadSections;
window.loadSectionPage = loadSectionPage;
window.openProductModal = openProductModal;
window.goToSection = goToSection;
window.initApp = initApp;
