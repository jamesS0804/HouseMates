export default function getTotalCost(serviceDetails:any){
    console.log(`service: ${serviceDetails.service.price}; type: ${typeof serviceDetails.service.price}`)
    console.log(`home: ${serviceDetails.data['Home Type'].price}; type: ${typeof serviceDetails.data['Home Type'].price}`)
    console.log(`room: ${serviceDetails.data['Room Type'].price}; type: ${typeof serviceDetails.data['Room Type'].price}`)
    console.log(`bathroom: ${serviceDetails.data['Bathroom Count'].price}; type: ${typeof serviceDetails.data['Bathroom Count'].price}`)
    const totalPrice =
        Number(serviceDetails.service.price) +
        Number(serviceDetails.data['Home Type'].price) +
        Number(serviceDetails.data['Room Type'].price) +
        Number(serviceDetails.data['Bathroom Count'].price) +
        serviceDetails.data['Extra Service'].reduce((acc: number, service: { quantity?: number, price: number }) => {
            const quantity = service.quantity || 1;
            console.log(`acc: ${acc}; type: ${typeof acc}`)
            console.log(`subservice: ${service.price}; type: ${typeof service.price}`)
            console.log(`quantity: ${quantity}; type: ${typeof quantity}`)
            return Number(acc) + Number(service.price) * Number(quantity);
        }, 0);
    console.log(`total price: ${totalPrice}; type: ${typeof totalPrice}`)
    return totalPrice
}