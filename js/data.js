/**
 * SK Electrical Services - Data Management
 * Handles fetching CSV from Google Sheets and parsing.
 */

const DataManager = (() => {

    // Fallback data for Services (as provided in prompt)
    const DEFAULT_SERVICES = [
        { name: "House Wiring", image: "https://images.unsplash.com/photo-1621905252507-b354bc2a196e?w=600&q=80", description: "Complete house electrification with high safety standards and quality materials.", icon: "home" },
        { name: "Electrical Repair", image: "https://images.unsplash.com/photo-1454165833267-02484a0d9236?w=600&q=80", description: "Expert troubleshooting and repair for all types of electrical faults.", icon: "tool" },
        { name: "Fan Installation", image: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600&q=80", description: "Ceiling, exhaust, and wall fan installation and maintenance.", icon: "wind" },
        { name: "CCTV Installation", image: "https://images.unsplash.com/photo-1557597774-9d2739f85aae?w=600&q=80", description: "Secure your home with professional CCTV surveillance setup.", icon: "video" },
        { name: "Solar Installation", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80", description: "Switch to clean energy with our solar panel installation service.", icon: "sun" },
        { name: "Inverter Installation", image: "https://images.unsplash.com/photo-1618576725058-294277c1b24e?w=600&q=80", description: "Quality inverter and battery setup for uninterrupted power backup.", icon: "battery-charging" },
        { name: "AC Wiring", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?w=600&q=80", description: "Specialized high-amp wiring and point installation for air conditioners.", icon: "snowflake" },
        { name: "Maintenance Service", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80", description: "Periodic electrical health checks and preventive maintenance.", icon: "settings" }
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
