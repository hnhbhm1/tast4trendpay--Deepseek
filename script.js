// الحالة العامة للتطبيق
const appState = {
    currentCurrency: "USD",
    currentSectionId: null,
    currentProduct: null,
    searchQuery: "",
    sortType: "default",
    viewMode: "grid",
    isDarkMode: true
};

// تهيئة التطبيق
function initApp() {
    // إعداد قائمة الجوال
    setupMobileMenu();
    
    // إعداد زر العودة للأعلى
    setupScrollTop();
    
    // إعداد تبديل الثيم
    setupThemeToggle();
    
    // إعداد التمرير للرأس
    setupHeaderScroll();
    
    // إعداد الرسوم المتحركة
    setupAnimations();
}

// تحميل الأقسام في الصفحة الرئيسية
function loadSections() {
    const container = document.getElementById('sections-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    sections.forEach(section => {
        const sectionColor = sectionColors[section.color] || sectionColors.blue;
        
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section-card';
        sectionElement.style.setProperty('--section-color', sectionColor.primary);
        sectionElement.onclick = () => goToSection(section.id);
        
        sectionElement.innerHTML = `
            <div class="section-card-header">
                <img src="${section.image}" alt="${section.name}" class="section-card-img">
                <div class="section-card-overlay">
                    <div class="section-card-icon" style="background: ${sectionColor.primary}">
                        <i class="${section.icon}"></i>
                    </div>
                </div>
            </div>
            <div class="section-card-content">
                <h3 class="section-card-title">${section.name}</h3>
                <p class="section-card-desc">${section.description}</p>
                <a href="#" class="section-card-btn">
                    <span>عرض المنتجات</span>
                    <i class="fas fa-arrow-left"></i>
                </a>
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
    
    // تحديث عنوان الصفحة
    document.title = `${section.name} - ترند كارد`;
    
    // تحديث خريطة الموقع
    document.getElementById('breadcrumb-section').textContent = section.name;
    
    // تحديث اسم القسم ووصفه
    document.getElementById('section-name').textContent = section.name;
    document.getElementById('section-desc').textContent = section.description;
    
    // إظهار وصف يويو إذا كان القسم هو شحن التطبيقات
    const yoyoDesc = document.getElementById('yoyo-description');
    if (yoyoDesc && section.id === 1) {
        yoyoDesc.style.display = 'block';
    }
    
    // تحميل منتجات القسم
    loadProducts();
    
    // إعداد البحث والترتيب
    setupSearchAndSort();
}

// تحميل المنتجات في صفحة القسم
function loadProducts() {
    const container = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;
    
    // إضافة فئة وضع العرض
    container.className = `products-container ${appState.viewMode}-view`;
    
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
    filteredProducts = sortProducts(filteredProducts, appState.sortType);
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        // الحصول على السعر الافتراضي
        let price = 0;
        let priceText = '';
        
        if (product.type === 'quantity') {
            price = product.unitPrice * product.defaultQuantity;
            priceText = formatPrice(price, appState.currentCurrency);
        } else if (product.type === 'category') {
            const defaultCategory = product.categories.find(c => c.id === product.defaultCategory);
            price = defaultCategory.price;
            priceText = formatPrice(price, appState.currentCurrency);
        }
        
        // إنشاء محتوى البطاقة
        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<div class="product-badge">${product.badge}</div>`;
        }
        
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${badgeHtml}
            </div>
            <div class="product-content">
                <div class="product-header">
                    <div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-number">#${product.productNumber}</div>
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${priceText}</div>
                    <button class="product-btn" onclick="openProductModal(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        <span>اطلب الآن</span>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(productElement);
    });
}

// ترتيب المنتجات
function sortProducts(products, sortType) {
    const sortedProducts = [...products];
    
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
            return sortedProducts;
    }
}

// الحصول على سعر المنتج
function getProductPrice(product) {
    if (product.type === 'quantity') {
        return product.unitPrice * product.defaultQuantity;
    } else if (product.type === 'category') {
        const defaultCategory = product.categories.find(c => c.id === product.defaultCategory);
        return defaultCategory.price;
    }
    return 0;
}

