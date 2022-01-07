
import 'bootstrap/dist/css/bootstrap.css';
import './ContentProfile.css';
import 'reactjs-popup/dist/index.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { Redirect, useParams, useHistory } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Component, useState } from 'react';
import { db } from '..';
import Popup from 'reactjs-popup';
import { HiDotsVertical } from "react-icons/fa";
import emailjs from 'emailjs-com';
import toast, { Toaster } from 'react-hot-toast';

import IMDbLogo from './Images/Rating Icons/imdblogo.png';
import RottenTomotoesLogo from './Images/Rating Icons/metacriticlogo.png';
import MetacriticLogo from './Images/Rating Icons/rottentomatoeslogo.png';

import DisneyPlusLogo from './Images/Streaming Icons/DisneyPlusIcon.png';
import AmazonPrimeLogo from './Images/Streaming Icons/AmazonPrimeIcon.png';
import GooglePlayLogo from './Images/Streaming Icons/GooglePlayIcon.png';
import NetflixLogo from './Images/Streaming Icons/NetflixIcon.png';
import iTunesLogo from './Images/Streaming Icons/iTunesIcon.png';
import CraveLogo from './Images/Streaming Icons/CraveIcon.png';
import HBOMaxLogo from './Images/Streaming Icons/HBOMaxIcon.png';
import HuluLogo from './Images/Streaming Icons/HuluIcon.jpg';
import PeacockLogo from './Images/Streaming Icons/PeacockIcon.png';
import ParamountPlusLogo from './Images/Streaming Icons/ParamountPlusIcon.jpg';
import ShowtimeLogo from './Images/Streaming Icons/ShowtimeIcon.png';
import StarzLogo from './Images/Streaming Icons/StarzIcon.png';
import AppleTVPlusLogo from './Images/Streaming Icons/AppleTVPlus.jpg';
import MubiLogo from './Images/Streaming Icons/MubiIcon.jpg';
import StanLogo from './Images/Streaming Icons/StanIcon.png';
import NowLogo from './Images/Streaming Icons/NowIcon.png';
import BritBoxLogo from './Images/Streaming Icons/BritBoxIcon.png';
import YoutubePremiumLogo from './Images/Streaming Icons/YoutubePremiumIcon.png';
import loadingGif from './Images/Loading.gif';



class ContentProfile extends Component{

