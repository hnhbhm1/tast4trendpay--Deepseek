// بيانات الأقسام مع تحسينات للتجاوب
const sections = [
    {
        id: 1,
        name: "شحن التطبيقات",
        description: "شحن رصيد للتطبيقات المختلفة بسهولة وأمان",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        icon: "fas fa-mobile-alt",
        color: "blue",
        products: [1, 2],
        featured: true
    },
    {
        id: 2,
        name: "شحن الألعاب",
        description: "شحن رصيد لأشهر الألعاب الإلكترونية",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        icon: "fas fa-gamepad",
        color: "purple",
        products: [3, 4, 5],
        featured: true
    },
    {
        id: 3,
        name: "بطاقات الهدايا",
        description: "بطاقات هدايا رقمية متعددة المنصات",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        icon: "fas fa-gift",
        color: "pink",
        products: [6, 7],
        featured: true
    },
    {
        id: 4,
        name: "منتجات متنوعة",
        description: "منتجات وعروض إضافية متنوعة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        icon: "fas fa-ellipsis-h",
        color: "teal",
        products: [8],
        featured: false
    }
];

// بيانات المنتجات مع تحسينات
const products = [
    {
        id: 1,
        sectionId: 1,
        productNumber: 1001,
        name: "يويو - YoYo",
        description: "شحن رصيد يويو للتطبيق بأسعار مناسبة وبدون أي مشاكل",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "quantity",
        unitPrice: 0.0008053,
        minQuantity: 1000,
        maxQuantity: 10000,
        defaultQuantity: 1000,
        currency: "USD",
        badge: "الأكثر مبيعاً",
        featured: true,
        rating: 4.9
    },
    {
        id: 2,
        sectionId: 1,
        productNumber: 1002,
        name: "تطبيق تانغو",
        description: "شحن رصيد لتطبيق تانغو للدردشة والمكالمات",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "quantity",
        unitPrice: 0.0012,
        minQuantity: 500,
        maxQuantity: 5000,
        defaultQuantity: 500,
        currency: "USD",
        badge: "جديد",
        featured: false,
        rating: 4.7
    },
    {
        id: 3,
        sectionId: 2,
        productNumber: 2001,
        name: "شدات ببجي موبايل",
        description: "شراء شدات لببجي موبايل بأسعار تنافسية وسرعة فائقة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "60 شدة", price: 0.99 },
            { id: 2, name: "120 شدة", price: 1.89 },
            { id: 3, name: "250 شدة", price: 3.49 },
            { id: 4, name: "600 شدة", price: 7.99 }
        ],
        defaultCategory: 1,
        currency: "USD",
        badge: "عرض خاص",
        featured: true,
        rating: 4.8
    },
    {
        id: 4,
        sectionId: 2,
        productNumber: 2002,
        name: "فورتنايت V-Bucks",
        description: "شراء عملات V-Bucks للعبة فورتنايت بكل سهولة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "1000 V-Bucks", price: 8.99 },
            { id: 2, name: "2800 V-Bucks", price: 22.99 },
            { id: 3, name: "5000 V-Bucks", price: 39.99 }
        ],
        defaultCategory: 1,
        currency: "USD",
        badge: null,
        featured: false,
        rating: 4.6
    },
    {
        id: 5,
        sectionId: 2,
        productNumber: 2003,
        name: "رصيد ستيم",
        description: "بطاقات هدايا ستيم بقيم مختلفة ومناسبة لجميع الألعاب",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "10$", price: 10 },
            { id: 2, name: "20$", price: 20 },
            { id: 3, name: "50$", price: 50 }
        ],
        defaultCategory: 1,
        currency: "USD",
        badge: "الأفضل",
        featured: true,
        rating: 4.9
    },
    {
        id: 6,
        sectionId: 3,
        productNumber: 3001,
        name: "بطاقة آيتونز",
        description: "بطاقات آيتونز بقيم مختلفة متوافقة مع جميع الأجهزة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "10$", price: 10 },
            { id: 2, name: "25$", price: 25 },
            { id: 3, name: "50$", price: 50 }
        ],
        defaultCategory: 1,
        currency: "USD",
        badge: null,
        featured: false,
        rating: 4.5
    },
    {
        id: 7,
        sectionId: 3,
        productNumber: 3002,
        name: "بطاقة جوجل بلاي",
        description: "بطاقات جوجل بلاي بقيم مختلفة لمتجر التطبيقات",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "10$", price: 10 },
            { id: 2, name: "25$", price: 25 },
            { id: 3, name: "50$", price: 50 }
        ],
        defaultCategory: 1,
        currency: "USD",
        badge: "مميز",
        featured: true,
        rating: 4.7
    },
    {
        id: 8,
        sectionId: 4,
        productNumber: 4001,
        name: "منتج تجريبي",
        description: "منتج تجريبي للقسم الإضافي مع خصائص متنوعة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "quantity",
        unitPrice: 0.005,
        minQuantity: 100,
        maxQuantity: 1000,
        defaultQuantity: 100,
        currency: "USD",
        badge: null,
        featured: false,
        rating: 4.0
    }
];

// سعر الصرف
const exchangeRate = {
    USD_TO_YER: 560
};

// رقم واتساب
const whatsappNumber = "+967735670700";

// بيانات الألوان حسب القسم
const sectionColors = {
    blue: { 
        primary: "#3b82f6", 
        secondary: "rgba(59, 130, 246, 0.1)",
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    },
    purple: { 
        primary: "#8b5cf6", 
        secondary: "rgba(139, 92, 246, 0.1)",
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
    },
    pink: { 
        primary: "#ec4899", 
        secondary: "rgba(236, 72, 153, 0.1)",
        gradient: "linear-gradient(135deg, #ec4899, #db2777)"
    },
    teal: { 
        primary: "#14b8a6", 
        secondary: "rgba(20, 184, 166, 0.1)",
        gradient: "linear-gradient(135deg, #14b8a6, #0d9488)"
    }
};

// إعدادات التطبيق
const appSettings = {
    defaultCurrency: "USD",
    defaultViewMode: "grid",
    itemsPerPage: 12,
    enableAnimations: true,
    autoLoad: true
};
