import React, { useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Search.css';
import 'jquery';
import { useState } from "react";
import SearchListGen from './SearchListGen';
import toast, { Toaster } from 'react-hot-toast';
import StreamingServices from '../Services.json'

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)   

const Search = () => {
    const myRef = useRef(null)
    const executeScroll = () => scrollToRef(myRef)
    var inputval;
    var [pageNum,setPageNum]=useState("1");
    var [searchVal,setSearchVal]=useState();
    var [country,setCountry]=useState("");

    //searches Utelly API for inputted movie or TV show title
    var [contentList, setList]= useState(['0']);

    const bulkSearch =(title, page)=>{
        if (title !== ""){
            pageNum=page;
            fetch("https://movie-database-imdb-alternative.p.rapidapi.com/?s="+title+"&page="+page+"&r=json", {
	            "method": "GET",
	            "headers": {
		            "x-rapidapi-key": process.env.REACT_APP_SA_API_KEY,
		            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com"
	            }
            })
            .then (response => response.json())
            .then(response => {
                if (response.Response === "True"){
                    setList(response);
                }
                else{
                    toast.error("Sorry we were unabe to find the Movie/TV Show you were looking for.") 
                }
            })
            .catch(err => {
                console.error(err);
                throw err;
            });

        }
        else{
            toast.error("Please input a the Title of a movie or TV show before searching");
        }
    }

    //reads value input into search bar
     const saveInput = (event) =>{
        event.preventDefault();
        const elementsArray =[...event.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) =>{
            if (currentValue.id){
                accumulator[currentValue.id]= currentValue.value;
            }
            return accumulator;
        },{});

        //formdata is an object {searchTerm: "the inputted value"} by calling
        //searchterm the value input into the search bar is extracted.

        //original inputted value
        const searchval = formData.searchTerm;

        setCountry(formData.countrySearched)

        //remove all leading and traillingwhitespace from string
        const inputnowhitespace = searchval.trim();
        //replace all spaces with _
        const inputnospaces= inputnowhitespace.replace(/\s/g,'_');

        inputval=inputnospaces;


        //assigns value to SearchValue to display html for "n results for "your_search_value"
        setSearchVal(searchval)
        
        //calls bulk function to call API and load  movie title - IMDb relational results into DB
        bulkSearch(inputval,1);

        if(inputval !== ""){
            handlechange();
            setTimeout(() => {
                executeScroll();
              }, 300);
        }
    }

    //used for search bar input reading
    const [state, setState] = useState([
        {divcontainer:false}
    ]);

    const handlechange = (e) =>{
        state[0].divcontainer=true;
    }

    const divcontainerState=state[0].divcontainer;


    const ContentPageNavButtonGen = (input) => {
        const ButtonGen=()=>{
            var buttons=[];
            
            if (input){
                var pagenum
                if (Math.ceil(input.totalResults/10) < 10){
                    pagenum = Math.ceil(input.totalResults/10);
                }
                else if (Math.ceil(input.totalResults/10 > 10)){
                    pagenum=10;
                }
                else{
                }
                for (var i=2; i<pagenum+1; i++){
                    buttons.push({id: i});
                }
                return(
                <div className="container-md">
                    <div className="row justify-content-center">
                        <div className="col-sm-6">
                            <div className="btn-group" >
                            <button type="button" className={buttonState("1")} onClick={() =>{pageNav(searchVal,1)}} style={{marginLeft:"1px", marginRight:"1px"}} id="1" key="1">1</button>
                                {buttons.map((butt) => (
                                    <button type="button" className={buttonState(butt.id)} onClick={() =>{pageNav(searchVal,butt.id)}} style={{marginLeft:"1px", marginRight:"1px"}} id={butt.id} key={butt.id}>{butt.id}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                ); 
            }
        }
    
        return (  
            ButtonGen()
        );
    }

    const pageNav = (inval,buttonVal) =>{
        setPageNum(buttonVal)
        const inputnowhitespace = inval.trim();
        //replace all spaces with _
        const inputnospaces= inputnowhitespace.replace(/\s/g,'_');
        bulkSearch(inputnospaces,buttonVal)
    }

    const buttonState = (id) =>{
        if (pageNum ===id){
            return ("btn btn-outline-primary active");
        }
        else{
            return("btn btn-outline-primary");
        }
    }

    function listServices(){
        var i=0;
        return(
            StreamingServices.map((cont) => (
                <div className="col-sm-2 tool" key={i++}>
                    <div className="row">
                        <img src={cont.image}  alt={cont.name + " logo"} className="mx-auto d-block" style={{maxWidth:"100px", height:"auto", borderRadius:"25%"}}></img>
                        <span className='tooltiptext'>{cont.name}</span>
                    </div>
                </div>
        )));
    }

    return ( 
        <div className="search">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <br/>
            <br/>
            <div className="container-md">
                <div className="row justify-content-center">
                    <div ref={myRef} className="col-sm-6">
                    <div className="input-group">
                        <form className="input-group" onSubmit={saveInput}>
                            <select className="input-group-prepend form-select"  id="countrySearched" defaultValue="ca" style={{height:"44px",maxWidth:"160px", backgroundColor:"#ebeef2"}}>
                                <option value="ca">Canada</option>
                                <option value="us">United States</option>
                            </select>
                            <input type="text" id="searchTerm" className="form-control rounded input-group" placeholder="Search for Movie or TV Show by Title" aria-label="Search" 
                                aria-describedby="search-addon" style={{height:"44px",minWidth:"180px", zIndex:"0"}}/>
                            <button className="input-group-append btn btn-outline-primary border border-primary border-3 searchButton"><b>Search</b></button>
                        </form>
                    </div>
                    </div>
                </div>
                <br/>
                <br/>
                {divcontainerState &&(
                    <div>
                        <div className="container-md">
                            <div className="row justify-content-center">
                                <div className="col-sm-7 "  style={{textAlign:"left", color:"white"}} >
                                    <i>{contentList.totalResults} Results found for "{searchVal}"</i>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <SearchListGen contentList={contentList} country={country}/>
                        </div>
                        <br/>
                        <br/>
                        <div className="row" style={{paddingBottom:"20px"}}>
                            {ContentPageNavButtonGen(contentList)}
                        </div>
                    </div>
                )}
                {!divcontainerState &&(
                    <div className="row justify-content-center supportedServices">
                        <u><h2 style={{color:"white"}}>Supported Services</h2></u>
                        {listServices()} 
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default Search;