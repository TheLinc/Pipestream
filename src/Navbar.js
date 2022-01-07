import 'bootstrap/dist/css/bootstrap.css';
import PipestreamLogo from './Images/logo.jpg';

const Navbar = () => {
    return ( 
        <div className="navbar" >
        <nav className="stroke border-bottom border-2" style={{top:"0",position:"fixed", width:"100%",zIndex:'1', minHeight:"12%"}}>  
            <div className="container-md">
                <br/>
                <div className="row my-auto">
                    <div className="col-sm-3"> 
                    <a href="/"style={{color:"white"}}><img style={{width:"100%", maxWidth:"300px", height:"auto"}} alt="Pipestream Logo" src={PipestreamLogo}></img></a>
                    </div>
                    <div className="col-sm-8 justify-content-center" style={{fontFamily:"helvetica", color:"white"}}> 
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