// إعداد البحث والترتيب
function setupSearchAndSort() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const sortSelect = document.getElementById('sort-select');
    
    if (searchInput && searchBtn) {
        // بحث عند النقر
        searchBtn.onclick = () => {
            appState.searchQuery = searchInput.value;
            loadProducts();
        };
        
        // بحث عند الضغط على Enter
        searchInput.onkeyup = (e) => {
            if (e.key === 'Enter') {
                appState.searchQuery = searchInput.value;
                loadProducts();
            }
        };
        
        // بحث أثناء الكتابة (بعد تأخير)
        let searchTimeout;
        searchInput.oninput = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                appState.searchQuery = searchInput.value;
                loadProducts();
            }, 500);
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

// إعداد تبديل وضع العرض
function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.onclick = () => {
                // إزالة التحديد من جميع الأزرار
                viewBtns.forEach(b => b.classList.remove('active'));
                
                // تحديد الزر المضغوط
                btn.classList.add('active');
                
                // تغيير وضع العرض
                appState.viewMode = btn.getAttribute('data-view');
                
                // إعادة تحميل المنتجات
                loadProducts();
            };
        });
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
    
    // إظهار النافذة مع تأثير
    setTimeout(() => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }, 10);
    
    document.body.style.overflow = 'hidden';
    
    // حساب السعر الأولي
    updatePriceDisplay();
}

// إنشاء محتوى نافذة منتج كمية
function createQuantityProductModal(product) {
    return `
        <form class="product-form" id="product-form">
            <div class="form-group">
                <label for="user-id">
                    <i class="fas fa-user"></i>
                    معرف الحساب (ID)
                </label>
                <input type="text" id="user-id" placeholder="أدخل معرف حسابك" required>
            </div>
            
            <div class="form-group">
                <label>
                    <i class="fas fa-layer-group"></i>
                    الكمية
                </label>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn" id="decrease-qty">-</button>
                    <input type="number" class="quantity-input" id="quantity" 
                           min="${product.minQuantity}" max="${product.maxQuantity}" 
                           value="${product.defaultQuantity}">
                    <button type="button" class="quantity-btn" id="increase-qty">+</button>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); text-align: center; margin-top: 10px;">
                    الحد الأدنى: ${product.minQuantity} | الحد الأقصى: ${product.maxQuantity}
                </p>
            </div>
            
            <div class="price-display">
                <h4>السعر الإجمالي</h4>
                <div class="price-amount" id="price-amount">0</div>
                <div class="currency-toggle" id="currency-toggle">
                    <i class="fas fa-exchange-alt"></i>
                    تبديل إلى ${appState.currentCurrency === 'USD' ? 'الريال اليمني' : 'الدولار الأمريكي'}
                </div>
            </div>
            
            <button type="button" class="whatsapp-btn" id="whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
                طلب عبر واتساب
            </button>
        </form>
    `;
}

