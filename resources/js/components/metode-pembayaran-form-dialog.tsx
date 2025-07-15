import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, useForm } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

interface MetodePembayaranFormField {
    id: string;
    label: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'file' | 'checkbox';
    required?: boolean;
    defaultValue?: string;
    defaultChecked?: boolean;
    accept?: string;
}

interface MetodePembayaranFormDialogProps {
    title: string;
    description: string;
    fields: MetodePembayaranFormField[];
    mode?: 'create' | 'edit';
    initialData?: Record<string, any>;
    onSubmit?: (data: FormData) => void;
    trigger?: React.ReactNode;
    submitText?: string;
    triggerText?: string;
    triggerIcon?: React.ReactNode;
    action?: string;
    method?: 'post' | 'put' | 'patch';
}

export function MetodePembayaranFormDialog({
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
}: MetodePembayaranFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>({});

    const defaultFormData = fields.reduce((acc, field) => {
        if (field.type === 'checkbox') {
            return acc;
        }
        return {
            ...acc,
            [field.id]: field.defaultValue || initialData[field.id] || '',
        };
    }, {});

    // Initialize checkbox values
    useState(() => {
        const checkboxDefaults: Record<string, boolean> = {};
        fields.forEach((field) => {
            if (field.type === 'checkbox') {
                checkboxDefaults[field.id] = field.defaultChecked ?? initialData[field.id] ?? false;
            }
        });
        setCheckboxValues(checkboxDefaults);
    });

    const { data, setData, post, put, patch, processing, reset, errors } = useForm<Record<string, any>>(defaultFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            const formData = new FormData();

            // Add regular fields
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            // Add checkbox values
            Object.keys(checkboxValues).forEach((key) => {
                formData.append(key, checkboxValues[key] ? '1' : '0');
            });

            // Add files
            Object.keys(files).forEach((key) => {
                if (files[key]) {
                    formData.append(key, files[key]!);
                }
            });

            onSubmit(formData);
            setOpen(false);
            if (mode === 'create') {
                reset();
                setFiles({});
                setCheckboxValues({});
            }
            return;
        }

        if (action) {
            // For file uploads, we need to use router.post with FormData
            const formData = new FormData();

            // Add regular fields
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            // Add checkbox values
            Object.keys(checkboxValues).forEach((key) => {
                formData.append(key, checkboxValues[key] ? '1' : '0');
            });

            // Add files
            Object.keys(files).forEach((key) => {
                if (files[key]) {
                    formData.append(key, files[key]!);
                }
            });

            // For PUT/PATCH requests with file uploads, we need to add _method
            if (method === 'put' || method === 'patch') {
                formData.append('_method', method.toUpperCase());
            }

            // Use router.post for all file uploads
            router.post(action, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    if (mode === 'create') {
                        reset();
                        setFiles({});
                        setCheckboxValues({});
                    }
                },
                onError: () => {},
            });
        }
    };

    const handleInputChange = (fieldId: string, value: string) => {
        setData((prev: Record<string, any>) => ({ ...prev, [fieldId]: value }));
    };

    const handleFileChange = (fieldId: string, file: File | null) => {
        setFiles((prev) => ({ ...prev, [fieldId]: file }));
    };

    const handleCheckboxChange = (fieldId: string, checked: boolean) => {
        setCheckboxValues((prev) => ({ ...prev, [fieldId]: checked }));
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    {fields.map((field) => (
                        <div key={field.id}>
                            <Label htmlFor={field.id}>{field.label}</Label>
                            {field.type === 'textarea' ? (
                                <Input
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    value={data[field.id] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    className={errors[field.id] ? 'border-red-500' : ''}
                                />
                            ) : field.type === 'file' ? (
                                <Input
                                    id={field.id}
                                    type="file"
                                    accept={field.accept}
                                    onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                                    required={field.required}
                                    className={errors[field.id] ? 'border-red-500' : ''}
                                />
                            ) : field.type === 'checkbox' ? (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={field.id}
                                        checked={checkboxValues[field.id] || false}
                                        onCheckedChange={(checked) => handleCheckboxChange(field.id, !!checked)}
                                    />
                                    <Label htmlFor={field.id} className="text-sm font-normal">
                                        {field.label}
                                    </Label>
                                </div>
                            ) : (
                                <Input
                                    id={field.id}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    value={data[field.id] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.id, e.target.value)}
                                    required={field.required}
                                    className={errors[field.id] ? 'border-red-500' : ''}
                                />
                            )}
                            {errors[field.id] && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
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
