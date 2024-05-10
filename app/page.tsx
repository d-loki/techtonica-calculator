'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import TableResult from '@/components/Content/TableResult';


export default function Home() {
    return (
        <div className="grid h-screen w-full pl-[56px]">
            <div className="flex flex-col">
                <Header />
                <main className="flex gap-4 overflow-auto p-4">
                    <Sidebar />
                    <TableResult />
                </main>
            </div>
        </div>
    );
}


