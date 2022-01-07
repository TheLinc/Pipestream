
import 'bootstrap/dist/css/bootstrap.css';

const ContentPageNavButtonGen = (props) => {
    const contentList = props.contentList;

    const ButtonGen=()=>{
        var buttons=[];
        if (contentList){
            var pagenum=Math.ceil(props.contentList.totalResults/10);
            for (var i=2; i<5; i++){
                buttons.push({id: i});
            }

            return(
            <div className="container-md">
                <div className="row justify-content-center">
                    <div className="col-sm-6">
                        <div className="btn-group" >
                        <button type="button" className="btn active btn-outline-primary" style={{marginLeft:"1px", marginRight:"1px"}} id={1} key="1">1</button>
                            {buttons.map((butt) => (
                                <button type="button" className="btn btn-outline-primary" style={{marginLeft:"1px", marginRight:"1px"}} id={butt.id} key={butt.id}>{butt.id}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            ); 
        }
        else{
            console.log("we are here");
        }
    }

    return (  
        ButtonGen()
    );
}
 
export default ContentPageNavButtonGen;