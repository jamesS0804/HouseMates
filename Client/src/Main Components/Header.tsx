import logo from '../assets/images/logo.png'

export default function Header(){
    return(
        <div className='flex flex-col items-center'>
            <img src={logo}/>
            <h2 className='font-medium'>Helping you have a better home</h2>
        </div>
    )
}