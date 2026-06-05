/**
 * Khan Electrical Services - Configuration
 * Update these values to customize the website.
 */

const CONFIG = {
    // Business Information
    businessName: "Khan Electrical Services",
    whatsappNumber: "917822886909", // Replace with your WhatsApp number (include country code without +)
    phoneNumber: "+91 7822886909",
    email: "spathan1862@gmail.com",
    address: "At Manrgaon Badnapur Jalna Maharastra "

    // Google Sheet CSV URLs (Publish to web -> CSV)
    sheets: {
        products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTmI4HruEQTBSx7Tnke03Ea6i1nrN_13EVMPb_Jlppf02eKtCp6mEZtny-eqC9C_8U9n8-YZvKfG2q/pub?gid=0&single=true&output=csv",
        projects: "",
        testimonials: ""
    },

    // Maps Embed URL (Google Maps -> Share -> Embed map -> src URL)
    mapsEmbedUrl: "https://www.google.com/maps/dir/Ai+Mobile+%26+computer+Accessories+shop,+near+Bharatgas+agency,+Badnapur,+Maharashtra+431202//@19.8647086,75.7280671,17.63z/data=!4m8!4m7!1m5!1m1!1s0x3bda5345e4b26565:0xc5d6e7e33a2fecde!2m2!1d75.7279683!2d19.866006!1m0?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D
    // Features
    enableFadeAnimations: true,
    enableThemeToggle: true,
    defaultTheme: 'dark' // 'light' or 'dark'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
