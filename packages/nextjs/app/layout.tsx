import "@rainbow-me/rainbowkit/styles.css";
import "@scaffold-ui/components/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Givvest",
  description: "Don't give, just Givvest. Deposit USDC, keep your principal, donate only the yield.",
});

const GivvestApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Givvest" />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="117887d6-6a7d-4f1b-a791-0ac51fa38814"
        ></script>
      </head>
      <body>
        <ThemeProvider enableSystem={false} defaultTheme="light">
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default GivvestApp;
