export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
            {children}
        </div>
    )
}
