import excellentPerson from "../assets/icons/excellentPerson.png"
import cleaningMaterials from "../assets/icons/cleaningMaterials.png"
import checkedBox from "../assets/icons/checkedBox.png"
import checkedShield from "../assets/icons/checkedShield.png"

export default function ServiceMainPage(){
    const basicServiceDescriptions = [
        {title: 'Service Details', icon: excellentPerson, description: "HouseMates cleaners clean your unit including bedrooms, bathrooms, and common areas. Our cleaners all work directly with Housemates and are loved by our users."},
        {title: 'Materials', icon: cleaningMaterials, description: "HouseMates cleaners come fully prepared with everything they need to clean your home. We use top-quality cleaning materials from international and local brands. The cleaner also brings a small vacuum ahe can use for sofas and rugs. We’ll leave your home looking great and smelling fresh!"},
        {title: 'Service Pro', icon: checkedBox, description: "Our cleaners are the best in the city! We carefully vet and select all of our cleaners, and each cleaner works directly to Housemates. All Housemates cleaners have passed our quality standard, and follows our performance guidelines."},
        {title: 'Safety', icon: checkedShield, description: "Our cleaners wear proper uniform throughout the service and can present Covid- 19 vaccination certificates upon request."}
    ]
    const services = [
        {title: 'Cleaning Services', image: '', price: '399', description: basicServiceDescriptions},
        {title: 'Aircon Services', image: '', price: '699', description: basicServiceDescriptions},
        {title: 'Plumbing Services', image: '', price: '', description: basicServiceDescriptions},
    ]
    return(
        <div>

        </div>
    )
}