# SK Electrical Services Website

A premium, modern electrician business website with dynamic content management via Google Sheets.

## 🚀 Features
- **Modern Design**: Card-based layout with Dark/Light mode support.
- **Dynamic Content**: Products, Projects, and Testimonials are fetched directly from Google Sheets.
- **Responsive**: Fully optimized for Mobile, Tablet, and Desktop.
- **Quick Contact**: Integrated WhatsApp and Call buttons.
- **Fast Loading**: Optimized assets and skeletons for loading states.

## 🛠️ Setup Instructions

### 1. Google Sheets Setup
To manage your content without changing code, follow these steps:

1. Create a Google Sheet with the following columns for each sheet:
   
   **Products Sheet**:
   `Image URL` | `Product Name` | `Category` | `Price` | `Description` | `Status`

   **Projects Sheet**:
   `Image URL` | `Project Name` | `Description`

   **Testimonials Sheet**:
   `Name` | `Rating` | `Review`

2. Fill in your data.
3. Go to **File > Share > Publish to web**.
4. Select the specific sheet (e.g., "Products") and change "Web Page" to **Comma-separated values (.csv)**.
5. Copy the generated URL.
6. Open `js/config.js` and paste the URLs into the `sheets` object.

### 2. Business Customization
Update `js/config.js` with your specific details:
- `whatsappNumber`: Your phone number starting with country code (e.g., `919822338978`).
- `address`, `phoneNumber`, `email`: Your business contact info.
- `mapsEmbedUrl`: Your Google Maps embed link.

### 3. Deployment
The website is ready for deployment on:
- **GitHub Pages**: Upload all files to a repository and enable Pages in settings.
- **Netlify**: Drag and drop the folder into the Netlify dashboard.
- **Vercel**: Use the Vercel CLI or connect your GitHub repository.

## 📁 File Structure
- `index.html`: Main structure.
- `css/styles.css`: All styling and theme variables.
- `js/config.js`: Business and integration settings.
- `js/data.js`: Google Sheets fetching logic.
- `js/ui.js`: UI rendering components.
- `js/app.js`: Main app logic and event listeners.

---
Built with ❤️ for SK Electrical Services.
