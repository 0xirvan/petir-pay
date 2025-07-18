import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabNavigationProps {
    activeTab: string;
}

export default function TabNavigation({ activeTab }: TabNavigationProps) {
    return (
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-gray-200">
            <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
                Overview
            </TabsTrigger>
            <TabsTrigger 
                value="bayar" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
                Bayar Tagihan
            </TabsTrigger>
            <TabsTrigger 
                value="riwayat" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
                Riwayat
            </TabsTrigger>
        </TabsList>
    );
}
