import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

interface FormField {
    id: string;
    label: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'select';
    required?: boolean;
    defaultValue?: string;
    options?: { value: string; label: string }[];
}

interface FormDialogProps {
    title: string;
    description: string;
    fields: FormField[];
    mode?: 'create' | 'edit';
    initialData?: Record<string, string>;
    onSubmit?: (data: Record<string, string>) => void;
    trigger?: React.ReactNode;
    submitText?: string;
    triggerText?: string;
    triggerIcon?: React.ReactNode;
    action?: string;
    method?: 'post' | 'put' | 'patch';
}

export function FormDialog({
    title,
    description,
    fields,
    mode = 'create',
    initialData = {},
    onSubmit,
    trigger,
    submitText,
    triggerText,
    triggerIcon,
    action,
    method = 'post',
}: FormDialogProps) {
    const [open, setOpen] = useState(false);

    const defaultFormData = fields.reduce(
        (acc, field) => ({
            ...acc,
            [field.id]: field.defaultValue || initialData[field.id] || '',
        }),
        {},
    );

    const { data, setData, post, put, patch, processing, reset } = useForm<Record<string, string>>(defaultFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(data);
            setOpen(false);
            if (mode === 'create') {
                reset();
            }
            return;
        }

        if (action) {
            const submitMethod = method === 'put' ? put : method === 'patch' ? patch : post;
            submitMethod(action, {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    if (mode === 'create') {
                        reset();
                    }
                },
            });
        }
    };

    const handleInputChange = (fieldId: string, value: string) => {
        setData((prev) => ({ ...prev, [fieldId]: value }));
    };

    const defaultTrigger =
        mode === 'create' ? (
            <Button className="bg-blue-600 hover:bg-blue-700">
                {triggerIcon || <Plus className="mr-2 h-4 w-4" />}
                {triggerText || 'Tambah'}
            </Button>
        ) : (
            <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
        );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.id}>
                            <Label htmlFor={field.id}>{field.label}</Label>
                            {field.type === 'select' ? (
                                <Select
                                    value={data[field.id] || ''}
                                    onValueChange={(value) => handleInputChange(field.id, value)}
                                    required={field.required}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.placeholder || 'Pilih option'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    id={field.id}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    value={data[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={processing}>
                        {processing ? 'Loading...' : submitText || (mode === 'create' ? 'Simpan' : 'Update')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
