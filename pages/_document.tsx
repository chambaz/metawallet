import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="scroll-smooth">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.theme === 'light') {
                document.documentElement.classList.remove('dark')
              } else {
                document.documentElement.classList.add('dark')
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