// إنشاء محتوى نافذة منتج فئات
function createCategoryProductModal(product) {
    const categoriesHtml = product.categories.map(cat => `
        <div class="category-option ${cat.id === product.defaultCategory ? 'active' : ''}" 
             data-category-id="${cat.id}" data-price="${cat.price}">
            <div class="category-name">${cat.name}</div>
            <div class="category-price">${cat.price.toFixed(2)} $</div>
        </div>
    `).join('');
    
    return `
        <form class="product-form" id="product-form">
            <div class="form-group">
                <label for="user-id">
                    <i class="fas fa-user"></i>
                    معرف الحساب (ID)
                </label>
                <input type="text" id="user-id" placeholder="أدخل معرف حسابك" required>
            </div>
            
            <div class="form-group">
                <label>
                    <i class="fas fa-tags"></i>
                    اختر الفئة
                </label>
                <div class="categories-container" id="categories-container">
                    ${categoriesHtml}
                </div>
                <input type="hidden" id="selected-category" value="${product.defaultCategory}">
            </div>
            
            <div class="price-display">
                <h4>السعر</h4>
                <div class="price-amount" id="price-amount">0</div>
                <div class="currency-toggle" id="currency-toggle">
                    <i class="fas fa-exchange-alt"></i>
                    تبديل إلى ${appState.currentCurrency === 'USD' ? 'الريال اليمني' : 'الدولار الأمريكي'}
                </div>
            </div>
            
            <button type="button" class="whatsapp-btn" id="whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
                طلب عبر واتساب
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
        closeBtn.onclick = closeModal;
    }
    
    // إغلاق النافذة بالنقر خارجها
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    // إغلاق النافذة بالضغط على Escape
    document.onkeydown = (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    };
    
    // تبديل العملة
    if (currencyToggle) {
        currencyToggle.onclick = () => {
            appState.currentCurrency = appState.currentCurrency === 'USD' ? 'YER' : 'USD';
            updatePriceDisplay();
            
            // تحديث نص زر تبديل العملة
            const newCurrencyText = appState.currentCurrency === 'USD' ? 
                '<i class="fas fa-exchange-alt"></i> تبديل إلى الريال اليمني' : 
                '<i class="fas fa-exchange-alt"></i> تبديل إلى الدولار الأمريكي';
            currencyToggle.innerHTML = newCurrencyText;
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
    const categoryOptions = document.querySelectorAll('.category-option');
    const selectedCategoryInput = document.getElementById('selected-category');
    
    if (categoryOptions.length > 0) {
        categoryOptions.forEach(option => {
            option.onclick = () => {
                // إزالة التحديد من جميع الخيارات
                categoryOptions.forEach(o => o.classList.remove('active'));
                
                // تحديد الخيار المضغوط
                option.classList.add('active');
                
                // تحديث الفئة المختارة
                if (selectedCategoryInput) {
                    selectedCategoryInput.value = option.getAttribute('data-category-id');
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

// إغلاق النافذة العائمة
function closeModal() {
    const modal = document.getElementById('product-modal');
    
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
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
    let priceDisplay = '';
    
    // بناء تفاصيل الطلب حسب نوع المنتج
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
    
    // فتح واتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');
    
    // إغلاق النافذة العائمة
    closeModal();
    
    // إعادة تعيين النموذج
    if (userIdInput) userIdInput.value = '';
}

// إعداد قائمة الجوال
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.onclick = () => {
            navMenu.classList.toggle('active');
            
            // تحويل أيقونة القائمة
            const hamburger = mobileMenuBtn.querySelector('.hamburger');
            if (hamburger) {
                hamburger.classList.toggle('active');
            }
        };
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.onclick = () => {
                navMenu.classList.remove('active');
                
                // إعادة تعيين أيقونة القائمة
                const hamburger = mobileMenuBtn.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            };
        });
    }
}

// إعداد زر العودة للأعلى
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (!scrollTopBtn) return;
    
    // إظهار/إخفاء الزر عند التمرير
    window.onscroll = () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };
    
    // التمرير إلى الأعلى عند النقر
    scrollTopBtn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
}

// إعداد تبديل الثيم
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.onclick = () => {
            appState.isDarkMode = !appState.isDarkMode;
            
            // تغيير الأيقونة
            const icon = themeToggle.querySelector('i');
            if (appState.isDarkMode) {
                icon.className = 'fas fa-moon';
                document.body.classList.remove('light-mode');
            } else {
                icon.className = 'fas fa-sun';
                document.body.classList.add('light-mode');
            }
        };
    }
}

// إعداد التمرير للرأس
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.onscroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
    }
}

// إعداد الرسوم المتحركة
function setupAnimations() {
    // إضافة فئة الرسوم المتحركة للعناصر عند التمرير
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
    
    // مراقبة العناصر التي نريد إضافة الرسوم المتحركة لها
    const animatedElements = document.querySelectorAll('.section-card, .feature-card, .product-card, .step');
    animatedElements.forEach(el => observer.observe(el));
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);