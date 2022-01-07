import 'bootstrap/dist/css/bootstrap.css';
import Search from '../Search/Search';
const Home = () => {
    return ( 
        <div className="home homePadding">
            <div className="container-md" style={{color:"white"}}>
                <div className="row justify-content-center" style={{fontSize:"50px", fontWeight:"bold", fontFamily:"helvetica", color:"#66FCF1"}}>
                    Welcome to Pipestream,
                </div>
                <br/>
                <div className="row justify-content-center" style={{fontFamily:"helvetica", fontSize:"18px"}}>
                    The tool to search all of your streaming platforms in one convenient location.
                </div>
            </div>
            <div className="justify-content-center">
                <Search/>
            </div>
        </div>
     );
}
 
export default Home;