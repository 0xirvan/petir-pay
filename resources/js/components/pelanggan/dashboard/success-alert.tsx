import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessAlert() {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };

    // Handle flash messages
    useEffect(() => {
        if (flash.success) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);
        }
        if (flash.error) {
            alert(flash.error);
        }
    }, [flash]);

    if (!showSuccessAlert || !flash.success) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 rounded-lg border border-green-200 bg-green-50 p-4 shadow-lg">
            <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                <div>
                    <p className="text-sm font-medium text-green-800">{flash.success}</p>
                </div>
                <button 
                    onClick={() => setShowSuccessAlert(false)} 
                    className="ml-4 text-green-600 hover:text-green-700"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
