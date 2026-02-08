import '@styles/globals.css'

export const metadata = {
    title: "Chatrigo Mini Project",
    description: "A Lite version of Chatrigo made by Goobins!"
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
        <body>
            <div className="main bg-gradient-to-bl from-orange-400 to-orange-600">
            </div>

            <main className='app'>
                {children}
            </main>
        </body>
    </html>
  )
}


export default layout;