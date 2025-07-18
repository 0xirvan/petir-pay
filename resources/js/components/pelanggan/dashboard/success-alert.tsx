import { usePage } from '@inertiajs/react';
import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuccessAlert() {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string; redirect_to_history?: boolean };

    // Handle flash messages
    useEffect(() => {
        if (flash.success) {
            setShowSuccessAlert(true);
            const timeout = flash.redirect_to_history ? 6000 : 5000;
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, timeout);
        }
        if (flash.error) {
            setShowErrorAlert(true);
            setTimeout(() => {
                setShowErrorAlert(false);
            }, 5000);
        }
    }, [flash]);

    return (
        <>
            {/* Success Alert */}
            {showSuccessAlert && flash.success && (
                <div className="fixed top-20 right-4 z-[9999] max-w-sm rounded-lg border border-green-200 bg-green-50 p-4 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start">
                        <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">Berhasil!</p>
                            <p className="mt-1 text-sm text-green-700">{flash.success}</p>
                            {flash.redirect_to_history && (
                                <p className="mt-2 text-xs font-medium text-green-600">Anda akan diarahkan ke tab Riwayat</p>
                            )}
                        </div>
                        <button onClick={() => setShowSuccessAlert(false)} className="ml-2 text-green-600 hover:text-green-700">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {showErrorAlert && flash.error && (
                <div className="fixed top-20 right-4 z-[9999] max-w-sm rounded-lg border border-red-200 bg-red-50 p-4 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start">
                        <div className="mt-0.5 mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                            <X className="h-3 w-3 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">Error!</p>
                            <p className="mt-1 text-sm text-red-700">{flash.error}</p>
                        </div>
                        <button onClick={() => setShowErrorAlert(false)} className="ml-2 text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
