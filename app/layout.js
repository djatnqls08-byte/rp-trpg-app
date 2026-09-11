export const metadata = {
  title: "TRPG 시나리오 룸",
  description: "텍스트 TRPG",
  openGraph: {
    title: "TRPG 시나리오 룸",
    description: "텍스트 TRPG",
    images: [
      {
        url: "https://i.pinimg.com/1200x/d8/2a/97/d82a97e86b15f52758d8cca34c51ffc1.jpg",
        width: 1200,
        height: 630,
        alt: "TRPG Cover Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRPG 시나리오 룸",
    description: "텍스트 TRPG",
    images: ["https://i.pinimg.com/1200x/d8/2a/97/d82a97e86b15f52758d8cca34c51ffc1.jpg"],
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
