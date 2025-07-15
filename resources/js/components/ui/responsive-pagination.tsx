import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
}

interface ResponsivePaginationProps {
    data: PaginationData;
    routeName: string;
    routeParams?: Record<string, any>;
    className?: string;
}

export default function ResponsivePagination({ data, routeName, routeParams = {}, className = '' }: ResponsivePaginationProps) {
    const { current_page, last_page, from, to, total } = data;

    const navigateToPage = (page: number) => {
        router.get(route(routeName), {
            ...routeParams,
            page,
        });
    };

    const generatePageNumbers = () => {
        const pages = [];
        const showPages = 3; // Show fewer pages on mobile
        
        // Always show first page
        if (current_page > showPages + 1) {
            pages.push(1);
            if (current_page > showPages + 2) {
                pages.push('...');
            }
        }

        // Show pages around current page
        for (let i = Math.max(1, current_page - Math.floor(showPages / 2)); 
             i <= Math.min(last_page, current_page + Math.floor(showPages / 2)); 
             i++) {
            pages.push(i);
        }

        // Always show last page
        if (current_page < last_page - showPages) {
            if (current_page < last_page - showPages - 1) {
                pages.push('...');
            }
            pages.push(last_page);
        }

        return pages;
    };

    const generateMobilePageNumbers = () => {
        const pages = [];
        
        // For mobile, only show current page and adjacent pages
        for (let i = Math.max(1, current_page - 1); 
             i <= Math.min(last_page, current_page + 1); 
             i++) {
            pages.push(i);
        }

        return pages;
    };

    if (last_page <= 1) return null;

    return (
        <div className={`flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${className}`}>
            {/* Results info */}
            <div className="text-sm text-gray-700">
                <span className="hidden sm:inline">
                    Menampilkan {from} sampai {to} dari {total} hasil
                </span>
                <span className="sm:hidden">
                    {from}-{to} dari {total}
                </span>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between sm:justify-end">
                {/* Mobile pagination */}
                <div className="flex items-center space-x-1 sm:hidden">
                    {/* Previous button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={current_page === 1}
                        onClick={() => navigateToPage(current_page - 1)}
                        className="px-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers - mobile version */}
                    {generateMobilePageNumbers().map((page) => (
                        <Button
                            key={page}
                            variant={page === current_page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => navigateToPage(page)}
                            className="px-3"
                        >
                            {page}
                        </Button>
                    ))}

                    {/* Next button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={current_page === last_page}
                        onClick={() => navigateToPage(current_page + 1)}
                        className="px-2"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden items-center space-x-2 sm:flex">
                    {/* Previous button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={current_page === 1}
                        onClick={() => navigateToPage(current_page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Sebelumnya
                    </Button>

                    {/* Page numbers - desktop version */}
                    <div className="flex space-x-1">
                        {generatePageNumbers().map((page, index) =>
                            page === '...' ? (
                                <span key={index} className="flex h-9 w-9 items-center justify-center text-gray-500">
                                    <MoreHorizontal className="h-4 w-4" />
                                </span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={page === current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => navigateToPage(page as number)}
                                    className="w-9"
                                >
                                    {page}
                                </Button>
                            )
                        )}
                    </div>

                    {/* Next button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={current_page === last_page}
                        onClick={() => navigateToPage(current_page + 1)}
                    >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                {/* Jump to page - mobile only */}
                <div className="flex items-center space-x-2 sm:hidden">
                    <span className="text-sm text-gray-500">Halaman</span>
                    <Select 
                        value={current_page.toString()} 
                        onValueChange={(value) => navigateToPage(parseInt(value))}
                    >
                        <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: last_page }, (_, i) => i + 1).map((page) => (
                                <SelectItem key={page} value={page.toString()}>
                                    {page}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500">dari {last_page}</span>
                </div>
            </div>
        </div>
    );
}
