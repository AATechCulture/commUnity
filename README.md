# CommUnity

<p align="center">
  <img src="[your-logo-path]" alt="CommUnity Logo" width="200"/>
</p>

## TL;DR 🚨
A community engagement platform powered by Next.js and GROQ AI that fosters meaningful connections and conversations.

## Challenge Statement(s) Addressed 🎯
- How might we create more meaningful connections in online communities?
- How might we leverage AI to facilitate better community engagement?
- How might we ensure safe and authentic online interactions?

## Project Description 🤯
CommUnity is an innovative platform that revolutionizes online community engagement by combining the power of Next.js with GROQ AI technology. The platform provides real-time interaction capabilities, secure authentication, and AI-powered conversation moderation to create safe and meaningful online spaces. Users can engage in discussions, share resources, and build connections while the AI ensures content quality and maintains community guidelines.

## Project Value 💰
Our target customers are community managers, online group administrators, and organizations looking to build engaged digital communities. CommUnity provides tangible benefits through reduced moderation overhead, increased user engagement metrics, and improved community safety. The AI-powered features help identify and promote quality conversations while automatically filtering inappropriate content, resulting in significant time and resource savings for community managers.

## Tech Overview 💻
- Next.js (Frontend & Backend)
- MongoDB Atlas (Database)
- GROQ AI (Language Model)
- NextAuth.js (Authentication)
- TailwindCSS (Styling)

## Link to Video Pitch 📹
[Watch our pitch](https://drive.google.com/drive/folders/1IDmaGLlK-yHJKO2XMgt4LM3R-_O3vRJP?usp=sharing)

## Link to Demo Presentation 📽
[View our presentation](https://drive.google.com/drive/folders/1IDmaGLlK-yHJKO2XMgt4LM3R-_O3vRJP?usp=sharing)

## Link to Presentation Slides 📽
[View our presentation](https://www.canva.com/design/DAGWmjqCf7g/J-5YUswfEkwi-3wCOT7q8Q/edit)

## Team Checklist ✅
- [x] Team photo
- [x] Team Slack channel
- [x] Communication established with mentor
- [x] Repo creation from template
- [x] Hangar registration

## Project Checklist 🏁
- [x] Presentation complete and linked
- [x] Video pitch recorded and linked
- [x] Code merged to main branch

## School Name 🏫
Fisk University

## Team Name 🏷
Fisk G13

## ✨ Contributors ✨
- Awantika Bastola - Product Developer [@reyyy81](https://github.com/reyyy81)
- Dinesh Pandey - Full Stack Developer [@dineshpandeyy](https://github.com/dineshpandeyy)
- Emmanuel Adeyemi - UX Designer [@AdeyemiEmmanuel](https://github.com/AdeyemiEmmanuel)
- Folusho Adeyemi - Project Manager [@folusho-adeyemi](https://github.com/folusho-adeyem)
- Pratush Khanal - Frontend Developer [@Khanalpratyush](https://github.com/Khanalpratyush)

## 🌟 Overview
CommUnity is a modern web application built to foster community engagement and connection. Powered by Next.js and MongoDB, it provides a robust platform for community interaction with secure authentication and intelligent conversation capabilities through GROQ API integration.

## ✨ Features

- 🔐 **Secure Authentication** - User authentication powered by NextAuth.js
- 💾 **MongoDB Integration** - Reliable data persistence with MongoDB Atlas
- 🤖 **AI Integration** - Smart conversations powered by GROQ API
- 🎨 **Modern UI** - Responsive and intuitive user interface
- ⚡ **Real-time Updates** - Instant interaction and updates
- 📱 **Mobile Responsive** - Seamless experience across all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- GROQ API account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/commUnity.git
   cd commUnity
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your credentials:
     - `DATABASE_URL`: MongoDB connection string
     - `NEXTAUTH_SECRET`: Generate a secure random string
     - `NEXTAUTH_URL`: Your application URL
     - `GROQ_API_KEY`: Your GROQ API key

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
commUnity/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # Reusable components
│   └── pages/          # Application pages
├── public/             # Static assets
├── styles/             # Global styles
├── lib/                # Utility functions
├── .env.example        # Environment variables example
└── package.json        # Project dependencies
```

## 💻 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **AI Integration**: GROQ API
- **Deployment**: Vercel

## 🔧 Configuration

### Environment Variables

```
DATABASE_URL=           # MongoDB connection string
NEXTAUTH_SECRET=        # NextAuth secret key
NEXTAUTH_URL=           # Application URL
GROQ_API_KEY=          # GROQ API key
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License

```
MIT License

Copyright (c) 2024 CommUnity

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🌟 Support

If you found this project helpful, please give it a ⭐️!

## 📞 Contact

For any inquiries or support:
- Email: support@community.com
- Twitter: [@CommUnityApp](https://twitter.com/CommUnityApp)
- Discord: [Join our community](https://discord.gg/community)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [MongoDB](https://www.mongodb.com/) - Database Solution
- [GROQ](https://groq.com/) - AI Language Model Provider
- [NextAuth.js](https://next-auth.js.org/) - Authentication Solution
- [TailwindCSS](https://tailwindcss.com/) - Styling Framework
- [Vercel](https://vercel.com/) - Deployment Platform

## 🔄 Updates & Changelog

### Latest Version: 1.0.0
- Initial release
- Basic authentication functionality
- GROQ API integration
- Community features implementation

## 🚨 Troubleshooting

Common issues and their solutions:

1. **Database Connection Issues**
   - Ensure your MongoDB connection string is correct
   - Check if your IP is whitelisted in MongoDB Atlas

2. **Authentication Problems**
   - Verify NEXTAUTH_URL matches your deployment URL
   - Ensure NEXTAUTH_SECRET is properly set

3. **GROQ API Issues**
   - Confirm your API key is valid
   - Check your rate limits and usage

For more detailed troubleshooting, please check our [Wiki](https://github.com/yourusername/commUnity/wiki) or open an issue.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
