/**
 * SK Electrical Services - Configuration
 * Update these values to customize the website.
 */

const CONFIG = {
    // Business Information
    businessName: "SK Electrical Services",
    whatsappNumber: "919822338978", // Replace with your WhatsApp number (include country code without +)
    phoneNumber: "+91 9822338978",
    email: "info@skelectrical.com",
    address: "Your Shop Address, City, State",
    
    // Google Sheet CSV URLs (Publish to web -> CSV)
    sheets: {
        products: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjtGt7IRbtMj48ilAqUMGcvGVSGisI142539yblXa26Fo8psxbfvlBvlZ8SIqoK2yZMtwHfwXg31Xh/pub?output=csv",
        projects: "", // Add your Projects sheet CSV URL
        testimonials: "" // Add your Testimonials sheet CSV URL
    },

    // Maps Embed URL (Google Maps -> Share -> Embed map -> src URL)
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1158.0!2d73.8!3d18.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzAwLjAiTiA3M8KwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",

    // Features
    enableFadeAnimations: true,
    enableThemeToggle: true,
    defaultTheme: 'dark' // 'light' or 'dark'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
