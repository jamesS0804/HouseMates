import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, AlertTriangle, X } from 'lucide-react';

interface AlertNotificationProps {
  alert: any
  setAlert: Function
}

export default function AlertNotification(props:AlertNotificationProps) {
    const { alert, setAlert } = props
    const handleAlertClose = () => {
      setAlert({ status: "", message: "" })
    }

    switch (alert.status) {
        case 'SUCCESS':
          return (
            <Alert className='absolute top-0 bg-green-100 rounded-none border-none p-3 z-20 shadow'>
                <div className='flex gap-3 relative px-3 pt-2 pb-1'>
                    <div><Check className="h-full w-9 text-green-500" /></div>
                    <div className='flex flex-col gap-1 text-green-500 font-black'>
                        <AlertTitle className='font-black text-base'>Success</AlertTitle>
                        <AlertDescription className='text-base'>{alert.message}</AlertDescription>
                    </div>
                    <Button 
                      className='border border-green-500 p-0 w-9 h-9 absolute right-0 top-0'
                      onClick={handleAlertClose}
                    ><X className='text-green-500' /></Button>
                </div>
            </Alert>
          );
        case 'ERROR':
          return (
            <Alert className='absolute top-0 bg-red-100 rounded-none border-none p-3 z-20 shadow'>
                <div className='flex gap-3 relative px-3 pt-2 pb-1'>
                    <div><AlertCircle className="h-full w-9 text-red-500" /></div>
                    <div className='flex flex-col gap-1 text-red-500 font-black'>
                        <AlertTitle className='font-black text-base'>Error</AlertTitle>
                        <AlertDescription className='text-base'>{alert.message}</AlertDescription>
                    </div>
                    <Button 
                      className='border border-red-500 p-0 w-9 h-9 absolute right-0 top-0'
                      onClick={handleAlertClose}
                    ><X className='text-red-500' /></Button>
                </div>
            </Alert>
          );
        case 'WARNING':
          return (
            <Alert className='absolute top-0 bg-yellow-100 rounded-none border-none p-3 z-20 shadow'>
                <div className='flex gap-3 relative px-3 pt-2 pb-1'>
                    <div><AlertTriangle className="h-full w-9 text-yellow-500" /></div>
                    <div className='flex flex-col gap-1 text-yellow-500 font-black'>
                        <AlertTitle className='font-black text-base'>Warning</AlertTitle>
                        <AlertDescription className='text-base'>{alert.message}</AlertDescription>
                    </div>
                    <Button 
                      className='border border-yellow-500 p-0 w-9 h-9 absolute right-0 top-0'
                      onClick={handleAlertClose}
                    ><X className='text-yellow-500' /></Button>
                </div>
            </Alert>
          );
        default:
          return null;
    }
}