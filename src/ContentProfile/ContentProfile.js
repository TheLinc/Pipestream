
import 'bootstrap/dist/css/bootstrap.css';
import '../ContentProfile/ContentProfile.css';
import 'reactjs-popup/dist/index.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Component } from 'react';
import { db } from '..';
import Popup from 'reactjs-popup';
import { Toaster } from 'react-hot-toast';
import IMDbLogo from '../Images/Rating Icons/imdblogo.png';
import RottenTomotoesLogo from '../Images/Rating Icons/metacriticlogo.png';
import MetacriticLogo from '../Images/Rating Icons/rottentomatoeslogo.png';
import loadingGif from '../Images/Loading.gif';
import fillerBackground from '../Images/BackgroundImages/SearchBackground.jpg'
import streamingServices from '../Services.json'
import AddStreamingServicePopup from './AddStreamingServicePopup';
import ReportProblemPopup from './ReportProblemPopup';

class ContentProfile extends Component{

    state={
        id:this.props.match.params.id,
        Utelly: [],
        MovieDB: [],
        StreamingAvailability:[],
        Content:'',
        Locations:["none"],
        value:'addService',
        contentExists: true
    }

    movieObj={
        id:'',
        Title:'',
        Year:'',
        Rated:'',
        Runtime:'',
        Actors:'',
        Director:'',
        Genre:'',
        Plot:'',
        Poster:'',
        Background:'',
        Ratings:[''],
    }

    movieLocation={
        Locations:['']
    }

     async componentDidMount(){
        try{
            const country = this.props.match.params.country
            let docRef = null;
            const itemID = this.props.match.params.id
            const Ref =  await db.collection("/General Collection").doc(itemID);

            //if searched country is ca reference ca DB collection
            if(country === "ca"){
                const docRefCA =  await db.collection("/EC - IMDB IDs - CA").doc(itemID);
                docRef = docRefCA;
            }else{
                const docRefUSA =  await db.collection("/EC - IMDB ID - USA").doc(itemID);
                docRef = docRefUSA;
            }
        
            //fetch streaming locations if not in DB
            if(!(await docRef.get()).exists){
                if (country === "ca"){
                    console.log("collecting from API - CA...");
                }else{
                    console.log("collecting from API - US...");
                }

                //fetch data from Utelly API
                const data = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id="+itemID+"&source=imdb&country="+country, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": process.env.REACT_APP_UTELLY_API_KEY,
                        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
                    }
                    });

                const Utelly = await data.json();
                console.log("Utelly Data: ",Utelly);

