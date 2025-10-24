interface HeaderProps {
    onUserClick?: () => void;
}

export default function Header({ onUserClick }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Swara App
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="flex space-x-8">
                            <a href="/dashboard" className="text-gray-500 hover:text-gray-900">
                                Dashboard
                            </a>
                            <a href="/profile" className="text-gray-500 hover:text-gray-900">
                                Profile
                            </a>
                        </nav>
                        {onUserClick && (
                            <button
                                onClick={onUserClick}
                                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-orange-600 transition-colors"
                            >
                                F
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
