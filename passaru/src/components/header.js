import { MdOutlineRestaurantMenu } from "react-icons/md";
import { SiGitconnected } from "react-icons/si";
import './header.css';

function Header() {
    function clearAuthData() {
        localStorage.removeItem('authName');
        localStorage.removeItem('authAddress');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/';
    }


    return (
        <div className="header-container">
            <h1 onClick={clearAuthData}><MdOutlineRestaurantMenu className='icon'/> PASSARU</h1>
            <a href='/connect'><SiGitconnected className='icon' /> Conecte com Metamask</a>
        </div>
    );
}

export default Header;
