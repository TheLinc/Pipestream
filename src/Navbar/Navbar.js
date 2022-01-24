import 'bootstrap/dist/css/bootstrap.css';
import './Navbar.css';
import PipestreamLogo from '../Images/logo.jpg';

const Navbar = () => {
    return ( 
        <div className="navbar" >
        <nav className="stroke border-bottom border-2 navbarContainer">  
            <div className="container-md">
                <br/>
                <div className="row my-auto">
                    <div className="col-sm-3 logoContainer"> 
                        <a href="/"><img className="logo" alt="Pipestream Logo" src={PipestreamLogo}></img></a>
                    </div>
                    <div className="col-sm-8 justify-content-center navbarTextContainer"> 
                        <ul>
                            <li><a href="/" className="navbar">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </div> 
        </nav>
    </div>

     );
}
 
export default Navbar;