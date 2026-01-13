// الحالة العامة للتطبيق
const appState = {
    currentCurrency: "USD", // العملة الحالية: USD أو YER
    currentSectionId: null, // معرف القسم الحالي
    currentProduct: null, // المنتج الحالي المحدد
    searchQuery: "", // نص البحث
    sortType: "default" // نوع الترتيب
};

// تحميل الأقسام في الصفحة الرئيسية
function loadSections() {
    const container = document.getElementById('sections-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section-card';
        sectionElement.onclick = () => goToSection(section.id);
        
        sectionElement.innerHTML = `
            <div class="section-img" style="background-image: url('${section.image}')"></div>
            <div class="section-info">
                <h3>${section.name}</h3>
                <p>${section.description}</p>
            </div>
        `;
        
        container.appendChild(sectionElement);
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
    
    // تحديث عنوان الصفحة واسم القسم
    document.getElementById('page-title').textContent = `${section.name} - ترند كارد`;
    document.getElementById('section-name').textContent = section.name;
    document.getElementById('section-desc').textContent = section.description;
    
    // إظهار وصف يويو إذا كان القسم هو شحن التطبيقات
    if (section.name.includes('يويو') || section.id === 1) {
        document.getElementById('yoyo-description').style.display = 'block';
    }
    
    // تحميل منتجات القسم
    loadProducts();
    
    // إعداد أحداث البحث والترتيب
    setupSearchAndSort();
}

// تحميل المنتجات في صفحة القسم
function loadProducts() {
    const container = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;
    
    // الحصول على منتجات القسم الحالي
    let filteredProducts = products.filter(p => p.sectionId === appState.currentSectionId);
    
    // تطبيق البحث
    if (appState.searchQuery) {
        const query = appState.searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
    }
    
    // تطبيق الترتيب
    if (appState.sortType === "number-asc") {
        filteredProducts.sort((a, b) => a.productNumber - b.productNumber);
    } else if (appState.sortType === "number-desc") {
        filteredProducts.sort((a, b) => b.productNumber - a.productNumber);
    }
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        // الحصول على السعر الافتراضي
        let priceText = '';
        if (product.type === 'quantity') {
            const totalPrice = product.unitPrice * product.defaultQuantity;
            priceText = formatPrice(totalPrice, appState.currentCurrency);
        } else if (product.type === 'category') {
            const defaultCategory = product.categories.find(c => c.id === product.defaultCategory);
            priceText = formatPrice(defaultCategory.price, appState.currentCurrency);
        }
        
        productElement.innerHTML = `
            <div class="product-img" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-meta">
                    <span>رقم المنتج: ${product.productNumber}</span>
                    <span class="product-price">${priceText}</span>
                </div>
                <p class="product-desc">${product.description}</p>
                <button class="product-btn" onclick="openProductModal(${product.id})">اطلب الآن</button>
            </div>
        `;
        
        container.appendChild(productElement);
    });
}

// إعداد البحث والترتيب
function setupSearchAndSort() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const sortSelect = document.getElementById('sort-select');
    
    if (searchInput && searchBtn) {
        searchBtn.onclick = () => {
            appState.searchQuery = searchInput.value;
            loadProducts();
        };
        
        searchInput.onkeyup = (e) => {
            if (e.key === 'Enter') {
                appState.searchQuery = searchInput.value;
                loadProducts();
            }
        };
    }
    
    if (sortSelect) {
        sortSelect.value = appState.sortType;
        sortSelect.onchange = () => {
            appState.sortType = sortSelect.value;
            loadProducts();
        };
    }
}

// فتح نافذة المنتج
function openProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const product = products.find(p => p.id === productId);
    
    if (!product || !modal) return;
    
    appState.currentProduct = product;
    
    // تحديث عنوان النافذة
    document.getElementById('modal-title').textContent = product.name;
    
    // إنشاء محتوى النافذة حسب نوع المنتج
    let modalContent = '';
    
    if (product.type === 'quantity') {
        modalContent = createQuantityProductModal(product);
    } else if (product.type === 'category') {
        modalContent = createCategoryProductModal(product);
    }
    
    document.getElementById('modal-body').innerHTML = modalContent;
    
    // إعداد الأحداث للنافذة
    setupModalEvents();
    
    // إظهار النافذة
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // حساب السعر الأولي
    updatePriceDisplay();
}

// إنشاء محتوى نافذة منتج كمية
function createQuantityProductModal(product) {
    return `
        <form class="product-form" id="product-form">
            <div class="form-group">
                <label for="user-id">معرف الحساب (ID)</label>
                <input type="text" id="user-id" placeholder="أدخل معرف حسابك" required>
            </div>
            
            <div class="form-group">
                <label>الكمية</label>
                <div class="quantity-controls">
                    <button type="button" id="decrease-qty">-</button>
                    <input type="number" id="quantity" min="${product.minQuantity}" max="${product.maxQuantity}" value="${product.defaultQuantity}">
                    <button type="button" id="increase-qty">+</button>
                </div>
                <p style="font-size: 0.9rem; color: #666;">الحد الأدنى: ${product.minQuantity} | الحد الأقصى: ${product.maxQuantity}</p>
            </div>
            
            <div class="price-display">
                <h4>السعر الإجمالي</h4>
                <div class="price-amount" id="price-amount">0</div>
                <div class="currency-toggle" id="currency-toggle">تغيير العملة إلى الريال اليمني</div>
            </div>
            
            <button type="button" class="whatsapp-btn" id="whatsapp-btn">
                <i class="fab fa-whatsapp"></i> طلب عبر واتساب
            </button>
        </form>
    `;
}

