
import 'bootstrap/dist/css/bootstrap.css';
import streamingServices from "../Services.json";

const About = () => {

    function listServices(){
        var i=0;
        return(
            streamingServices.map((cont) => (
                <div className="col-sm-2" key={i++} style={{paddingTop: "6px"}}>
                    <div className="row">
                        <img src={cont.image}  className="mx-auto d-block" style={{maxWidth:"100px", height:"auto", borderRadius:"25%"}}></img>
                    </div>
                    <div className="row justify-content-center">
                        {cont.name}
                    </div>
                </div>
        )));
    }
    

    return ( 
        <div className="container-md" style={{color: "white"}}>
            <br/>
            <div className = "row">
                <h1>About Pipestream</h1>
            </div>
            <br/>
            <div className="row" style={{fontSize:"20px", textAlign:"left"}}>
                <u><h3>What is Pipestream?</h3></u>
                <p><b>Pipestream is a search engine that allows you to find the location of your favorite movies in one quick search!</b> In addition, we also provide information on the movies/TV shows you search, which vary from ratings, to that actors that star in them.</p>
                <u><h3>How does our tool work?</h3></u>
                <p>Our search tool is powered by APIs which gather information from sources such as IMDb. In addition to this, we ask for user input in order to keep our data up to date, to provide you with the most accurate results at anytme.</p>
                <br/>
                <u><h3>What services does our search engine support?</h3></u>
                <p>Based on your location, our search engine will support a variation of the following streaming services:
                <br/> 
                <div className="row" style={{paddingTop:"25px"}}>
                    {listServices()}
                </div>
                </p>
            </div>
            <br/>
            <br/>
        </div>
     );
}
 
export default About;