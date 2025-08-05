# Toolzin - Online Tools Collection

A collection of useful online tools built with Next.js and TailwindCSS.

## 🛠️ Features

- CPF Generator - Generate valid Brazilian CPFs for testing and development
- CNPJ Generator - Generate valid Brazilian CNPJs for testing and development
- Password Generator - Create secure passwords with custom options
- Hash Generator - Generate hash values from text using various algorithms
- JWT Decoder - Decode and analyze JWT tokens with detailed explanations
- Base64 Tool - Encode text to Base64 or decode Base64 to text

## 🚀 Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

## 📊 Analytics Setup

This project is configured with Google Analytics 4 (GA4) for tracking visitor interactions with the site. Follow these steps to enable analytics:

1. Create a Google Analytics 4 property in the [Google Analytics console](https://analytics.google.com/)
2. Get your Measurement ID (starts with G-)
3. Update the `.env.local` file with your Measurement ID:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The analytics implementation includes:

- Page view tracking
- Event tracking for tool usage
- Tracking for key user interactions (copying, generating, etc.)

## 📝 Analytics Events

The following events are tracked:

- **Page Views**: All page navigations
- **Tool Usage**: 
  - `generate_cpf`: When a CPF is generated
  - `generate_cnpj`: When a CNPJ is generated
  - `generate_password`: When a password is generated
  - `generate_hash`: When a hash is generated
  - `decode_jwt`: When a JWT token is decoded
  - `base64_encode`: When text is encoded to Base64
  - `base64_decode`: When Base64 is decoded to text
  - `copy`: When content is copied to clipboard
- **Password Options**: Changes to password generation options
- **Password Strength**: The strength score of generated passwords

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🔒 Privacy

- All tools run entirely in the browser
- No data is sent to any server (except for analytics)
- No personally identifiable information is collected
- Analytics can be disabled by removing the GA Measurement ID from the environment variables

## � SEO

This project includes:
- `sitemap.xml` - Helps search engines discover and index all pages
- `robots.txt` - Provides crawling instructions for search engine bots

Both files are located in the `/public` directory.

## �📄 License

This project is open source and available under the MIT License.
