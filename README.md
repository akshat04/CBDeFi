# CBDeFi Payment Gateway

A modern, regulatory-compliant payment gateway that bridges cryptocurrency and traditional UPI payments, featuring CBDC integration and smart contract-based escrow for instant settlements.

## Features

- **Crypto to UPI Payments**: Seamlessly pay UPI merchants using crypto tokens
- **Regulatory Compliance**: Full KYC, AML, and tax compliance framework
- **Instant Settlement**: Real-time payments with smart contract escrow
- **CBDC Integration**: Strengthening digital rupee circulation
- **Multi-Step Workflow**: Comprehensive payment process with validation, wallet connection, AML checks, and transaction signing
- **Modern UI**: Built with shadcn-ui and Tailwind CSS for a polished user experience

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn-ui, Radix UI primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner, React Toast

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (shadcn-ui)
│   └── workflow/    # Payment workflow components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Route components
└── main.tsx         # App entry point
```

## Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Workflow Steps

The payment gateway follows a comprehensive workflow:

1. **Payment Initiation** - Enter amount and payment method
2. **Token Selection** - Choose cryptocurrency token
3. **Token Validation** - Verify token and amount
4. **Transaction Review** - Review payment details
5. **Wallet Connection** - Connect crypto wallet
6. **AML Check** - Security and compliance verification
7. **Balance Check** - Verify sufficient balance
8. **Transaction Signing** - Sign and authorize transaction
9. **Settlement** - Process and complete payment

## Deployment

This project can be deployed using various platforms:

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag & drop the build folder or connect via Git

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