                //fetch data from Movie Availability API
                const avail = await fetch("https://streaming-availability.p.rapidapi.com/get/basic?country="+country+"&imdb_id="+itemID, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
                        "x-rapidapi-key": process.env.REACT_APP_SA_API_KEY
                    }
                    });

                const availability = await avail.json();
                console.log("API Data:", availability.streamingInfo);

                this.setState({id: this.props.match.params.id, Utelly: Utelly, StreamingAvailability: availability});

                var arrayservices1=[];
                if (Utelly.collection.locations){
                    //collect streaming services from Utelly API return and store in arrayservices1
                    for (var i=0; i<(Utelly.collection.locations.length); i++){
                        const locationObj={
                            Service:"",
                            Link:""
                        }
                        if(this.state.Utelly.collection.locations[i].display_name === "Netflix"){
                            locationObj.Service="Netflix";
                            locationObj.Link=this.state.Utelly.collection.locations[i].url;
                        }
                        else if(this.state.Utelly.collection.locations[i].display_name === "iTunes"){
                            locationObj.Service="iTunes";
                            locationObj.Link=this.state.Utelly.collection.locations[i].url;
                        }
                        else if(this.state.Utelly.collection.locations[i].display_name === "Google Play"){
                            locationObj.Service="Google Play";
                            locationObj.Link=this.state.Utelly.collection.locations[i].url;
                        }
                        else if(this.state.Utelly.collection.locations[i].display_name === "Disney+"){
                            locationObj.Service="Disney+";
                            locationObj.Link=this.state.Utelly.collection.locations[i].url;
                        }
                        else if(this.state.Utelly.collection.locations[i].display_name === "Amazon Instant Video"){
                            locationObj.Service="Amazon Prime";
                            locationObj.Link=this.state.Utelly.collection.locations[i].url;
                        }
                        else if(this.state.Utelly.collection.locations[i].display_name === "Amazon Prime Video"){
                            locationObj.Service="Amazon Prime";
                            locationObj.Link=this.state.Utelly.collection.locations[i].url;
                        }
                        arrayservices1.push(locationObj);
                    }
                }

                var arrayservices2=[];
                //collect streaming services from MovieAvailability API return and store in arrayservices2
                if (this.state.StreamingAvailability.streamingInfo){
                    const locationObj={
                        Service:"",
                        Link:""
                    }
                    if (this.state.StreamingAvailability.streamingInfo.netflix){
                        locationObj.Service="Netflix";               
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.netflix[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.prime){
                        locationObj.Service="Amazon Prime";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.prime[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.hbo){
                        locationObj.Service="HBO Max";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.hbo[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.hulu){
                        locationObj.Service="Hulu";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.hulu[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.disney){
                        locationObj.Service="Disney+";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.disney[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.peacock){
                        locationObj.Service="Peacock";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.peacock[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.paramount){
                        locationObj.Service="Paramount+";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.paramount[country].link
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.starz){
                        locationObj.Service="Starz";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.starz[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.showtime){
                        locationObj.Service="Showtime";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.showtime[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.apple){  
                        locationObj.Service="Apple TV+";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.apple[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.mubi){
                        locationObj.Service="Mubi";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.mubi[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.stan){
                        locationObj.Service="Stan";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.stan[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.now){
                        locationObj.Service="Now";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.now[country].link;
                        arrayservices2.push(locationObj);
                    }
                    if (this.state.StreamingAvailability.streamingInfo.crave){
                        locationObj.Service="Crave";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.crave[country].link;
                        arrayservices2.push(locationObj);
                    }

                    if (this.state.StreamingAvailability.streamingInfo.britbox){
                        locationObj.Service="BritBox";
                        locationObj.Link=this.state.StreamingAvailability.streamingInfo.britbox[country].link;
                        arrayservices2.push(locationObj);
                    }
                }

                //create union array of services returned by API results
                const mergedArray = [...arrayservices1, ...arrayservices2];
                let set = new Set();
                let unionArray = mergedArray.filter(item =>{
                    if (!set.has(item.Service)){
                        set.add(item.Service);
                        return true;
                    }
                    return false;
                },set);
                console.log("Union Array: ",unionArray);

                const StreamingPlatforms={
                    platforms: unionArray
                }

                //store streaming services related to content in DB 
                if (country === "ca"){
                    db.collection("/EC - IMDB IDs - CA").doc(itemID).set(StreamingPlatforms);
                }else{
                    db.collection("/EC - IMDB ID - USA").doc(itemID).set(StreamingPlatforms);
                }
                this.setState({Locations: StreamingPlatforms.platforms});

            //if streaming locations exist in DB, fetch them
            }else{
                if(country === "ca"){
                    console.log("Fetching from DB - CA...");
                    docRef.get().then((document) => {
                        if(document.exists){
                            this.setState({Locations: document.data().platforms})
                            console.log("THE LOCATION DOCUMENT EXISTS", document.data());
                        }
                        else{
                            console.log("THE LOCATION DOCUMENT DOES NOT EXIST")
                        }
                    });
                }else{
                    console.log("Fetching from DB - USA...");
                    docRef.get().then((document) => {
                        if(document.exists){
                            this.setState({Locations: document.data().platforms})
                            console.log("THE LOCATION DOCUMENT EXISTS", document.data());
                        }
                        else{
                            console.log("THE LOCATION DOCUMENT DOES NOT EXIST")
                        }
                    });
                }
            }

            if (!(await Ref.get()).exists){
                console.log("Collecting movie details from API...");
                const response = await fetch("https://movie-database-imdb-alternative.p.rapidapi.com/?i="+itemID+"&r=json", {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": process.env.REACT_APP_MDB_API_KEY,
                        "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com"
                    }
                    });
                const MovieDB = await response.json();
                console.log("MovieDB Response: ", MovieDB);
                
                this.setState({MovieDB: MovieDB});
                this.movieObj.id=this.state.id;

                //associate MovieDB results with attributes of movieObj
                if (this.state.MovieDB.Title){
                    this.movieObj.Title=this.state.MovieDB.Title;
                }
                if (this.state.MovieDB.Year){
                    this.movieObj.Year=this.state.MovieDB.Year;
                }
                if (this.state.MovieDB.Rated){
                    this.movieObj.Rated=this.state.MovieDB.Rated;
                }
                if (this.state.MovieDB.Runtime){
                    this.movieObj.Runtime=this.state.MovieDB.Runtime;
                }       
                if (this.state.MovieDB.Actors){
                    this.movieObj.Actors=this.state.MovieDB.Actors;
                }
                if (this.state.MovieDB.Director){
                    this.movieObj.Director=this.state.MovieDB.Director;
                }
                if (this.state.MovieDB.Genre){
                    this.movieObj.Genre=this.state.MovieDB.Genre;
                }
                if (this.state.MovieDB.Plot){
                    this.movieObj.Plot=this.state.MovieDB.Plot;
                }
                if (this.state.MovieDB.Poster){
                    this.movieObj.Poster=this.state.MovieDB.Poster;
                }
                if (this.state.Utelly.collection.picture){
                    this.movieObj.Background=this.state.Utelly.collection.picture;
                }
                if (this.state.MovieDB.Ratings){
                    this.movieObj.Ratings=this.state.MovieDB.Ratings;
                }

                //store movie details in General Collection 
                db.collection("/General Collection").doc(this.movieObj.id).set(this.movieObj)
                this.setState({Content: this.movieObj});
            }
            //get movie details from DB if they exist
            else{
                console.log("Collecting movie details from DB...");
                Ref.get().then((doc) => {
                    if(doc.exists){
                        this.setState({exists: true, Content: doc.data()})
                        console.log("THE MOVIE DOCUMENT EXISTS", doc.data());
                    }
                    else{
                        this.setState({exists: false})
                        console.log("THE MOVIE DOCUMENT DOES NOT EXIST");
                    }
                });
            }
        }
        catch(err){
            this.setState({contentExists:false})
            console.log("ERROR: ",err);
        }
     }

    render(){
        function logoAssign(ratingSrc){
            var source;
            if (ratingSrc){
                if (ratingSrc==="Internet Movie Database"){
                    source=<img src={IMDbLogo} alt="IMDB Logo" className="ratingLogo"></img>
                }
                else if (ratingSrc==="Rotten Tomatoes"){
                    source=<img src={RottenTomotoesLogo} alt="Rotten Tomatoes Logo" className="ratingLogo"></img>
                }
                else if (ratingSrc==="Metacritic"){
                    source=<img src={MetacriticLogo} alt="Metacritic Logo" className="ratingLogo"></img>
                }
            return source;
            }
        }

        function getRatings(ratingArray){
            if(ratingArray){
                var i = 0;
                return(
                    ratingArray.map((cont) => (
                        <div className="d-inline p-1" key={i++}>
                            {logoAssign(cont.Source)} {cont.Value}
                        </div>
                )));
            }
            else{
                return(<div style={{color:"grey"}}><i>No current ratings available.</i></div>)
            }
        }

        function getDirector(name){
            if (name){
                if (name !== "N/A"){
                    return (<div><b>Director: </b> <br/>{name}</div>);
                }
            }
        }

        function getBackground(back){
            if(back){
                return back;
            }
            else{
                return fillerBackground;
            }
        }

        //list out clickable streaming services that have movie
        function getServices(services,id){
            if(services){
                if ((services[0] !== "none") && (services.length > 0)){
                    var i=0;
                    return(
                        services.map((cont) => (
                            <div className="col-sm-2" key={i++}>
                                <div className="row">
                                    <a href={cont.Link}>
                                        <img src={LogoAssign(cont.Service)[0]} className="mx-auto d-block serviceLogo" alt={cont.service + " Logo"}></img>
                                    </a>
                                </div>
                                <div className="row justify-content-center serviceText">
                                    {LogoAssign(cont.Service)[1]}
                                </div>
                                <br/>
                            </div>   
                    )));
                }
                else if (services.length === 0){
                    return (
                        <div className="container-md">
                            <div className="row">
                                <div className="noInfoText" style={{paddingBottom:"20px"}}>
                                    <i>Oh no! It seems we do not have any information on streaming services that have this content...</i>
                                    <i>If you know of any, please fill out the form below to help other users get more accurate results. </i>
                                </div> 
                                <div className="row">
                                    <Popup className="my-popup" trigger={<button type="button" className="btn btn-primary" style={{maxWidth:"225px"}}> 
                                        <b>+</b> Add Streaming Service </button>} position="top center">
                                        <AddStreamingServicePopup id={id}/>
                                    </Popup>
                                </div>    
                            </div>
                        </div>
                    );    
                }
                else{
                    <p style={{color:"grey"}}>Loading...</p> 
                }
            }
            else{
                return (
                    <p style={{color:"grey"}}>Loading...</p>
                );
            }
        }

        function LogoAssign(service){
            var value=[];
            for (let i = 0; i < streamingServices.length; i++) {
                if(service === streamingServices[i].name){
                    value[0] = streamingServices[i].image;
                    value[1] = service;
                    break;
                }
            }
            return value;
        }

        const goBack = () =>{
            this.props.history.goBack();
        }

        function getRuntime (runtime){
            if(runtime && (runtime !== "N/A")){
                return(runtime);
            }
        }


        function displayContent(dependent1, dependent2, id, contentExists){
            if ((dependent1[0] !== "none") && (dependent2 !== '') && contentExists){
                return(
                    <div>
                        <div style={{backgroundImage: `url(${getBackground(dependent2.Background)})`, backgroundSize:"cover", height:"700px", backgroundPosition:"center", color:"white"}}>
                            <br/>
                            <div>
                                <div className="container-md">
                                    <Toaster
                                        position="top-center"
                                        reverseOrder={false}
                                    />
                                    <div className="row justify-content-center">
                                        <div className="col-sm-10" style={{backgroundColor:"rgba(0,0,0, 0.7)", borderRadius: "15px"}}>
                                        <br/>
                                        <div className="row justify-content-between">
                                            <div className="col-2">
                                                <button type="button" onClick={()=>{goBack()}} style={{maxWidth:"80px", maxHeight:"40px", backgroundColor:"grey", borderColor:"grey"}} className="justify-content-start btn btn-primary">Back</button>
                                            </div>
                                            <div className="col-3 ">
                                                <div className='row'>
                                                    <div className="col">
                                                        <Popup className="my-popup" trigger={<button type="button" className="btn btn-default contentButton">
                                                            <i className="bi bi-plus-lg" style={{color:"white", paddingRight:"2px"}}></i></button>}>
                                                            <AddStreamingServicePopup id={id}/>
                                                        </Popup>
                                                    </div>
                                                    <div className="col">
                                                        <Popup className="my-popup" trigger={<button type="button" className="btn btn-default contentButton">
                                                            <i className="bi bi-exclamation-triangle" style={{color:"white"}}></i></button>}>
                                                            <ReportProblemPopup id={id}/>
                                                        </Popup>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="row">
                                            <h1>{dependent2.Title} </h1>
                                            <br/>
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div className="row justify-content-center ">
                                                            <img src={dependent2.Poster} alt="Content Poster" style={{height:"245px", width:"auto", paddingBottom:"10px"}}></img>
                                                        </div>
                                                        <div className="row" style={{display:"inline-block"}}>
                                                            <div className="d-inline p-1">
                                                                {dependent2.Year}
                                                            </div>
                                                            <div className="d-inline p-1" style={{borderStyle:"solid", borderRadius:"4px", borderColor:"grey", fontSize:"12px"}}>
                                                                {dependent2.Rated}
                                                            </div>
                                                            <div className="d-inline p-1">
                                                                {getRuntime(dependent2.Runtime)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-7" style={{textAlign: "left"}}>
                                                        <div className="row">
                                                            <b>Plot:</b><p>{dependent2.Plot}</p>
                                                        </div>
                                                        <div className="row">
                                                            <b>Genre:</b><p>{dependent2.Genre}</p> 
                                                        </div>
                                                        <div className="row">
                                                            <b>Cast:</b><p>{dependent2.Actors}</p> 
                                                        </div>
                                                        <div className="row">
                                                            {getDirector(dependent2.Director)}
                                                        </div>
                                                        <br/>
                                                        <div className="row">
                                                            <div className="row " >
                                                                <b><u><p>Ratings:</p></u></b>
                                                                <div style={{display:"inline-block"}}>
                                                                    {getRatings(dependent2.Ratings)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <div className="row">
                                                            <div className="row">
                                                                <b>Services:</b>
                                                            </div>
                                                            <br/>
                                                            <br/>
                                                            <div className="row">
                                                                {console.log("Location print out: ",dependent1)}
                                                                {getServices(dependent1, id)}
                                                            </div>
                                                        </div>
                                                        <br/>
                                                    </div>
                                                </div>               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            else if (!contentExists){
                return(
                    <div className="justify-content-center" style={{paddingTop:"40px", color:"white"}}>
                        <div className="col-2">
                            <button type="button" onClick={()=>{goBack()}} style={{maxWidth:"80px", maxHeight:"40px", backgroundColor:"grey", borderColor:"grey"}} 
                                className="justify-content-start btn btn-primary">Back</button>
                        </div>
                        <i className="bi bi-exclamation-circle exclamationIcon"></i>
                        <div><b>Sorry, we don't have any information on that title</b></div>
                    </div>
                );
            }
            else{
                return (
                    <div>
                        <div className="row justify-content-start" style={{paddingTop:"40px"}}>
                            <div className="col-2">
                                <button type="button" onClick={()=>{goBack()}} style={{maxWidth:"80px", maxHeight:"40px", backgroundColor:"grey", borderColor:"grey"}} 
                                    className="justify-content-start btn btn-primary">Back</button>
                            </div>
                        </div>
                        <img src={loadingGif} alt="Loading Symbol"style={{maxWidth:"45px", height:"auto", width:"100%", paddingTop:"40px"}}></img>
                    </div>
                );
            }
        }
        return(  
            <div>
                {displayContent(this.state.Locations, this.state.Content, this.state.id, this.state.contentExists)}
            </div> 
        );
    }  
}
export default ContentProfile;
  