// إنشاء محتوى نافذة منتج فئات
function createCategoryProductModal(product) {
    const categoriesHtml = product.categories.map(cat => `
        <div class="category-btn ${cat.id === product.defaultCategory ? 'active' : ''}" data-category-id="${cat.id}">
            ${cat.name}
        </div>
    `).join('');
    
    return `
        <form class="product-form" id="product-form">
            <div class="form-group">
                <label for="user-id">معرف الحساب (ID)</label>
                <input type="text" id="user-id" placeholder="أدخل معرف حسابك" required>
            </div>
            
            <div class="form-group">
                <label>اختر الفئة</label>
                <div class="categories" id="categories-container">
                    ${categoriesHtml}
                </div>
                <input type="hidden" id="selected-category" value="${product.defaultCategory}">
            </div>
            
            <div class="price-display">
                <h4>السعر</h4>
                <div class="price-amount" id="price-amount">0</div>
                <div class="currency-toggle" id="currency-toggle">تغيير العملة إلى الريال اليمني</div>
            </div>
            
            <button type="button" class="whatsapp-btn" id="whatsapp-btn">
                <i class="fab fa-whatsapp"></i> طلب عبر واتساب
            </button>
        </form>
    `;
}

// إعداد أحداث النافذة العائمة
function setupModalEvents() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('close-modal');
    const currencyToggle = document.getElementById('currency-toggle');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    
    // زر الإغلاق
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    
    // إغلاق النافذة بالنقر خارجها
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // تبديل العملة
    if (currencyToggle) {
        currencyToggle.onclick = () => {
            appState.currentCurrency = appState.currentCurrency === 'USD' ? 'YER' : 'USD';
            updatePriceDisplay();
            
            // تحديث نص زر تبديل العملة
            const newCurrencyText = appState.currentCurrency === 'USD' ? 'تغيير العملة إلى الريال اليمني' : 'تغيير العملة إلى الدولار';
            currencyToggle.textContent = newCurrencyText;
        };
    }
    
    // أحداث لمنتجات الكمية
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.onclick = () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > appState.currentProduct.minQuantity) {
                quantityInput.value = currentValue - 1;
                updatePriceDisplay();
            }
        };
        
        increaseBtn.onclick = () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < appState.currentProduct.maxQuantity) {
                quantityInput.value = currentValue + 1;
                updatePriceDisplay();
            }
        };
        
        quantityInput.onchange = updatePriceDisplay;
        quantityInput.onkeyup = updatePriceDisplay;
    }
    
    // أحداث لمنتجات الفئات
    const categoryBtns = document.querySelectorAll('.category-btn');
    const selectedCategoryInput = document.getElementById('selected-category');
    
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.onclick = () => {
                // إزالة التحديد من جميع الأزرار
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                // تحديد الزر المضغوط
                btn.classList.add('active');
                
                // تحديث الفئة المختارة
                if (selectedCategoryInput) {
                    selectedCategoryInput.value = btn.getAttribute('data-category-id');
                }
                
                updatePriceDisplay();
            };
        });
    }
    
    // زر الطلب عبر واتساب
    if (whatsappBtn) {
        whatsappBtn.onclick = sendWhatsAppOrder;
    }
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
    
    // تنسيق السعر حسب العملة
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

// إرسال الطلب عبر واتساب
function sendWhatsAppOrder() {
    const product = appState.currentProduct;
    const userIdInput = document.getElementById('user-id');
    
    if (!userIdInput || !userIdInput.value.trim()) {
        alert('يرجى إدخال معرف الحساب (ID)');
        userIdInput.focus();
        return;
    }
    
    const userId = userIdInput.value.trim();
    let price = 0;
    let details = '';
    
    // بناء تفاصيل الطلب حسب نوع المنتج
    if (product.type === 'quantity') {
        const quantityInput = document.getElementById('quantity');
        const quantity = parseInt(quantityInput.value) || product.defaultQuantity;
        price = product.unitPrice * quantity;
        
        if (appState.currentCurrency === 'YER') {
            price = price * exchangeRate.USD_TO_YER;
            details = `🎯 الكمية: ${quantity} 💰 السعر: ${price.toFixed(0)} ﷼`;
        } else {
            details = `🎯 الكمية: ${quantity} 💰 السعر: ${price.toFixed(2)} $`;
        }
    } else if (product.type === 'category') {
        const selectedCategoryInput = document.getElementById('selected-category');
        const categoryId = parseInt(selectedCategoryInput.value) || product.defaultCategory;
        const category = product.categories.find(c => c.id === categoryId);
        
        if (category) {
            price = category.price;
            
            if (appState.currentCurrency === 'YER') {
                price = price * exchangeRate.USD_TO_YER;
                details = `🎯 الفئة: ${category.name} 💰 السعر: ${price.toFixed(0)} ﷼`;
            } else {
                details = `🎯 الفئة: ${category.name} 💰 السعر: ${price.toFixed(2)} $`;
            }
        }
    }
    
    // بناء رسالة واتساب
    let message = `🛒 طلب جديد من ترند كارد%0A`;
    message += `📦 المنتج: ${product.name} ${details}%0A`;
    message += `معرف الحساب (ID): ${userId}`;
    
    // إنشاء رابط واتساب
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // فتح واتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');
    
    // إغلاق النافذة العائمة
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// إعداد قائمة الجوال
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navUl) {
        mobileMenuBtn.onclick = () => {
            navUl.classList.toggle('active');
        };
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.onclick = () => {
                navUl.classList.remove('active');
            };
        });
    }
}