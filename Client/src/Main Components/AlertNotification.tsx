import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, AlertTriangle } from 'lucide-react';

export default function AlertNotification(props:any) {
    const { alert } = props

    switch (alert.status) {
        case 'SUCCESS':
          return (
            <Alert className="absolute top-0 bg-green-200 rounded-none border-none flex gap-3">
                <div><Check className="h-full w-9 text-green-500" /></div>
                <div className='flex flex-col gap-1 text-green-500 font-black'>
                    <AlertTitle className='font-black'>Success</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </div>
            </Alert>
          );
        case 'ERROR':
          return (
            <Alert variant="destructive" className="absolute top-0 bg-red-200 rounded-none border-none flex gap-3">
                <div><AlertCircle className="h-full w-9 text-red-500" /></div>
                <div className='flex flex-col gap-1 text-red-500 font-black'>
                    <AlertTitle className='font-black'>Error</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </div>
            </Alert>
          );
        case 'WARNING':
          return (
            <Alert className="absolute top-0 bg-yellow-200 rounded-none border-none flex gap-3">
                <div><AlertTriangle className="h-full w-9 text-yellow-500" /></div>
                <div className='flex flex-col gap-1 text-yellow-500 font-black'>
                    <AlertTitle className='font-black'>Warning</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </div>
            </Alert>
          );
        default:
          return null;
    }
}