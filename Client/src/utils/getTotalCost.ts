export default function getTotalCost(serviceDetails:any){
    const totalPrice =
        serviceDetails.service.price +
        serviceDetails.data['Home Type'].price +
        serviceDetails.data['Room Type'].price +
        serviceDetails.data['Bathroom Count'].price +
        serviceDetails.data['Extra Service'].reduce((acc: number, service: { quantity?: number, price: number }) => {
            const quantity = service.quantity || 1;
            return acc + service.price * quantity;
        }, 0);
    return totalPrice
}