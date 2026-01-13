// بيانات الأقسام
const sections = [
    {
        id: 1,
        name: "شحن التطبيقات",
        description: "شحن رصيد للتطبيقات المختلفة بسهولة وأمان",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        products: [1, 2]
    },
    {
        id: 2,
        name: "شحن الألعاب",
        description: "شحن رصيد لأشهر الألعاب الإلكترونية",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        products: [3, 4, 5]
    },
    {
        id: 3,
        name: "بطاقات الهدايا",
        description: "بطاقات هدايا رقمية متعددة المنصات",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        products: [6, 7]
    },
    {
        id: 4,
        name: "قسم إضافي",
        description: "منتجات وعروض إضافية متنوعة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        products: [8]
    }
];

// بيانات المنتجات
const products = [
    {
        id: 1,
        sectionId: 1,
        productNumber: 1001,
        name: "يويو - YoYo",
        description: "شحن رصيد يويو للتطبيق بأسعار مناسبة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "quantity",
        unitPrice: 0.0008053,
        minQuantity: 1000,
        maxQuantity: 10000,
        defaultQuantity: 1000,
        currency: "USD"
    },
    {
        id: 2,
        sectionId: 1,
        productNumber: 1002,
        name: "تطبيق تانغو",
        description: "شحن رصيد لتطبيق تانغو للدردشة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "quantity",
        unitPrice: 0.0012,
        minQuantity: 500,
        maxQuantity: 5000,
        defaultQuantity: 500,
        currency: "USD"
    },
    {
        id: 3,
        sectionId: 2,
        productNumber: 2001,
        name: "شدات ببجي موبايل",
        description: "شراء شدات لببجي موبايل بأسعار منافسة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "60 شدة", price: 0.99 },
            { id: 2, name: "120 شدة", price: 1.89 },
            { id: 3, name: "250 شدة", price: 3.49 },
            { id: 4, name: "600 شدة", price: 7.99 }
        ],
        defaultCategory: 1,
        currency: "USD"
    },
    {
        id: 4,
        sectionId: 2,
        productNumber: 2002,
        name: "فورتنايت V-Bucks",
        description: "شراء عملات V-Bucks للعبة فورتنايت",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "1000 V-Bucks", price: 8.99 },
            { id: 2, name: "2800 V-Bucks", price: 22.99 },
            { id: 3, name: "5000 V-Bucks", price: 39.99 }
        ],
        defaultCategory: 1,
        currency: "USD"
    },
    {
        id: 5,
        sectionId: 2,
        productNumber: 2003,
        name: "رصيد ستيم",
        description: "بطاقات هدايا ستيم بقيم مختلفة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "10$", price: 10 },
            { id: 2, name: "20$", price: 20 },
            { id: 3, name: "50$", price: 50 }
        ],
        defaultCategory: 1,
        currency: "USD"
    },
    {
        id: 6,
        sectionId: 3,
        productNumber: 3001,
        name: "بطاقة آيتونز",
        description: "بطاقات آيتونز بقيم مختلفة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "10$", price: 10 },
            { id: 2, name: "25$", price: 25 },
            { id: 3, name: "50$", price: 50 }
        ],
        defaultCategory: 1,
        currency: "USD"
    },
    {
        id: 7,
        sectionId: 3,
        productNumber: 3002,
        name: "بطاقة جوجل بلاي",
        description: "بطاقات جوجل بلاي بقيم مختلفة",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "category",
        categories: [
            { id: 1, name: "10$", price: 10 },
            { id: 2, name: "25$", price: 25 },
            { id: 3, name: "50$", price: 50 }
        ],
        defaultCategory: 1,
        currency: "USD"
    },
    {
        id: 8,
        sectionId: 4,
        productNumber: 4001,
        name: "منتج تجريبي",
        description: "منتج تجريبي للقسم الإضافي",
        image: "https://i.ibb.co/rRq8TGwg/image.jpg",
        type: "quantity",
        unitPrice: 0.005,
        minQuantity: 100,
        maxQuantity: 1000,
        defaultQuantity: 100,
        currency: "USD"
    }
];

// سعر الصرف
const exchangeRate = {
    USD_TO_YER: 560
};

// رقم واتساب
const whatsappNumber = "+967735670700";