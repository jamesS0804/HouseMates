export default function getTotalCost(serviceDetails:any){
    const totalPrice =
        Number(serviceDetails.service.price) +
        Number(serviceDetails.data['Home Type'].price) +
        Number(serviceDetails.data['Room Type'].price) +
        Number(serviceDetails.data['Bathroom Count'].price) +
        serviceDetails.data['Extra Service'].reduce((acc: number, service: { quantity?: number, price: number }) => {
            const quantity = service.quantity || 1;
            return Number(acc) + Number(service.price) * Number(quantity);
        }, 0);
    return totalPrice
}