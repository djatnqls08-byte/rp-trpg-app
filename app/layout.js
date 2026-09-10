export const metadata = {
  title: "RP & TRPG Sandbox",
  description: "Custom RP App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>{children}</body>
    </html>
  );
}
