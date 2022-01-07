import 'bootstrap/dist/css/bootstrap.css';
import NoImageFoundPoster from '../Images/NoImageFoundPoster.png';
import loadingGif from '../Images/Loading.gif';
import { useHistory } from 'react-router-dom';

const SearchListGen = (props) => {
    const contentList = props.contentList.Search;
    const countrySearched=props.country;
    const history = useHistory();

    //fetches poster for content list. If there is no poster, filler poster is used
    function getPoster(content){
        var imgsrc="";
        if (content.Poster === "N/A"){
            imgsrc = NoImageFoundPoster;
        }
        else{
          imgsrc = content.Poster ; 
        }
        return imgsrc;
    }

    //routes to content profile on button click
    const buttonClick = (id) =>{
        return(
            history.push(`/content/${countrySearched}/${id}`)
        );
    }

    //removes items of type "movie" from content array
    function filterContent (content){
        var movieList = content;
        for (var i=0; i<content.length; i++){
            if(movieList[i].Type === "game"){
                movieList.splice(i,1);
            }
            else{}   
        }
        return movieList;
    }


    //generates list of content based on user search passed by prop from Search.js
    const genList = ()=>{
        if(contentList){
            var movieList = filterContent(contentList);
            return(
            movieList.map((cont) => (
                <div className="content-preview" key={cont.imdbID}>
                    <div className="container-md">
                        <br/>
                        <div className="row justify-content-center">
                            <div className="col-sm-7">
                                <div className="row border-bottom border-2">
                                    <div className="col-sm-2">
                                        <img className="img-responsive" src={getPoster(cont)} alt="" style={{maxHeight:"auto", maxWidth:"100px", paddingBottom:"10px"}}></img>
                                    </div>
                                    <div className="col-sm-8"  style={{textAlign:"left"}}>
                                        <div className="row" style={{paddingBottom:"10px"}}>
                                            <h3>{cont.Title}</h3>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <p>Year: {cont.Year}</p>
                                            </div>
                                            <div className="col-sm-4">
                                                <p>Type: {cont.Type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2 my-auto" style={{paddingBottom:"15px"}}>
                                        <div className="row  my-auto">
                                            <button type="button" className="btn btn-primary" onClick={()=>{buttonClick(cont.imdbID)}} id={cont.imdbID}>Select</button>
                                        </div>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )));

        }
        else{
            return(<img src={loadingGif} alt="Loading Symbol"style={{maxWidth:"45px", height:"auto", width:"100%"}}></img>);
        }
    }

    
    return ( 
        <div className="content=list" style={{ color:"white"}}>
            {genList()}
        </div>
     );
}
 
export default SearchListGen;