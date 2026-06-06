/**
 * SK Electrical Services - Data Management
 * Handles fetching CSV from Google Sheets and parsing.
 */

const DataManager = (() => {

    // Fallback data for Services (as provided in prompt)
    const DEFAULT_SERVICES = [
        { name: "House Wiring", image: "https://www.paamconstruction.com/wp-content/uploads/2023/03/8-1.jpg", description: "Complete house electrification with high safety standards and quality materials.", icon: "home" },
        { name: "Electrical Repair", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQdD5ovj-jbbNZ4GiJostklycKmQo_hBMZ5Q&s", description: "Expert troubleshooting and repair for all types of electrical faults.", icon: "tool" },
        { name: "CCTV Installation", image: "data:image/jpeg;base64,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", description: "Secure your home with professional CCTV surveillance setup.", icon: "video" },
        { name: "Home Decore", image: "https://pchomedecor.com/cdn/shop/products/images_2F485dc0bc-e007-4fc9-965d-04dd8c0b6f7f.jpg?v=1699368266", description: "Aapke Sapno Ka Ghar, Hamari Khoobsurat Sajawat.", icon: "sun" },
        { name: "Inverter Installation", image: "https://i.ytimg.com/vi/P7P_ziNxqlI/maxresdefault.jpg", description: "Roshni Kabhi Na Ruke.", icon: "battery-charging" },
        { name: "Web Devlopement", image: "https://www.simplilearn.com/ice9/free_resources_article_thumb/is_web_development_good_career.jpg", description: "Aapke Business Ko Digital Pehchaan Dete Hain.", icon: "settings" }
    ];

    // Fallback empty arrays for other sections
    const FALLBACK_PRODUCTS = [];
    const FALLBACK_PROJECTS = [];
    const FALLBACK_TESTIMONIALS = [];

    /**
     * Fetch CSV data from a URL and parse it to JSON
     * @param {string} url - Google Sheet CSV URL
     * @returns {Promise<Array>}
     */
    async function fetchData(url) {
        if (!url) return [];

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const csvText = await response.text();

            return new Promise((resolve) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve(results.data);
                    },
                    error: (error) => {
                        console.error('PapaParse error:', error);
                        resolve([]);
                    }
                });
            });
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    /**
     * Get products data from Google Sheets or fallback
     */
    async function getProducts() {
        const data = await fetchData(CONFIG.sheets.products);
        return data.length > 0 ? data.map(row => ({
            name: row['Product Name'] || row['name'] || '',
            category: row['Category'] || row['category'] || 'General',
            price: row['Price'] || row['price'] || '',
            description: row['Details'] || row['Description'] || row['details'] || '',
            image: row['Image URL'] || row['image'] || '',
            status: row['Status'] || row['status'] || 'Available'
        })) : FALLBACK_PRODUCTS;
    }

    /**
     * Get projects data from Google Sheets or fallback
     */
    async function getProjects() {
        const data = await fetchData(CONFIG.sheets.projects);
        return data.length > 0 ? data.map(row => ({
            name: row['Project Name'] || row['name'] || '',
            description: row['Description'] || '',
            image: row['Image URL'] || row['image'] || ''
        })) : FALLBACK_PROJECTS;
    }

    /**
     * Get testimonials from Google Sheets or fallback
     */
    async function getTestimonials() {
        const data = await fetchData(CONFIG.sheets.testimonials);
        return data.length > 0 ? data.map(row => ({
            name: row['Name'] || '',
            rating: parseInt(row['Rating']) || 5,
            review: row['Review'] || ''
        })) : FALLBACK_TESTIMONIALS;
    }

    return {
        getServices: () => DEFAULT_SERVICES,
        getProducts,
        getProjects,
        getTestimonials
    };

})();
