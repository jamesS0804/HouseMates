export default function getTotalCost(serviceDetails:any){
    const totalPrice =
        serviceDetails.service.price +
        serviceDetails.data.homeType.price +
        serviceDetails.data.numberOfBedroom.price +
        serviceDetails.data.numberOfBathroom.price +
        serviceDetails.data.extraServices.reduce((acc:number, service:{type: string, quantity: number, price: number}) => acc + (service.price * service.quantity), 0);
    return totalPrice
}