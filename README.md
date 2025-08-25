# 🚀 PeerLink - Privacy-First Professional Networking

> **Instant trusted connections — without oversharing**

PeerLink revolutionizes professional networking by providing instant, verified connections through QR codes while maintaining complete privacy control. Built with Civic Auth for secure identity verification and Web3-ready architecture.

## 🎯 **Problem Statement**

Traditional networking at events involves:
- **Oversharing personal information** with business cards
- **Privacy concerns** about data being stored indefinitely
- **Inefficient follow-up** processes after events
- **No verification** of professional identities
- **Limited control** over what information is shared

## 💡 **Solution**

PeerLink provides a **privacy-first networking platform** that:
- **Verifies identities** through Civic Auth (Google, Discord, X)
- **Generates unique QR codes** for instant connections
- **Controls information sharing** with granular privacy settings
- **Enables real-time messaging** without exchanging contact details
- **Integrates Web3 wallets** for future blockchain features

## 🏗️ **Architecture**

### **Frontend (React + TypeScript)**
- **Modern React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, beautiful UI
- **Civic Auth SDK** for secure authentication
- **Component-based architecture** for maintainability

### **Backend (Node.js + Express)**
- **RESTful API** with Express.js
- **Prisma ORM** for database management
- **JWT authentication** for secure sessions
- **Modular service architecture**

### **Database (PostgreSQL)**
- **User profiles** with privacy controls
- **Connection management** between users
- **Event tracking** and participation
- **Message history** and conversations

### **Authentication (Civic Auth)**
- **OAuth 2.0** integration with Google, Discord, X
- **PKCE flow** for enhanced security
- **Verified identities** for trust building
- **Single sign-on** across platforms

## ✨ **Key Features**

### **🔐 Identity Verification**
- **Civic Auth integration** for verified professional identities
- **Multi-provider OAuth** (Google, Discord, X)
- **Secure authentication** without password requirements
- **Profile verification** badges

### **📱 QR Code Networking**
- **Instant QR generation** for professional profiles
- **Scan and connect** at events in real-time
- **Customizable QR designs** with branding options
- **Offline-first** networking capability

### **👁️ Privacy Controls**
- **Granular visibility settings** for each profile field
- **Context-aware sharing** based on event type
- **Temporary connections** with expiration options
- **Data retention controls** for user privacy

### **💬 Private Messaging**
- **In-app messaging** without contact exchange
- **Encrypted conversations** for security
- **File sharing** capabilities
- **Message threading** and organization

### **🎯 Event Management**
- **Event creation** and management tools
- **Participant directories** with privacy controls
- **QR code generation** for event-specific networking
- **Analytics and insights** for organizers

### **💰 Web3 Integration**
- **Wallet connection** (Solana, Ethereum)
- **NFT passes** for premium events
- **Token-gated access** to exclusive networks
- **Blockchain verification** of achievements

## 🔑 **Token Model**

### **Civic Auth Tokens**
- **Access tokens** for API authentication
- **Refresh tokens** for session management
- **ID tokens** for user identity verification

### **Future Web3 Tokens**
- **PLINK tokens** for platform governance
- **Achievement NFTs** for professional milestones
- **Event passes** for premium networking access
- **Reputation tokens** for community building

## 🚀 **Roadmap**

### **Phase 1: MVP (Current) ✅**
- [x] **Core authentication** with Civic Auth
- [x] **Basic profile management** with privacy controls
- [x] **QR code generation** and scanning
- [x] **Simple messaging** system
- [x] **Event creation** and management
- [x] **Web3 wallet integration** (basic)

### **Phase 2: Enhanced Features (Q2 2024)**
- [ ] **Advanced privacy controls** with AI recommendations
- [ ] **Group networking** and team connections
- [ ] **Analytics dashboard** for networking insights
- [ ] **Mobile app** for iOS and Android
- [ ] **API integrations** with CRM systems

### **Phase 3: Web3 Expansion (Q3 2024)**
- [ ] **DeFi integration** for networking incentives
- [ ] **DAO governance** for community decisions
- [ ] **Cross-chain compatibility** for multi-blockchain support
- [ ] **NFT marketplace** for professional achievements
- [ ] **Token staking** for premium features

### **Phase 4: Enterprise & Scale (Q4 2024)**
- [ ] **Enterprise SSO** integration
- [ ] **Advanced analytics** and reporting
- [ ] **White-label solutions** for organizations
- [ ] **Global expansion** with multi-language support
- [ ] **AI-powered networking** recommendations

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Lucide React** - Beautiful icons

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens

### **Authentication**
- **Civic Auth** - Identity verification
- **OAuth 2.0** - Authorization protocol
- **PKCE** - Security enhancement

### **Deployment**
- **Vercel** - Frontend hosting
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## 📱 **Getting Started**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- Civic Auth account
- OAuth provider credentials

### **Installation**
```bash
# Clone repository
git clone https://github.com/henrysammarfo/peerlink.git
cd peerlink

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

### **Environment Variables**
```bash
# Civic Auth
VITE_CIVIC_APP_ID=your_civic_app_id
VITE_CIVIC_REDIRECT_URI=your_redirect_uri

# OAuth Providers
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_DISCORD_CLIENT_ID=your_discord_client_id
VITE_X_CLIENT_ID=your_x_client_id

# Database
DATABASE_URL=your_postgresql_url
```

## 🌐 **Live Demo**

**Production Site:** [https://peerlink-blush.vercel.app](https://peerlink-blush.vercel.app)
**Demo Video:** [[DEMO VIDEO](https://youtu.be/c-3N21aBFVo)]((https://youtu.be/c-3N21aBFVo))

**Features Available:**
- ✅ **OAuth Authentication** (Google, Discord, X)
- ✅ **Profile Management** with privacy controls
- ✅ **QR Code Generation** and sharing
- ✅ **Event Creation** and management
- ✅ **Private Messaging** system
- ✅ **Web3 Wallet** integration

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation:** [docs.peerlink.com](https://docs.peerlink.com)
- **Issues:** [GitHub Issues](https://github.com/henrysammarfo/peerlink/issues)
- **Discord:** [Join our community](https://discord.gg/peerlink)
- **Email:** support@peerlink.com

## 🙏 **Acknowledgments**

- **Civic** for secure identity verification
- **Vercel** for reliable hosting
- **Open source community** for amazing tools
- **Early adopters** for valuable feedback

---

**Built with ❤️ by the PeerLink Team**

*Transforming professional networking, one connection at a time.*
