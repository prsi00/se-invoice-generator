import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings as SettingsIcon, FilePlus, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export function DefaultLayout() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'New Invoice', path: '/invoice/new', icon: FilePlus },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ];

    const NavContent = () => (
        <>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        I
                    </div>
                    InvoiceGen PWA
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-center text-slate-400">
                Cross-Platform • Offline Ready
            </div>
        </>
    );

    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <div className="w-7 h-7 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        I
                    </div>
                    InvoiceGen
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 flex flex-col">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex-col shrink-0">
                <NavContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}
