import streamingServices from '../Services.json' 
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';

const AddStreamingServicePopup = (props) => {
    const id = props.id;

    function listServiceOptions(){
        var i = 0;
        return(
            streamingServices.map((cont) => (
                <option value={cont.name} key={i++}>{cont.name}</option>
            ))
        );
    }

    function sendEmail(e) {
        e.preventDefault();
        const elementsArray =[...e.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) =>{
            if (currentValue.id){
                accumulator[currentValue.id]= currentValue.value;
            }
            return accumulator;
        },{});
        emailjs.sendForm('service_q8akaed', 'template_q0cdh28', e.target, 'user_hYCVxI0KQt3ZFIZhx5psT')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
          
        e.target.reset();
      toast.success('Form Submitted Successfully! Thank you!');
    }

    return ( 
        <div>
            <div>Found this content on a streaming site that is not listed?</div>
            <div>Help us improve your user experience by submitting a form so we can fix it!</div>
            <br/>
            <form onSubmit={sendEmail}>
                <div className="form-group">
                    <label htmlFor="content_id">Content ID Key (<i>filled out automatically</i>)</label>
                    <input className="form-control" type="text" value={id} id="content_id" name="content_id" readOnly></input>
                    <label htmlFor="action">Action: (<i>filled out automatically</i>)</label>
                    <input className="form-control" type="text" value="Add Service" id="action" name="action" readOnly></input>
                    <label htmlFor="service_name">Streaming Service</label>
                    <select id="service_name" name="service_name" className="form-control mdb-select md-form" searchable="Search here..." required>
                        <option value=""> Choose...</option>
                        {listServiceOptions()}
                    </select>
                    <label htmlFor="content_link">Link</label>
                    <input type="link" className="form-control" id="content_link" name="content_link" placeholder="Link to content" required></input>
                    <br/>
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form> 
        </div>                                                             
    );
}
export default AddStreamingServicePopup;