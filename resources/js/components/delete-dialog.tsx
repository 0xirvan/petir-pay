import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteDialogProps {
    title?: string;
    description?: string;
    itemName?: string;
    action: string;
    onSuccess?: () => void;
    onError?: () => void;
    trigger?: React.ReactNode;
    method?: 'delete' | 'post';
    disabled?: boolean;
}

export function DeleteDialog({
    title = 'Konfirmasi Hapus',
    description,
    itemName = 'item ini',
    action,
    onSuccess,
    onError,
    trigger,
    method = 'delete',
    disabled = false,
}: DeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const defaultDescription = description || `Apakah Anda yakin ingin menghapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`;

    const handleDelete = () => {
        setIsDeleting(true);

        if (method === 'delete') {
            router.delete(action, {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    setIsDeleting(false);
                    onSuccess?.();
                },
                onError: () => {
                    setIsDeleting(false);
                    onError?.();
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            });
        } else {
            router.post(
                action,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setOpen(false);
                        setIsDeleting(false);
                        onSuccess?.();
                    },
                    onError: () => {
                        setIsDeleting(false);
                        onError?.();
                    },
                    onFinish: () => {
                        setIsDeleting(false);
                    },
                },
            );
        }
    };

    const defaultTrigger = (
        <Button variant="ghost" size="sm" disabled={disabled}>
            <Trash2 className="h-4 w-4" />
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-500" />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-left">{defaultDescription}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
