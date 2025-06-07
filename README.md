# MODMASTER - Premium Mod APK Website

A modern, cyberpunk-themed website for downloading premium mod APKs with a comprehensive admin panel for content management.

## Features

### Website Features
- **Modern Cyberpunk Design**: Dark theme with neon accents and futuristic animations
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **SEO Optimized**: Meta tags, structured data, and optimized performance
- **Fast Loading**: Optimized images, lazy loading, and performance best practices
- **Search Functionality**: Real-time search with filtering capabilities
- **Video Tutorial**: Popup modal with installation instructions
- **Individual App Pages**: Dedicated pages for each app with detailed information
- **Contact Form**: Integrated with formsubmit.co for app requests

### Admin Panel Features
- **Secure Login**: Password-protected admin access
- **App Management**: Add, edit, and delete apps with rich form interface
- **Settings Management**: Configure website colors, content, and settings
- **Menu Management**: Create and manage navigation menu items
- **JSON-Based CMS**: All data stored in a single JSON file for easy management
- **Export/Import**: Backup and restore functionality
- **Real-time Preview**: Changes reflect immediately on the website

### Technical Features
- **Pure HTML/CSS/JS**: No external frameworks or dependencies
- **Google Drive Integration**: File and image hosting through Google Drive
- **Mobile Responsive**: Optimized for all screen sizes
- **Performance Optimized**: Fast loading times and smooth animations
- **Cross-browser Compatible**: Works on all modern browsers

## File Structure

```
modmaster/
├── index.html              # Main website homepage
├── app-detail.html         # Individual app detail page
├── thank-you.html          # Thank you page after form submission
├── styles.css              # Main website styles
├── script.js               # Main website JavaScript
├── data.json               # Website content and app data
├── admin/
│   ├── index.html          # Admin panel interface
│   ├── admin-styles.css    # Admin panel styles
│   └── admin-script.js     # Admin panel JavaScript
└── README.md               # This file
```

## Setup Instructions

### 1. GitHub Pages Deployment

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your website will be available at `https://yourusername.github.io/repository-name`

### 2. Admin Panel Access

- URL: `https://yourusername.github.io/repository-name/admin/`
- Username: `admin`
- Password: `modmaster2024`

### 3. Google Drive Setup

1. Upload your AP files and images to Google Drive
2. Make them publicly accessible
3. Get the direct download links
4. Use these links in the admin panel when adding apps

### 4. Form Configuration

The contact form is configured to use formsubmit.co with the email `ishant150407@gmail.com`. To change this:

1. Open `index.html`
2. Find the form with `action="https://formsubmit.co/ishant150407@gmail.com"`
3. Replace the email with your desired email address

## Admin Panel Usage

### Adding Apps

1. Login to the admin panel
2. Go to the "Apps" tab
3. Click "Add New App"
4. Fill in all required fields:
   - App Name, Version, Category
   - Description and features
   - Google Drive links for icon, image, and APK file
   - Rating, downloads, size information
5. Mark as Featured or Trending if desired
6. Save the app

### Managing Settings

1. Go to the "Settings" tab
2. Update site information:
   - Site name and description
   - Contact email and website links
   - Theme colors
   - Tutorial video URL
3. Save settings

### Menu Management

1. Go to the "Menu" tab
2. Add, edit, or delete navigation menu items
3. Use section anchors (#section) or full URLs

### Export/Import Data

1. Go to the "Export" tab
2. Download JSON data for backup
3. Import data to restore from backup
4. Export CSV for app data analysis

## Customization

### Colors
Update the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #00f3ff;    /* Cyan */
    --secondary-color: #b829ff;  /* Purple */
    --accent-color: #39ff14;     /* Green */
}
```

### Content
All content is managed through the admin panel and stored in `data.json`. You can:
- Add/remove apps
- Update website settings
- Modify navigation menu
- Change contact information

### Styling
- Main styles: `styles.css`
- Admin styles: `admin/admin-styles.css`
- Both use CSS custom properties for easy theming

## SEO Optimization

The website includes:
- Semantic HTML structure
- Meta tags for description, keywords, and social sharing
- Open Graph and Twitter Card meta tags
- Structured data (JSON-LD) for search engines
- Optimized images with alt text
- Fast loading times
- Mobile-responsive design

## Performance Features

- Lazy loading for images
- CSS and JavaScript minification ready
- Optimized animations and transitions
- Efficient DOM manipulation
- Responsive images
- Minimal external dependencies

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- Admin panel uses client-side authentication (suitable for personal use)
- For production use, implement server-side authentication
- Regularly backup your data.json file
- Keep admin credentials secure

## Contributing

This is a personal project, but suggestions and improvements are welcome. Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is created by Ishant Webworks. Feel free to use and modify for personal projects.

## Support

For support or questions:
- Email: ishant150407@gmail.com
- Website: https://ishant.shop
- Blog: https://blogs.ishant.shop

## Credits

- Created by: Ishant Webworks
- Design: Cyberpunk/Futuristic theme
- Icons: Custom SVG icons
- Fonts: Google Fonts (Orbitron, Rajdhani)
- Images: Pexels (for demo content)