    state={
        id:this.props.match.params.id,
        Utelly: [],
        MovieDB: [],
        StreamingAvailability:[],
        Content:'',
        Locations:["none"],
        value:'addService'
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

            if(this.props.match.params.country == "ca"){

                    const docRefCA =  await db.collection("/EC - IMDB IDs - CA").doc(this.props.match.params.id);
                    const Ref =  await db.collection("/General Collection").doc(this.props.match.params.id);

                    

                    /////////////////////////////////////////////////////////////////////

                    if((!((await docRefCA.get()).exists)) && (!((await Ref.get()).exists))){
                        console.log("collecting from API - CA...");

                        const response = await fetch("https://movie-database-imdb-alternative.p.rapidapi.com/?i="+this.props.match.params.id+"&r=json", {
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-key": process.env.REACT_APP_MDB_API_KEY,
                            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com"
                        }
                        });
                        const MovieDB = await response.json();

                        
                        
                        const data = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id="+this.props.match.params.id+"&source=imdb&country="+this.props.match.params.country, {
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-key": process.env.REACT_APP_UTELLY_API_KEY,
                            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
                        }
                        });
        
                        const Utelly = await data.json();
                        
                        console.log("Utelly Data: ",Utelly);

                        const avail = await fetch("https://streaming-availability.p.rapidapi.com/get/basic?country="+this.props.match.params.country+"&imdb_id="+this.props.match.params.id, {
	                    "method": "GET",
	                    "headers": {
		                    "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
		                    "x-rapidapi-key": process.env.REACT_APP_SA_API_KEY
	                    }
                        });

                        const availability = await avail.json();


                        console.log("API Data:", availability.streamingInfo);
                        
                        this.setState({id: this.props.match.params.id, Utelly: Utelly, MovieDB: MovieDB, StreamingAvailability: availability})
        
                        this.movieObj.id=this.state.id;

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
        
                        var arrayservices1=[];

                        if (Utelly.collection.locations){
                            for (var i=0; i<(Utelly.collection.locations.length); i++){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                if(this.state.Utelly.collection.locations[i].display_name == "Netflix"){
                                    locationObj.Service="Netflix";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "iTunes"){
                                    locationObj.Service="iTunes";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Google Play"){
                                    locationObj.Service="Google Play";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Disney+"){
                                    locationObj.Service="Disney+";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Instant Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Prime Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                arrayservices1.push(locationObj);
                            }
                        }

                        var arrayservices2=[];
                        
                        if (this.state.StreamingAvailability.streamingInfo){
                            if (this.state.StreamingAvailability.streamingInfo.netflix){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Netflix";
                                //locationObjCountry = this.state.StreamingAvailability.streamingInfo.netflix[this.props.match.params.country].link;
                                
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.netflix[this.props.match.params.country].link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.prime){
                                 const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Amazon Prime";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.prime.ca.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.hbo){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="HBO Max";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.hbo.ca.link;
                               arrayservices2.push(locationObj);
                           }

                           if (this.state.StreamingAvailability.streamingInfo.hulu){
                            const locationObj={
                               Service:"",
                               Link:""
                           }
                           locationObj.Service="Hulu";
                           locationObj.Link=this.state.StreamingAvailability.streamingInfo.hulu.ca.link;
                           arrayservices2.push(locationObj);
                           }

                            if (this.state.StreamingAvailability.streamingInfo.disney){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Disney+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.disney.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.peacock){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Peacock";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.peacock.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.paramount){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Paramount+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.paramount.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.starz){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Starz";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.starz.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.showtime){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Showtime";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.showtime.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.apple){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Apple TV+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.apple.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.mubi){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Mubi";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.mubi.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.stan){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Stan";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.stan.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.now){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Now";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.now.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.crave){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Crave";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.crave.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.britbox){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="BritBox";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.britbox.ca.link;
                               arrayservices2.push(locationObj);
                            }

                        }

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
                        console.log(arrayservices2);

                        const StreamingPlatforms={
                            platforms: unionArray
                        }



                        db.collection("/EC - IMDB IDs - CA").doc(this.movieObj.id).set(StreamingPlatforms);
                        db.collection("/General Collection").doc(this.movieObj.id).set(this.movieObj);

                        this.setState({Content: this.movieObj, Locations: unionArray})
        
                    }

                    //////////////////////////////////////////////////////////////////////////////////////

                    else if ((((await Ref.get()).exists)) && (!((await docRefCA.get()).exists))){
                        console.log("collecting Content from DB and fetching supporting services from API -CA...");


                        Ref.get().then((doc) => {
                            if(doc.exists){
                                this.setState({Content: doc.data()})
                                console.log("THE DOCUMENT EXISTS ",doc.data());
                            }
                            else{
                                console.log("THE DOCUMENT DOES NOT EXIST")
                            }
                        })


                        const data = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id="+this.props.match.params.id+"&source=imdb&country="+this.props.match.params.country, {
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-key": process.env.REACT_APP_UTELLY_API_KEY,
                                "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
                            }
                            });
            
                        const Utelly = await data.json();
                        console.log(Utelly);

                        const avail = await fetch("https://streaming-availability.p.rapidapi.com/get/basic?country="+this.props.match.params.country+"&imdb_id="+this.props.match.params.id, {
	                    "method": "GET",
	                    "headers": {
		                    "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
		                    "x-rapidapi-key": process.env.REACT_APP_SA_API_KEY
	                    }
                        });

                        console.log(avail);

                        const availability = await avail.json();

                        this.setState({StreamingAvailability: availability})

                        var arrayservices1=[];

                        if (Utelly.collection.locations){
                            for (var i=0; i<(Utelly.collection.locations.length); i++){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                if(this.state.Utelly.collection.locations[i].display_name == "Netflix"){
                                    locationObj.Service="Netflix";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "iTunes"){
                                    locationObj.Service="iTunes";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Google Play"){
                                    locationObj.Service="Google Play";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Disney+"){
                                    locationObj.Service="Disney+";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Instant Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Prime Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                arrayservices1.push(locationObj);
                            }
                        }


                        var arrayservices2=[];
                        
                        if (this.state.StreamingAvailability.streamingInfo){
                            if (this.state.StreamingAvailability.streamingInfo.netflix){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Netflix";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.netflix.ca.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.prime){
                                 const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Amazon Prime";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.prime.ca.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.hbo){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="HBO Max";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.hbo.ca.link;
                               arrayservices2.push(locationObj);
                           }

                           if (this.state.StreamingAvailability.streamingInfo.hulu){
                            const locationObj={
                               Service:"",
                               Link:""
                           }
                           locationObj.Service="Hulu";
                           locationObj.Link=this.state.StreamingAvailability.streamingInfo.hulu.ca.link;
                           arrayservices2.push(locationObj);
                           }

                            if (this.state.StreamingAvailability.streamingInfo.disney){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Disney+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.disney.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.peacock){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Peacock";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.peacock.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.paramount){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Paramount+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.paramount.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.starz){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Starz";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.starz.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.showtime){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Showtime";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.showtime.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.apple){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Apple TV+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.apple.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.mubi){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Mubi";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.mubi.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.stan){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Stan";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.stan.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.now){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Now";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.now.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.crave){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Crave";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.crave.ca.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.britbox){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="BritBox";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.britbox.ca.link;
                               arrayservices2.push(locationObj);
                            }

                        }

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
                        console.log(arrayservices2);

                        const StreamingPlatforms={
                            platforms: unionArray
                        }
    
                        this.setState({Locations: StreamingPlatforms.platforms})
                        console.log("movieobjid: ", this.movieObj.id);
                        db.collection("/EC - IMDB IDs - CA").doc(this.props.match.params.id).set(StreamingPlatforms);
                        

                    }
                    /////////////////////////////////////////////////////////////////////////////////////////////
                    else{
                        console.log("Fetching from DB - CA...");
    
                        docRefCA.get().then((document) => {
                            if(document.exists){
                                this.setState({Locations: document.data().platforms})
                                console.log("THE LOCATION DOCUMENT EXISTS", document.data());
                            }
                            else{
                                console.log("THE LOCATION DOCUMENT DOES NOT EXIST")
                            }
                        })
                        
                        Ref.get().then((doc) => {
                            if(doc.exists){
                                this.setState({exists: true, Content: doc.data()})
                                console.log("THE MOVIE DOCUMENT EXISTS", console.log(doc.data()));
                            }
                            else{
                                this.setState({exists: false})
                                console.log("THE MOVIE DOCUMENT DOES NOT EXIST")
                            }
                        })
                    }
            }

            else if(this.props.match.params.country == "us"){
                
                const docRefUSA =  await db.collection("/EC - IMDB ID - USA").doc(this.props.match.params.id);
                const Ref =  await db.collection("/General Collection").doc(this.props.match.params.id);
            
                if((!((await docRefUSA.get()).exists)) && (!(( await Ref.get()).exists))){
                    console.log("collecting from API - USA...");
                    const response = await fetch("https://movie-database-imdb-alternative.p.rapidapi.com/?i="+this.props.match.params.id+"&r=json", {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": process.env.REACT_APP_MDB_API_KEY,
                        "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com"
                    }
                    });
                    const MovieDB = await response.json();

                    const data = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id="+this.props.match.params.id+"&source=imdb&country="+this.props.match.params.country, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": process.env.REACT_APP_UTELLY_API_KEY,
                        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
                    }
                    });

                    const Utelly = await data.json();

                    const avail = await fetch("https://streaming-availability.p.rapidapi.com/get/basic?country="+this.props.match.params.country+"&imdb_id="+this.props.match.params.id, {
	                    "method": "GET",
	                    "headers": {
		                    "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
		                    "x-rapidapi-key": process.env.REACT_APP_SA_API_KEY
	                    }
                        });

                        const availability = await avail.json();

                    this.setState({id: this.props.match.params.id, Utelly: Utelly, MovieDB: MovieDB, StreamingAvailability: availability})

                    this.movieObj.id=this.state.id;
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

                    var arrayservices1=[];

                        if (Utelly.collection.locations){
                            for (var i=0; i<(Utelly.collection.locations.length); i++){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                if(this.state.Utelly.collection.locations[i].display_name == "Netflix"){
                                    locationObj.Service="Netflix";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "iTunes"){
                                    locationObj.Service="iTunes";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Google Play"){
                                    locationObj.Service="Google Play";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Disney+"){
                                    locationObj.Service="Disney+";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Instant Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Prime Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }

                                arrayservices1.push(locationObj);
                            }
                        }


                        var arrayservices2=[];
                        
                        if (this.state.StreamingAvailability.streamingInfo){
                            if (this.state.StreamingAvailability.streamingInfo.netflix){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Netflix";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.netflix.us.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.prime){
                                 const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Amazon Prime";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.prime.us.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.hbo){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="HBO Max";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.hbo.us.link;
                               arrayservices2.push(locationObj);
                           }

                           if (this.state.StreamingAvailability.streamingInfo.hulu){
                            const locationObj={
                               Service:"",
                               Link:""
                           }
                           locationObj.Service="Hulu";
                           locationObj.Link=this.state.StreamingAvailability.streamingInfo.hulu.us.link;
                           arrayservices2.push(locationObj);
                           }

                            if (this.state.StreamingAvailability.streamingInfo.disney){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Disney+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.disney.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.peacock){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Peacock";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.peacock.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.paramount){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Paramount+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.paramount.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.starz){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Starz";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.starz.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.showtime){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Showtime";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.showtime.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.apple){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Apple TV+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.apple.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.mubi){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Mubi";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.mubi.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.stan){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Stan";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.stan.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.now){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Now";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.now.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.crave){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Crave";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.crave.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.britbox){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="BritBox";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.britbox.us.link;
                               arrayservices2.push(locationObj);
                            }

                        }

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
                        console.log(arrayservices2);

                        const StreamingPlatforms={
                            platforms: unionArray
                        }


                
                    db.collection("/EC - IMDB ID - USA").doc(this.movieObj.id).set(StreamingPlatforms);
                    db.collection("/General Collection").doc(this.movieObj.id).set(this.movieObj);
                    

                    this.setState({Content: this.movieObj, Locations: StreamingPlatforms.platforms})

                }

                else if((((await Ref.get()).exists)) && (!((await docRefUSA.get()).exists))){
                    console.log("collecting Content from DB and fetching supporting services from API - USA...");

                        Ref.get().then((doc) => {
                            if(doc.exists){
                                this.setState({Content: doc.data()})
                                console.log("THE DOCUMENT EXISTS", console.log(doc.data()));
                            }
                            else{
                                console.log("THE DOCUMENT DOES NOT EXIST")
                            }
                        })

                        const data = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id="+this.props.match.params.id+"&source=imdb&country="+this.props.match.params.country, {
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-key": process.env.REACT_APP_UTELLY_API_KEY,
                                "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com"
                            }
                            });
            
                        const Utelly = await data.json();

                        const avail = await fetch("https://streaming-availability.p.rapidapi.com/get/basic?country="+this.props.match.params.country+"&imdb_id="+this.props.match.params.id, {
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
                                "x-rapidapi-key": process.env.REACT_APP_SA_API_KEY
                            }
                            });
    
                        const availability = await avail.json();

                        console.log("movie avail: ",availability);
                        console.log("Utelly: ", Utelly);

                        var arrayservices1=[];

                        if (Utelly.collection.locations){
                            for (var i=0; i<(Utelly.collection.locations.length); i++){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                if(Utelly.collection.locations[i].display_name == "Netflix"){
                                    locationObj.Service="Netflix";
                                    locationObj.Link=Utelly.collection.locations[i].url;
                                }
                                else if(Utelly.collection.locations[i].display_name == "iTunes"){
                                    locationObj.Service="iTunes";
                                    locationObj.Link=Utelly.collection.locations[i].url;
                                }
                                else if(Utelly.collection.locations[i].display_name == "Google Play"){
                                    locationObj.Service="Google Play";
                                    locationObj.Link=Utelly.collection.locations[i].url;
                                }
                                else if(Utelly.collection.locations[i].display_name == "Disney+"){
                                    locationObj.Service="Disney+";
                                    locationObj.Link=Utelly.collection.locations[i].url;
                                }
                                else if(Utelly.collection.locations[i].display_name == "Amazon Instant Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=Utelly.collection.locations[i].url;
                                }
                                else if(this.state.Utelly.collection.locations[i].display_name == "Amazon Prime Video"){
                                    locationObj.Service="Amazon Prime";
                                    locationObj.Link=this.state.Utelly.collection.locations[i].url;
                                }
                                arrayservices1.push(locationObj);
                            }
                        }


                        var arrayservices2=[];
                        
                        if (this.state.StreamingAvailability.streamingInfo){
                            if (this.state.StreamingAvailability.streamingInfo.netflix){
                                const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Netflix";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.netflix.us.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.prime){
                                 const locationObj={
                                    Service:"",
                                    Link:""
                                }
                                locationObj.Service="Amazon Prime";
                                locationObj.Link=this.state.StreamingAvailability.streamingInfo.prime.us.link;
                                arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.hbo){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="HBO Max";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.hbo.us.link;
                               arrayservices2.push(locationObj);
                           }

                           if (this.state.StreamingAvailability.streamingInfo.hulu){
                            const locationObj={
                               Service:"",
                               Link:""
                           }
                           locationObj.Service="Hulu";
                           locationObj.Link=this.state.StreamingAvailability.streamingInfo.hulu.us.link;
                           arrayservices2.push(locationObj);
                           }

                            if (this.state.StreamingAvailability.streamingInfo.disney){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Disney+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.disney.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.peacock){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Peacock";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.peacock.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.paramount){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Paramount+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.paramount.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.starz){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Starz";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.starz.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.showtime){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Showtime";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.showtime.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.apple){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Apple TV+";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.apple.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.mubi){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Mubi";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.mubi.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.stan){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Stan";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.stan.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.now){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Now";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.now.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.crave){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="Crave";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.crave.us.link;
                               arrayservices2.push(locationObj);
                            }

                            if (this.state.StreamingAvailability.streamingInfo.britbox){
                                const locationObj={
                                   Service:"",
                                   Link:""
                               }
                               locationObj.Service="BritBox";
                               locationObj.Link=this.state.StreamingAvailability.streamingInfo.britbox.us.link;
                               arrayservices2.push(locationObj);
                            }

                        }

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
                        console.log(arrayservices2);

                        const StreamingPlatforms={
                            platforms: unionArray
                        }

                        this.setState({Locations: StreamingPlatforms.platforms})

                        db.collection("/EC - IMDB ID - USA").doc(this.props.match.params.id).set(StreamingPlatforms);
                        
                }

                else{
                      console.log("Fetching from DB - USA...");
                        docRefUSA.get().then((document) => {
                            if(document.exists){
                                this.setState({Locations: document.data().platforms})
                                console.log("THE LOCATION DOCUMENT EXISTS", document.data());
                            }
                            else{
                                console.log("THE LOCATION DOCUMENT DOES NOT EXIST")
                            }
                        })

                        Ref.get().then((doc) => {
                            if(doc.exists){
                                this.setState({exists: true, Content: doc.data()})
                                console.log("THE MOVIE DOCUMENT EXISTS", doc.data());
                            }
                            else{
                                this.setState({exists: false})
                                console.log("THE MOVIE DOCUMENT DOES NOT EXIST")
                            }
                        })
                    }
            }
        }
    

        catch(err){
            console.log("ERROR: ",err);
        }
     }

    render(){

        function logoAssign(ratingSrc){
            var source;
            if (ratingSrc){
                if (ratingSrc=="Internet Movie Database"){
                    source=<img src={IMDbLogo}style={{height:"25px", width:"auto"}}></img>
                }
                else if (ratingSrc=="Rotten Tomatoes"){
                    source=<img src={RottenTomotoesLogo} style={{height:"25px", width:"auto"}}></img>
                }
                else if (ratingSrc=="Metacritic"){
                    source=<img src={MetacriticLogo} style={{height:"25px", width:"auto"}}></img>
                }

            return source;
            }
        }

        function getRatings(ratingArray){

            if(ratingArray){
                var i=0;
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

        function getDirector(thing){
            if (thing){
                if (thing != "N/A"){
                    return (<div><b>Director: </b> <br/>{thing}</div>);
                }
                else{}
            }
            else{}
        }

        function getBackground(back){
            if(back){
                return back;
            }
            else{
                //return ("https://images.unsplash.com/photo-1585314062604-1a357de8b000?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80");
            }
        }

        function getID (val){
            if (val){
                return val.id;
            }
            else{
                return "";
            }
        }
        //style={{minHeight:"20px", maxHeight:"75px", width:"auto", borderRadius:"5px"}}>

        function getServices(services,id){
            if(services){
                if ((services[0] != "none") && (services.length > 0)){
                    var i=0;
                    return(
                        services.map((cont) => (
                            <div className="col-sm-2" key={i++}>
                                <div className="row">
                                    <a href={cont.Link}>
                                        <img src={LogoAssign(cont.Service)[0]} class="mx-auto d-block" style={{width:"100%", maxWidth:"75px", height:"auto", borderRadius:"6px"}}></img>
                                    </a>
                                </div>
                                <div className="row justify-content-center" style={{fontSize:"12px", textAlign:"center"}}>
                                    {LogoAssign(cont.Service)[1]}
                                </div>
                                <br/>
                            </div>   
                    )));
                }

                else if (services.length==0){
                    return (
                        <div className="container-md">
                            <div className="row">
                            <div className="noInfoText" style={{paddingBottom:"20px"}}>
                                <i>Oh no! It seems we do not have any information on streaming services that have this content...</i>
                                <i>If you know of any, please fill out the form below to help other users get more accurate results. </i>
                            </div> 
                            <div className="row">
                                
                                <Popup className="my-popup" trigger={<button type="button" className="btn btn-primary" style={{maxWidth:"225px"}}> <b>+</b> Add Streaming Service </button>} position="top center">
                                        <div>Found this content on a streaming site that is not listed?</div>
                                        <div>Help us improve your user experience by submitting a form so we can fix it!</div>
                                            <br/>
                                        <form onSubmit={sendEmail}>
                                            <div className="form-group">
                                                    <label for="content_id">Content ID Key (<i>filled out automatically</i>)</label>
                                                    <input class="form-control" type="text" value={id} id="content_id" name="content_id" readonly></input>
                                                    <label for="service_name">Streaming Service</label>
                                                    <select id="service_name"  name="service_name" className="form-control mdb-select md-form" searchable="Search here..." required>
                                                        <option value="" selected> Choose...</option>
                                                        <option  value="Amazon Prime">Amazon Prime</option>
                                                        <option  value="Apple TV+">Apple TV+</option>
                                                        <option  value="BritBox">BritBox</option>
                                                        <option  value="Crave">Crave</option>
                                                        <option  value="Disney+">Disney+</option>
                                                        <option  value="Google Play">Google Play</option>
                                                        <option  value="HBO Max">HBO Max</option>
                                                        <option  value="Hulu">Hulu</option>
                                                        <option  value="iTunes">iTunes</option>
                                                        <option  value="Mubi">Mubi</option>
                                                        <option value="Netflix">Netflix</option>
                                                        <option  value="Now">Now</option>
                                                        <option  value="Paramount+">Paramount+</option>
                                                        <option  value="Peacock">Peacock</option>
                                                        <option  value="Showtime">Showtime</option>
                                                        <option  value="Stan">Stan</option>
                                                        <option  value="Starz">Starz</option>
                                                    </select>
                                                
                                                    <label for="content_link">Link</label>
                                                    <input type="link" class="form-control" id="content_link" name="content_link" placeholder="Link to content" required></input>
                                                    <br/>
                                                    <button class="btn btn-primary">Submit</button>
                                            </div>

                                        </form>
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

        function LogoAssign(logo){
            var value=[];
            if(logo=="iTunes"){
                value[0]=iTunesLogo;
            }
            else if(logo =="Google Play"){
                value[0]=GooglePlayLogo;
            }
            else if(logo == "Amazon Prime"){
                value[0]=AmazonPrimeLogo;
            }
            else if(logo == "Disney+"){
                value[0]=DisneyPlusLogo;
            }
            else if(logo == "Netflix"){
                value[0]=NetflixLogo;
            }
            else if(logo == "Crave"){
                value[0]=CraveLogo;
            }
            else if(logo == "HBO Max"){
                value[0]=HBOMaxLogo;
            }
            else if(logo == "Hulu"){
                value[0]=HuluLogo;
            }
            else if(logo == "Peacock"){
                value[0]=PeacockLogo;
            }
            else if(logo == "Paramount+"){
                value[0]=ParamountPlusLogo;
            }
            else if(logo == "Starz"){
                value[0]=StarzLogo;
            }
            else if(logo == "Showtime"){
                value[0]=ShowtimeLogo;
            }
            else if(logo == "Apple TV+"){
                value[0]=AppleTVPlusLogo;
            }
            else if(logo == "Mubi"){
                value[0]=MubiLogo;
            }
            else if(logo == "Stan"){
                value[0]=StanLogo;
            }
            else if(logo == "Now"){
                value[0]=NowLogo;
            }
            else if(logo == "BritBox"){
                value[0]=BritBoxLogo;
            }
            else if (logo == "Youtube Premium"){
                value[0]=YoutubePremiumLogo;
            }

            value[1]= logo;

            return value;
        }

        function sendEmail (e) {
            e.preventDefault();

            const elementsArray =[...e.target.elements];
            const formData = elementsArray.reduce((accumulator, currentValue) =>{
                if (currentValue.id){
                    accumulator[currentValue.id]= currentValue.value;
                }
                return accumulator;
            },{});

            const contentid = formData.content_id;
            const servicename= formData.service_name;
            const contentlink= formData.content_link;

            if(validate(servicename) && validate(contentlink)){
                emailjs.sendForm('service_q8akaed', 'template_q0cdh28', e.target, 'user_hYCVxI0KQt3ZFIZhx5psT')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                });
              
              e.target.reset();
              console.log("FORM SUBMITTED")
              toast.success('Form Submitted Successfully! Thank you!');
            }
            else{
                alert("Please fill out all feilds before attempting to submit form");
            }

        }


        function validate(f){
            if (f!=""){
                return true;
            }
            else{
                return false;
            }
        }

        const goBack = () =>{
            this.props.history.goBack();
        }

        function getRuntime (runtime){
            if(runtime && (runtime != "N/A")){
                return(runtime);
            }
            else{}
        }

        function getIssue (e){
            this.setState({value: e.target.value});
        }

        function setIssue(val, id){
            if (val == "addService"){
                return (
                    <div>
                        <div>Found this content on a streaming site that is not listed?</div>
                                        <div>Help us improve your user experience by submitting a form so we can fix it!</div>
                                            <br/>
                                        <form onSubmit={sendEmail}>
                                            <div className="form-group">
                                                    <label for="content_id">Content ID Key (<i>filled out automatically</i>)</label>
                                                    <input class="form-control" type="text" value={id} id="content_id" name="content_id" readonly></input>
                                                    <label for="service_name">Streaming Service</label>
                                                    <select id="service_name"  name="service_name" className="form-control mdb-select md-form" searchable="Search here..." required>
                                                        <option value="" selected> Choose...</option>
                                                        <option  value="Amazon Prime">Amazon Prime</option>
                                                        <option  value="Apple TV+">Apple TV+</option>
                                                        <option  value="BritBox">BritBox</option>
                                                        <option  value="Crave">Crave</option>
                                                        <option  value="Disney+">Disney+</option>
                                                        <option  value="Google Play">Google Play</option>
                                                        <option  value="HBO Max">HBO Max</option>
                                                        <option  value="Hulu">Hulu</option>
                                                        <option  value="iTunes">iTunes</option>
                                                        <option  value="Mubi">Mubi</option>
                                                        <option value="Netflix">Netflix</option>
                                                        <option  value="Now">Now</option>
                                                        <option  value="Paramount+">Paramount+</option>
                                                        <option  value="Peacock">Peacock</option>
                                                        <option  value="Showtime">Showtime</option>
                                                        <option  value="Stan">Stan</option>
                                                        <option  value="Starz">Starz</option>
                                                    </select>
                                                
                                                    <label for="content_link">Link</label>
                                                    <input type="link" class="form-control" id="content_link" name="content_link" placeholder="Link to content" required></input>
                                                    <br/>
                                                    <button class="btn btn-primary">Submit</button>
                                            </div>

                                        </form>
                    </div>
                )
            }
            else if (val == "removeService"){
                return(
                    <div>
                        hello
                    </div>
                );
            }
        }

        function renderContent(dependent1, dependent2, id, val){
            if ((dependent1[0] != "none") && (dependent2 != '')){
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
                                            <div className="col-6">
                                                <Popup className="my-popup" trigger={<button type="button" className="btn btn-default" style={{backgroundColor:"grey", borderRadius:"35px", fontSize:"25px", width:"50px", height:"auto"}}><i className="bi bi-plus-lg" style={{color:"white"}}></i></button>} position="bottom center">
                                                <div>Found this content on a streaming site that is not listed?</div>
                                                        <div>Help us improve your user experience by submitting a form so we can fix it!</div>
                                                            <br/>
                                                        <form onSubmit={sendEmail}>
                                                            <div className="form-group">
                                                                <label for="content_id">Content ID Key (<i>filled out automatically</i>)</label>
                                                                <input class="form-control" type="text" value={id} id="content_id" name="content_id" readonly></input>
                                                                <label for="service_name">Streaming Service</label>
                                                                <select id="service_name"  name="service_name" className="form-control mdb-select md-form" searchable="Search here..." required>
                                                                    <option value="" selected> Choose...</option>
                                                                    <option  value="Amazon Prime">Amazon Prime</option>
                                                                    <option  value="Apple TV+">Apple TV+</option>
                                                                    <option  value="BritBox">BritBox</option>
                                                                    <option  value="Crave">Crave</option>
                                                                    <option  value="Disney+">Disney+</option>
                                                                    <option  value="Google Play">Google Play</option>
                                                                    <option  value="HBO Max">HBO Max</option>
                                                                    <option  value="Hulu">Hulu</option>
                                                                    <option  value="iTunes">iTunes</option>
                                                                    <option  value="Mubi">Mubi</option>
                                                                    <option value="Netflix">Netflix</option>
                                                                    <option  value="Now">Now</option>
                                                                    <option  value="Paramount+">Paramount+</option>
                                                                    <option  value="Peacock">Peacock</option>                                                                        <option  value="Showtime">Showtime</option>
                                                                    <option  value="Stan">Stan</option>
                                                                    <option  value="Starz">Starz</option>
                                                                </select>
                                                                <label for="content_link">Link</label>
                                                                <input type="link" class="form-control" id="content_link" name="content_link" placeholder="Link to content" required></input>
                                                                <br/>
                                                                <button class="btn btn-primary">Submit</button>
                                                            </div>
                                                         </form>
                                                </Popup>
                                                <Popup className="my-popup" trigger={<button type="button" className="btn btn-default" style={{backgroundColor:"grey", borderRadius:"35px", fontSize:"25px", width:"50px", height:"auto"}}><i className="bi bi-exclamation-triangle" style={{color:"white"}}></i></button>} position="bottom center">
                                                    <form>
                                                        <div> Are one of our links not working? Or our information incorrect?</div>
                                                        <label for="content_id">Content ID Key (<i>filled out automatically</i>)</label>
                                                        <input class="form-control" type="text" value={id} id="content_id" name="content_id" readonly></input>
                                                        <label for="service_name">For which service is the link not working?</label>
                                                        <select id='service_name'className="form-control mdb-select md-form" searchable="Search here..." required>
                                                            <option  value="" selected> Choose...</option>
                                                            <option  value="Amazon Prime">Amazon Prime</option>
                                                            <option  value="Apple TV+">Apple TV+</option>
                                                            <option  value="BritBox">BritBox</option>
                                                            <option  value="Crave">Crave</option>
                                                            <option  value="Disney+">Disney+</option>
                                                            <option  value="Google Play">Google Play</option>
                                                            <option  value="HBO Max">HBO Max</option>
                                                            <option  value="Hulu">Hulu</option>
                                                            <option  value="iTunes">iTunes</option>
                                                            <option  value="Mubi">Mubi</option>
                                                            <option value="Netflix">Netflix</option>
                                                            <option  value="Now">Now</option>
                                                            <option  value="Paramount+">Paramount+</option>
                                                            <option  value="Peacock">Peacock</option>                                                                        <option  value="Showtime">Showtime</option>
                                                            <option  value="Stan">Stan</option>
                                                            <option  value="Starz">Starz</option>
                                                    </select>
                                                    <br/>
                                                    <button class="btn btn-primary">Submit</button>
                                                   </form>
                                                </Popup>
                                            </div>
                                        </div> 
                                        <div className="row">
                                            <h1>{dependent2.Title} </h1>
                                            <br/>
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div className="row justify-content-center ">
                                                            <img src={dependent2.Poster} style={{height:"245px", width:"auto", paddingBottom:"10px"}}></img>
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
            else{
                return (
                    <div>
                        <div className="row justify-content-start" style={{paddingTop:"40px"}}>
                            <div className="col-2">
                                <button type="button" onClick={()=>{goBack()}} style={{maxWidth:"80px", maxHeight:"40px", backgroundColor:"grey", borderColor:"grey"}} className="justify-content-start btn btn-primary">Back</button>
                            </div>
                        </div>
                        <img src={loadingGif} style={{maxWidth:"45px", height:"auto", width:"100%", paddingTop:"40px"}}></img>
                    </div>
                );
            }
        }


        return(  
            <div>
                {renderContent(this.state.Locations, this.state.Content, this.state.id, this.state.value) }
            </div> 
        );
    }  
}
export default ContentProfile;
  