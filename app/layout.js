export const metadata = {
  title: "LyrisTable",
  description: "​몇 개의 키워드가 온전한 세계로 완성되는 1:1 텍스트 TRPG",
  icons: {
    icon: "/icon.png", // 🌟 [추가됨] 브라우저 탭 아이콘 연결!
  },
  openGraph: {
    title: "LyrisTable",
    description: "​몇 개의 키워드가 온전한 세계로 완성되는 1:1 텍스트 TRPG",
    images: [
      {
        url: "https://cdn.phototourl.com/free/2026-09-13-be3b81ab-c892-4f25-ba89-1bb86ea1518e.jpg",
        width: 1200,
        height: 630,
        alt: "TRPG Cover Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LyrisTable",
    description: "​몇 개의 키워드가 온전한 세계로 완성되는 1:1 텍스트 TRPG",
    images: ["https://cdn.phototourl.com/free/2026-09-13-be3b81ab-c892-4f25-ba89-1bb86ea1518e.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
